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
  BUSINESS_TYPE_IDS,
  LANDING_BUDGET_IDS,
  LANDING_SERVICE_LABEL,
  LANDING_SOURCE,
  LANDING_THANK_YOU_PATH,
  budgetLabel,
  businessTypeLabel,
} from "@/lib/data/landing-100-leads";
import { GTA_LANDING_ID, GTA_LANDING_SERVICE_LABEL, GTA_LANDING_SOURCE, GTA_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-gta";
import { GTA_EXTRA_BUSINESS_TYPE_IDS, GTA_EXTRA_BUDGET_IDS, LANDING_CHANNEL_IDS, isValidLeadPhone, landingChannelLabel, normaliseWebOrSocial } from "@/lib/landing-lead-fields";
import { setLandingConversionReceipt } from "@/lib/landing-conversion";

/** Pages that share this form, keyed by their hidden `source` value. */
const PAGES = {
  [LANDING_SOURCE]: { landing: "100-leads", thankYou: LANDING_THANK_YOU_PATH, service: LANDING_SERVICE_LABEL, subject: "100-leads landing lead" },
  [GTA_LANDING_SOURCE]: { landing: GTA_LANDING_ID, thankYou: GTA_LANDING_THANK_YOU_PATH, service: GTA_LANDING_SERVICE_LABEL, subject: "GTA agency landing lead" },
} as const;

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
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "msclkid", "referrer", "path"] as const;

const schema = z.object({
  company: z.string().trim().min(2, "Please enter your business name.").max(120, "Please keep your business name under 120 characters."),
  location: z.string().trim().min(2, "Please enter your city or service area.").max(120, "Please keep your service area under 120 characters."),
  /** Optional: website URL or Instagram handle — whichever the business actually has. */
  website: z.string().trim().max(200, "Please keep your website under 200 characters.").refine((value) => normaliseWebOrSocial(value) !== null, "Enter a website such as yourbusiness.ca or an Instagram @handle.").optional(),
  business_type: z.enum([...BUSINESS_TYPE_IDS, ...GTA_EXTRA_BUSINESS_TYPE_IDS], { message: "Please choose a business type." }),
  budget: z.enum([...LANDING_BUDGET_IDS, ...GTA_EXTRA_BUDGET_IDS], { message: "Please choose a monthly ad budget." }),
  channel: z.enum(LANDING_CHANNEL_IDS, { message: "Please choose a channel, or let us recommend one." }).optional().or(z.literal("")),
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Please keep your name under 100 characters."),
  email: z.string().trim().email("Please enter a valid email.").max(254),
  phone: z.string().trim().max(40).refine(isValidLeadPhone, "Please enter a valid phone number, including the area code."),
  source: z.enum([LANDING_SOURCE, GTA_LANDING_SOURCE], { message: "Please refresh this page and try again." }).optional().or(z.literal("")),
  /** JSON string built client-side from the landing URL (see LeadsLanding). */
  utm: z.string().optional(),
  session_id: z.string().max(64).optional().or(z.literal("")),
  // Honeypot — must be empty.
  company_website: z.string().max(400).optional(),
  // Anti-spam fields supplied by <TurnstileField />.
  turnstileToken: z.string().max(4000).optional().or(z.literal("")),
  renderedAt: z.string().max(20).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.source === GTA_LANDING_SOURCE && !data.channel) {
    ctx.addIssue({ code: "custom", path: ["channel"], message: "Please choose a channel, or let us recommend one." });
  }
  if (data.source !== GTA_LANDING_SOURCE) {
    if (!BUSINESS_TYPE_IDS.some((id) => id === data.business_type)) {
      ctx.addIssue({ code: "custom", path: ["business_type"], message: "Please choose a business type for this offer." });
    }
    if (!LANDING_BUDGET_IDS.some((id) => id === data.budget)) {
      ctx.addIssue({ code: "custom", path: ["budget"], message: "Please choose a monthly ad budget for this offer." });
    }
  }
});

export type LandingLeadState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

