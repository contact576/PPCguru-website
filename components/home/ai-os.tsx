import { aiToolGroups } from "@/lib/data/logos";

const ink = "#14170e";
const lime = "#ceff3a";

/**
 * "The AI operating system behind your marketing" — six grouped tool categories
 * rendered as monochrome text-pills. Server component (no client JS). Reads the
 * grouped tool list from lib/data/logos.ts.
 */
export function AiOs() {
  return (
    <section style={{ background: ink, color: "#f1efe3", borderBottom: "1px solid #000" }}>
      <div className="mx-auto max-w-[1340px] px-5 py-20 md:px-8 md:py-24">
        <div data-reveal style={{ maxWidth: 780, margin: "0 auto 52px", textAlign: "center" }}>
          <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: lime }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: lime }} /> AI-first stack
          </span>
          <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)", marginTop: 14 }}>The AI operating system behind your marketing</h2>
          <p style={{ fontSize: 17, color: "#a9aa97", marginTop: 18, lineHeight: 1.6 }}>
            We combine platform data, human strategy and AI-assisted workflows to find waste faster, test more angles, and improve accounts daily. Built with the tools modern growth teams use every day.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiToolGroups.map((g) => (
            <div key={g.title} data-reveal style={{ background: "rgba(241,239,227,.04)", border: "1px solid rgba(241,239,227,.1)", borderRadius: 20, padding: 22 }}>
              <div className="mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: lime, marginBottom: 14 }}>{g.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {g.tools.map((t) => (
                  <span key={t} className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: "#d9dac8", background: "rgba(241,239,227,.05)", border: "1px solid rgba(241,239,227,.14)", padding: "6px 11px", borderRadius: 999, whiteSpace: "nowrap" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
