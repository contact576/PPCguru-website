import Link from "next/link";
import {
  Search, Zap, ShoppingBag, Repeat, Play, Phone,
  FileText, KeyRound, Gauge, ShieldCheck, TrendingUp, Wrench,
  ArrowRight, Check,
} from "lucide-react";
import type { Service } from "@/lib/data/services";
import { Reveal } from "@/components/ui/reveal";
import { AuditChecklist, AiAutomation, OptimizationCadence, Timeline30Day, ToolStack } from "@/components/sections/service-deep";
import { ServiceProof } from "@/components/sections/service-proof";
import { EstimateBand } from "@/components/sections/estimate-band";
import { LeadBand } from "@/components/sections/lead-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { LogoStrip } from "@/components/home/logo-strip";

/* ── palette (cream / lime / ink — matches the homepage) ─────────────────── */
const ink = "#14170e", cream = "#f1efe3", lime = "#ceff3a", olive = "#6f7d22", coral = "#f26a2b";
const WRAP = "mx-auto max-w-[1480px] px-5 py-16 md:px-8 md:py-24";

function Eyebrow({ children, color = olive }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="eyebrow" style={{ color, marginBottom: 18, display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width="44" height="12" viewBox="0 0 44 12" fill="none" aria-hidden style={{ flexShrink: 0 }}>
        <line x1="1" y1="7" x2="13" y2="7" stroke={coral} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
        <path d="M17 7 H34 l 5 -4.5" stroke={olive} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15" cy="7" r="2.8" fill={ink} />
        <circle cx="40" cy="2.5" r="3" fill={lime} stroke={olive} strokeWidth="1" />
      </svg>
      {children}
    </div>
  );
}
function Em({ children, color = "#5d6b1a" }: { children: React.ReactNode; color?: string }) {
  return <span className="serif" style={{ textTransform: "none", fontWeight: 400, fontStyle: "italic", color }}>{children}</span>;
}

/* Static, design-driven copy for the bespoke sections. */
const LEAKS = [
  { t: "Clicks, not booked jobs", d: "Budget pours into broad searches and junk terms that never turn into a booked job." },
  { t: "Blind spots in tracking", d: "Conversions fire on the wrong events, so the account optimizes toward the wrong numbers." },
  { t: "Leaks you can't see", d: "Wasted spend hides in search terms, devices, times and geos nobody reviews." },
  { t: "Set-and-forget management", d: "No new negatives, no creative tests, no bid tightening — for weeks at a time." },
];

const ARSENAL = [
  { icon: Search, tag: "High-intent search", t: "Search", d: "Tightly-themed campaigns built around your most profitable services and locations, with rigorous negatives." },
  { icon: Zap, tag: "AI coverage", t: "Performance Max", d: "Goal-based campaigns with tuned asset groups and audience signals — fed clean conversion data, not left on autopilot." },
  { icon: ShoppingBag, tag: "Feed-driven", t: "Shopping & Feeds", d: "Merchant Center and product feeds structured around margin and intent, not just impressions." },
  { icon: Repeat, tag: "Warm traffic", t: "Display & Remarketing", d: "Stay top-of-mind and re-engage the visitors who didn't convert the first time." },
  { icon: Play, tag: "Demand", t: "YouTube & Video", d: "Short-form video that drives demand and refills your remarketing pools." },
  { icon: Phone, tag: "Local intent", t: "Local & Call", d: "Local and call campaigns with call tracking that routes high-intent callers straight to your team." },
];

const PARTNER = [
  { icon: TrendingUp, t: "Revenue, not clicks", d: "We optimize to booked jobs and cost-per-booked-job — not vanity CTR." },
  { icon: FileText, t: "Weekly action summaries", d: "Plain-language updates on what changed and why, not just a month-end dashboard." },
  { icon: KeyRound, t: "You own everything", d: "Your accounts, data and creative stay yours — always. No hostage-taking." },
  { icon: ShieldCheck, t: "Tracking done right", d: "GA4, GTM, call tracking and offline-conversion import, verified before we scale." },
  { icon: Wrench, t: "AI-accelerated", d: "AI does the heavy lifting on builds, negatives and reporting; humans own strategy." },
  { icon: Gauge, t: "No lock-in", d: "Month-to-month. You continue only while it's working for you." },
];

const SPECIALISTS = [
  "Physiotherapy & Rehab", "Dental & Ortho", "HVAC", "Roofing", "Basement Renovation",
  "Real Estate", "Immigration", "Legal", "Med Spa & Clinics", "Home Services",
];

/**
 * BESPOKE flagship layout for the Google Ads service. Rebuilt on the cream /
 * lime / ink system from the Claude Design handoff: a hero with a live-looking
 * Google ad preview, a "leaky bucket" problem section, the full-arsenal grid
 * and a "different kind of partner" band — followed by every existing wired,
 * data-driven section (audit checklist, AI, cadence, timeline, tools, proof,
 * estimate calculator, lead capture, FAQ, CTA) so nothing is lost.
 */
export function GoogleAdsFlagship({ service }: { service: Service }) {
  const stats = service.proofStats.slice(0, 3);
  return (
    <div style={{ background: cream, color: ink, overflowX: "hidden" }}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", background: cream, overflow: "hidden", borderBottom: "1px solid #e3e0d0" }}>
        <div style={{ position: "absolute", top: -140, right: -100, width: 560, height: 560, background: "radial-gradient(circle,rgba(206,255,58,.14),transparent 65%)" }} aria-hidden />
        <div className="mx-auto grid max-w-[1480px] items-center gap-11 px-5 pb-16 pt-32 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:px-8 md:pb-24 md:pt-40" style={{ position: "relative" }}>
          <div>
            <nav aria-label="Breadcrumb" className="mono" style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 11, letterSpacing: ".04em", color: "#83856f", marginBottom: 22 }}>
              <Link href="/" style={{ color: "#83856f" }}>Home</Link><span>/</span>
              <Link href="/services" style={{ color: "#83856f" }}>Services</Link><span>/</span>
              <span style={{ color: "#54564a" }}>Google Ads</span>
            </nav>
            <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#4f5f14", border: "1px solid rgba(95,111,23,.4)", padding: "8px 14px", borderRadius: 999, marginBottom: 26 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: lime, display: "inline-block", boxShadow: `0 0 8px ${lime}` }} />
              Flagship service · High-intent search
            </div>
            <h1 className="head" style={{ fontSize: "clamp(2.8rem,6.2vw,5.4rem)" }}>
              Google Ads<br />that books<br /><Em>real jobs.</Em>
            </h1>
            <p style={{ fontSize: 17.5, lineHeight: 1.6, color: "#54564a", marginTop: 26, maxWidth: 500 }}>{service.hero}</p>
            <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginTop: 32 }}>
              <Link href="/#sprint" className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: lime, color: ink, fontWeight: 700, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "17px 28px", borderRadius: 14, boxShadow: "0 12px 34px rgba(206,255,58,.3)" }}>Start 30-Day Free Trial <ArrowRight size={16} /></Link>
              <Link href="#lead" className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", border: "1px solid #c4c2b0", color: ink, fontWeight: 600, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "17px 26px", borderRadius: 14 }}>Get a Free Account Audit</Link>
            </div>
            <div style={{ display: "flex", gap: 34, marginTop: 40, flexWrap: "wrap" }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="head" style={{ fontSize: "clamp(1.8rem,3.4vw,2.6rem)", color: ink, lineHeight: 1 }}>{s.value}</div>
                  <div className="mono" style={{ marginTop: 8, fontSize: 9.5, letterSpacing: ".06em", textTransform: "uppercase", color: "#83856f" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Google ad preview card (Sample — numbers illustrative) */}
          <Reveal className="relative">
            <div style={{ position: "relative", background: "#fff", border: "1px solid #e3e0d0", borderRadius: 22, padding: 22, boxShadow: "0 40px 90px -40px rgba(20,23,14,.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#1a7f37", background: "#e8f6ec", padding: "3px 7px", borderRadius: 5 }}>Ad</span>
                  <span style={{ fontSize: 12.5, color: "#54564a" }}>Sponsored · your business</span>
                </div>
                <span style={{ fontSize: 12, color: "#9a9b88" }}>google.com</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#1a3fb0", lineHeight: 1.25 }}>Emergency HVAC Repair — Same-Day · 5-Star Rated</div>
              <div style={{ fontSize: 12.5, color: "#1a7f37", marginTop: 3 }}>yourbusiness.ca/hvac-repair</div>
              <div style={{ fontSize: 13.5, color: "#3a3c30", lineHeight: 1.5, marginTop: 8 }}>Licensed techs, upfront pricing, booked in minutes. Serving the GTA 7 days a week.</div>
              <div className="mono" style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#1a3fb0", marginTop: 10 }}>
                <span>Book online ›</span><span>Get a quote ›</span><span>Financing ›</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 10, marginTop: 18 }}>
                <div style={{ background: "#fbfaf2", border: "1px solid #e3e0d0", borderRadius: 14, padding: "14px 16px" }}>
                  <div className="head" style={{ fontSize: 22, color: ink }}>$205,424</div>
                  <div className="mono" style={{ fontSize: 8.5, letterSpacing: ".06em", textTransform: "uppercase", color: "#83856f", marginTop: 4 }}>Revenue tracked / 30d</div>
                </div>
                <div style={{ background: ink, borderRadius: 14, padding: "14px 16px" }}>
                  <div className="head" style={{ fontSize: 22, color: lime }}>4.8x</div>
                  <div className="mono" style={{ fontSize: 8.5, letterSpacing: ".06em", textTransform: "uppercase", color: "#9a9b88", marginTop: 4 }}>Blended ROAS</div>
                </div>
              </div>

              <div style={{ background: "#fbfaf2", border: "1px solid #e3e0d0", borderRadius: 14, padding: "14px 16px", marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: ".06em", textTransform: "uppercase", color: "#83856f" }}>Cost / booked job</span>
                  <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "#5f6f17" }}>▼ 42%</span>
                </div>
                <svg viewBox="0 0 320 44" style={{ width: "100%", height: 44, display: "block" }} preserveAspectRatio="none" aria-hidden>
                  <path d="M0,10 L60,16 L120,14 L180,24 L240,30 L320,38" fill="none" stroke={olive} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div style={{ position: "absolute", left: 22, bottom: -20, display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #e3e0d0", borderRadius: 14, padding: "10px 14px", boxShadow: "0 16px 34px -18px rgba(20,23,14,.4)" }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: lime, color: ink, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check size={15} /></span>
                <div><div className="head" style={{ fontSize: 14 }}>Quality Score 8.4</div><div className="mono" style={{ fontSize: 8.5, letterSpacing: ".05em", textTransform: "uppercase", color: "#83856f" }}>Avg. across keywords</div></div>
              </div>
              <span className="mono" style={{ position: "absolute", top: 14, right: 60, fontSize: 8.5, color: "#b9b7a4", letterSpacing: ".08em", textTransform: "uppercase" }}>Sample</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── LEAKY BUCKET (problem) ───────────────────────────────────────── */}
      <section style={{ background: ink, color: cream, borderBottom: `1px solid ${ink}` }}>
        <div className={WRAP}>
          <Reveal>
            <Eyebrow color="#a9c34a">The problem</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.8vw,3.8rem)", color: cream }}>If your Google Ads feel like a <Em color="#c7e070">leaky bucket</Em></h2>
            <p style={{ fontSize: 16.5, color: "#c9c8b6", lineHeight: 1.6, marginTop: 18, maxWidth: 620 }}>Most accounts we inherit waste 20–40% of spend before a single lead is lost. Here&rsquo;s where the budget usually drains — and what we fix first.</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ marginTop: 44 }}>
            {LEAKS.map((l, i) => (
              <Reveal key={l.t} delay={i * 0.05}>
                <div style={{ height: "100%", background: "rgba(241,239,227,.04)", border: "1px solid rgba(241,239,227,.12)", borderRadius: 20, padding: 24 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(242,106,43,.16)", color: "#fca972", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>✕</div>
                  <div className="head" style={{ fontSize: 17, color: cream, marginBottom: 8 }}>{l.t}</div>
                  <div style={{ fontSize: 13.5, color: "#9a9b88", lineHeight: 1.55 }}>{l.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FULL ARSENAL ─────────────────────────────────────────────── */}
      <section style={{ background: cream, color: ink, borderBottom: "1px solid #e3e0d0" }}>
        <div className={WRAP}>
          <Reveal>
            <Eyebrow>What we run</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.8vw,3.8rem)" }}>The full Google Ads <Em>arsenal</Em></h2>
            <p style={{ fontSize: 16.5, color: "#54564a", lineHeight: 1.6, marginTop: 18, maxWidth: 620 }}>Every campaign type, wired to one goal: your cost per booked job. We use the right mix for your market — never a copy-paste template.</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: 44 }}>
            {ARSENAL.map((a, i) => {
              const Icon = a.icon;
              return (
                <Reveal key={a.t} delay={i * 0.04}>
                  <div style={{ height: "100%", background: "#fbfaf2", border: "1px solid #dddbc9", borderRadius: 22, padding: 26 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <span style={{ width: 50, height: 50, borderRadius: 14, background: ink, color: lime, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={21} /></span>
                      <span className="mono" style={{ fontSize: 9, color: "#8a8c72", letterSpacing: ".07em", textTransform: "uppercase", border: "1px solid #d3d1bf", padding: "5px 9px", borderRadius: 7 }}>{a.tag}</span>
                    </div>
                    <div className="head" style={{ fontSize: 19, marginBottom: 9 }}>{a.t}</div>
                    <div style={{ fontSize: 13.5, color: "#54564a", lineHeight: 1.55 }}>{a.d}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Wired, data-driven sections (kept — nothing lost) ─────────────── */}
      {service.auditChecklist && <AuditChecklist serviceName={service.name} groups={service.auditChecklist} />}
      {service.aiAutomation && <AiAutomation items={service.aiAutomation} />}
      {service.optimizationCadence && <OptimizationCadence cadence={service.optimizationCadence} />}
      {service.first30Days && <Timeline30Day items={service.first30Days} />}
      {service.toolStack && <ToolStack groups={service.toolStack} />}

      {/* ── A DIFFERENT KIND OF PARTNER ──────────────────────────────────── */}
      <section style={{ background: "#f7f5ea", color: ink, borderBottom: "1px solid #e3e0d0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -60, width: 380, height: 380, background: "radial-gradient(circle,rgba(206,255,58,.08),transparent 65%)" }} aria-hidden />
        <div className={WRAP} style={{ position: "relative" }}>
          <Reveal>
            <Eyebrow>Why PPC Guru</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.8vw,3.8rem)" }}>A different kind of <Em>Google Ads</Em> partner</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: 44 }}>
            {PARTNER.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.t} delay={i * 0.04}>
                  <div style={{ height: "100%", background: "#fff", border: "1px solid #e3e0d0", borderRadius: 20, padding: 24 }}>
                    <span style={{ width: 44, height: 44, borderRadius: 12, background: "#eef2dd", color: "#5f6f17", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Icon size={20} /></span>
                    <div className="head" style={{ fontSize: 17, marginBottom: 8 }}>{p.t}</div>
                    <div style={{ fontSize: 13.5, color: "#54564a", lineHeight: 1.55 }}>{p.d}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Local service specialists — quick vertical chips */}
          <Reveal>
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid #dddbc9" }}>
              <div className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#83856f", marginBottom: 16 }}>Local service specialists</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SPECIALISTS.map((s) => (
                  <span key={s} className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: "#2c2e22", background: "#fff", border: "1px solid #e3e0d0", padding: "9px 14px", borderRadius: 999 }}>{s}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <ServiceProof serviceName={service.name} proofStats={service.proofStats} caseStudySlugs={service.caseStudySlugs} />

      {/* Platform / tool logo strip (shared with the homepage) */}
      <LogoStrip />

      <EstimateBand platform="google-search" title={<>Estimate your <Em>Google Ads</Em> potential</>} intro="Pick your industry and budget — we'll model the leads, booked calls and revenue your Google Ads could produce." />
      <div id="lead"><LeadBand source="flagship:google-ads" title="Get a free Google Ads audit" /></div>
      <FaqAccordion faqs={service.faqs} title="Google Ads, answered" />
      <CtaBlock title={<>Turn Google clicks into<br /><Em>booked jobs</Em></>} intro="Start with a free Google Ads audit or the 30-Day Free Trial — clear next steps before you commit. No commitment, no obligation." />
    </div>
  );
}
