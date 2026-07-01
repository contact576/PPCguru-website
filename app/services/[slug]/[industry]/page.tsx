import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getService } from "@/lib/data/services";
import { getIndustry } from "@/lib/data/industries";
import {
  allServiceIndustryPairs, getServiceIndustryAngle, serviceIndustryLabel, serviceShortName, industryShortName,
} from "@/lib/data/service-industry";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/interactive";
import { TrustBadgeBar, ServiceIntro, ServiceStatBand, ComparisonTable, CityCallout, LastReviewed } from "@/components/sections/service-aeo";
import { getServiceContent } from "@/lib/data/service-content";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { EstimateBand } from "@/components/sections/estimate-band";
import { LeadBand } from "@/components/sections/lead-band";
import { CtaBlock } from "@/components/sections/cta-block";
import { getAccent, accentVars } from "@/lib/data/themes";
import { serviceArt } from "@/components/illustrations/service-art";
import { BigQuote, AccentCard } from "@/components/ui/layout";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, serviceSchema, breadcrumbSchema } from "@/lib/seo";
import type { PlatformId } from "@/lib/data/benchmarks";

export const dynamicParams = false;

const PLATFORM: Record<string, PlatformId> = { "google-ads": "google-search", "meta-ads": "meta", creative: "meta" };

export function generateStaticParams() {
  return allServiceIndustryPairs().map((p) => ({ slug: p.service, industry: p.industry }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; industry: string }> }): Promise<Metadata> {
  const { slug, industry } = await params;
  if (!getServiceIndustryAngle(slug, industry)) return {};
  const label = serviceIndustryLabel(slug, industry);
  return buildMetadata({
    title: `${label} in the GTA & Canada`,
    description: `PPC Guru runs ${serviceShortName[slug]} for ${industryShortName[industry]} across the GTA and Canada — best practices, typical benchmarks and what to expect.`,
    path: `/services/${slug}/${industry}`,
  });
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[var(--color-ink-dim)]">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Check size={12} /></span>
          {it}
        </li>
      ))}
    </ul>
  );
}

export default async function ServiceIndustryPage({ params }: { params: Promise<{ slug: string; industry: string }> }) {
  const { slug, industry } = await params;
  const service = getService(slug);
  const ind = getIndustry(industry);
  const angle = getServiceIndustryAngle(slug, industry);
  if (!service || !ind || !angle) notFound();

  const sShort = serviceShortName[slug] ?? service.name;
  const iShort = industryShortName[industry] ?? ind.name;
  const label = serviceIndustryLabel(slug, industry);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${slug}` },
    { name: iShort, path: `/services/${slug}/${industry}` },
  ];
  const intro = `${label}: how PPC Guru runs ${sShort} for ${iShort.toLowerCase()} across the Greater Toronto Area and Canada — what good looks like, the benchmarks to expect, and how we turn budget into booked jobs, not vanity metrics.`;
  const sc = getServiceContent(slug);
  const comboDef = `${label} is ${sShort} run specifically for ${iShort.toLowerCase()}. PPC Guru is a Google Partner and Meta Business Partner based in the Greater Toronto Area that helps ${iShort.toLowerCase()} across Canada and the USA win more booked jobs through ${sShort.toLowerCase()} — optimized around revenue, not clicks.`;

  return (
    <div style={accentVars(slug)}>
      <JsonLd data={serviceSchema({ name: label, description: intro, path: `/services/${slug}/${industry}` })} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero eyebrow={`${sShort} × ${iShort}`} title={label} intro={intro} breadcrumbs={crumbs} accent={getAccent(slug)} art={serviceArt(slug)}>
        <Magnetic>
          <Button href="/contact" size="lg" className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]">Get a free {sShort} audit <ArrowRight size={18} /></Button>
        </Magnetic>
      </PageHero>

      <TrustBadgeBar />
      <ServiceIntro name={label} definition={comboDef} heading={`What is ${label}?`} />

      {/* What good looks like + best practices — accent-edged panels */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <AccentCard index={0} className="!p-7 md:!p-9">
            <SectionHeading align="left" eyebrow="What good looks like" title={<>Getting {sShort} right for <span className="text-gradient">{iShort.toLowerCase()}</span></>} />
            <Bullets items={angle.goodPractices} />
          </AccentCard>
          <AccentCard index={1} className="!p-7 md:!p-9">
            <SectionHeading align="left" eyebrow="Best practices" title={<>How we run <span className="text-gradient">{sShort}</span> here</>} />
            <Bullets items={angle.bestPractices} />
          </AccentCard>
        </div>
      </Section>

      {/* Industry standards + what to expect — sticky split for a different rhythm */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <SectionHeading align="left" eyebrow="Industry standards" title={<>Typical <span className="text-gradient">benchmarks</span></>} intro="Representative ranges for this vertical and channel — typical, not guaranteed. Below: exactly what working with us looks like." />
            <Bullets items={angle.industryStandards} />
          </div>
          <div>
            <SectionHeading align="left" eyebrow="What to expect" title={<>Working with <span className="text-gradient">PPC Guru</span></>} />
            <div className="mt-4 grid gap-3">
              {angle.whatToExpect.map((it, i) => (
                <AccentCard key={it} index={i} className="!p-5">
                  <p className="text-[14px] leading-relaxed text-[var(--color-ink-dim)]">{it}</p>
                </AccentCard>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <ServiceStatBand slug={slug} />

      {sc?.comparison && <ComparisonTable rows={sc.comparison} serviceName={label} />}

      <EstimateBand
        platform={PLATFORM[slug] ?? "google-search"}
        defaultIndustry={ind.calculatorIndustrySlug ?? ind.slug}
        title={<>Estimate your {sShort.toLowerCase()} <span className="text-gradient">potential</span></>}
        intro={`Model the leads, booked calls and revenue ${sShort} could produce for your ${iShort.toLowerCase()} business — with real benchmarks and your average ticket.`}
      />

      {/* Reciprocal internal links */}
      <Section className="!pt-0">
        <div className="flex flex-wrap gap-3">
          <Link href={`/services/${slug}`} className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-5 py-2.5 text-xs uppercase tracking-[.05em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">
            ← All {sShort} services
          </Link>
          <Link href={`/industries/${industry}`} className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-5 py-2.5 text-xs uppercase tracking-[.05em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">
            {ind.name} marketing →
          </Link>
        </div>
      </Section>

      <CityCallout serviceName={label} />
      {sc?.faqs && <FaqAccordion faqs={sc.faqs} title={`${label} — questions`} />}
      <LeadBand source={`service-industry:${slug}:${industry}`} title={`Get a free ${sShort} audit`} />
      <LastReviewed />
      <CtaBlock title={`Ready to grow your ${iShort.toLowerCase()} business with ${sShort}?`} />
    </div>
  );
}
