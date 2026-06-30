import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { services, getService } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Magnetic, SpotlightCard } from "@/components/ui/interactive";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { ServiceProof } from "@/components/sections/service-proof";
import { AuditChecklist, AiAutomation, OptimizationCadence, Timeline30Day, ToolStack } from "@/components/sections/service-deep";
import { DashboardMock } from "@/components/illustrations/dashboard-mock";
import { EstimateBand } from "@/components/sections/estimate-band";
import { LeadBand } from "@/components/sections/lead-band";
import { CtaBlock } from "@/components/sections/cta-block";
import type { PlatformId } from "@/lib/data/benchmarks";
import { getAccent, accentVars } from "@/lib/data/themes";
import { GoogleAdsFlagship } from "@/components/flagship/google-ads";
import { TrustBadgeBar, ServiceIntro, ServiceStatBand, ComparisonTable, CityCallout, LastReviewed } from "@/components/sections/service-aeo";
import { getServiceContent } from "@/lib/data/service-content";
import { ServiceIndustryAccordion } from "@/components/sections/service-industry-accordion";
import { industriesForService, getServiceIndustryAngle, serviceIndustryLabel } from "@/lib/data/service-industry";

// Which ad platform each service's calculator should default to.
const SERVICE_PLATFORM: Record<string, PlatformId> = {
  "google-ads": "google-search", "meta-ads": "meta", "youtube-ads": "youtube",
  "microsoft-ads": "microsoft", "tiktok-ads": "tiktok", "linkedin-ads": "linkedin",
  "pinterest-ads": "pinterest", "seo": "google-search", "web-design": "google-search",
  "cro-landing-pages": "google-search", "creative": "meta", "crm": "google-search",
  "ai-automation": "google-search",
};
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, serviceSchema, breadcrumbSchema } from "@/lib/seo";
import {
  GoogleAdsArt, MetaAdsArt, SeoArt, CreativeArt, WebDesignArt, CrmArt, ServicesArt,
} from "@/components/illustrations/hero-art";

