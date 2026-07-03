import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const ink = "#14170e", cream = "#f1efe3", lime = "#ceff3a";

/**
 * Closing CTA — handoff design (saturated lime panel, oversized head with serif
 * emphasis, contour rings). Shared across every inner page so the whole site
 * ends on the same conversion note as the homepage final CTA.
 */
export function CtaBlock({
  title,
  intro = "Start with a free PPC audit or the 30-Day Free Trial. You'll get clear next steps before committing to a long-term plan.",
}: {
  title?: React.ReactNode;
  intro?: React.ReactNode;
}) {
  return (
    <section style={{ background: lime, color: ink, position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }} aria-hidden>
        <g fill="none" stroke={ink} strokeWidth="1" strokeOpacity=".06">
          <ellipse cx="600" cy="250" rx="320" ry="180" />
          <ellipse cx="600" cy="250" rx="460" ry="260" />
          <ellipse cx="600" cy="250" rx="600" ry="340" />
        </g>
      </svg>
      <div style={{ position: "absolute", bottom: -160, left: "50%", transform: "translateX(-50%)", width: 680, height: 420, background: "radial-gradient(circle,rgba(255,255,255,.45),transparent 65%)" }} />
      <div className="mx-auto max-w-[940px] px-5 py-24 text-center md:px-8" style={{ position: "relative" }}>
        <h2 className="head" style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>
          {title ?? (
            <>Find the <span className="text-gradient">leaks</span><br />in your ad spend</>
          )}
        </h2>
        <p style={{ fontSize: 18, color: "#54564a", lineHeight: 1.6, margin: "22px auto 0", maxWidth: 600 }}>{intro}</p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 40 }}>
          <Link href={siteConfig.cta.primaryHref} className="mono" style={{ background: ink, color: cream, fontWeight: 700, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "18px 30px", borderRadius: 14, boxShadow: "0 14px 40px rgba(20,23,14,.28)" }}>{siteConfig.cta.primaryLabel}</Link>
          <Link href="/tools/google-ads-calculator" className="mono" style={{ background: "transparent", border: "1px solid rgba(20,23,14,.32)", color: ink, fontWeight: 600, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "18px 28px", borderRadius: 14 }}>Try the ROI calculator</Link>
          <Link href="/contact" className="mono" style={{ background: "transparent", border: "1px solid rgba(20,23,14,.32)", color: ink, fontWeight: 600, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "18px 26px", borderRadius: 14, display: "inline-flex", alignItems: "center", gap: 9 }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: ink }} />WhatsApp Us</Link>
        </div>
        <p className="mono" style={{ fontSize: 11, color: "#3a4a10", marginTop: 28, letterSpacing: ".1em", textTransform: "uppercase" }}>No long-term contracts · You keep ownership of your accounts</p>
      </div>
    </section>
  );
}
