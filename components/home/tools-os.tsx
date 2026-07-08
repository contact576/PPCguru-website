import { stackGroups } from "@/lib/data/logos";
import { BrandIcon } from "@/components/shared/brand-logos";

const ink = "#14170e";
const lime = "#ceff3a";

/**
 * The single merged "stack" section — platforms, tools, AI and accreditation in
 * one place (replaces the old separate credentials + AI-operating-system blocks).
 * Server component; each tool is a monochrome pill with a monogram mark.
 */
export function ToolsOs() {
  return (
    <section style={{ background: ink, color: "#f1efe3", borderBottom: "1px solid #000" }}>
      <div className="mx-auto max-w-[1340px] px-5 py-20 md:px-8 md:py-24">
        <div data-reveal style={{ maxWidth: 820, margin: "0 auto 52px", textAlign: "center" }}>
          <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: lime }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: lime }} /> The AI operating system
          </span>
          <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)", marginTop: 14 }}>Every platform, tool & AI behind your marketing</h2>
          <p style={{ fontSize: 17, color: "#a9aa97", marginTop: 18, lineHeight: 1.6 }}>
            Google-trained thinking, AI-powered execution and daily optimization — built with the platforms,
            analytics, automation and AI tools modern growth teams use every day.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((g) => (
            <div key={g.title} data-reveal style={{ background: "rgba(241,239,227,.04)", border: "1px solid rgba(241,239,227,.1)", borderRadius: 20, padding: 22 }}>
              <div className="mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: lime, marginBottom: 14 }}>{g.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {g.tools.map((t) => (
                  <span key={t} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 600, color: "#d9dac8", background: "rgba(241,239,227,.05)", border: "1px solid rgba(241,239,227,.14)", padding: "5px 10px 5px 5px", borderRadius: 999, whiteSpace: "nowrap" }}>
                    <BrandIcon name={t} size={20} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
