"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { leadRecipients, sendMail, emailConfigured, sendLeadAutoresponder } from "@/lib/email";
import { saveLeadReturning, hasSupabase } from "@/lib/supabase";
import { saveLandingLead } from "@/lib/landing-leads";
import { sendLeadToZoho, zohoConfigured } from "@/lib/zoho";
import { sendLeadToGhl, ghlConfigured } from "@/lib/gohighlevel";
import { identifyVisitor } from "@/lib/identity";
import { verifyTurnstile, turnstileConfigured } from "@/lib/turnstile";
import { scoreSubmission, logBlocked } from "@/lib/spam-filter";
import { rateLimit, clientIpFromHeaders } from "@/lib/rate-limit";
import {
  BUSINESS_TYPE_IDS,
  LANDING_BUDGET_IDS,
  LANDING_SERVICE_LABEL,
  LANDING_SOURCE,
  LANDING_THANK_YOU_PATH,
  budgetLabel,
  businessTypeLabel,
} from "@/lib/data/landing-100-leads";

/**
 * Server action behind the /100-leads three-step qualification form.
 *
 * Mirrors `captureLead` (app/actions/lead.ts) — same four-layer anti-spam
 * gauntlet, same delivery fan-out (Supabase → CRM → team email → autoresponder
 * → identity stitch) — but validates the landing page's own question set and
 * writes a second, structured row to `landing_page_leads` so the admin panel
 * can work the queue by market, business type, budget and attribution.
 *
 * On success it REDIRECTS to the custom thank-you page (call + WhatsApp
 * buttons) instead of returning a state — that is the conversion event the ad
 * platforms are pointed at, so it must be a real URL, not an in-place swap.
 */

/** Attribution keys we keep from the landing URL. Anything else is dropped. */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid", "referrer", "path"] as const;

const schema = z.object({
  company: z.string().min(2, "Please enter your business name.").max(120),
  location: z.string().min(2, "Please enter your city or service area.").max(120),
  business_type: z.enum(BUSINESS_TYPE_IDS, { message: "Please choose a business type." }),
  budget: z.enum(LANDING_BUDGET_IDS, { message: "Please choose a monthly ad budget." }),
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(7, "Please enter a phone number we can reach you on.").max(40),
  source: z.string().max(80).optional().or(z.literal("")),
  /** JSON string built client-side from the landing URL (see LeadsLanding). */
  utm: z.string().max(2000).optional().or(z.literal("")),
  session_id: z.string().max(64).optional().or(z.literal("")),
  // Honeypot — must be empty.
  company_website: z.string().max(0).optional().or(z.literal("")),
  // Anti-spam fields supplied by <TurnstileField />.
  turnstileToken: z.string().max(4000).optional().or(z.literal("")),
  renderedAt: z.string().max(20).optional().or(z.literal("")),
});

export type LandingLeadState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

function parseUtm(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw) as unknown;
    if (!obj || typeof obj !== "object") return {};
    const out: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = (obj as Record<string, unknown>)[k];
      if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 300);
    }
    return out;
  } catch {
    return {};
  }
}

function firstName(full: string) {
  return full.trim().split(/\s+/)[0] ?? "";
}

export async function submitLandingLead(_prev: LandingLeadState, formData: FormData): Promise<LandingLeadState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }
  const data = parsed.data;
  const source = data.source || LANDING_SOURCE;
  const thankYou = `${LANDING_THANK_YOU_PATH}?n=${encodeURIComponent(firstName(data.name))}&c=${encodeURIComponent(data.company)}`;

  // 1) Honeypot → pretend success (bots learn nothing; the redirect target is public anyway).
  if (data.company_website) redirect(thankYou);

  const ip = await clientIpFromHeaders();

  // 2) Per-IP burst cap.
  if (!rateLimit(`landing:${ip}`, 5, 10 * 60_000).ok) {
    console.warn(`[spam] rate-limited landing lead from ${ip} (${source})`);
    redirect(thankYou);
  }

  // 3) Cloudflare Turnstile (no-op until the keys are set).
  const turnstile = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstile.ok) {
    return { ok: false, message: "Please complete the “I'm not a robot” check and try again." };
  }

  // 4) Heuristic scoring — the active filter while Turnstile is unconfigured.
  const verdict = scoreSubmission({
    name: data.name,
    email: data.email,
    phone: data.phone,
    website: "",
    message: `${data.company} ${data.location}`,
    renderedAt: data.renderedAt,
  });
  if (verdict.spam) {
    logBlocked(`landing (${source})`, verdict, data);
    redirect(thankYou);
  }
  if (!turnstileConfigured() && verdict.score > 0) {
    console.info(`[spam] allowed landing lead with score ${verdict.score}: ${verdict.reasons.join(" | ")}`);
  }

  const utm = parseUtm(data.utm);
  const typeLabel = businessTypeLabel(data.business_type);
  const budgetText = budgetLabel(data.budget);
  const attribution = Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(" ");

  // The canonical mirror in `leads` — keeps /admin/leads, CRM delivery, the
  // identity stitch and email exactly as they are for every other form.
  const record = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    website: "",
    source,
    service: LANDING_SERVICE_LABEL,
    budget: `${budgetText} / month (ad budget)`,
    message: [
      `Location: ${data.location}`,
      `Business type: ${typeLabel}`,
      `Budget: ${data.budget}`,
      attribution ? `Attribution: ${attribution}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
  const leadId = await saveLeadReturning(record);
  if (hasSupabase() && !leadId) {
    return { ok: false, message: "We couldn't save your request right now. Please try again shortly." };
  }

  // The structured landing row (best-effort — the lead is already safe above).
  await saveLandingLead({
    leadId,
    landing: "100-leads",
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    location: data.location,
    businessType: data.business_type,
    budget: data.budget,
    utm,
  });

  const crmed = ghlConfigured()
    ? await sendLeadToGhl({ ...record, submissionId: leadId ?? undefined, createdAt: new Date().toISOString() })
    : await sendLeadToZoho(record);
  const stored = leadId !== null;

  await identifyVisitor({ sessionId: data.session_id, leadId, email: data.email, name: data.name });

  const emailed = await sendMail({
    to: leadRecipients(),
    replyTo: data.email,
    subject: `🔥 100-leads landing lead — ${data.name} (${data.company}, ${data.location})`,
    text: [
      `Source: ${source}`,
      `Name: ${data.name}`,
      `Business: ${data.company}`,
      `Service area: ${data.location}`,
      `Business type: ${typeLabel}`,
      `Monthly ad budget: ${budgetText}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      attribution ? `Attribution: ${attribution}` : "",
      "",
      "Next step: qualification call — agree lead criteria, geography, budget and written terms.",
    ]
      .filter((l) => l !== "")
      .join("\n"),
  });

  await sendLeadAutoresponder({ name: data.name, email: data.email });

  const anyConfigured = emailConfigured() || hasSupabase() || zohoConfigured() || ghlConfigured();
  const anyDelivered = emailed || stored || crmed;
  if (anyConfigured && !anyDelivered) {
    return { ok: false, message: "We couldn't submit that right now. Please call or email us directly." };
  }
  if (!anyDelivered) {
    console.info("[landing-lead] (no RESEND_API_KEY / no Supabase / no CRM) capture:", data);
  }

  redirect(thankYou);
}
