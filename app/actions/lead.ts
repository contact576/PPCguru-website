"use server";

import { z } from "zod";
import { leadRecipients, sendMail, emailConfigured, sendLeadAutoresponder } from "@/lib/email";
import { saveLeadReturning, hasSupabase } from "@/lib/supabase";
import { sendLeadToZoho, zohoConfigured } from "@/lib/zoho";
import { identifyVisitor } from "@/lib/identity";
import { verifyTurnstile, turnstileConfigured } from "@/lib/turnstile";
import { scoreSubmission, logBlocked } from "@/lib/spam-filter";
import { rateLimit, clientIpFromHeaders } from "@/lib/rate-limit";
import { SERVICE_OPTIONS, BUDGET_OPTIONS, SERVICES_MAX_LEN } from "@/lib/data/form-options";

/**
 * Shared lead-capture action used by the pop-up funnel and the gated tools.
 * Zod-validated, honeypot-protected, delivers via Resend when configured and
 * otherwise logs (so it works with no keys). `source` records where the lead
 * came from (e.g. "popup:audit", "tool:roas-calculator").
 *
 * Anti-spam runs in four layers before anything is stored or emailed:
 * honeypot → per-IP rate limit → Cloudflare Turnstile → heuristic scoring.
 * Bot submissions are dropped SILENTLY (returned as success) so the sender
 * gets no signal about what tripped, and — critically — never reach
 * `sendLeadAutoresponder`, which would otherwise mail a forged address from
 * our domain and burn sender reputation.
 */
const schema = z.object({
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.string().email("Please enter a valid email."),
  // Phone is collected by most forms but optional here so entry points that don't
  // ask for it (e.g. the gated tools) still submit. Forms that require it enforce
  // it in their own UI.
  phone: z.string().max(40).optional().or(z.literal("")),
  // Business name. Every capture point asks for it now — it's the one field that
  // makes a lead actionable (and Zoho Leads requires `Company`, which used to
  // fall back to "Unknown (website lead)" for everything but the contact form).
  company: z.string().min(2, "Please enter your business name.").max(120),
  website: z.string().max(200).optional().or(z.literal("")),
  // Services are multi-select checkboxes, so this arrives as N repeated form
  // entries — see `rawFrom()` for why we can't use Object.fromEntries alone.
  // Unknown values are rejected rather than trimmed: the strings are written
  // straight to Supabase and Zoho, so a spoofed option would poison reporting.
  services: z
    .array(z.enum(SERVICE_OPTIONS))
    .min(1, "Please choose at least one service.")
    .max(SERVICE_OPTIONS.length),
  budget: z.enum(BUDGET_OPTIONS, { message: "Please choose a budget range." }),
  source: z.string().max(80).optional().or(z.literal("")),
  detail: z.string().max(2000).optional().or(z.literal("")),
  // First-party device id (<SessionField />). Lets us retro-stitch everything
  // this browser did before it had a name. Absent = we just skip the stitch.
  session_id: z.string().max(64).optional().or(z.literal("")),
  // Honeypot — must be empty.
  company_website: z.string().max(0).optional().or(z.literal("")),
  // Anti-spam fields supplied by <TurnstileField />.
  turnstileToken: z.string().max(4000).optional().or(z.literal("")),
  renderedAt: z.string().max(20).optional().or(z.literal("")),
});

export type LeadState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

/** Silent drop: bots are told "thanks" so they can't probe the filter. */
const SILENT_OK: LeadState = { ok: true, message: "Thanks — we'll be in touch shortly." };

/**
 * `Object.fromEntries` keeps only the LAST value of a repeated key, which would
 * silently reduce a multi-select to one checkbox. Pull the repeating fields with
 * getAll() and let the rest collapse as before.
 */
function rawFrom(formData: FormData) {
  return {
    ...Object.fromEntries(formData.entries()),
    services: formData.getAll("services").map(String),
  };
}

