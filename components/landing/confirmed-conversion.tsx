"use client";

import { useEffect } from "react";
import { consentState, sendEvent, trackLead } from "@/lib/analytics";
import { GTA_LANDING_SOURCE } from "@/lib/data/landing-gta";

/** GTA conversion events require a server receipt AND the matching tab event. */
export function ConfirmedLandingConversion({ eventId }: { eventId?: string }) {
  useEffect(() => {
    if (!eventId || consentState() === "declined") return;
    if (!trackLead({ requireId: true, expectedEventId: eventId })) return;
    sendEvent("audit_form_submit", { target: GTA_LANDING_SOURCE });
    const win = window as typeof window & {
      dataLayer?: Array<Record<string, unknown>>;
      fbq?: (...args: unknown[]) => void;
    };
    // GTM can route this event into the account's Google Ads/GA4 conversion tag.
    // No account IDs, lead values or contact details are invented here.
    (win.dataLayer ??= []).push({ event: "generate_lead", form_name: "gta_growth_plan", source: GTA_LANDING_SOURCE, event_id: eventId });
    win.fbq?.("track", "Lead", { content_name: "GTA growth plan" }, { eventID: eventId });
  }, [eventId]);
  return null;
}
