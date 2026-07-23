"use server";

import { z } from "zod";
import { leadRecipients, sendMail, emailConfigured, sendLeadAutoresponder } from "@/lib/email";
import { saveLead, hasSupabase } from "@/lib/supabase";
import { verifyTurnstile, turnstileConfigured } from "@/lib/turnstile";
import { scoreSubmission, logBlocked } from "@/lib/spam-filter";
import { rateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

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
  website: z.string().max(200).optional().or(z.literal("")),
  source: z.string().max(80).optional().or(z.literal("")),
  detail: z.string().max(2000).optional().or(z.literal("")),
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

export async function captureLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(formData.entries());
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

  // Persist to Supabase first (best-effort) so a lead is never lost even if email fails.
  const stored = await saveLead({
    name: data.name,
    email: data.email,
    phone: data.phone,
    website: data.website,
    source: data.source || "site",
    message: data.detail,
  });

  const to = leadRecipients();
  // Team notification (SMTP → Resend fallback; best-effort, never throws).
  const emailed = await sendMail({
    to,
    replyTo: data.email,
    subject: `New lead (${data.source || "site"}) — ${data.name}`,
    text: [
      `Source: ${data.source || "—"}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Website: ${data.website || "—"}`,
      data.detail ? `\n${data.detail}` : "",
    ].join("\n"),
  });

  // Fire the branded welcome/autoresponder TO the lead (best-effort, never throws).
  await sendLeadAutoresponder({ name: data.name, email: data.email });

  // A delivery channel is "configured" if it has keys. If at least one channel is
  // configured but nothing actually got through (no email AND no DB row), the lead
  // would be silently lost — surface an error so the visitor can reach us another way.
  const anyConfigured = emailConfigured() || hasSupabase();
  if (anyConfigured && !emailed && !stored) {
    return { ok: false, message: "We couldn't submit that right now. Please email us directly." };
  }
  if (!emailed && !stored) {
    console.info("[lead] (no RESEND_API_KEY / no Supabase) capture:", data);
  }

  return { ok: true, message: "Thanks — your report is unlocked and we'll be in touch shortly." };
}
