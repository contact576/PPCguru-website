import { after } from "next/server";
import { leadRecipients, sendMail, emailConfigured, sendLeadAutoresponder } from "@/lib/email";
import { hasSupabase, type LeadInput } from "@/lib/supabase";
import { sendLeadToZoho, zohoConfigured } from "@/lib/zoho";
import { sendLeadToGhl, ghlConfigured } from "@/lib/gohighlevel";

/**
 * Post-save fan-out shared by every lead form (contact, pop-up/tools, the paid
 * landing pages): CRM → team notification → autoresponder.
 *
 * WHY THIS EXISTS — the submit button "taking forever". Each action used to
 * await these one after another: a 6–8 s CRM call, then an SMTP connect +
 * auth + (rejected) send, then the same again for the autoresponder, then
 * Resend… the visitor stared at a spinner for 10–20 s. Now:
 *
 *   1. The three deliveries run IN PARALLEL (Promise.all).
 *   2. When the submission is already safe in Supabase, the whole fan-out is
 *      handed to Next's `after()` and runs once the response has been sent —
 *      the visitor sees the thank-you page as soon as the row is written.
 *   3. Only when there is NO durable store (Supabase unconfigured) do we wait
 *      for the fan-out, because then an email/CRM hit is the only proof the
 *      lead exists and the action must be able to report a failure.
 */

export type Notification = {
  subject: string;
  text: string;
  /** The lead's address — replies from the team go straight back to them. */
  replyTo?: string;
};

export type DeliveryInput = {
  record: LeadInput;
  leadId: string | null;
  notification: Notification;
  /** Who gets the branded autoresponder. */
  lead: { name?: string; email?: string };
};

export type DeliveryResult = { crmed: boolean; emailed: boolean; autoresponded: boolean };

async function safe<T>(label: string, p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch (err) {
    console.error(`[lead-delivery] ${label} failed:`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

/** Run CRM + team email + autoresponder concurrently. Never throws. */
export async function fanOut(input: DeliveryInput): Promise<DeliveryResult> {
  const { record, leadId, notification, lead } = input;
  const crm = ghlConfigured()
    ? sendLeadToGhl({ ...record, submissionId: leadId ?? undefined, createdAt: new Date().toISOString() })
    : sendLeadToZoho(record);
  const [crmed, emailed, autoresponded] = await Promise.all([
    safe("crm", crm, false),
    safe(
      "team email",
      sendMail({ to: leadRecipients(), replyTo: notification.replyTo, subject: notification.subject, text: notification.text }),
      false,
    ),
    safe("autoresponder", sendLeadAutoresponder(lead), false),
  ]);
  if (!emailed) {
    console.error(
      `[lead-delivery] team notification NOT delivered for ${record.email ?? "?"} (${record.source ?? "site"}) — check /admin/settings → Email delivery.`,
    );
  }
  return { crmed, emailed, autoresponded };
}

export type DeliveryOutcome =
  | { ok: true }
  /** Nothing durable accepted the lead — the caller should show an error. */
  | { ok: false; reason: "undelivered" };

/**
 * Decide how to run the fan-out for this submission.
 *  - stored in Supabase  → schedule it after the response, return ok immediately.
 *  - not stored          → run it now; ok only if some channel accepted the lead.
 */
export async function deliverLead(input: DeliveryInput): Promise<DeliveryOutcome> {
  const stored = input.leadId !== null;
  if (stored) {
    after(async () => {
      await fanOut(input);
    });
    return { ok: true };
  }

  const result = await fanOut(input);
  const anyConfigured = emailConfigured() || hasSupabase() || zohoConfigured() || ghlConfigured();
  const anyDelivered = result.emailed || result.crmed;
  if (anyConfigured && !anyDelivered) return { ok: false, reason: "undelivered" };
  if (!anyDelivered) {
    console.info("[lead-delivery] (no email / Supabase / CRM configured) capture:", input.record);
  }
  return { ok: true };
}
