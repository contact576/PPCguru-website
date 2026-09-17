import { createHash, randomUUID } from "node:crypto";
import { META_PIXEL_ID } from "@/components/analytics/third-party";
import type { ConversionContext } from "@/lib/conversion-context";

/**
 * Meta Conversions API — server-side `Lead` for every website form.
 *
 * Called from lib/lead-delivery.ts, the one fan-out every lead form already
 * goes through (contact, pop-up/tools, homepage audit, /100-leads, /seo-visibility),
 * so there is no per-form wiring.
 *
 * The browser Pixel (components/analytics/third-party.tsx) sends PageView; the
 * Lead is sent from HERE only, so there is nothing to double-count and no
 * browser/server event_id dedupe to keep in sync. Match quality comes from the
 * Pixel's own _fbp/_fbc cookies plus hashed email/phone/name, IP and user-agent.
 *
 * Env:
 *   META_CAPI_ACCESS_TOKEN  (required) Events Manager → dataset → Settings →
 *                           Conversions API → Generate access token
 *   NEXT_PUBLIC_META_PIXEL_ID  dataset id (defaults to "PPC Pixels")
 *   META_CAPI_TEST_CODE     optional; routes events to Events Manager → Test events
 *
 * Never throws; no-op without a token or when the visitor declined cookies.
 */

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v23.0";

export function metaCapiConfigured(): boolean {
  return Boolean(process.env.META_CAPI_ACCESS_TOKEN && META_PIXEL_ID);
}

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

/** Meta wants digits only with country code; the site's leads are CA/US. */
function normPhone(raw?: string): string | undefined {
  const d = (raw || "").replace(/\D/g, "");
  if (!d) return undefined;
  return d.length === 10 ? `1${d}` : d;
}

export type MetaLead = {
  eventId?: string;
  email?: string;
  phone?: string;
  name?: string;
  source?: string;
};

export async function sendMetaLead(lead: MetaLead, ctx: ConversionContext): Promise<boolean> {
  if (!metaCapiConfigured() || ctx.declined) return false;

  const [first, ...rest] = (lead.name || "").trim().toLowerCase().split(/\s+/);
  const last = rest.pop();
  const email = lead.email?.trim().toLowerCase();
  const phone = normPhone(lead.phone);

  const user_data: Record<string, unknown> = {
    client_ip_address: ctx.ip,
    client_user_agent: ctx.userAgent,
    fbp: ctx.fbp,
    fbc: ctx.fbc,
  };
  if (email) user_data.em = [sha(email)];
  if (phone) user_data.ph = [sha(phone)];
  if (first) user_data.fn = [sha(first)];
  if (last) user_data.ln = [sha(last)];

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.eventId || randomUUID(),
        action_source: "website",
        event_source_url: ctx.sourceUrl,
        user_data,
        custom_data: { content_name: lead.source || "website" },
      },
    ],
    ...(process.env.META_CAPI_TEST_CODE ? { test_event_code: process.env.META_CAPI_TEST_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(process.env.META_CAPI_ACCESS_TOKEN!)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) {
      console.error(`[meta-capi] ${res.status}:`, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[meta-capi] failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
