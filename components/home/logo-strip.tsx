import { Marquee } from "@/components/magicui/marquee";
import { BrandLogo } from "@/components/shared/brand-logo";

/**
 * Platform / tool logo strip — a continuously scrolling row of the real brand
 * marks we run every day. Ported from the Claude Design handoff (it replaced a
 * flat text list with recognisable logos). These are the products we operate
 * in, shown as capability marks — NOT official partner badges.
 */
const marks: { name: string; label?: string }[] = [
  { name: "Google Ads" },
  { name: "Meta Ads" },
  { name: "YouTube Ads" },
  { name: "Microsoft Ads" },
  { name: "TikTok Ads" },
  { name: "LinkedIn Ads" },
  { name: "Google Analytics 4", label: "Analytics 4" },
  { name: "Google Tag Manager", label: "Tag Manager" },
  { name: "Looker Studio" },
  { name: "Semrush" },
  { name: "Ahrefs" },
  { name: "Zapier" },
  { name: "HubSpot" },
];

export function LogoStrip() {
  return (
    <section aria-label="Platforms and tools we run" style={{ background: "#f7f5ea", borderBottom: "1px solid #e3e0d0" }}>
      <div className="mx-auto max-w-[1480px] px-5 py-9 md:px-8 md:py-11">
        <p className="mono" data-reveal style={{ textAlign: "center", fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#83856f", marginBottom: 22 }}>
          The platforms &amp; tools we run every day
        </p>
        <div className="relative overflow-hidden">
          <Marquee pauseOnHover className="[--duration:34s] [--gap:0.75rem]">
            {marks.map((m) => (
              <span
                key={m.name}
                className="mono"
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", border: "1px solid #e3e0d0", borderRadius: 12, padding: "10px 16px 10px 12px", fontSize: 13.5, fontWeight: 700, color: "#2c2e22", whiteSpace: "nowrap", boxShadow: "0 4px 14px -8px rgba(20,23,14,.18)" }}
              >
                <BrandLogo name={m.name} size={22} />
                {m.label ?? m.name}
              </span>
            ))}
          </Marquee>
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-24" style={{ background: "linear-gradient(90deg,#f7f5ea,transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-24" style={{ background: "linear-gradient(270deg,#f7f5ea,transparent)" }} />
        </div>
      </div>
    </section>
  );
}