function parseUtm(raw: string | undefined): Record<string, string> {
  // Attribution must never prevent an otherwise valid lead from being saved.
  if (!raw || raw.length > 8000) return {};
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
    return { ok: false, message: errors.source || "Please fix the highlighted fields.", errors };
  }
  const data = parsed.data;
  const source = data.source || LANDING_SOURCE;
  const page = PAGES[source as keyof typeof PAGES] ?? PAGES[LANDING_SOURCE];
  const website = normaliseWebOrSocial(data.website) ?? "";
  // Keep GTA form details out of browser history, referrers and analytics URLs.
  const thankYou = source === GTA_LANDING_SOURCE ? page.thankYou : `${page.thankYou}?n=${encodeURIComponent(firstName(data.name))}&c=${encodeURIComponent(data.company)}`;

  // Rejected requests never visit the conversion URL or claim to be received.
  if (data.company_website) return { ok: false, message: "We couldn't verify this request. Please try again or contact us directly." };

  const ip = await clientIpFromHeaders();

  // 2) Per-IP burst cap.
  if (!rateLimit(`landing:${ip}`, 5, 10 * 60_000).ok) {
    console.warn(`[spam] rate-limited landing lead from ${ip} (${source})`);
    return { ok: false, message: "You've made several attempts. Please wait 10 minutes and try again, or contact us directly." };
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
    message: `${data.company} ${data.location}`,
    renderedAt: data.renderedAt,
  });
  if (verdict.spam) {
    logBlocked(`landing (${source})`, verdict, data);
    return { ok: false, message: "We couldn't verify this request. Please check your details and try again, or contact us directly." };
  }
  if (!turnstileConfigured() && verdict.score > 0) {
    console.info(`[spam] allowed landing lead with score ${verdict.score}: ${verdict.reasons.join(" | ")}`);
  }

  const utm = parseUtm(data.utm);
  const typeLabel = businessTypeLabel(data.business_type);
  const budgetText = budgetLabel(data.budget);
  const channelText = landingChannelLabel(data.channel);
  const attribution = Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(" ");

  // The canonical mirror in `leads` — keeps /admin/leads, CRM delivery, the
  // identity stitch and email exactly as they are for every other form.
  const record = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    website,
    source,
    service: page.service,
    budget: data.budget === "recommend" ? budgetText : `${budgetText} / month (ad budget)`,
    message: [
      `Location: ${data.location}`,
      website ? `Website / Instagram: ${website}` : "",
      `Business type: ${typeLabel}`,
      channelText ? `Preferred channel: ${channelText}` : "",
      `Budget: ${budgetText}`,
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
    landing: page.landing,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    location: data.location,
    website,
    businessType: data.business_type,
    budget: data.budget,
    answers: data.channel ? { channel: data.channel } : undefined,
    utm,
  });

  await identifyVisitor({ sessionId: data.session_id, leadId, email: data.email, name: data.name });

  // CRM + team notification + autoresponder — parallel, deferred past the
  // redirect once the row is stored (lib/lead-delivery.ts). This is what makes
  // the thank-you page appear immediately instead of after 10+ s of SMTP.
  const delivery = await deliverLead({
    eventId: formData.get("event_id"),
    requireDelivery: true,
    record,
    leadId,
    lead: { name: data.name, email: data.email },
    notification: {
      replyTo: data.email,
      subject: `🔥 ${page.subject} — ${data.name} (${data.company}, ${data.location})`,
      text: [
        `Source: ${source}`,
        `Name: ${data.name}`,
        `Business: ${data.company}`,
        `Service area: ${data.location}`,
        website ? `Website / Instagram: ${website}` : "",
        `Business type: ${typeLabel}`,
        channelText ? `Preferred channel: ${channelText}` : "",
        `Monthly ad budget: ${budgetText}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        attribution ? `Attribution: ${attribution}` : "",
        "",
        "Next step: qualification call — agree lead criteria, geography, budget and written terms.",
      ]
        .filter((l) => l !== "")
        .join("\n"),
    },
  });
  if (!delivery.ok) {
    return { ok: false, message: "We couldn't submit that right now. Please call or email us directly." };
  }

  if (source === GTA_LANDING_SOURCE) {
    try {
      await setLandingConversionReceipt(formData.get("event_id"));
    } catch {
      // A missing analytics receipt must never undo an already accepted lead.
      console.warn("[landing-lead] Unable to set the confirmed conversion receipt.");
    }
  }
  redirect(thankYou);
}
