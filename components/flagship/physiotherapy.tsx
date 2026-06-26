import Link from "next/link";
import { ArrowRight, CalendarCheck, PhoneCall, MapPin, Activity, Check } from "lucide-react";
import type { Industry } from "@/lib/data/industries";
import type { CaseStudy } from "@/lib/data/case-studies";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Magnetic, SpotlightCard } from "@/components/ui/interactive";
import { IndustryPlaybook, IndustryHacks, IndustryPlan90 } from "@/components/sections/industry-deep";
import { CaseStudyCards } from "@/components/sections/case-study-cards";
import { EstimateBand } from "@/components/sections/estimate-band";
import { LeadBand } from "@/components/sections/lead-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { accentVarsFor } from "@/lib/data/themes";

const ACCENT = "#2f8f6b";
const INK = "#14170e";

const CONDITIONS = [
  "Back & neck pain", "Sports injuries", "Post-surgery rehab", "Pelvic-floor",
  "Knee & hip pain", "Vestibular / dizziness", "MVA & WSIB rehab", "Chronic pain",
];

/**
 * BESPOKE flagship layout for the physiotherapy industry page — a distinct,
 * patient-acquisition-focused design (booking-led hero, conditions grid, patient
 * journey) that reuses the shared conversion sections. Rendered in place of the
 * generic template for slug === "physiotherapy".
 */
export function PhysiotherapyFlagship({ ind, cases }: { ind: Industry; cases: CaseStudy[] }) {
  return (
    <div style={accentVarsFor(ACCENT)}>
      {/* ── Bespoke hero: clinical, booking-led, split with a calendar mock ── */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] pt-32 pb-16 md:pt-40 md:pb-20" style={{ background: `color-mix(in srgb, ${ACCENT} 8%, var(--color-base))` }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px]" style={{ background: ACCENT }} />
        <div className="pointer-events-none absolute -right-32 -top-24 h-[440px] w-[440px] rounded-full" style={{ background: `radial-gradient(circle, color-mix(in srgb, ${ACCENT} 22%, transparent), transparent 65%)` }} />
        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-ink-faint)]">
              <Link href="/" className="hover:text-[var(--color-ink)]">Home</Link><span>/</span>
              <Link href="/industries" className="hover:text-[var(--color-ink)]">Industries</Link><span>/</span>
              <span className="text-[var(--color-ink-dim)]">Physiotherapy</span>
            </nav>
            <span className="mono inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: ACCENT, border: `1px solid color-mix(in srgb, ${ACCENT} 40%, transparent)` }}>
              <Activity size={13} /> Physiotherapy marketing · GTA
            </span>
            <h1 className="head mt-5 text-[clamp(2.6rem,5.6vw,4.6rem)]">Fill your <span style={{ color: ACCENT }}>clinic calendar</span> with high-intent patients</h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-dim)]">We turn search and social into booked assessments — not clicks — for physiotherapy & rehab clinics across the GTA, measured to the patient.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic><Button href="/contact" size="lg" style={{ background: ACCENT, color: "#fff" }}>Get a free clinic audit <ArrowRight size={18} /></Button></Magnetic>
              <Button href="#estimate" variant="outline">Estimate new patients</Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-ink-dim)]">
              <span className="flex items-center gap-2"><PhoneCall size={15} style={{ color: ACCENT }} /> Call tracking on every campaign</span>
              <span className="flex items-center gap-2"><MapPin size={15} style={{ color: ACCENT }} /> Local map-pack focus</span>
            </div>
          </div>
          {/* Booking-calendar mock */}
          <Reveal className="relative">
            <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-tile">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: ACCENT, color: "#fff" }}><CalendarCheck size={17} /></span><div className="text-sm font-bold">Assessments — this week</div></div>
                <span className="mono text-[10px] uppercase tracking-[.08em] text-[var(--color-ink-faint)]">Sample</span>
              </div>
              <div className="mt-5 grid grid-cols-5 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
                  <div key={d} className="text-center">
                    <div className="mono text-[10px] uppercase text-[var(--color-ink-faint)]">{d}</div>
                    <div className="mt-1.5 flex flex-col gap-1.5">
                      {Array.from({ length: [3, 4, 2, 5, 4][i] }).map((_, j) => <span key={j} className="h-3 rounded" style={{ background: `color-mix(in srgb, ${ACCENT} ${55 + j * 8}%, #eef2dd)` }} />)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-5">
                {[["Booked / wk", "34"], ["Cost / booking", "$122"], ["Show rate", "92%"]].map(([l, v]) => (
                  <div key={l}><div className="head text-[22px]" style={{ color: INK }}>{v}</div><div className="mono text-[9.5px] uppercase tracking-[.04em] text-[var(--color-ink-dim)]">{l}</div></div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Conditions we target (bespoke) ── */}
      <Section>
        <SectionHeading align="left" eyebrow="Search intent" title={<>Patients search by <span style={{ color: ACCENT }}>problem</span>, not by &ldquo;physio&rdquo;</>} intro="We structure campaigns and pages around the conditions and treatments people actually search for — so your ads match intent and convert." />
        <div className="mt-8 flex flex-wrap gap-2.5">
          {CONDITIONS.map((c) => (
            <span key={c} className="rounded-full border bg-white px-4 py-2.5 text-sm font-medium" style={{ borderColor: `color-mix(in srgb, ${ACCENT} 30%, #dddbc9)`, color: INK }}>{c}</span>
          ))}
        </div>
      </Section>

      {/* ── Pain vs approach (themed) ── */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="The challenge" title="What's holding bookings back" />
            <ul className="mt-8 space-y-3">
              {ind.painPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[var(--color-ink-dim)]"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(242,106,43,.16)] text-[var(--color-coral)]">✕</span>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Our approach" title="How we fill the calendar" />
            <ul className="mt-8 space-y-3">
              {ind.approach.map((a) => (
                <li key={a} className="flex items-start gap-3 text-[var(--color-ink)]"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: `color-mix(in srgb, ${ACCENT} 18%, transparent)`, color: ACCENT }}><Check size={13} /></span>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {ind.playbook && <IndustryPlaybook name={ind.name} playbook={ind.playbook} />}
      {ind.hacks && <IndustryHacks name={ind.name} hacks={ind.hacks} />}
      {ind.plan90 && <IndustryPlan90 items={ind.plan90} />}
      {cases.length > 0 && <CaseStudyCards items={cases} heading />}

      <EstimateBand defaultIndustry="physiotherapy" title={<>Estimate your <span style={{ color: ACCENT }}>new-patient</span> potential</>} intro="Pick your platform and budget — we'll model the bookings and revenue your clinic could expect, using real physio benchmarks and your average patient value." />
      <LeadBand source="flagship:physiotherapy" title="Get a free clinic audit" />
      <FaqAccordion faqs={ind.faqs} title="Physiotherapy marketing — questions" />
      <CtaBlock title="Ready to fill your physiotherapy schedule?" />
    </div>
  );
}
