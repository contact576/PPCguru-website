"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { saveLeadReturning, hasSupabase } from "@/lib/supabase";
import { saveLandingLead } from "@/lib/landing-leads";
import { deliverLead } from "@/lib/lead-delivery";
import { identifyVisitor } from "@/lib/identity";
import { verifyTurnstile, turnstileConfigured } from "@/lib/turnstile";
import { scoreSubmission, logBlocked } from "@/lib/spam-filter";
import { rateLimit, clientIpFromHeaders } from "@/lib/rate-limit";
import {
  SEO_GOAL_IDS,
  SEO_INVESTMENT_IDS,
  SEO_LANDING_ID,
  SEO_LANDING_SERVICE_LABEL,
  SEO_LANDING_SOURCE,
  SEO_LANDING_THANK_YOU_PATH,
  seoGoalLabel,
  seoInvestmentLabel,
} from "@/lib/data/landing-seo";

/**
 * Server action behind the /seo-visibility three-step "free search visibility
 * check" form. Same anti-spam gauntlet and delivery fan-out as the other lead
 * forms (see app/actions/landing-lead.ts); validates this page's own question
 * set (website, target search, visibility goal, monthly SEO investment) and
 * writes a structured `landing_page_leads` row with `landing = seo-visibility`.
 * On success it REDIRECTS to the thank-you page (the ad-platform conversion URL).
 */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid", "referrer", "path"] as const;

const schema = z.object({
  website: z.string().min(3, "Please enter your website.").max(200),
  search: z.string().min(3, "Tell us the service + city to check.").max(160),
  goal: z.enum(SEO_GOAL_IDS, { message: "Please choose where you need to show up." }),
  investment: z.enum(SEO_INVESTMENT_IDS, { message: "Please choose a monthly SEO investment." }),
  company: z.string().min(2, "Please enter your business name.").max(120),
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(7, "Please enter a phone or WhatsApp number.").max(40),
  source: z.string().max(80).optional().or(z.literal("")),
  utm: z.string().max(2000).optional().or(z.literal("")),
  session_id: z.string().max(64).optional().or(z.literal("")),
  // Honeypot — must be empty.
  company_website: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().max(4000).optional().or(z.literal("")),
  renderedAt: z.string().max(20).optional().or(z.literal("")),
});

export type SeoLeadState = {
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

/** "northstarheating.ca" → "https://northstarheating.ca"; leaves full URLs alone. */
function normaliseWebsite(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v.replace(/^\/+/, "")}`;
}

function firstName(full: string) {
  return full.trim().split(/\s+/)[0] ?? "";
}

export async function submitSeoLead(_prev: SeoLeadState, formData: FormData): Promise<SeoLeadState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }
  const data = parsed.data;
  const source = data.source || SEO_LANDING_SOURCE;
  const website = normaliseWebsite(data.website);
  const thankYou = `${SEO_LANDING_THANK_YOU_PATH}?n=${encodeURIComponent(firstName(data.name))}&c=${encodeURIComponent(data.company)}&q=${encodeURIComponent(data.search)}`;

  // 1) Honeypot → pretend success.
  if (data.company_website) redirect(thankYou);

  const ip = await clientIpFromHeaders();

  // 2) Per-IP burst cap.
  if (!rateLimit(`landing-seo:${ip}`, 5, 10 * 60_000).ok) {
    console.warn(`[spam] rate-limited SEO landing lead from ${ip}`);
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
    website,
    message: `${data.company} ${data.search}`,
    renderedAt: data.renderedAt,
  });
  if (verdict.spam) {
    logBlocked(`landing (${source})`, verdict, data);
    redirect(thankYou);
  }
  if (!turnstileConfigured() && verdict.score > 0) {
    console.info(`[spam] allowed SEO landing lead with score ${verdict.score}: ${verdict.reasons.join(" | ")}`);
  }

  const utm = parseUtm(data.utm);
  const goalText = seoGoalLabel(data.goal);
  const investmentText = seoInvestmentLabel(data.investment);
  const attribution = Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(" ");

  // Canonical mirror in `leads` — keeps /admin/leads, CRM, identity + email identical to every other form.
  const record = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    website,
    source,
    service: SEO_LANDING_SERVICE_LABEL,
    budget: `${investmentText} / month (SEO)`,
    message: [`Target search: ${data.search}`, `Visibility goal: ${goalText}`, `Investment: ${data.investment}`, attribution ? `Attribution: ${attribution}` : ""]
      .filter(Boolean)
      .join("\n"),
  };
  const leadId = await saveLeadReturning(record);
  if (hasSupabase() && !leadId) {
    return { ok: false, message: "We couldn't save your request right now. Please try again shortly." };
  }

  // Structured landing row (best-effort — the lead is already safe above).
  await saveLandingLead({
    leadId,
    landing: SEO_LANDING_ID,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    location: data.search,
    budget: data.investment,
    website,
    answers: { search: data.search, goal: data.goal, website },
    utm,
  });

  await identifyVisitor({ sessionId: data.session_id, leadId, email: data.email, name: data.name });

  const delivery = await deliverLead({
    record,
    leadId,
    lead: { name: data.name, email: data.email },
    notification: {
      replyTo: data.email,
      subject: `🔎 SEO visibility check — ${data.name} (${data.company}) · “${data.search}”`,
      text: [
        `Source: ${source}`,
        `Name: ${data.name}`,
        `Business: ${data.company}`,
        `Website: ${website}`,
        `Target search: ${data.search}`,
        `Visibility goal: ${goalText}`,
        `Monthly SEO investment: ${investmentText}`,
        `Email: ${data.email}`,
        `Phone / WhatsApp: ${data.phone}`,
        attribution ? `Attribution: ${attribution}` : "",
        "",
        "Next step: capture how the business appears today for the target search (Google, Maps, AI answers), then book the 30-day target call.",
      ]
        .filter((l) => l !== "")
        .join("\n"),
    },
  });
  if (!delivery.ok) {
    return { ok: false, message: "We couldn't submit that right now. Please call or email us directly." };
  }

  redirect(thankYou);
}
