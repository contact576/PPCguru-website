import Link from "next/link";
import { ArrowRight, Home, MapPin, TrendingUp, Check } from "lucide-react";
import type { Industry } from "@/lib/data/industries";
import type { CaseStudy } from "@/lib/data/case-studies";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/interactive";
import { IndustryPlaybook, IndustryHacks, IndustryPlan90 } from "@/components/sections/industry-deep";
import { CaseStudyCards } from "@/components/sections/case-study-cards";
import { EstimateBand } from "@/components/sections/estimate-band";
import { LeadBand } from "@/components/sections/lead-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { accentVarsFor } from "@/lib/data/themes";
import { HeroOffer } from "@/components/shared/hero-offer";
import { LeadCtaButton } from "@/components/shared/lead-cta";
import { genericOffer } from "@/lib/data/service-offers";

const ACCENT = "#2f7d6b";
const INK = "#14170e";

const FUNNELS = [
  { tag: "Sellers", title: "Home-valuation funnel", body: "Neighbourhood-targeted valuation ads → a fast 'what's my home worth?' page → instant agent routing. The highest-converting seller offer there is." },
  { tag: "Buyers", title: "New-listing & alerts funnel", body: "Listing and area-alert campaigns capture buyers early, then nurture them with new-match automation until they're ready to tour." },
];

/** BESPOKE flagship layout for the real-estate industry — a buyer/seller-funnel
 *  design with a valuation-lead hero, distinct from the generic template. */
export function RealEstateFlagship({ ind, cases }: { ind: Industry; cases: CaseStudy[] }) {
  return (
    <div style={accentVarsFor(ACCENT)}>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] pt-32 pb-16 md:pt-40 md:pb-20" style={{ background: `color-mix(in srgb, ${ACCENT} 8%, var(--color-base))` }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px]" style={{ background: ACCENT }} />
        <div className="pointer-events-none absolute -right-32 -top-24 h-[440px] w-[440px] rounded-full" style={{ background: `radial-gradient(circle, color-mix(in srgb, ${ACCENT} 22%, transparent), transparent 65%)` }} />
        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-ink-faint)]">
              <Link href="/" className="hover:text-[var(--color-ink)]">Home</Link><span>/</span>
              <Link href="/industries" className="hover:text-[var(--color-ink)]">Industries</Link><span>/</span>
              <span className="text-[var(--color-ink-dim)]">Real Estate</span>
            </nav>
            <span className="mono inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: ACCENT, border: `1px solid color-mix(in srgb, ${ACCENT} 40%, transparent)` }}>
              <Home size={13} /> Real estate marketing · GTA
            </span>
            <h1 className="head mt-5 text-[clamp(2.6rem,5.6vw,4.6rem)]">A <span style={{ color: ACCENT }}>predictable pipeline</span> beyond referrals</h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-dim)]">Buyer and seller leads with clear attribution — valuation and listing funnels, instant routing and follow-up so more leads become appointments.</p>
            <HeroOffer className="mt-7 max-w-xl" badge="30-day free trial" line="Try our Google or Meta ad management free for 30 days — no contract, no setup fee, no obligation." credit />
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic><LeadCtaButton label={<>Start my free trial <ArrowRight size={18} /></>} source="offer:real-estate:flagship-hero" title="Get your free lead-gen audit" blurb={genericOffer.popupBody} submitLabel="Get my free audit" className="inline-flex items-center justify-center gap-2 rounded-[14px] px-6 py-3.5 text-[15px] font-bold text-white" style={{ background: ACCENT }} /></Magnetic>
              <Button href="#estimate" variant="outline">Estimate lead volume</Button>
            </div>
          </div>
          {/* valuation-lead mock */}
          <Reveal className="relative">
            <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-tile">
              <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: ACCENT, color: "#fff" }}><MapPin size={17} /></span><div className="text-sm font-bold">What&rsquo;s my home worth?</div><span className="mono ml-auto text-[10px] uppercase tracking-[.08em] text-[var(--color-ink-faint)]">Sample</span></div>
              <div className="mt-5 space-y-2.5">
                {["123 Maple Ave, Vaughan", "Property type", "Email for your estimate"].map((p) => <div key={p} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-3 text-sm text-[var(--color-ink-dim)]">{p}</div>)}
                <div className="rounded-xl py-3 text-center text-sm font-bold text-white" style={{ background: ACCENT }}>Get my valuation</div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-5">
                {[["Cost / lead", "$14"], ["LP conversion", "11%"], ["Leads / mo", "127"]].map(([l, v]) => (
                  <div key={l}><div className="head text-[22px]" style={{ color: INK }}>{v}</div><div className="mono text-[9.5px] uppercase tracking-[.04em] text-[var(--color-ink-dim)]">{l}</div></div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Buyer / seller funnels (bespoke) */}
      <Section>
        <SectionHeading align="left" eyebrow="Two funnels" title={<>Built for <span style={{ color: ACCENT }}>buyers and sellers</span></>} intro="Different intent, different funnels — each engineered around the offer that converts that audience." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {FUNNELS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="h-full rounded-[22px] border border-[#dddbc9] bg-white p-7">
                <span className="mono inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.06em]" style={{ background: `color-mix(in srgb, ${ACCENT} 14%, transparent)`, color: ACCENT }}>{f.tag}</span>
                <h3 className="head mt-4 text-[20px] flex items-center gap-2"><TrendingUp size={18} style={{ color: ACCENT }} /> {f.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="The challenge" title="What makes the pipeline unpredictable" />
            <ul className="mt-8 space-y-3">{ind.painPoints.map((p) => <li key={p} className="flex items-start gap-3 text-[var(--color-ink-dim)]"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(242,106,43,.16)] text-[var(--color-coral)]">✕</span>{p}</li>)}</ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Our approach" title="How we make it predictable" />
            <ul className="mt-8 space-y-3">{ind.approach.map((a) => <li key={a} className="flex items-start gap-3 text-[var(--color-ink)]"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: `color-mix(in srgb, ${ACCENT} 18%, transparent)`, color: ACCENT }}><Check size={13} /></span>{a}</li>)}</ul>
          </div>
        </div>
      </Section>

      {ind.playbook && <IndustryPlaybook name={ind.name} playbook={ind.playbook} />}
      {ind.hacks && <IndustryHacks name={ind.name} hacks={ind.hacks} />}
      {ind.plan90 && <IndustryPlan90 items={ind.plan90} />}
      {cases.length > 0 && <CaseStudyCards items={cases} heading />}

      <EstimateBand defaultIndustry="real-estate" platform="meta" title={<>Estimate your <span style={{ color: ACCENT }}>lead</span> potential</>} intro="Model the buyer/seller leads and pipeline your budget could produce, using real real-estate benchmarks." />
      <LeadBand source="flagship:real-estate" title="Get a free lead-gen audit" />
      <FaqAccordion faqs={ind.faqs} title="Real estate marketing — questions" />
      <CtaBlock title="Ready for a predictable real-estate pipeline?" />
    </div>
  );
}
