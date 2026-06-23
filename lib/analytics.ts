"use client";

/**
 * Lightweight front-end analytics event hooks.
 *
 * These are intentionally NO-OPs until real measurement IDs are configured.
 * They never send data on their own — wire them up after consent is in place.
 *
 * TODO: Connect to GA4 / Google Tag Manager (window.dataLayer.push or gtag).
 * TODO: Connect to Meta Pixel only AFTER a consent banner is implemented.
 * TODO: Forward lead events (audit_form_submit, popup_submit) to the CRM.
 */

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

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // TODO: replace this dev log with a real GA4/GTM dataLayer push once IDs exist.
  // window.dataLayer?.push({ event, ...payload });
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics:todo]", event, payload);
  }
}
