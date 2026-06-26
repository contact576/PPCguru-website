import Link from "next/link";

/**
 * Floating "Free PPC Audit" pill (handoff design) — bottom-right, lime, with a
 * pulsing dot. Links to the home audit form (works from any page).
 */
export function FloatingCta() {
  return (
    <Link
      href="/#audit"
      className="mono ppc-shake"
      style={{
        position: "fixed", right: 22, bottom: 22, zIndex: 70,
        background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 12.5,
        letterSpacing: ".05em", textTransform: "uppercase", padding: "15px 22px",
        borderRadius: 999, boxShadow: "0 12px 34px rgba(206,255,58,.4)",
        display: "inline-flex", alignItems: "center", gap: 9,
        animation: "ppcShake 9s ease-in-out 5s infinite", transformOrigin: "center",
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#14170e", animation: "ppcPulse 2.2s infinite" }} />
      Free PPC Audit
    </Link>
  );
}
