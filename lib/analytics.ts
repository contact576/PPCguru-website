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

function consentState(): "accepted" | "declined" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

function readUtm(): Record<string, string> {
  try {
    const p = new URLSearchParams(location.search);
    const out: Record<string, string> = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"]) {
      const v = p.get(k);
      if (v) out[k] = v.slice(0, 200);
    }
    return out;
  } catch {
    return {};
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
      utm: readUtm(),
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
