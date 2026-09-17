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
  // Conversion event id (not personal data, so sent even when declined): the
  // server's conversion-API events and the browser pixels share it.
  const [eid, setEid] = useState("");

  useEffect(() => {
    setEid(leadEventId());
    if (consentState() === "declined") return;
    setSid(sessionId() ?? "");
  }, []);

  return (
    <>
      <input type="hidden" name="session_id" value={sid} readOnly />
      <input type="hidden" name="event_id" value={eid} readOnly />
    </>
  );
}