const SERVICE_ART: Record<string, React.ReactNode> = {
  "google-ads": <GoogleAdsArt />,
  "meta-ads": <MetaAdsArt />,
  "seo": <SeoArt />,
  "creative": <CreativeArt />,
  "web-design": <WebDesignArt />,
  "crm": <CrmArt />,
  // New services reuse the closest existing art until bespoke art ships.
  "linkedin-ads": <MetaAdsArt />,
  "tiktok-ads": <MetaAdsArt />,
  "microsoft-ads": <GoogleAdsArt />,
  "pinterest-ads": <MetaAdsArt />,
  "youtube-ads": <CreativeArt />,
  "ai-automation": <CrmArt />,
  "cro-landing-pages": <WebDesignArt />,
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({ title: `${service.name} in the GTA & Canada`, description: service.description, path: `/services/${slug}` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedIndustries = industries.filter((i) => i.services.includes(slug));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${slug}` },
  ];
  const firstWord = service.name.split(" ")[0];
  const content = getServiceContent(slug);
  const schemaDesc = content?.definition ?? service.description;
  const siRows = industriesForService(slug).flatMap((iSlug) => {
    const a = getServiceIndustryAngle(slug, iSlug);
    return a ? [{ industrySlug: iSlug, label: serviceIndustryLabel(slug, iSlug), href: `/services/${slug}/${iSlug}`, angle: a }] : [];
  });

  // Bespoke flagship layout for the Google Ads showcase service.
  if (slug === "google-ads") {
    return (
      <>
        <JsonLd data={serviceSchema({ name: service.name, description: schemaDesc, path: `/services/${slug}` })} />
        <JsonLd data={breadcrumbSchema(crumbs)} />
        <GoogleAdsFlagship service={service} />
      </>
    );
  }

  return (
    <div style={accentVars(slug)}>
      <JsonLd data={serviceSchema({ name: service.name, description: schemaDesc, path: `/services/${slug}` })} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero eyebrow="Service" title={service.name} intro={service.hero} breadcrumbs={crumbs} accent={getAccent(slug)} art={SERVICE_ART[slug] ?? <ServicesArt />}>
        <Magnetic>
          <Button href="/contact" size="lg" className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]">Get a free {firstWord} audit <ArrowRight size={18} /></Button>
        </Magnetic>
      </PageHero>

      {/* Trust strip + answer-first definition + per-service stats (AEO / E-E-A-T) */}
      <TrustBadgeBar />
      {content?.definition && <ServiceIntro name={service.name} definition={content.definition} heading={content.definitionHeading} />}
      <ServiceStatBand slug={slug} />

      {/* Outcomes strip */}
      <Section className="!pb-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.outcomes.map((o) => (
            <div key={o} className="flex items-center gap-3 rounded-[14px] border border-[var(--accent-line)] bg-[#fbfaf2] px-5 py-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent)] text-white"><Check size={15} /></span>
              <span className="text-sm font-medium">{o}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Sample dashboard — math-consistent, labelled sample */}
      {service.dashboardMock && (
        <Section>
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionHeading align="left" eyebrow="What you'll see" title={<>Everything ties back to <span className="text-gradient">revenue</span></>} intro="No vanity metrics. Your reporting connects spend to leads, customers and revenue — here's a sample of the kind of dashboard we run." />
              <div className="mt-7"><Magnetic><Button href="/contact" className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]">Get your real numbers <ArrowRight size={16} /></Button></Magnetic></div>
            </div>
            <DashboardMock data={service.dashboardMock} />
          </div>
        </Section>
      )}

      {/* What we audit first */}
      {service.auditChecklist && <AuditChecklist serviceName={service.name} groups={service.auditChecklist} />}

      {/* Symptoms — problem framing */}
      <Section>
        <SectionHeading align="left" eyebrow="Sound familiar?" title={<>Signs your {firstWord.toLowerCase() === "websites" ? "site" : firstWord.toLowerCase()} is <span className="text-gradient">leaving money on the table</span></>} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {service.symptoms.map((s, i) => (
            <Reveal key={s} delay={(i % 2) * 0.05}>
              <div className="flex h-full items-start gap-3.5 rounded-[18px] border border-[#f0d4c4] bg-white p-5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(242,106,43,.14)] text-[var(--color-coral)]"><X size={15} /></span>
                <p className="text-[15px] text-[var(--color-ink-dim)]">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* What's included + who it's for */}
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading align="left" eyebrow="What's included" title={<>Every {firstWord} engagement <span className="text-gradient">includes</span></>} />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.included.map((it) => (
                <div key={it} className="flex items-center gap-3 rounded-[12px] border border-[var(--accent-line)] bg-white px-4 py-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Check size={13} /></span>
                  <span className="text-sm font-medium text-[var(--color-ink)]">{it}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Who it's for" title="Is this you?" />
            <ul className="mt-8 space-y-3">
              {service.whoFor.map((w) => (
                <li key={w} className="flex items-start gap-3 text-[15px] text-[var(--color-ink-dim)]">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-lime)] ring-2 ring-[#cfe39a]" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Deliverables — detailed */}
      <Section>
        <SectionHeading align="left" eyebrow="What we actually do" title={<>The work behind <span className="text-gradient">the results</span></>} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {service.deliverables.map((d, i) => (
            <Reveal key={d.title} delay={(i % 2) * 0.05}>
              <SpotlightCard className="h-full rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7">
                <h3 className="head text-[18px]">{d.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{d.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Campaign types / platforms */}
      <Section tone="cream">
        <SectionHeading align="left" eyebrow="Channels & tactics" title={<>What we run for <span className="text-gradient">{service.name.toLowerCase()}</span></>} />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {service.platforms.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 0.05}>
              <SpotlightCard className="h-full rounded-[20px] border border-[#dddbc9] bg-white p-6">
                <div className="head text-[16px] text-[var(--color-ink)]">{p.name}</div>
                <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{p.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeading align="left" eyebrow="The process" title={<>How we run <span className="text-gradient">{service.name}</span></>} />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p, i) => (
            <Reveal key={p.step} delay={(i % 4) * 0.05}>
              <SpotlightCard className="h-full rounded-[22px] border border-[var(--color-border)] bg-white p-6">
                <span className="head text-[42px]" style={{ color: "color-mix(in srgb, var(--accent) 38%, transparent)" }}>{p.step}</span>
                <h3 className="head mt-3 text-[18px]">{p.title}</h3>
                <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{p.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How we use AI & automation */}
      {service.aiAutomation && <AiAutomation items={service.aiAutomation} />}

      {/* Day-to-day optimization cadence */}
      {service.optimizationCadence && <OptimizationCadence cadence={service.optimizationCadence} />}

      {/* What we fix in the first 30 days */}
      {service.first30Days && <Timeline30Day items={service.first30Days} />}

      {/* Tool stack */}
      {service.toolStack && <ToolStack groups={service.toolStack} />}

      {/* Proof — representative results + curated case studies */}
      <ServiceProof serviceName={service.name} proofStats={service.proofStats} caseStudySlugs={service.caseStudySlugs} />

      {/* Transparency: what we report + what affects cost */}
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="No black box" title={<>What we <span className="text-gradient">report on</span></>} />
            <p className="mt-4 text-[var(--color-ink-dim)]">Every metric ties back to leads, booked jobs and revenue — not impressions. You own your account and your data, always.</p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {service.metrics.map((m) => (
                <div key={m} className="flex items-center gap-2.5 rounded-[12px] border border-[#dddbc9] bg-white px-4 py-3 text-sm text-[var(--color-ink)]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-lime)]"><Check size={11} /></span>
                  {m}
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Transparent pricing" title={<>What shapes your <span className="text-gradient">investment</span></>} />
            <p className="mt-4 text-[var(--color-ink-dim)]">Management fees depend on scope. Ad spend is separate and paid directly to the platforms. We confirm your exact scope after a review — no surprises.</p>
            <Link href="/pricing" className="mono mt-4 inline-block text-xs font-bold uppercase tracking-[.06em] text-[var(--accent-strong)] hover:text-[var(--color-ink)]">See exactly how our pricing works →</Link>
            <ul className="mt-7 space-y-3">
              {service.pricingFactors.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-[12px] border border-[#dddbc9] bg-white px-4 py-3.5 text-sm text-[var(--color-ink-dim)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef2dd] text-[#5f6f17] text-[11px] font-bold">$</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Comparison table — decision content (PPC Guru vs typical agency) */}
      {content?.comparison && <ComparisonTable rows={content.comparison} serviceName={service.name} />}

      {/* Per-service calculator */}
      <EstimateBand
        platform={SERVICE_PLATFORM[slug] ?? "google-search"}
        title={<>Estimate your {firstWord.toLowerCase()} <span className="text-gradient">potential</span></>}
        intro={`Pick your industry and budget — we'll model the leads, booked calls and revenue ${service.name.toLowerCase()} could produce, using real benchmarks and your average ticket.`}
      />

      {/* Industry playbooks — "[Service] for [Industry]" accordion + dedicated pages */}
      {siRows.length > 0 ? (
        <Section>
          <SectionHeading align="left" eyebrow="Industry playbooks" title={<>{firstWord} for <span className="text-gradient">your industry</span></>} intro={`Tap an industry to see how we run ${service.name} for it — what good looks like, best practices, typical benchmarks and what to expect.`} />
          <ServiceIndustryAccordion rows={siRows} />
        </Section>
      ) : relatedIndustries.length > 0 ? (
        <Section>
          <SectionHeading align="left" eyebrow="Where it works" title="Industries we run this for" />
          <div className="mt-8 flex flex-wrap gap-3">
            {relatedIndustries.map((ind) => (
              <Link key={ind.slug} href={`/industries/${ind.slug}`} className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-5 py-2.5 text-xs uppercase tracking-[.05em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">
                {ind.name}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <CityCallout serviceName={service.name} />

      <LeadBand source={`service:${slug}`} title={`Get a free ${firstWord} audit`} />

      <FaqAccordion faqs={content?.faqs ?? service.faqs} title={`${service.name} — questions`} />
      <LastReviewed />
      <CtaBlock />
    </div>
  );
}
