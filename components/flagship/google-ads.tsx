import Link from "next/link";
import { ArrowRight, Search, MousePointerClick, Target, Check } from "lucide-react";
import type { Service } from "@/lib/data/services";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/interactive";
import { AuditChecklist, AiAutomation, OptimizationCadence, Timeline30Day, ToolStack } from "@/components/sections/service-deep";
import { DashboardMock } from "@/components/illustrations/dashboard-mock";
import { ServiceProof } from "@/components/sections/service-proof";
import { EstimateBand } from "@/components/sections/estimate-band";
import { LeadBand } from "@/components/sections/lead-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { accentVarsFor } from "@/lib/data/themes";
import { TrustBadgeBar, ServiceIntro, ServiceStatBand, ComparisonTable } from "@/components/sections/service-aeo";
import { getServiceContent } from "@/lib/data/service-content";
import { ServiceIndustryAccordion } from "@/components/sections/service-industry-accordion";
import { industriesForService, getServiceIndustryAngle, serviceIndustryLabel } from "@/lib/data/service-industry";

const ACCENT = "#2f6db0";
const INK = "#14170e";

const ANATOMY = [
  { icon: Search, title: "High-intent Search", body: "Tightly-themed campaigns built around your most profitable services and locations — full-strength RSAs, rigorous negatives." },
  { icon: Target, title: "Conversion-based bidding", body: "tCPA/tROAS bidding that optimizes to booked jobs, fed by call tracking and offline-conversion import — not form fills." },
  { icon: MousePointerClick, title: "Landing & tracking", body: "Message-matched landing pages and airtight GA4/GTM/conversion tracking so every dollar is measurable." },
];

/** BESPOKE flagship layout for the Google Ads service — an "anatomy of a rebuilt
 *  account", audit-first design distinct from the generic service template. */
export function GoogleAdsFlagship({ service }: { service: Service }) {
  const content = getServiceContent("google-ads");
  const siRows = industriesForService("google-ads").flatMap((iSlug) => {
    const a = getServiceIndustryAngle("google-ads", iSlug);
    return a ? [{ industrySlug: iSlug, label: serviceIndustryLabel("google-ads", iSlug), href: `/services/google-ads/${iSlug}`, angle: a }] : [];
  });
  return (
    <div style={accentVarsFor(ACCENT)}>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] pt-32 pb-16 md:pt-40 md:pb-20" style={{ background: `color-mix(in srgb, ${ACCENT} 8%, var(--color-base))` }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px]" style={{ background: ACCENT }} />
        <div className="pointer-events-none absolute -right-32 -top-24 h-[440px] w-[440px] rounded-full" style={{ background: `radial-gradient(circle, color-mix(in srgb, ${ACCENT} 22%, transparent), transparent 65%)` }} />
        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-ink-faint)]">
              <Link href="/" className="hover:text-[var(--color-ink)]">Home</Link><span>/</span>
              <Link href="/services" className="hover:text-[var(--color-ink)]">Services</Link><span>/</span>
              <span className="text-[var(--color-ink-dim)]">Google Ads</span>
            </nav>
            <span className="mono inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: ACCENT, border: `1px solid color-mix(in srgb, ${ACCENT} 40%, transparent)` }}>
              <Search size={13} /> Google Ads management
            </span>
            <h1 className="head mt-5 text-[clamp(2.6rem,5.6vw,4.6rem)]">Google Ads, rebuilt around <span style={{ color: ACCENT }}>booked jobs</span></h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-dim)]">{service.hero}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic><Button href="/contact" size="lg" style={{ background: ACCENT, color: "#fff" }}>Get a free Google Ads audit <ArrowRight size={18} /></Button></Magnetic>
              <Button href="#estimate" variant="outline">Estimate your results</Button>
            </div>
            <div className="mt-9 grid grid-cols-3 gap-3 max-w-md">
              {service.proofStats.map((s) => (
                <div key={s.label}><div className="head text-[clamp(1.4rem,3vw,1.9rem)]" style={{ color: INK }}>{s.value}</div><div className="mono mt-1 text-[9.5px] uppercase leading-tight tracking-[.04em] text-[var(--color-ink-dim)]">{s.label}</div></div>
              ))}
            </div>
          </div>
          <Reveal className="relative">{service.dashboardMock ? <DashboardMock data={service.dashboardMock} /> : null}</Reveal>
        </div>
      </section>

      <TrustBadgeBar />
      {content?.definition && <ServiceIntro name="Google Ads management" definition={content.definition} heading={content.definitionHeading} />}
      <ServiceStatBand slug="google-ads" />

      {/* Anatomy of a rebuilt account (bespoke) */}
      <Section>
        <SectionHeading align="left" eyebrow="What we build" title={<>The anatomy of a <span style={{ color: ACCENT }}>rebuilt account</span></>} intro="Most accounts we inherit waste 20–40% of spend on the wrong searches, weak bidding and broken tracking. Here's the structure we rebuild toward." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ANATOMY.map((a, i) => {
            const Icon = a.icon;
            return (
              <Reveal key={a.title} delay={i * 0.05}>
                <div className="h-full rounded-[22px] border border-[#dddbc9] bg-white p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[14px]" style={{ background: ACCENT, color: "#fff" }}><Icon size={21} /></span>
                  <h3 className="head mt-4 text-[18px]">{a.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{a.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {service.auditChecklist && <AuditChecklist serviceName={service.name} groups={service.auditChecklist} />}
      {service.aiAutomation && <AiAutomation items={service.aiAutomation} />}
      {service.optimizationCadence && <OptimizationCadence cadence={service.optimizationCadence} />}
      {service.first30Days && <Timeline30Day items={service.first30Days} />}
      {service.toolStack && <ToolStack groups={service.toolStack} />}

      <ServiceProof serviceName={service.name} proofStats={service.proofStats} caseStudySlugs={service.caseStudySlugs} />
      <EstimateBand platform="google-search" title={<>Estimate your <span style={{ color: ACCENT }}>Google Ads</span> potential</>} intro="Pick your industry and budget — we'll model the leads, booked calls and revenue your Google Ads could produce." />
      <LeadBand source="flagship:google-ads" title="Get a free Google Ads audit" />
      {siRows.length > 0 && (
        <Section>
          <SectionHeading align="left" eyebrow="Industry playbooks" title={<>Google Ads for <span style={{ color: ACCENT }}>your industry</span></>} intro="Tap an industry to see how we run Google Ads for it — what good looks like, best practices, typical benchmarks and what to expect." />
          <ServiceIndustryAccordion rows={siRows} />
        </Section>
      )}
      {content?.comparison && <ComparisonTable rows={content.comparison} serviceName="Google Ads management" />}
      <FaqAccordion faqs={content?.faqs ?? service.faqs} title="Google Ads Management — questions" />
      <CtaBlock />
    </div>
  );
}
