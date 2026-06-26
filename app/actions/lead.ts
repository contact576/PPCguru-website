"use server";

import { z } from "zod";
import { siteConfig } from "@/lib/site-config";

/**
 * Shared lead-capture action used by the pop-up funnel and the gated tools.
 * Zod-validated, honeypot-protected, delivers via Resend when configured and
 * otherwise logs (so it works with no keys). `source` records where the lead
 * came from (e.g. "popup:audit", "tool:roas-calculator").
 */
const schema = z.object({
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(5, "Please enter a phone number.").max(40),
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

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;
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
    } catch {
      return { ok: false, message: "We couldn't submit that right now. Please email us directly." };
    }
  } else {
    console.info("[lead] (no RESEND_API_KEY) capture:", data);
  }

  return { ok: true, message: "Thanks — your report is unlocked and we'll be in touch shortly." };
}
