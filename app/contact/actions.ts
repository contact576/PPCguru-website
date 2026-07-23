"use server";

import { z } from "zod";
import { leadRecipients, sendMail, emailConfigured, sendLeadAutoresponder } from "@/lib/email";
import { saveLead, hasSupabase } from "@/lib/supabase";
import { verifyTurnstile } from "@/lib/turnstile";
import { scoreSubmission, logBlocked } from "@/lib/spam-filter";
import { rateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  budget: z.string().max(40).optional().or(z.literal("")),
  service: z.string().max(60).optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a little about your goals.").max(4000),
  // Honeypot — must be empty.
  website: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().max(4000).optional().or(z.literal("")),
  renderedAt: z.string().max(20).optional().or(z.literal("")),
});

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

/** Silent drop: bots are told "thanks" so they can't probe the filter. */
const SILENT_OK: ContactState = { ok: true, message: "Thanks — we'll be in touch shortly." };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }
  const data = parsed.data;

  // Anti-spam: honeypot → per-IP rate limit → Turnstile → heuristics. Runs
  // before any delivery so a bot can never trigger the autoresponder (which
  // would mail a forged address from our domain). See `lib/spam-filter.ts`.

  // 1) Honeypot triggered → silently accept (bots think they succeeded)
  if (data.website) return SILENT_OK;

  const ip = await clientIpFromHeaders();

  // 2) Per-IP burst cap.
  if (!rateLimit(`contact:${ip}`, 4, 10 * 60_000).ok) {
    console.warn(`[spam] rate-limited contact submission from ${ip}`);
    return SILENT_OK;
  }

  // 3) Cloudflare Turnstile — no-ops until both keys are set.
  const turnstile = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstile.ok) {
    return { ok: false, message: "Please complete the “I'm not a robot” check and try again." };
  }

  // 4) Heuristics — catches the agency-pitch / link-drop spam that dominates
  //    this form, and keeps working if the challenge is ever solved for hire.
  const verdict = scoreSubmission({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    renderedAt: data.renderedAt,
  });
  if (verdict.spam) {
    logBlocked("contact", verdict, { name: data.name, email: data.email, message: data.message });
    return SILENT_OK;
  }

  // Persist to Supabase first (best-effort) so a request is never lost.
  const stored = await saveLead({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    source: "contact",
    budget: data.budget,
    service: data.service,
    message: data.message,
  });

  // Team notification (SMTP → Resend fallback; best-effort, never throws).
  const to = leadRecipients();
  const emailed = await sendMail({
    to,
    replyTo: data.email,
    subject: `New audit request from ${data.name}${data.company ? ` (${data.company})` : ""}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "—"}`,
      `Company: ${data.company || "—"}`,
      `Budget: ${data.budget || "—"}`,
      `Interested in: ${data.service || "—"}`,
      "",
      data.message,
    ].join("\n"),
  });

  // Fire the branded welcome/autoresponder TO the person who submitted (best-effort).
  await sendLeadAutoresponder({ name: data.name, email: data.email });

  // If a delivery channel is configured but nothing got through, don't pretend it worked.
  const anyConfigured = emailConfigured() || hasSupabase();
  if (anyConfigured && !emailed && !stored) {
    return { ok: false, message: "We couldn't send your message right now. Please email us directly." };
  }
  if (!emailed && !stored) {
    console.info("[contact] (no RESEND_API_KEY / no Supabase) submission:", { ...data, turnstileToken: undefined });
  }

  return { ok: true, message: "Thanks — we've received your request and will be in touch within one business day." };
}
