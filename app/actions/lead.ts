"use server";

import { z } from "zod";
import { leadRecipients } from "@/lib/email";
import { saveLead, hasSupabase } from "@/lib/supabase";

/**
 * Shared lead-capture action used by the pop-up funnel and the gated tools.
 * Zod-validated, honeypot-protected, delivers via Resend when configured and
 * otherwise logs (so it works with no keys). `source` records where the lead
 * came from (e.g. "popup:audit", "tool:roas-calculator").
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
});

export type LeadState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function captureLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }
  const data = parsed.data;

  // Honeypot triggered → silently accept.
  if (data.company_website) return { ok: true, message: "Thanks — we'll be in touch shortly." };

  // Persist to Supabase first (best-effort) so a lead is never lost even if email fails.
  const stored = await saveLead({
    name: data.name,
    email: data.email,
    phone: data.phone,
    website: data.website,
    source: data.source || "site",
    message: data.detail,
  });

  let emailed = false;
  const resendKey = process.env.RESEND_API_KEY;
  const to = leadRecipients();
  if (resendKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL || "PPC Guru Website <onboarding@resend.dev>",
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
      emailed = true;
    } catch {
      // Email delivery failed — the Supabase row (if any) is still the safety net.
    }
  }

  // A delivery channel is "configured" if it has keys. If at least one channel is
  // configured but nothing actually got through (no email AND no DB row), the lead
  // would be silently lost — surface an error so the visitor can reach us another way.
  const anyConfigured = Boolean(resendKey) || hasSupabase();
  if (anyConfigured && !emailed && !stored) {
    return { ok: false, message: "We couldn't submit that right now. Please email us directly." };
  }
  if (!emailed && !stored) {
    console.info("[lead] (no RESEND_API_KEY / no Supabase) capture:", data);
  }

  return { ok: true, message: "Thanks — your report is unlocked and we'll be in touch shortly." };
}
