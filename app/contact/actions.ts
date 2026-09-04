"use server";

import { z } from "zod";
import { leadRecipients, sendMail, emailConfigured, sendLeadAutoresponder } from "@/lib/email";
import { saveLeadReturning, hasSupabase } from "@/lib/supabase";
import { sendLeadToZoho, zohoConfigured } from "@/lib/zoho";
import { sendLeadToGhl, ghlConfigured } from "@/lib/gohighlevel";
import { identifyVisitor } from "@/lib/identity";
import { verifyTurnstile } from "@/lib/turnstile";
import { scoreSubmission, logBlocked } from "@/lib/spam-filter";
import { rateLimit, clientIpFromHeaders } from "@/lib/rate-limit";
import { SERVICE_OPTIONS, BUDGET_OPTIONS, SERVICES_MAX_LEN } from "@/lib/data/form-options";

const schema = z.object({
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(6, "Please enter your phone number.").max(40),
  company: z.string().min(2, "Please enter your business name.").max(120),
  // NB the honeypot owns the name `website`, so the real website field is
  // `site_url`. Renaming the honeypot would retire a trap bots already fall for.
  site_url: z.string().max(200).optional().or(z.literal("")),
  budget: z.enum(BUDGET_OPTIONS, { message: "Please choose a budget range." }),
  // Multi-select checkboxes — see `rawFrom()` below.
  services: z
    .array(z.enum(SERVICE_OPTIONS))
    .min(1, "Please choose at least one service.")
    .max(SERVICE_OPTIONS.length),
  message: z.string().min(10, "Tell us a little about your goals.").max(4000),
  // First-party device id (<SessionField />) — see app/actions/lead.ts.
  session_id: z.string().max(64).optional().or(z.literal("")),
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

/** Repeated checkbox keys survive only via getAll — see app/actions/lead.ts. */
function rawFrom(formData: FormData) {
  return {
    ...Object.fromEntries(formData.entries()),
    services: formData.getAll("services").map(String),
  };
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = rawFrom(formData);
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
    website: data.site_url,
    message: data.message,
    renderedAt: data.renderedAt,
  });
  if (verdict.spam) {
    logBlocked("contact", verdict, { name: data.name, email: data.email, message: data.message });
    return SILENT_OK;
  }

  // Save the submission before CRM delivery, keeping a durable copy and stable
  // submission id for recovery if GoHighLevel is temporarily unavailable.
  const servicesText = data.services.join(", ").slice(0, SERVICES_MAX_LEN);

  const record = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    website: data.site_url,
    source: "contact",
    budget: data.budget,
    service: servicesText,
    message: data.message,
  };
  const leadId = await saveLeadReturning(record);
  if (hasSupabase() && !leadId) {
    return { ok: false, message: "We couldn't save your request right now. Please try again shortly." };
  }
  // GoHighLevel replaces Zoho once configured; keep Zoho active until cutover.
  const crmed = ghlConfigured()
    ? await sendLeadToGhl({ ...record, submissionId: leadId ?? undefined, createdAt: new Date().toISOString() })
    : await sendLeadToZoho(record);
  const stored = leadId !== null;

  // Retro-stitch their anonymous browsing to this identity + set the
  // recognition cookie. See lib/identity.ts. Best-effort — never throws.
  await identifyVisitor({
    sessionId: data.session_id,
    leadId,
    email: data.email,
    name: data.name,
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
      `Website: ${data.site_url || "—"}`,
      `Budget: ${data.budget}`,
      `Interested in: ${servicesText}`,
      "",
      data.message,
    ].join("\n"),
  });

  // Fire the branded welcome/autoresponder TO the person who submitted (best-effort).
  await sendLeadAutoresponder({ name: data.name, email: data.email });

  // If a delivery channel is configured but nothing got through, don't pretend it worked.
  const anyConfigured = emailConfigured() || hasSupabase() || zohoConfigured() || ghlConfigured();
  const anyDelivered = emailed || stored || crmed;
  if (anyConfigured && !anyDelivered) {
    return { ok: false, message: "We couldn't send your message right now. Please email us directly." };
  }
  if (!anyDelivered) {
    console.info("[contact] (no RESEND_API_KEY / no Supabase / no Zoho / no GHL) submission:", {
      ...data,
      turnstileToken: undefined,
    });
  }

  return { ok: true, message: "Thanks — we've received your request and will be in touch within one business day." };
}
