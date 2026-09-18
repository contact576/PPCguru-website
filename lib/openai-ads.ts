import { createHash } from "node:crypto";
import { isIP } from "node:net";

const EVENTS_ENDPOINT = "https://bzr.openai.com/v1/events";
const REQUEST_TIMEOUT_MS = 2500;

export type OpenAiLeadEvent = {
  eventId: string;
  email?: string;
  phone?: string;
  name?: string;
  externalId?: string;
  oppref?: string;
  obref?: string;
  sourceUrl: string;
  ipAddress?: string;
  userAgent?: string;
  measurementConsent?: "accepted" | "implicit" | "declined";
};

function apiKey(): string | undefined {
  return (
    process.env.OPENAI_ADS_CONVERSIONS_API_KEY?.trim() ||
    process.env.OPENAI_ADS_CAPI_KEY?.trim() ||
    process.env.OPENAI_ADS_API_KEY?.trim() ||
    process.env.OPENAI_CONVERSIONS_API_KEY?.trim() ||
    process.env.OPENAI_CAPI_KEY?.trim() ||
    undefined
  );
}

export function openAiAdsPixelId(): string {
  return (
    process.env.OPENAI_ADS_PIXEL_ID?.trim() ||
    process.env.NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID?.trim() ||
    "VaW8hbc5GLhy5y8FWYNcYt"
  );
}

export function openAiAdsServerConfigured(): boolean {
  return Boolean(apiKey() && openAiAdsPixelId());
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function normalizedPhone(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value
    .trim()
    .replace(/[\s().-]/g, "")
    .replace(/^\+/, "")
    .replace(/^0+/, "");
  return /^\d{8,15}$/.test(normalized) ? normalized : undefined;
}

function normalizedNamePart(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().replace(/[\x00-\x20\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/g, "");
  return normalized || undefined;
}

function userPayload(event: OpenAiLeadEvent): Record<string, unknown> | undefined {
  const user: Record<string, unknown> = {};
  const email = event.email?.trim().toLowerCase();
  const phone = normalizedPhone(event.phone);
  const names = event.name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const firstName = normalizedNamePart(names[0]);
  const lastName = normalizedNamePart(names.length > 1 ? names[names.length - 1] : undefined);
  const externalId = event.externalId?.trim();

  if (email) user.emails_sha256 = [sha256(email)];
  if (phone) user.phone_numbers_sha256 = [sha256(phone)];
  if (externalId) user.external_ids_sha256 = [sha256(externalId)];
  if (firstName) user.first_names_sha256 = [sha256(firstName)];
  if (lastName) user.last_names_sha256 = [sha256(lastName)];
  if (event.obref?.trim()) user.obref = event.obref.trim();
  if (event.ipAddress && isIP(event.ipAddress)) user.ip_address = event.ipAddress;
  if (event.userAgent?.trim()) user.user_agent = event.userAgent.trim().slice(0, 1000);

  return Object.keys(user).length ? user : undefined;
}

async function postEvent(key: string, pixelId: string, body: Record<string, unknown>): Promise<Response | null> {
  try {
    return await fetch(`${EVENTS_ENDPOINT}?pid=${encodeURIComponent(pixelId)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

/**
 * Sends the successful form submission to OpenAI's server-side Conversions API.
 * This is best-effort and never blocks lead storage or CRM delivery. Raw contact
 * data and API responses are deliberately never logged.
 */
export async function sendOpenAiLeadCreated(event: OpenAiLeadEvent): Promise<boolean> {
  if (event.measurementConsent === "declined") return false;
  const key = apiKey();
  const pixelId = openAiAdsPixelId();
  if (!key || !pixelId || !event.eventId.trim()) return false;

  const conversion: Record<string, unknown> = {
    id: event.eventId.trim().slice(0, 200),
    type: "lead_created",
    timestamp_ms: Date.now(),
    source_url: event.sourceUrl,
    action_source: "web",
    data: { type: "customer_action" },
  };
  if (event.oppref?.trim()) conversion.oppref = event.oppref.trim();
  const user = userPayload(event);
  if (user) conversion.user = user;

  const body = {
    validate_only: false,
    integration_source: "ppc_guru_website",
    events: [conversion],
  };

  let response = await postEvent(key, pixelId, body);
  if (!response || response.status === 429 || response.status >= 500) {
    response = await postEvent(key, pixelId, body);
  }
  if (response?.ok) return true;
  console.warn(`[openai-ads] lead event incomplete (${response ? `HTTP ${response.status}` : "network error"}); browser pixel remains the fallback.`);
  return false;
}
