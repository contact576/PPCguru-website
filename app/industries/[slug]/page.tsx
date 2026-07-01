import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Check, X, ArrowRight, Activity, HeartPulse, Smile, Wind, Droplets, Zap, Hammer,
  Home, Plane, Scale, Building2, Wrench, Dumbbell, Sparkles, Briefcase, type LucideIcon,
} from "lucide-react";
import { industries, getIndustry } from "@/lib/data/industries";
import { IndustryArt } from "@/components/illustrations/hero-art";
import { getService } from "@/lib/data/services";
import { caseStudiesByIndustry } from "@/lib/data/case-studies";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Magnetic, SpotlightCard } from "@/components/ui/interactive";
import { CaseStudyCards } from "@/components/sections/case-study-cards";
import { IndustryReality, IndustryPlaybook, IndustryHacks, IndustryPlan90 } from "@/components/sections/industry-deep";
import { EstimateBand } from "@/components/sections/estimate-band";
import { LeadBand } from "@/components/sections/lead-band";
import { getAccent, accentVars } from "@/lib/data/themes";
import { PhysiotherapyFlagship } from "@/components/flagship/physiotherapy";
import { RealEstateFlagship } from "@/components/flagship/real-estate";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { TrustBadgeBar, ServiceIntro, CityCallout, LastReviewed } from "@/components/sections/service-aeo";
import { BigQuote } from "@/components/ui/layout";
import { getIndustryContent } from "@/lib/data/industry-content";
import { getServiceIndustryAngle, serviceIndustryLabel } from "@/lib/data/service-industry";

const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  physiotherapy: Activity,
  "healthcare-clinics": HeartPulse,
  dental: Smile,
  hvac: Wind,
  plumbing: Droplets,
  electrical: Zap,
  "construction-renovation": Hammer,
  roofing: Home,
  immigration: Plane,
  "law-firms": Scale,
  "real-estate": Building2,
  "home-improvement": Wrench,
  "fitness-gyms": Dumbbell,
  "med-spa": Sparkles,
  "professional-services": Briefcase,
};

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return buildMetadata({ title: `${ind.name} Marketing in the GTA & Canada`, description: ind.description, path: `/industries/${slug}` });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  const relatedServices = ind.services.map(getService).filter(Boolean);
  const cases = caseStudiesByIndustry(slug);
  const intro = getIndustryContent(slug);
  const comboLinks = ind.services
    .filter((sv) => getServiceIndustryAngle(sv, slug))
    .map((sv) => ({ href: `/services/${sv}/${slug}`, label: serviceIndustryLabel(sv, slug) }));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: ind.name, path: `/industries/${slug}` },
  ];

  // Bespoke flagship layouts for showcase verticals.
  if (slug === "physiotherapy") return (<><JsonLd data={breadcrumbSchema(crumbs)} /><PhysiotherapyFlagship ind={ind} cases={cases} /></>);
  if (slug === "real-estate") return (<><JsonLd data={breadcrumbSchema(crumbs)} /><RealEstateFlagship ind={ind} cases={cases} /></>);

  return (
    <div style={accentVars(ind.slug)}>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero eyebrow={`${ind.name} marketing`} title={ind.name} intro={ind.hero} breadcrumbs={crumbs} accent={getAccent(ind.slug)} art={<IndustryArt icon={INDUSTRY_ICONS[ind.slug] ?? Briefcase} name={ind.name.split(" ")[0]} accent={getAccent(ind.slug)} />}>
        <Magnetic>
          <Button href="/contact" size="lg" className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]">Get a free audit <ArrowRight size={18} /></Button>
        </Magnetic>
      </PageHero>

      {/* Trust strip + answer-first definition (AEO / E-E-A-T) */}
      <TrustBadgeBar />
      {intro?.definition && <ServiceIntro name={ind.name} definition={intro.definition} heading={intro.definitionHeading} />}

      {/* Pain points → approach */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="The challenge" title="What's holding growth back" />
            <ul className="mt-8 space-y-3">
              {ind.painPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[var(--color-ink-dim)]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-danger)_16%,transparent)] text-[var(--color-danger)]"><X size={13} /></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Our approach" title="How we fix it" />
            <ul className="mt-8 space-y-3">
              {ind.approach.map((a) => (
                <li key={a} className="flex items-start gap-3 text-[var(--color-ink)]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Check size={13} /></span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Industry reality + benchmarks */}
      <IndustryReality name={ind.name} reality={ind.reality} benchmarks={ind.benchmarks} />

      {/* Editorial break — vertical expertise */}
      <BigQuote variant="tint" attribution={`Why ${ind.name.toLowerCase()} is different`}>
        A generic agency runs the same playbook for a plumber and a law firm.{" "}
        {ind.name} customers search, compare and book differently — and that difference is exactly
        where the budget is won or lost.
      </BigQuote>

      {/* Related services */}
      <Section className="bg-[var(--color-base-2)]">
        <SectionHeading align="left" eyebrow="Services" title={`What we run for ${ind.name.toLowerCase()}`} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {relatedServices.map((s, i) => {
            if (!s) return null;
            const Icon = s.icon;
            return (
              <Reveal key={s.slug} delay={i * 0.05}>
                <SpotlightCard className="h-full rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2]">
                  <Link href={`/services/${s.slug}`} className="group flex h-full flex-col gap-3 rounded-[22px] p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--accent)] text-white"><Icon size={21} /></span>
                    <h3 className="head text-[17px]">{s.name}</h3>
                    <p className="text-sm text-[var(--color-ink-dim)]">{s.short}</p>
                  </Link>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Service-for-industry playbooks — reciprocal links into the combo pages */}
      {comboLinks.length > 0 && (
        <Section className="!pt-0">
          <SectionHeading align="left" eyebrow="Playbooks" title={<>How we run each service for <span className="text-gradient">{ind.name.toLowerCase()}</span></>} />
          <div className="mt-8 flex flex-wrap gap-3">
            {comboLinks.map((c) => (
              <Link key={c.href} href={c.href} className="mono rounded-full border border-[var(--accent-line)] bg-[var(--accent-tint)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[.05em] text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)]">{c.label} →</Link>
            ))}
          </div>
        </Section>
      )}

      {/* Per-channel playbook */}
      {ind.playbook && <IndustryPlaybook name={ind.name} playbook={ind.playbook} />}

      {/* Industry hacks */}
      {ind.hacks && <IndustryHacks name={ind.name} hacks={ind.hacks} />}

      {/* Sample 90-day plan */}
      {ind.plan90 && <IndustryPlan90 items={ind.plan90} />}

      {cases.length > 0 && <CaseStudyCards items={cases} heading />}

      {/* Per-industry calculator */}
      <EstimateBand
        defaultIndustry={ind.calculatorIndustrySlug ?? ind.slug}
        title={<>Estimate your <span className="text-gradient">{ind.name.split(" ")[0].toLowerCase()}</span> potential</>}
        intro={`Model the leads, booked calls and revenue your ${ind.name.toLowerCase()} marketing budget could produce — by platform, with real benchmarks.`}
      />

      <CityCallout serviceName={`${ind.name} marketing`} />

      <LeadBand source={`industry:${ind.slug}`} title={`Grow your ${ind.name.split(" ")[0].toLowerCase()} business`} />

      <FaqAccordion faqs={intro?.faqs ?? ind.faqs} title={`${ind.name} — questions`} />
      <LastReviewed />
      <CtaBlock title={`Ready to grow your ${ind.name.toLowerCase()} business?`} />
    </div>
  );
}
