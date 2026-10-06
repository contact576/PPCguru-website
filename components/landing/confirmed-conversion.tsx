"use client";

import { useEffect } from "react";
import { consentState, sendEvent, trackLead } from "@/lib/analytics";
import { GTA_LANDING_SOURCE } from "@/lib/data/landing-gta";
import { GOOGLE_META_LANDING_SOURCE } from "@/lib/data/landing-google-meta";
import { configureGoogleMetaAds, googleMetaTag, GOOGLE_META_ADS_CONVERSION, GOOGLE_META_GA4_ID } from "@/components/landing/google-meta-analytics";

/** Conversion events require a receipt for this funnel AND its matching tab event. */
export function ConfirmedLandingConversion({ eventId, source = GTA_LANDING_SOURCE }: { eventId?: string; source?: typeof GTA_LANDING_SOURCE | typeof GOOGLE_META_LANDING_SOURCE }) {
  useEffect(() => {
    if (!eventId || consentState() === "declined") return;
    if (!trackLead({ requireId: true, expectedEventId: eventId })) return;
    sendEvent("audit_form_submit", { target: source });
    const win = window as typeof window & {
      dataLayer?: Array<Record<string, unknown> | IArguments>;
      fbq?: (...args: unknown[]) => void;
      clarity?: (...args: unknown[]) => void;
    };
    const googleMeta = source === GOOGLE_META_LANDING_SOURCE;
    const parameters = { form_name: googleMeta ? "google_meta_growth_plan" : "gta_growth_plan", source, event_id: eventId };
    if (googleMeta) {
      // Both destinations use the existing Google tag. Explicit routing keeps
      // the GA4 lead separate from the Ads action; the receipt guards both.
      configureGoogleMetaAds();
      googleMetaTag("event", "generate_lead", { ...parameters, send_to: GOOGLE_META_GA4_ID });
      googleMetaTag("event", "conversion", { send_to: GOOGLE_META_ADS_CONVERSION, transaction_id: eventId });
      win.clarity?.("event", "google_meta_lead_submitted");
    } else {
      (win.dataLayer ??= []).push({ event: "generate_lead", ...parameters });
    }
    win.fbq?.("track", "Lead", { content_name: googleMeta ? "Google + Meta growth plan" : "GTA growth plan" }, { eventID: eventId });
  }, [eventId, source]);
  return null;
}
