"use client";

/**
 * First-party, consent-aware event beacon.
 *
 * Sends lightweight interaction events (pageviews, clicks, form/tool events) to
 * our own /api/track endpoint, which writes them to Supabase. Nothing is sent to
 * third parties here.
 *
 * PRIVACY MODEL (PIPEDA/CASL-aligned, disclosed in /privacy):
 *  - If the visitor explicitly DECLINED the cookie notice → we send nothing.
 *  - Before a choice / after "Accept" → we send anonymous events (path, a random
 *    first-party session id, UTM tags). These carry no personal data.
 *  - The server attaches technical/identifying fields (IP, coarse geo, user-agent)
 *    ONLY when `consent === "accepted"`.
 */

const CONSENT_KEY = "ppcg_cookie_consent";
const SID_KEY = "ppcg_sid";
const ATTRIBUTION_KEY = "ppcg_attribution_v1";
const LEAD_EVENT_KEY = "ppcg_lead_eid";
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "oppref",
  "oa_ad_account_id",
  "oa_campaign_id",
  "oa_ad_group_id",
  "oa_ad_id",
] as const;

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

/** Stable, first-party anonymous session id (localStorage). Not a tracking cookie. */
export function sessionId(): string | undefined {
  try {
    let id = localStorage.getItem(SID_KEY);
    if (!id) {
      id = crypto?.randomUUID?.() ?? `${Date.now()}${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

/** Current cookie-consent choice. `null` = they haven't answered the banner yet. */
export function consentState(): "accepted" | "declined" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

type StoredAttribution = {
  captured_at: number;
  values: Record<string, string>;
};

/**
 * Captures the latest attributable landing touch and retains it for the same
 * 30-day window used by the campaign. Direct return visits reuse that touch;
 * a later tagged visit replaces it. An explicit analytics decline disables
 * persistence, while the current URL values can still accompany a form the
 * visitor intentionally submits.
 */
export function attributionSnapshot(): Record<string, string> {
  try {
    const p = new URLSearchParams(location.search);
    const current: Record<string, string> = {};
    for (const k of ATTRIBUTION_PARAMS) {
      const v = p.get(k);
      if (v) current[k] = v.slice(0, 300);
    }

    if (Object.keys(current).length) {
      current.landing_path = location.pathname;
      if (document.referrer) current.referrer = document.referrer.slice(0, 300);
      if (consentState() !== "declined") {
        const stored: StoredAttribution = { captured_at: Date.now(), values: current };
        localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(stored));
      }
      return current;
    }

    if (consentState() !== "declined") {
      const raw = localStorage.getItem(ATTRIBUTION_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredAttribution;
        if (stored?.captured_at && Date.now() - stored.captured_at <= ATTRIBUTION_TTL_MS && stored.values) {
          return stored.values;
        }
        localStorage.removeItem(ATTRIBUTION_KEY);
      }
    }
    return {};
  } catch {
    return {};
  }
}

/** One stable id per pending form submission, shared by browser and server. */
export function leadEventId(): string | undefined {
  try {
    let id = sessionStorage.getItem(LEAD_EVENT_KEY);
    if (!id) {
      id = crypto?.randomUUID?.() ?? `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(LEAD_EVENT_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export function trackOpenAiPageViewed(): void {
  if (typeof window === "undefined" || consentState() === "declined") return;
  try {
    window.oaiq?.("measure", "page_viewed", { type: "contents" });
  } catch {
    /* measurement must never break navigation */
  }
}

/**
 * Browser fallback for a lead already accepted by the server. The success URL
 * supplies the exact id used by CAPI; spam/failed submissions never receive it.
 */
export function trackOpenAiLeadCreated(eventId: string | null | undefined): void {
  if (typeof window === "undefined" || !eventId || consentState() === "declined") return;
  try {
    const sentKey = `${LEAD_EVENT_KEY}_sent_${eventId}`;
    if (sessionStorage.getItem(sentKey)) return;
    window.oaiq?.("measure", "lead_created", { type: "customer_action" }, { event_id: eventId });
    sessionStorage.setItem(sentKey, "1");
    if (sessionStorage.getItem(LEAD_EVENT_KEY) === eventId) sessionStorage.removeItem(LEAD_EVENT_KEY);
  } catch {
    /* measurement must never break the thank-you page */
  }
}

/** Fire a first-party event. No-ops entirely if the visitor declined cookies. */
export function sendEvent(event: string, extra: { target?: string; path?: string } = {}) {
  if (typeof window === "undefined") return;
  const consent = consentState();
  if (consent === "declined") return; // honour the opt-out completely
  try {
    const body = JSON.stringify({
      event,
      path: extra.path ?? location.pathname,
      referrer: document.referrer || undefined,
      target: extra.target,
      session_id: sessionId(),
      consent: consent === "accepted",
      utm: attributionSnapshot(),
    });
    const url = "/api/track";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      fetch(url, { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
    }
  } catch {
    /* analytics must never break the page */
  }
}

export type AnalyticsEvent =
  | "cta_click"
  | "audit_form_start"
  | "audit_form_submit"
  | "trial_offer_click"
  | "phone_click"
  | "whatsapp_click"
  | "calculator_complete"
  | "popup_submit"
  | "service_card_click";

/** Back-compat helper used across the app — now forwards to the first-party beacon. */
export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  const target =
    typeof payload.label === "string" ? payload.label : typeof payload.target === "string" ? payload.target : undefined;
  sendEvent(event, { target });
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, payload);
  }
}
