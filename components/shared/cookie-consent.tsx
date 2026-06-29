"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Lightweight cookie/consent notice. Shows once until a choice is stored in
 * localStorage. Bottom-left compact card so it never collides with the
 * bottom-right floating CTA / offer pop-up. Reduced-motion safe (no animation).
 * Analytics hooks (lib/analytics) stay no-ops until a key is added — this records
 * intent so consent is captured before any tracking is wired.
 */
const KEY = "ppcg_cookie_consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* localStorage unavailable — don't block the page */
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
      window.dispatchEvent(new CustomEvent("ppcg:consent", { detail: value }));
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      style={{
        position: "fixed", left: 14, bottom: 14, zIndex: 60,
        width: "min(92vw, 360px)",
        background: "#fff", border: "1px solid #dddbc9", borderRadius: 16,
        padding: 18, boxShadow: "0 18px 50px rgba(20,23,14,.16)",
      }}
    >
      <p style={{ fontSize: 13, lineHeight: 1.55, color: "#3a3c30" }}>
        We use cookies to run this site and understand traffic. See our{" "}
        <Link href="/privacy" style={{ color: "#5d6b1a", textDecoration: "underline" }}>Privacy Policy</Link>.
      </p>
      <div style={{ display: "flex", gap: 9, marginTop: 14 }}>
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="mono"
          style={{ flex: 1, cursor: "pointer", border: "none", background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 11.5, letterSpacing: ".05em", textTransform: "uppercase", padding: "11px 12px", borderRadius: 11 }}
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide("declined")}
          className="mono"
          style={{ cursor: "pointer", background: "transparent", border: "1px solid #d8d6c6", color: "#54564a", fontWeight: 600, fontSize: 11.5, letterSpacing: ".05em", textTransform: "uppercase", padding: "11px 14px", borderRadius: 11 }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
