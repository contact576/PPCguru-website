"use client";

import { useEffect, useState } from "react";

/**
 * Floating "Free Audit" pill (bottom-right). Converts IN PLACE — clicking opens
 * the page-specific offer slide-in (`OfferPopup` listens for `ppcg:open-offer`)
 * instead of navigating away, so the visitor never leaves the page they're
 * converting on. Auto-hides while the slide-in is already open (avoids a
 * bottom-right pile-up on mobile).
 */
export function FloatingCta() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sync = () => setHidden(document.body.hasAttribute("data-offer-open"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-offer-open"] });
    return () => obs.disconnect();
  }, []);

  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("ppcg:open-offer"))}
      aria-label="Get a free audit"
      className="mono ppc-shake"
      style={{
        position: "fixed", right: 22, bottom: 22, zIndex: 70,
        background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 12.5,
        letterSpacing: ".05em", textTransform: "uppercase", padding: "15px 22px",
        borderRadius: 999, boxShadow: "0 12px 34px rgba(206,255,58,.4)",
        display: "inline-flex", alignItems: "center", gap: 9, border: "none", cursor: "pointer",
        animation: "ppcShake 9s ease-in-out 5s infinite", transformOrigin: "center",
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#14170e", animation: "ppcPulse 2.2s infinite" }} />
      Free Audit
    </button>
  );
}
