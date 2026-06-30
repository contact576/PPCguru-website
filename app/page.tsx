import Link from "next/link";
import { RevealInit } from "@/components/home/reveal-init";
import { HeroDashboard } from "@/components/home/hero-dashboard";
import { WasteCalculator } from "@/components/home/waste-calculator";
import { FaqList } from "@/components/home/faq-list";
import { AuditForm } from "@/components/home/audit-form";
import {
  tickerLoop, proofItems, proofPoints, sprintWeeks, homeServices, aiTasks, humanTasks,
  cmpBad, cmpGood, rptDeliverables, rptKpis, homeCases, homeIndustries,
  homePricing,
} from "@/lib/data/home";
import { TestimonialCarousel } from "@/components/home/testimonial-carousel";
import { ToolsOs } from "@/components/home/tools-os";
import { LeadCtaButton } from "@/components/shared/lead-cta";
import { performanceStats } from "@/lib/data/performance-stats";
import { HeroVectors } from "@/components/shared/hero-vectors";
import { AnimatedStat } from "@/components/ui/animated-stat";
import { ScrollProgress } from "@/components/home/scroll-progress";
import { ScrollParallax } from "@/components/shared/scroll-parallax";
import { GsapHeroReveal } from "@/components/home/gsap-hero";
import { GrowthLoopPinned } from "@/components/home/growth-loop-pinned";
import { GsapText } from "@/components/shared/gsap-text";

/* ── shared bits ─────────────────────────────────────────────────────────── */
const WRAP = "mx-auto max-w-[1480px] px-5 py-14 md:px-8 md:py-20";
const ink = "#14170e", cream = "#f1efe3", lime = "#ceff3a", olive = "#6f7d22", coral = "#f26a2b";

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

