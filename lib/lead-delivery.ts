import { after } from "next/server";
import { leadRecipients, sendMail, emailConfigured, sendLeadAutoresponder } from "@/lib/email";
import { hasSupabase, type LeadInput } from "@/lib/supabase";
import { sendLeadToZoho, zohoConfigured } from "@/lib/zoho";
import { sendLeadToGhl, ghlConfigured } from "@/lib/gohighlevel";
import { sendMetaLead } from "@/lib/meta-capi";
import { sendOpenAiLead } from "@/lib/openai-capi";
import { readConversionContext, cleanEventId, type ConversionContext } from "@/lib/conversion-context";
import { GOOGLE_META_LANDING_SOURCE } from "@/lib/data/landing-google-meta";
import type { GoogleMetaAttempt } from "@/lib/google-meta-submission";

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
 *   3. The Google + Meta funnel always waits for email and GHL acknowledgment.
 *      Other forms only wait when there is NO durable store (unconfigured),
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
  /** The form's hidden `event_id` — the browser pixels fire with the same id. */
  eventId?: FormDataEntryValue | null;
  /** Paid landing pages may only confirm a lead accepted by a durable channel. */
  requireDelivery?: boolean;
  /** Server-owned retry progress, only used by the Google + Meta funnel. */
  attempt?: GoogleMetaAttempt;
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

async function sendConversions(input: DeliveryInput, ctx: ConversionContext): Promise<void> {
  const { record, leadId } = input;
  const conversion = { eventId: cleanEventId(input.eventId) ?? leadId ?? undefined, email: record.email, phone: record.phone, name: record.name, source: record.source };
  await Promise.all([
    safe("meta capi", sendMetaLead(conversion, ctx), false),
    safe("openai capi", sendOpenAiLead(conversion, ctx), false),
  ]);
}

/** Run CRM + team email + autoresponder (+ Meta and OpenAI conversion APIs) concurrently. Never throws. */
export async function fanOut(input: DeliveryInput, ctx?: ConversionContext): Promise<DeliveryResult> {
  const { record, leadId, notification, lead } = input;
  const crm = ghlConfigured()
    ? sendLeadToGhl({ ...record, submissionId: leadId ?? undefined, createdAt: new Date().toISOString() })
    : sendLeadToZoho(record);
  const [crmed, emailed, autoresponded] = await Promise.all([
    safe("crm", crm, false),
    safe(
      "team email",
      sendMail({ to: leadRecipients(record.source), replyTo: notification.replyTo, subject: notification.subject, text: notification.text, rescue: true }),
      false,
    ),
    // Strict forms without a saved row wait for a team/CRM acknowledgement
    // before telling the visitor that their request has been received.
    !input.requireDelivery || leadId !== null ? safe("autoresponder", sendLeadAutoresponder(lead, { source: record.source }), false) : false,
    ctx ? sendConversions(input, ctx) : undefined,
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
  /** Required delivery did not complete — the caller should show an error. */
  | { ok: false; reason: "undelivered" };

/**
 * Decide how to run the fan-out for this submission.
 *  - Google + Meta       → await all team recipients and GHL, even when stored.
 *  - other stored leads  → schedule it after the response, return ok immediately.
 *  - not stored          → run it now; ok only if some channel accepted the lead.
 */
export async function deliverLead(input: DeliveryInput): Promise<DeliveryOutcome> {
  const stored = input.leadId !== null;
  // Headers/cookies are request-scoped: read them now, before `after()`.
  const ctx = await readConversionContext();
  // This funnel promises all three team inboxes AND GHL. A stored row is a
  // recovery copy, not confirmation of those deliveries; Zoho cannot replace GHL.
  if (input.record.source === GOOGLE_META_LANDING_SOURCE) {
    const { record, notification, attempt } = input;
    if (attempt?.accepted) return { ok: true };
    const remainingRecipients = leadRecipients(record.source).filter((recipient) => !attempt?.acceptedRecipients.includes(recipient));
    const [emailed, crmed] = await Promise.all([
      attempt?.emailed || !remainingRecipients.length || (emailConfigured() && safe("Google + Meta team email", sendMail({
        to: remainingRecipients, replyTo: notification.replyTo,
        subject: notification.subject, text: notification.text, rescue: true,
        onAccepted: attempt ? (recipients) => {
          attempt.acceptedRecipients = [...new Set([...attempt.acceptedRecipients, ...recipients])];
        } : undefined,
      }), false)),
      attempt?.crmed || (ghlConfigured() && safe("Google + Meta GHL", sendLeadToGhl({
        ...record, submissionId: input.leadId ?? attempt?.submissionId ?? cleanEventId(input.eventId),
        createdAt: new Date().toISOString(),
      }), false)),
    ]);
    if (attempt) {
      attempt.emailed = emailed;
      attempt.crmed = crmed;
    }
    if (!emailed || !crmed) {
      console.error("[lead-delivery] Google + Meta required delivery incomplete", {
        leadId: input.leadId, emailAccepted: emailed, ghlAccepted: crmed,
      });
      return { ok: false, reason: "undelivered" };
    }
    if (attempt) attempt.accepted = true;
    // Only acknowledge and count a conversion after both required destinations
    // accepted the request. The saved recovery copy alone is not a conversion.
    after(async () => {
      await Promise.all([
        safe("autoresponder", sendLeadAutoresponder(input.lead, { source: record.source }), false),
        sendConversions(input, ctx),
      ]);
    });
    return { ok: true };
  }
  if (stored) {
    after(async () => {
      await fanOut(input, ctx);
    });
    return { ok: true };
  }

  // With no database, wait for an email/CRM acknowledgement before counting a
  // strict landing submission as a conversion. Failed delivery is not a lead.
  const result = await fanOut(input, input.requireDelivery ? undefined : ctx);
  const anyConfigured = emailConfigured() || hasSupabase() || zohoConfigured() || ghlConfigured();
  const anyDelivered = result.emailed || result.crmed;
  if ((input.requireDelivery || anyConfigured) && !anyDelivered) return { ok: false, reason: "undelivered" };
  if (input.requireDelivery && anyDelivered) {
    after(async () => {
      await Promise.all([
        safe("autoresponder", sendLeadAutoresponder(input.lead, { source: input.record.source }), false),
        sendConversions(input, ctx),
      ]);
    });
  }
  if (!anyDelivered) {
    console.info("[lead-delivery] (no email / Supabase / CRM configured) capture:", input.record);
  }
  return { ok: true };
}
