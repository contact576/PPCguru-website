import { createHash, randomUUID } from "node:crypto";
import { OPENAI_PIXEL_ID } from "@/components/analytics/third-party";
import type { ConversionContext } from "@/lib/conversion-context";

/**
 * OpenAI (ChatGPT Ads) Conversions API — server-side `lead_created`.
 * https://developers.openai.com/ads/conversions-api
 *
 * Sent from lib/lead-delivery.ts for every website lead, alongside the browser
 * pixel's `lead_created` (lib/analytics.ts trackLead). Both carry the SAME id
 * (the form's hidden `event_id`), and OpenAI keeps the first event per
 * pixel + type + id, so a lead is counted once even when both arrive.
 *
 * Env: OPENAI_ADS_API_KEY (required), NEXT_PUBLIC_OPENAI_PIXEL_ID.
 * Never throws; no-op without a key or when the visitor declined cookies.
 */

export function openAiCapiConfigured(): boolean {
  return Boolean(process.env.OPENAI_ADS_API_KEY && OPENAI_PIXEL_ID);
}

const sha = (v: string) => createHash("sha256").update(v).digest("hex");
/** Lowercase, no whitespace or ASCII punctuation (OpenAI's name normalisation). */
const normName = (v: string) => v.toLowerCase().replace(/[\s!-/:-@[-`{-~]/g, "");

export type OpenAiLead = {
  eventId?: string;
  email?: string;
  phone?: string;
  name?: string;
  source?: string;
};

export async function sendOpenAiLead(lead: OpenAiLead, ctx: ConversionContext): Promise<boolean> {
  if (!openAiCapiConfigured() || ctx.declined) return false;

  const user: Record<string, unknown> = {};
  const email = lead.email?.trim().toLowerCase();
  if (email) user.emails_sha256 = [sha(email)];
  // 8–15 digits, no leading "+"/zeroes. Leads are CA/US, so a bare 10-digit number gets its "1".
  let phone = (lead.phone || "").replace(/\D/g, "").replace(/^0+/, "");
  if (phone.length === 10) phone = `1${phone}`;
  if (phone.length >= 8 && phone.length <= 15) user.phone_numbers_sha256 = [sha(phone)];
  const parts = (lead.name || "").trim().split(/\s+/).map(normName).filter(Boolean);
  if (parts[0]) user.first_names_sha256 = [sha(parts[0])];
  if (parts.length > 1) user.last_names_sha256 = [sha(parts[parts.length - 1])];
  if (ctx.obref) user.obref = ctx.obref;
  if (ctx.ip) user.ip_address = ctx.ip;
  if (ctx.userAgent) user.user_agent = ctx.userAgent;

  const body = {
    validate_only: process.env.OPENAI_ADS_VALIDATE_ONLY === "true",
    events: [
      {
        id: lead.eventId || randomUUID(),
        type: "lead_created",
        timestamp_ms: Date.now(),
        source_url: ctx.sourceUrl || "https://ppcguru.ca/",
        action_source: "web",
        ...(ctx.oppref ? { oppref: ctx.oppref } : {}),
        data: { type: "customer_action" },
        user,
      },
    ],
  };

  try {
    const res = await fetch(`https://bzr.openai.com/v1/events?pid=${encodeURIComponent(OPENAI_PIXEL_ID)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_ADS_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`[openai-capi] ${res.status}:`, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[openai-capi] failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
