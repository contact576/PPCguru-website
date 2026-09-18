"use client";

import { useEffect, useState } from "react";
import { sessionId, consentState, leadEventId } from "@/lib/analytics";

/**
 * Hidden field carrying this browser's first-party device id (`ppcg_sid`) into
 * a form submission. That id is what lets the server retro-stitch everything
 * the visitor read *before* they filled anything in — see lib/identity.ts.
 *
 * Drop it inside any <form> that posts to a lead action.
 *
 * Two deliberate behaviours:
 *  - It resolves in an effect, so the id never appears in server-rendered HTML.
 *  - If the visitor DECLINED the cookie banner, it stays empty. They can still
 *    submit the form and we still get their enquiry — we just don't tie it back
 *    to their browsing history. Declining has to mean something.
 */
export function SessionField() {
  const [sid, setSid] = useState("");
  const [eventId, setEventId] = useState("");
  const [measurementConsent, setMeasurementConsent] = useState<"accepted" | "implicit" | "declined">("implicit");

  useEffect(() => {
    const refresh = (choice = consentState()) => {
      const state = choice ?? "implicit";
      setMeasurementConsent(state);
      setSid(state === "declined" ? "" : sessionId() ?? "");
    };
    refresh();
    setEventId(leadEventId() ?? "");

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      refresh(detail === "accepted" || detail === "declined" ? detail : consentState());
    };
    window.addEventListener("ppcg:consent", onConsent);
    return () => window.removeEventListener("ppcg:consent", onConsent);
  }, []);

  return (
    <>
      <input type="hidden" name="session_id" value={sid} readOnly />
      <input type="hidden" name="event_id" value={eventId} readOnly />
      <input type="hidden" name="measurement_consent" value={measurementConsent} readOnly />
    </>
  );
}
