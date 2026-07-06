import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { services, getService } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic, SpotlightCard } from "@/components/ui/interactive";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { ServiceProof } from "@/components/sections/service-proof";
import { AuditChecklist, AiAutomation, OptimizationCadence, Timeline30Day, ToolStack } from "@/components/sections/service-deep";
import { DashboardMock } from "@/components/illustrations/dashboard-mock";
import { EstimateBand } from "@/components/sections/estimate-band";
import { LeadBand } from "@/components/sections/lead-band";
import { LeadCtaButton } from "@/components/shared/lead-cta";
import { getServiceOffer, genericOffer } from "@/lib/data/service-offers";
import { HeroOffer } from "@/components/shared/hero-offer";
import { CtaBlock } from "@/components/sections/cta-block";
import type { PlatformId } from "@/lib/data/benchmarks";
import { getAccent, accentVars } from "@/lib/data/themes";
import { GoogleAdsFlagship } from "@/components/flagship/google-ads";
import { TrustBadgeBar, ServiceIntro, ServiceStatBand, ComparisonTable, CityCallout, LastReviewed } from "@/components/sections/service-aeo";
import { ReviewRating, AwardsStrip } from "@/components/sections/trust-proof";
import { BigQuote, SplitFeature, AccentCard, SealDivider, accentAt } from "@/components/ui/layout";
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
import { serviceArt } from "@/components/illustrations/service-art";

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
  const offer = getServiceOffer(slug) ?? genericOffer;
  const ctaCls = "inline-flex items-center justify-center gap-2 rounded-[14px] bg-[var(--accent)] px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[var(--accent-strong)]";
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

      <PageHero eyebrow="Service" title={service.name} intro={service.hero} breadcrumbs={crumbs} accent={getAccent(slug)} art={serviceArt(slug)}>
        <div>
          <HeroOffer
            className="mb-6 max-w-xl"
            badge={offer.trial ? "30-day free trial" : "Free audit · no obligation"}
            line={offer.trial ? `Try our ${service.name} management free for 30 days — no contract, no setup fee, no obligation.` : offer.subhook}
            credit={offer.credit}
          />
          <Magnetic>
            <LeadCtaButton label={<>{offer.ctaLabel} <ArrowRight size={18} /></>} source={offer.formSource} title={offer.popupTitle} blurb={offer.popupBody} submitLabel={offer.ctaLabel} className={ctaCls} />
          </Magnetic>
        </div>
      </PageHero>

      {/* Trust strip + answer-first definition + per-service stats (AEO / E-E-A-T) */}
      <TrustBadgeBar />
      <div className="container-page flex flex-col items-center gap-6 pt-8">
        <ReviewRating />
        <AwardsStrip />
      </div>
      {content?.definition && <ServiceIntro name={service.name} definition={content.definition} heading={content.definitionHeading} />}
      <ServiceStatBand slug={slug} />

      {/* Revenue calculator — moved high (the strongest hook: "what could I make?") */}
      <EstimateBand
        platform={SERVICE_PLATFORM[slug] ?? "google-search"}
        title={<>See how much revenue {firstWord} could <span className="text-gradient">make you</span></>}
        intro={`Pick your industry and monthly budget — we'll model the leads, booked calls and revenue your ${service.name.toLowerCase()} could produce, using real industry benchmarks and your average ticket.`}
      />

      {/* Outcomes strip — accent-edged tiles (distinct from the check-row lists below) */}
      <Section className="!pb-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.outcomes.map((o, i) => (
            <AccentCard key={o} index={i} className="!p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] text-white" style={{ background: accentAt(i) }}><Check size={16} /></span>
              <span className="mt-3 block text-sm font-medium leading-snug text-[var(--color-ink)]">{o}</span>
            </AccentCard>
          ))}
        </div>
      </Section>

      {/* Sample dashboard — math-consistent, labelled sample */}
      {service.dashboardMock && (
        <Section>
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionHeading align="left" eyebrow="What you'll see" title={<>Everything ties back to <span className="text-gradient">revenue</span></>} intro="No vanity metrics. Your reporting connects spend to leads, customers and revenue — here's a sample of the kind of dashboard we run." />
              <div className="mt-7"><Magnetic><LeadCtaButton label={<>Get your real numbers <ArrowRight size={16} /></>} source={`${offer.formSource}:dashboard`} title={offer.popupTitle} blurb={offer.popupBody} submitLabel={offer.ctaLabel} className={ctaCls} /></Magnetic></div>
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

      {/* Editorial break — the leak-sealed philosophy (breaks the box rhythm) */}
      <BigQuote variant="ink" attribution="The PPC Guru approach">
        Most {firstWord.toLowerCase()} budgets don&apos;t fail from spending too little — they{" "}
        <span className="text-[var(--color-lime)]">leak</span> from untracked clicks, lazy match types and
        pages that don&apos;t convert. We find the leak, then seal it.
      </BigQuote>

      {/* Mid-page conversion strip — page-specific offer at the decision point */}
      <Section className="!pt-0">
        <div className="flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-[var(--accent-line)] bg-[var(--accent-tint)] px-6 py-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="head text-[clamp(1.15rem,2.4vw,1.5rem)] text-[var(--color-ink)]">{offer.hook}</p>
            <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{offer.subhook}{offer.trial ? " No contract, no setup fee — walk away anytime." : " No obligation, no lock-in."}</p>
          </div>
          <Magnetic><LeadCtaButton label={<>{offer.ctaLabel} <ArrowRight size={16} /></>} source={`${offer.formSource}:mid`} title={offer.popupTitle} blurb={offer.popupBody} submitLabel={offer.ctaLabel} className={`${ctaCls} shrink-0`} /></Magnetic>
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

      {/* Deliverables — sticky split (breaks the run of card grids) */}
      <SplitFeature
        eyebrow="What we actually do"
        title={<>The work behind <span className="text-gradient">the results</span></>}
        intro="No fluff, no filler line-items — the concrete work that actually moves your numbers, run every month."
        aside={<Magnetic><LeadCtaButton label={<>{offer.ctaLabel} <ArrowRight size={16} /></>} source={`${offer.formSource}:included`} title={offer.popupTitle} blurb={offer.popupBody} submitLabel={offer.ctaLabel} className={ctaCls} /></Magnetic>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {service.deliverables.map((d, i) => (
            <Reveal key={d.title} delay={(i % 2) * 0.05}>
              <AccentCard index={i} className="!p-6">
                <h3 className="head text-[16px]">{d.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{d.body}</p>
              </AccentCard>
            </Reveal>
          ))}
        </div>
      </SplitFeature>

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

      <SealDivider />

      {/* Process — numbered accent-edged cards (distinct from the 30-day timeline below) */}
      <Section>
        <SectionHeading align="left" eyebrow="The process" title={<>How we run <span className="text-gradient">{service.name}</span></>} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p, i) => (
            <Reveal key={p.step} delay={(i % 4) * 0.05}>
              <AccentCard index={i} className="!p-6">
                <span className="head text-[42px] leading-none" style={{ color: `color-mix(in srgb, ${accentAt(i)} 42%, transparent)` }}>{p.step}</span>
                <h3 className="head mt-3 text-[18px]">{p.title}</h3>
                <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{p.body}</p>
              </AccentCard>
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

      <LeadBand source={offer.formSource} title={offer.ctaLabel.replace(/^Get my /, "Get your ")} blurb={offer.popupBody} ctaLabel={offer.ctaLabel} />

      <FaqAccordion faqs={content?.faqs ?? service.faqs} title={`${service.name} — questions`} />
      <LastReviewed />
      <CtaBlock />
    </div>
  );
}
