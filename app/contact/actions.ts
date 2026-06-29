"use server";

import { z } from "zod";
import { siteConfig } from "@/lib/site-config";
import { saveLead } from "@/lib/supabase";

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
  turnstileToken: z.string().optional(),
});

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

async function verifyTurnstile(token?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → skip
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message;
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }
  const data = parsed.data;

  // Honeypot triggered → silently accept (bots think they succeeded)
  if (data.website) return { ok: true, message: "Thanks — we'll be in touch shortly." };

  if (!(await verifyTurnstile(data.turnstileToken))) {
    return { ok: false, message: "Spam check failed. Please try again." };
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

  // Deliver via Resend if configured; otherwise log (dev/no-key fallback).
  let emailed = false;
  let emailError = false;
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
      emailed = true;
    } catch {
      emailError = true;
    }
  }

  if (emailError && !stored) {
    return { ok: false, message: "We couldn't send your message right now. Please email us directly." };
  }
  if (!emailed && !stored) {
    console.info("[contact] (no RESEND_API_KEY / no Supabase) submission:", { ...data, turnstileToken: undefined });
  }

  return { ok: true, message: "Thanks — we've received your request and will be in touch within one business day." };
}