export async function captureLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = rawFrom(formData);
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }
  const data = parsed.data;

  // 1) Honeypot triggered → silently accept.
  if (data.company_website) return SILENT_OK;

  const ip = await clientIpFromHeaders();

  // 2) Per-IP burst cap. A human fills a handful of forms at most; a bot loops.
  if (!rateLimit(`lead:${ip}`, 5, 10 * 60_000).ok) {
    console.warn(`[spam] rate-limited lead from ${ip} (source: ${data.source || "site"})`);
    return SILENT_OK;
  }

  // 3) Cloudflare Turnstile ("I'm not a robot"). No-ops until the keys are set.
  const turnstile = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstile.ok) {
    return { ok: false, message: "Please complete the “I'm not a robot” check and try again." };
  }

  // 4) Heuristics — the real filter while Turnstile is unconfigured, and a
  //    backstop for solved-challenge spam (paid solvers) once it is.
  const verdict = scoreSubmission({
    name: data.name,
    email: data.email,
    phone: data.phone,
    website: data.website,
    message: data.detail,
    // Absent on pages cached before <TurnstileField /> shipped — the time-trap
    // rule simply doesn't fire in that case rather than penalising the visitor.
    renderedAt: data.renderedAt,
  });
  if (verdict.spam) {
    logBlocked(`lead (${data.source || "site"})`, verdict, data);
    return SILENT_OK;
  }
  if (!turnstileConfigured() && verdict.score > 0) {
    console.info(`[spam] allowed lead with score ${verdict.score}: ${verdict.reasons.join(" | ")}`);
  }

  // Persist to Supabase and mirror into Zoho CRM (both best-effort) so a lead is
  // never lost even if email fails. Run together — they're independent, and
  // serialising them would add the CRM round-trip to the visitor's wait.
  // `leads.service` is a single text column and Zoho has no standard field for
  // it either, so the multi-select is stored as one comma-joined string. Capped
  // so a crafted payload can't blow past the column/Description budget.
  const servicesText = data.services.join(", ").slice(0, SERVICES_MAX_LEN);

  const record = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    website: data.website,
    source: data.source || "site",
    service: servicesText,
    budget: data.budget,
    message: data.detail,
  };
  const [leadId, crmed] = await Promise.all([saveLeadReturning(record), sendLeadToZoho(record)]);
  const stored = leadId !== null;

  // They just told us who they are. Claim their anonymous history (this device
  // and any other device that used this email), and set the recognition cookie
  // so future visits arrive already identified. Best-effort — never throws.
  await identifyVisitor({
    sessionId: data.session_id,
    leadId,
    email: data.email,
    name: data.name,
  });

  const to = leadRecipients();
  // Team notification (SMTP → Resend fallback; best-effort, never throws).
  const emailed = await sendMail({
    to,
    replyTo: data.email,
    subject: `New lead (${data.source || "site"}) — ${data.name} (${data.company})`,
    text: [
      `Source: ${data.source || "—"}`,
      `Name: ${data.name}`,
      `Business: ${data.company}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Website: ${data.website || "—"}`,
      `Services: ${servicesText}`,
      `Budget: ${data.budget}`,
      data.detail ? `\n${data.detail}` : "",
    ].join("\n"),
  });

  // Fire the branded welcome/autoresponder TO the lead (best-effort, never throws).
  await sendLeadAutoresponder({ name: data.name, email: data.email });

  // A delivery channel is "configured" if it has keys. If at least one channel is
  // configured but nothing actually got through (no email AND no DB row), the lead
  // would be silently lost — surface an error so the visitor can reach us another way.
  const anyConfigured = emailConfigured() || hasSupabase() || zohoConfigured();
  const anyDelivered = emailed || stored || crmed;
  if (anyConfigured && !anyDelivered) {
    return { ok: false, message: "We couldn't submit that right now. Please email us directly." };
  }
  if (!anyDelivered) {
    console.info("[lead] (no RESEND_API_KEY / no Supabase / no Zoho) capture:", data);
  }

  return { ok: true, message: "Thanks — your report is unlocked and we'll be in touch shortly." };
}