export default function HomePage() {
  return (
    <div style={{ position: "relative", overflowX: "hidden", background: cream }}>
      <ScrollProgress />
      <RevealInit />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section id="top" style={{ position: "relative", background: cream, overflow: "hidden", borderBottom: "1px solid #e3e0d0" }}>
        <ScrollParallax speed={20} className="pointer-events-none absolute inset-x-0 -inset-y-[14%]">
          <HeroVectors variant="feature" animate idSeed="home-hero" />
        </ScrollParallax>
        <div style={{ position: "absolute", top: -140, right: -100, width: 520, height: 520, background: "radial-gradient(circle,rgba(206,255,58,.1),transparent 65%)" }} />
        {/* kinetic marquee behind */}
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, overflow: "hidden", opacity: 0.16, pointerEvents: "none" }} aria-hidden>
          <div className="mq" style={{ fontSize: "8vw" }}>
            {["Stop wasting ad spend", "turn clicks into", "booked jobs", "stop wasting ad spend", "turn clicks into booked jobs"].map((t, i) => (
              i % 2 === 0
                ? <span key={i} className="head" style={{ WebkitTextStroke: `1.5px ${ink}`, color: "transparent", padding: "0 .25em" }}>{t}</span>
                : <span key={i} className="serif" style={{ color: olive, padding: "0 .25em", textTransform: "none" }}>{t}</span>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-[1480px] items-center gap-11 px-5 py-[88px] md:px-8 md:py-[96px] lg:grid-cols-[1.05fr_1fr] lg:gap-14" style={{ position: "relative" }}>
          <GsapHeroReveal>
            <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "#4f5f14", border: "1px solid rgba(95,111,23,.4)", padding: "8px 14px", borderRadius: 999, marginBottom: 30 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: lime, display: "inline-block", boxShadow: `0 0 8px ${lime}` }} />
              GTA&rsquo;s AI-first Google &amp; Meta Partner agency · Canada &amp; USA
            </div>
            <h1 className="head" style={{ fontSize: "clamp(3rem,7vw,6.4rem)" }}>
              <span style={{ display: "block" }}>Stop</span>
              <span style={{ display: "inline-block", position: "relative" }}>
                <Em color="#5d6b1a">wasting</Em>
                <svg className="scribble" viewBox="0 0 320 130" preserveAspectRatio="none" style={{ position: "absolute", left: "-6%", top: "-14%", width: "112%", height: "128%", overflow: "visible", pointerEvents: "none" }} aria-hidden>
                  <path d="M40 96 C 4 60, 70 14, 168 16 C 268 18, 312 52, 296 82 C 280 112, 170 122, 78 112 C 18 105, -6 74, 52 50" fill="none" stroke={lime} strokeWidth="4" strokeLinecap="round" style={{ ["--len" as string]: "920" }} />
                </svg>
              </span>
              <span style={{ display: "block" }}>ad spend.</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#54564a", marginTop: 28, maxWidth: 500 }}>
              We audit, rebuild and manage Google Ads, Meta &amp; SEO so your budget turns into <strong style={{ color: ink, fontWeight: 700 }}>qualified leads, booked jobs and revenue.</strong> Find the leaks before you scale.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
              <Link href="#audit" className="mono btn-shine transition-transform hover:-translate-y-0.5" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: lime, color: ink, fontWeight: 700, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "17px 28px", borderRadius: 14, boxShadow: "0 12px 34px rgba(206,255,58,.3)" }}>Get Free PPC Audit →</Link>
              <Link href="#calculator" className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", border: "1px solid #c4c2b0", color: ink, fontWeight: 600, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "17px 26px", borderRadius: 14 }}>Try ROI Calculator</Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 40, flexWrap: "wrap" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badges/google-partner.svg" alt="Google Partner" style={{ height: 40, width: "auto", flexShrink: 0 }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badges/meta-business-partner.svg" alt="Meta Business Partner" style={{ height: 40, width: "auto", flexShrink: 0 }} />
              <div className="mono" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#6b6d5c", lineHeight: 1.6 }}>Performance marketing · GTA</div>
            </div>
          </GsapHeroReveal>
          <HeroDashboard />
        </div>
      </section>

      {/* ── LIME TICKER ────────────────────────────────────────────────────── */}
      <div style={{ background: lime, color: ink, overflow: "hidden", padding: "16px 0", borderBottom: "1px solid #b6e62a" }}>
        <div className="mq mq-rev" style={{ fontSize: 20, alignItems: "center" }}>
          {[...tickerLoop, ...tickerLoop].map((t, i) => (
            <span key={i} className="head" style={{ fontSize: 20, padding: "0 22px", display: "inline-flex", alignItems: "center", gap: 22 }}>{t}<span className="serif" style={{ fontWeight: 400, textTransform: "none", fontSize: 22 }}>✺</span></span>
          ))}
        </div>
      </div>

      {/* ── PROOF ──────────────────────────────────────────────────────────── */}
      <section id="proof" style={{ background: cream, color: ink, borderBottom: `1px solid ${ink}` }}>
        <div className={WRAP}>
          <div data-reveal style={{ maxWidth: 760, margin: "0 auto 52px" }}>
            <Eyebrow>What you can count on</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>Proof we can show <Em>before</Em> you book a call</h2>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2">
            {proofItems.map((it) => (
              <div key={it.title} data-reveal className="hcard" style={{ background: "#fbfaf2", border: "1px solid #dddbc9", borderRadius: 22, padding: 28 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: ink, color: lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23, marginBottom: 18 }}>{it.icon}</div>
                <div className="head" style={{ fontSize: 20, marginBottom: 8 }}>{it.title}</div>
                <div style={{ fontSize: 14.5, color: "#54564a", lineHeight: 1.55 }}>{it.desc}</div>
              </div>
            ))}
          </div>
          <div data-reveal style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 24 }}>
            {proofPoints.map((p) => (
              <span key={p} className="mono" style={{ fontSize: 11, fontWeight: 600, color: "#4f5f14", background: "#eef2dd", border: "1px solid #cfe39a", padding: "8px 13px", borderRadius: 999, letterSpacing: ".03em" }}>{p}</span>
            ))}
          </div>

          {/* Real, client-confirmed aggregate results — three headline numbers, not a wall of stats. */}
          <div data-reveal style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid #dddbc9" }}>
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-8">
              {performanceStats.filter((s) => s.proofType === "agency_aggregate").map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div className="head" style={{ fontSize: "clamp(2.6rem,5vw,3.6rem)", color: ink, lineHeight: 1 }}><AnimatedStat value={s.value} /></div>
                  <div style={{ fontSize: 13.5, color: "#54564a", lineHeight: 1.4, marginTop: 10 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 11.5, color: "#8a8c72", marginTop: 26, letterSpacing: ".02em" }}>PPC Guru client aggregate — not a guarantee of individual results.</p>
          </div>
        </div>
      </section>

      {/* ── 30-DAY SPRINT ──────────────────────────────────────────────────── */}
      <section id="sprint" style={{ background: "#f7f5ea", color: ink, position: "relative", overflow: "hidden", borderBottom: "1px solid #e3e0d0" }}>
        <div className="ambient-glow" style={{ position: "absolute", top: -120, left: -80, width: 420, height: 420, background: "radial-gradient(circle,rgba(206,255,58,.08),transparent 65%)" }} />
        <div className={WRAP} style={{ position: "relative" }}>
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.2fr]">
            <div data-reveal>
              <Eyebrow>⚡ 30-Day PPC Growth Sprint</Eyebrow>
              <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.5vw,3.6rem)" }}>Try us for <Em>one month</Em> before you commit</h2>
              <p style={{ fontSize: 17, color: "#54564a", lineHeight: 1.6, marginTop: 18, maxWidth: 460 }}>A focused 30-day sprint: we audit your account, fix the obvious leaks, and show you a clear plan — so you can judge us on results, not promises.</p>
              <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginTop: 30 }}>
                <Link href="#audit" className="mono" style={{ background: lime, color: ink, fontWeight: 700, fontSize: 12.5, letterSpacing: ".06em", textTransform: "uppercase", padding: "16px 26px", borderRadius: 13 }}>Claim 30-Day Sprint</Link>
                <Link href="#calculator" className="mono" style={{ background: "#fff", border: "1px solid #c4c2b0", color: ink, fontWeight: 600, fontSize: 12.5, letterSpacing: ".06em", textTransform: "uppercase", padding: "16px 24px", borderRadius: 13 }}>Run the free audit</Link>
              </div>
              <p style={{ fontSize: 12.5, color: "#6b6d5c", lineHeight: 1.55, marginTop: 22, maxWidth: 440 }}>Trial does not include ad spend. Final scope depends on account size, campaign history, tracking setup, and monthly budget. Results vary by industry, budget, tracking quality and offer strength.</p>
            </div>
            <div data-reveal>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sprintWeeks.map((w) => (
                  <div key={w.num} style={{ position: "relative", zIndex: 1, background: "#fff", border: "1px solid #e3e0d0", borderRadius: 20, padding: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span className="head" style={{ fontSize: 22, color: olive }}>{w.num}</span>
                      <span className="mono" style={{ fontSize: 10, fontWeight: 600, color: "#83856f", letterSpacing: ".1em", textTransform: "uppercase" }}>{w.week}</span>
                    </div>
                    <div className="head" style={{ fontSize: 16, lineHeight: 1.05, marginBottom: 9 }}>{w.title}</div>
                    <div style={{ fontSize: 13, color: "#54564a", lineHeight: 1.5 }}>{w.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WASTE CALCULATOR ───────────────────────────────────────────────── */}
      <section id="calculator" style={{ background: cream, color: ink, position: "relative", overflow: "hidden", borderBottom: "1px solid #e3e0d0" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(20,23,14,.05) 1px,transparent 1px)", backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse 70% 80% at 70% 40%,#000,transparent)", WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 70% 40%,#000,transparent)", opacity: 0.5 }} />
        <div className={WRAP} style={{ position: "relative" }}>
          <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr]">
            <div data-reveal>
              <Eyebrow color={coral}>🔎 Free PPC waste audit</Eyebrow>
              <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.5vw,3.6rem)" }}>Find the <Em color={coral}>leaks</Em> in your budget</h2>
              <p style={{ fontSize: 16.5, color: "#54564a", lineHeight: 1.6, marginTop: 18, maxWidth: 420 }}>Enter a few numbers to see a directional estimate of where spend may be leaking — and what a realistic improvement could look like.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "26px 0 0", display: "flex", flexDirection: "column", gap: 13 }}>
                {["Built like a mini audit report, not a basic form", "Risk scoring for tracking & landing pages", "A recommended first fix in seconds"].map((t) => (
                  <li key={t} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14.5, color: "#3a3c30" }}><span style={{ color: olive }}>●</span> {t}</li>
                ))}
              </ul>
              <p style={{ fontSize: 12, color: "#6b6d5c", marginTop: 24, maxWidth: 380, lineHeight: 1.5 }}>Directional estimate, not a guarantee. Real findings depend on your actual account, tracking and market.</p>
            </div>
            <WasteCalculator />
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────────── */}
      <section id="services" style={{ background: cream, color: ink, borderBottom: `1px solid ${ink}` }}>
        <div className={WRAP}>
          <div data-reveal style={{ maxWidth: 760, margin: "0 auto 52px" }}>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>Full-funnel growth,<br />one <Em>accountable</Em> team</h2>
            <p style={{ fontSize: 17, color: "#54564a", marginTop: 18, lineHeight: 1.6, maxWidth: 560 }}>Paid ads, SEO, creative and the systems that turn leads into booked jobs — all measured against revenue.</p>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((s) => (
              <div key={s.title} data-reveal className="hcard" style={{ background: "#fbfaf2", border: "1px solid #dddbc9", borderRadius: 22, padding: 28, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <span style={{ width: 54, height: 54, borderRadius: 15, background: ink, color: lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{s.icon}</span>
                  <span className="mono" style={{ fontSize: 9.5, color: "#8a8c72", letterSpacing: ".08em", textTransform: "uppercase", border: "1px solid #d3d1bf", padding: "5px 9px", borderRadius: 7 }}>{s.bestFor}</span>
                </div>
                <div className="head" style={{ fontSize: 20, marginBottom: 9 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "#54564a", lineHeight: 1.55, marginBottom: 16 }}>{s.outcome}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
                  {s.deliverables.map((d) => (
                    <span key={d} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#2c2e22" }}><span style={{ color: olive, fontSize: 13 }}>✓</span>{d}</span>
                  ))}
                </div>
                <Link href={s.href} className="mono" style={{ marginTop: "auto", fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: ink, display: "inline-flex", alignItems: "center", gap: 7, borderTop: "1px solid #e3e1d2", paddingTop: 16 }}>Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GROWTH LOOP (pinned, scroll-scrubbed) ──────────────────────────── */}
      <GrowthLoopPinned />

      {/* ── AI EXECUTION ───────────────────────────────────────────────────── */}
      <section id="ai" style={{ background: cream, color: ink, borderBottom: `1px solid ${ink}` }}>
        <div className={WRAP}>
          <div data-reveal style={{ maxWidth: 760, margin: "0 auto 52px" }}>
            <Eyebrow>AI-augmented, human-directed</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)" }}>AI-augmented execution.<br /><Em>Human-led</Em> strategy.</h2>
            <GsapText mode="scrub" style={{ fontSize: 17, color: "#54564a", marginTop: 18, lineHeight: 1.6, maxWidth: 560 }}>A command center where AI does the heavy lifting and strategists own every decision that touches your budget.</GsapText>
          </div>
          <div className="grid gap-[18px] lg:grid-cols-2">
            <div data-reveal style={{ background: "#fbfaf2", border: "1px solid #dddbc9", borderRadius: 24, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <span style={{ width: 46, height: 46, borderRadius: 13, background: ink, color: lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</span>
                <div><div className="head" style={{ fontSize: 19 }}>AI handles the volume</div><div className="mono" style={{ fontSize: 10, color: "#8a8c72", letterSpacing: ".08em", textTransform: "uppercase" }}>Always-on · every account</div></div>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {aiTasks.map((t) => (
                  <div key={t} style={{ background: "#fff", border: "1px solid #e3e1d2", borderRadius: 12, padding: "12px 13px", fontSize: 13, color: "#2c2e22", display: "flex", alignItems: "center", gap: 9 }}><span style={{ color: olive }}>▸</span>{t}</div>
                ))}
              </div>
            </div>
            <div data-reveal style={{ background: ink, border: `1px solid ${ink}`, borderRadius: 24, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <span style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(206,255,58,.16)", color: lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧠</span>
                <div><div className="head" style={{ fontSize: 19, color: cream }}>Humans own the judgment</div><div className="mono" style={{ fontSize: 10, color: "#9a9b88", letterSpacing: ".08em", textTransform: "uppercase" }}>Strategy · money · client</div></div>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {humanTasks.map((t) => (
                  <div key={t} style={{ background: "rgba(241,239,227,.05)", border: "1px solid rgba(241,239,227,.1)", borderRadius: 12, padding: "12px 13px", fontSize: 13, color: "#c9c8b6", display: "flex", alignItems: "center", gap: 9 }}><span style={{ color: olive }}>●</span>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI OPERATING SYSTEM ────────────────────────────────────────────── */}
      <ToolsOs />

      {/* ── COMPARISON ─────────────────────────────────────────────────────── */}
      <section style={{ background: cream, color: ink, borderBottom: "1px solid #e3e0d0" }}>
        <div className="mx-auto max-w-[1340px] px-5 py-20 md:px-8 md:py-24">
          <div data-reveal style={{ maxWidth: 760, margin: "0 auto 52px", textAlign: "center" }}>
            <Eyebrow>Why PPC Guru</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)" }}>Typical agency vs <Em>the Guru way</Em></h2>
            <GsapText mode="scrub" style={{ fontSize: 17, color: "#54564a", marginTop: 18, lineHeight: 1.6 }}>The difference isn&rsquo;t just better bidding — it&rsquo;s transparency, ownership, and optimizing for revenue.</GsapText>
          </div>
          <div className="grid gap-[18px] md:grid-cols-2">
            <div data-reveal style={{ background: "#fff", border: "1px solid #f0d4c4", borderRadius: 24, padding: 30 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 22 }}><span style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(242,106,43,.16)", color: coral, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✕</span><span className="head" style={{ fontSize: 19 }}>Typical agency</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {cmpBad.map((b) => <div key={b} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14.5, color: "#54564a", lineHeight: 1.5 }}><span style={{ color: coral, fontWeight: 700, flexShrink: 0 }}>✕</span>{b}</div>)}
              </div>
            </div>
            <div data-reveal style={{ background: "#eef2dd", border: "1px solid #cfe39a", borderRadius: 24, padding: 30, boxShadow: "0 18px 44px rgba(111,125,34,.12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 22 }}><span style={{ width: 40, height: 40, borderRadius: 11, background: lime, color: ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✓</span><span className="head" style={{ fontSize: 19 }}>The PPC Guru way</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {cmpGood.map((g) => <div key={g} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14.5, color: "#2c2e22", lineHeight: 1.5, fontWeight: 500 }}><span style={{ color: olive, fontWeight: 700, flexShrink: 0 }}>✓</span>{g}</div>)}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 22, paddingTop: 20, borderTop: "1px solid #cfe39a" }}>
                {["📄 Weekly report", "✅ Tracking checklist", "🔑 Account ownership"].map((c) => <span key={c} className="mono" style={{ fontSize: 10, fontWeight: 600, color: "#4f5f14", border: "1px solid #cfe39a", padding: "6px 10px", borderRadius: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>{c}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REPORTING ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#f7f5ea", color: ink, position: "relative", overflow: "hidden", borderBottom: "1px solid #e3e0d0" }}>
        <div className="ambient-glow" style={{ position: "absolute", bottom: -160, left: "8%", width: 480, height: 480, background: "radial-gradient(circle,rgba(206,255,58,.1),transparent 65%)" }} />
        <div className={WRAP} style={{ position: "relative" }}>
          <div className="grid items-center gap-12 lg:grid-cols-[0.84fr_1.16fr]">
            <div data-reveal>
              <Eyebrow>Transparent reporting</Eyebrow>
              <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)" }}>No agency <Em>black box</Em></h2>
              <p style={{ fontSize: 16.5, color: "#54564a", lineHeight: 1.6, marginTop: 18, maxWidth: 440 }}>You should never have to guess what your agency did this month. Here&rsquo;s exactly what lands in your inbox, on a clear cadence.</p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" style={{ marginTop: 26 }}>
                {rptDeliverables.map((d) => <div key={d} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 13.5, color: "#3a3c30", background: "#eef0e2", border: "1px solid #dddbc9", padding: "12px 13px", borderRadius: 12 }}><span style={{ color: olive }}>✓</span>{d}</div>)}
              </div>
            </div>
            <div data-reveal style={{ background: "#1b1f12", border: "1px solid rgba(241,239,227,.12)", borderRadius: 24, padding: 24, boxShadow: "0 40px 90px rgba(0,0,0,.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div className="head" style={{ fontSize: 16, color: cream }}>Monthly Performance Report</div>
                <span className="mono" style={{ fontSize: 9.5, color: "#8a8b78", border: "1px solid rgba(241,239,227,.12)", padding: "5px 10px", borderRadius: 7, letterSpacing: ".06em", textTransform: "uppercase" }}>Sample</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" style={{ marginBottom: 14 }}>
                {rptKpis.map((k) => (
                  <div key={k.label} style={{ background: "rgba(241,239,227,.04)", border: "1px solid rgba(241,239,227,.08)", borderRadius: 13, padding: 13 }}>
                    <div className="mono" style={{ fontSize: 8.5, color: "#8a8b78", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>{k.label}</div>
                    <div className="head" style={{ fontSize: 19, marginTop: 4, color: k.c }}>{k.val}</div>
                    <div className="mono" style={{ fontSize: 9.5, color: "#9bd227", fontWeight: 600, marginTop: 1 }}>{k.delta}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(241,239,227,.04)", border: "1px solid rgba(241,239,227,.08)", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span className="mono" style={{ fontSize: 10, color: "#8a8b78", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Revenue vs wasted spend</span><span className="mono" style={{ fontSize: 10, color: lime, fontWeight: 600 }}>▲ trending up</span></div>
                <svg viewBox="0 0 360 90" style={{ width: "100%", height: 88, display: "block" }} preserveAspectRatio="none">
                  <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lime} stopOpacity=".3" /><stop offset="1" stopColor={lime} stopOpacity="0" /></linearGradient></defs>
                  <path d="M0,74 L60,68 L120,70 L180,52 L240,44 L300,28 L360,12 L360,90 L0,90 Z" fill="url(#rg)" />
                  <path d="M0,74 L60,68 L120,70 L180,52 L240,44 L300,28 L360,12" fill="none" stroke={lime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 480, strokeDashoffset: 480, animation: "ppcDash 1.8s ease forwards .3s" }} />
                  <path d="M0,80 L60,79 L120,80 L180,78 L240,79 L300,80 L360,80" fill="none" stroke={coral} strokeWidth="1.5" strokeDasharray="4 4" opacity=".6" />
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, background: "rgba(206,255,58,.08)", border: "1px solid rgba(206,255,58,.22)", padding: "11px 14px", borderRadius: 12 }}><span style={{ color: "#c9c8b6" }}>Top campaign · Emergency HVAC</span><span className="mono" style={{ color: lime, fontWeight: 700 }}>5.3x ROAS</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, background: "rgba(242,106,43,.08)", border: "1px solid rgba(242,106,43,.22)", padding: "11px 14px", borderRadius: 12 }}><span style={{ color: "#c9c8b6" }}>42 search terms added as negatives</span><span className="mono" style={{ color: "#fdba74", fontWeight: 700 }}>−18% waste</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ───────────────────────────────────────────────────── */}
      <section id="cases" style={{ background: cream, color: ink, borderBottom: `1px solid ${ink}` }}>
        <div className={WRAP}>
          <div data-reveal style={{ maxWidth: 780, margin: "0 auto 14px" }}>
            <Eyebrow>Proof</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>Results that show up<br />in the <Em>bank account</Em></h2>
            <p style={{ fontSize: 17, color: "#54564a", marginTop: 18, lineHeight: 1.6, maxWidth: 600 }}>Representative engagements showing how we turn spend into booked jobs. Anonymized — individual results vary.</p>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: 40 }}>
            {homeCases.map((c) => (
              <div key={c.industry} data-reveal className="hcard" style={{ background: "#fbfaf2", border: "1px solid #dddbc9", borderRadius: 22, padding: 26, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span className="mono" style={{ fontSize: 10, fontWeight: 600, color: ink, background: lime, padding: "5px 10px", borderRadius: 7, letterSpacing: ".05em", textTransform: "uppercase" }}>{c.industry}</span>
                  <span className="mono" style={{ fontSize: 10, color: "#8a8c72", letterSpacing: ".04em" }}>{c.location}</span>
                </div>
                <div className="head" style={{ fontSize: 46, color: ink, marginBottom: 6 }}>{c.metric}</div>
                <div className="mono" style={{ fontSize: 11.5, color: "#54564a", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 18 }}>{c.metricLabel}</div>
                <div style={{ marginBottom: 18 }}>
                  <svg viewBox="0 0 200 44" style={{ width: "100%", height: 46, display: "block" }}>
                    <line x1="10" y1="42.5" x2="190" y2="42.5" stroke="#dddbc9" strokeWidth="1" />
                    <rect x="24" y={c.barA} width="60" height={c.barAh} rx="4" fill="#cfcdba" />
                    <rect x="116" y={c.barB} width="60" height={c.barBh} rx="4" fill="#9bd227" />
                  </svg>
                  <div style={{ display: "flex", marginTop: 8 }}>
                    <span className="mono" style={{ flex: 1, textAlign: "center", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "#83856f" }}>Before</span>
                    <span className="mono" style={{ flex: 1, textAlign: "center", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "#5f6f17", fontWeight: 700 }}>After</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#54564a", lineHeight: 1.5, marginBottom: 8 }}><strong style={{ color: ink }}>Problem:</strong> {c.problem}</div>
                <div style={{ fontSize: 13, color: "#54564a", lineHeight: 1.5, marginBottom: 18 }}><strong style={{ color: ink }}>Action:</strong> {c.action}</div>
                <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #e3e1d2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 10, color: "#8a8c72", letterSpacing: ".03em" }}>{c.channel} · {c.timeline}</span>
                  <Link href={`/results/${c.slug}`} className="mono" style={{ fontSize: 11, fontWeight: 700, color: ink, letterSpacing: ".05em", textTransform: "uppercase" }}>View →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────────────────────────────────── */}
      <section id="industries" style={{ background: cream, color: ink, borderBottom: "1px solid #e3e0d0" }}>
        <div className={WRAP}>
          <div data-reveal style={{ maxWidth: 760, margin: "0 auto 52px", textAlign: "center" }}>
            <Eyebrow>Who we help</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>Deep in local <Em>service</Em> verticals</h2>
            <p style={{ fontSize: 17, color: "#54564a", marginTop: 18, lineHeight: 1.6 }}>Repeatable playbooks for the industries we know best — niche depth beats generalist agencies for local lead-gen.</p>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {homeIndustries.map((i) => (
              <Link key={i.name} href={`/industries/${i.slug}`} data-reveal className="group transition-all hover:-translate-y-1 hover:shadow-tile" style={{ background: "#fff", border: "1px solid #e3e0d0", borderRadius: 18, padding: 22, display: "block" }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "#eef2dd", color: "#5f6f17", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, marginBottom: 14 }}>{i.icon}</div>
                <div className="head" style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.05 }}>{i.name}</div>
                <div style={{ fontSize: 12.5, color: "#54564a", lineHeight: 1.5 }}>{i.angle}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ background: cream, color: ink, borderBottom: `1px solid ${ink}` }}>
        <div className="mx-auto max-w-[1340px] px-5 py-20 md:px-8 md:py-24">
          <div data-reveal style={{ maxWidth: 760, margin: "0 auto 52px", textAlign: "center" }}>
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)" }}>Built around your <Em>budget</Em></h2>
            <p style={{ fontSize: 17, color: "#54564a", marginTop: 18, lineHeight: 1.6 }}>Management fees depend on account complexity, channels, tracking and goals. Here&rsquo;s the structure — your exact scope is confirmed after a review.</p>
          </div>
          <div className="grid items-stretch gap-[18px] lg:grid-cols-3">
            {homePricing.map((p) => (
              <div key={p.name} data-reveal style={{ background: p.dark ? ink : "#fbfaf2", color: p.dark ? cream : ink, border: `1px solid ${p.dark ? ink : "#dddbc9"}`, borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", position: "relative", boxShadow: p.dark ? "0 24px 60px rgba(20,23,14,.25)" : "none" }}>
                {p.dark && <span className="mono" style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: lime, color: ink, fontSize: 10, fontWeight: 700, padding: "7px 14px", borderRadius: 999, whiteSpace: "nowrap", letterSpacing: ".08em", textTransform: "uppercase" }}>Most popular</span>}
                <div className="head" style={{ fontSize: 20 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: p.dark ? "#9a9b88" : "#54564a", marginTop: 7, lineHeight: 1.4 }}>{p.bestFor}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "22px 0" }}><span className="head" style={{ fontSize: 42, color: p.dark ? lime : ink }}>{p.price}</span>{p.priceNote && <span className="mono" style={{ fontSize: 12, color: p.dark ? "#9a9b88" : "#8a8c72", textTransform: "uppercase", letterSpacing: ".05em" }}>{p.priceNote}</span>}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 26 }}>
                  {p.items.map((it) => <span key={it} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, lineHeight: 1.4, color: p.dark ? "#e7e6d6" : "#2c2e22" }}><span style={{ color: p.dark ? lime : olive, flexShrink: 0 }}>✓</span>{it}</span>)}
                </div>
                <LeadCtaButton label={p.cta} source={`pricing:${p.name}`} title={`${p.name} — get started`} className="mono" style={{ marginTop: "auto", width: "100%", cursor: "pointer", border: "none", textAlign: "center", background: p.dark ? lime : ink, color: p.dark ? ink : cream, fontWeight: 700, fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", padding: 15, borderRadius: 13 }} />
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 12.5, color: "#8a8c72", marginTop: 26, maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>Ad spend is separate from management fees and paid directly to the ad platforms. Pricing depends on account complexity, channels, tracking setup, landing-page needs and growth goals.</p>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section style={{ background: "#f7f5ea", color: ink, borderBottom: "1px solid #e3e0d0" }}>
        <div className={WRAP}>
          <div data-reveal style={{ maxWidth: 760, margin: "0 auto 14px", textAlign: "center" }}>
            <Eyebrow>In their words</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)" }}>What working with us <Em>feels like</Em></h2>
            <p style={{ fontSize: 14, color: "#8a8c72", marginTop: 14 }}>Representative of the feedback we hear from clients.</p>
          </div>
        </div>
        <TestimonialCarousel />
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ background: cream, color: ink, borderBottom: `1px solid ${ink}` }}>
        <div className="mx-auto max-w-[1080px] px-5 py-20 md:px-8 md:py-24">
          <div data-reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="head" style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>Questions, <Em>answered</Em></h2>
          </div>
          <FaqList />
        </div>
      </section>

      {/* ── AUDIT FORM ─────────────────────────────────────────────────────── */}
      <section id="audit" style={{ background: cream, color: ink, borderBottom: "1px solid #e3e0d0", position: "relative", overflow: "hidden" }}>
        <div className="ambient-glow" style={{ position: "absolute", top: -120, right: -90, width: 420, height: 420, background: "radial-gradient(circle,rgba(206,255,58,.2),transparent 65%)" }} />
        <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-24" style={{ position: "relative" }}>
          <div className="grid items-start gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <div data-reveal>
              <Eyebrow>Free PPC audit</Eyebrow>
              <h2 className="head" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)" }}>See where your budget is <Em>really going</Em></h2>
              <p style={{ fontSize: 16.5, color: "#54564a", lineHeight: 1.6, marginTop: 18, maxWidth: 440 }}>Most accounts waste spend on poor tracking, weak keywords, bad landing pages or slow follow-up. We&rsquo;ll show you exactly where — before you commit to anything.</p>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 11 }}>
                {["Campaign structure & search-term waste", "Negative-keyword opportunities", "Conversion tracking — GA4 / GTM", "Landing-page & CRO review", "Budget allocation & competitor visibility", "A clear 30-day action plan"].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#2c2e22" }}><span style={{ color: olive }}>✓</span>{t}</div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#6b6d5c", marginTop: 22, maxWidth: 400, lineHeight: 1.5 }}>No obligation. No long-term lock-in. You own your accounts and data. We reply within one business day.</p>
            </div>
            <AuditForm />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section id="get-started" style={{ background: lime, color: ink, position: "relative", overflow: "hidden" }}>
        <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }} aria-hidden>
          <g fill="none" stroke={ink} strokeWidth="1" strokeOpacity=".06"><ellipse cx="600" cy="250" rx="320" ry="180" /><ellipse cx="600" cy="250" rx="460" ry="260" /><ellipse cx="600" cy="250" rx="600" ry="340" /></g>
        </svg>
        <div style={{ position: "absolute", bottom: -160, left: "50%", transform: "translateX(-50%)", width: 680, height: 420, background: "radial-gradient(circle,rgba(255,255,255,.45),transparent 65%)" }} />
        <div data-reveal className="mx-auto max-w-[940px] px-5 py-24 text-center md:px-8" style={{ position: "relative" }}>
          <GsapText as="h2" mode="chars" className="head" style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>Turn ad spend into<br /><Em>booked jobs</Em></GsapText>
          <p style={{ fontSize: 18, color: "#54564a", lineHeight: 1.6, margin: "22px auto 0", maxWidth: 600 }}>Start with a free PPC audit or claim the 30-Day Growth Sprint. You&rsquo;ll get clear next steps before committing to a long-term plan.</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 40 }}>
            <Link href="#audit" className="mono" style={{ background: ink, color: cream, fontWeight: 700, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "18px 30px", borderRadius: 14, boxShadow: "0 14px 40px rgba(20,23,14,.28)" }}>Get Free PPC Audit</Link>
            <Link href="#sprint" className="mono" style={{ background: "transparent", border: "1px solid rgba(20,23,14,.32)", color: ink, fontWeight: 600, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "18px 28px", borderRadius: 14 }}>Claim 30-Day Sprint</Link>
            <Link href="/contact" className="mono" style={{ background: "transparent", border: "1px solid rgba(20,23,14,.32)", color: ink, fontWeight: 600, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", padding: "18px 26px", borderRadius: 14, display: "inline-flex", alignItems: "center", gap: 9 }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: ink }} />Message us</Link>
          </div>
          <p className="mono" style={{ fontSize: 11, color: "#3a4a10", marginTop: 28, letterSpacing: ".1em", textTransform: "uppercase" }}>No long-term contracts · You keep ownership of your accounts</p>
        </div>
      </section>
    </div>
  );
}
