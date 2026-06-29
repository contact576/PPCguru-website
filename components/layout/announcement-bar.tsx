import Link from "next/link";

/**
 * Lime announcement bar (handoff design). Normal flow at the very top; the
 * sticky header sits directly below it.
 */
export function AnnouncementBar() {
  return (
    <div style={{ background: "#ceff3a", color: "#14170e", fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "9px 20px", flexWrap: "wrap", fontWeight: 600 }}>
      <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, letterSpacing: ".06em", textTransform: "uppercase" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#14170e", display: "inline-block", animation: "ppcPulse 2.2s infinite" }} />
        30-Day PPC Growth Sprint — now open
      </span>
      <span style={{ opacity: 0.4 }} className="hidden sm:inline">/</span>
      <span className="mono hidden sm:inline" style={{ opacity: 0.75, letterSpacing: ".06em", textTransform: "uppercase" }}>You own your accounts · No lock-in</span>
      <Link href="/#sprint" className="mono" style={{ fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: 3 }}>Claim trial →</Link>
    </div>
  );
}
