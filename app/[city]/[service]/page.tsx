import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, MapPin } from "lucide-react";
import { allLocationParams, getCity, getLocationService, cities, locationServices } from "@/lib/data/locations";
import { getService } from "@/lib/data/services";
import { CityServiceArt } from "@/components/illustrations/hero-art";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic, SpotlightCard } from "@/components/ui/interactive";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { ServiceProof } from "@/components/sections/service-proof";
import { LeadBand } from "@/components/sections/lead-band";
import { CtaBlock } from "@/components/sections/cta-block";
import { TrustBadgeBar, ServiceIntro } from "@/components/sections/service-aeo";
import { getAccent, accentVars } from "@/lib/data/themes";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";
import { siteConfig } from "@/lib/site-config";

// Only render the city×service combos we define; everything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return allLocationParams();
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; service: string }> }): Promise<Metadata> {
  const { city, service } = await params;
  const c = getCity(city);
  const s = getLocationService(service);
  if (!c || !s) return {};
  return withMetaOverride(buildMetadata({
    title: `${s.name} in ${c.name}, ${c.region}`,
    description: `${siteConfig.name} is a Google Partner & Meta Business Partner agency helping ${c.name} service businesses ${s.verb} that turn into booked jobs. Get a free audit.`,
    path: `/${city}/${service}`,
    keywords: [`${s.name} ${c.name}`, `${c.name} ${service}`, `digital marketing ${c.name}`],
  }), `/${city}/${service}`);
}

export default async function LocationServicePage({ params }: { params: Promise<{ city: string; service: string }> }) {
  const { city, service } = await params;
  const c = getCity(city);
  const s = getLocationService(service);
  const fullService = getService(service);
  if (!c || !s || !fullService) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: `${s.name} in ${c.name}`, path: `/${city}/${service}` },
  ];

  // LocalBusiness schema for the city
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${siteConfig.name} — ${s.name} in ${c.name}`,
    description: `${s.name} for ${c.name} service businesses.`,
    areaServed: { "@type": "City", name: c.name },
    url: `${siteConfig.url}/${city}/${service}`,
    // priceRange intentionally omitted — we publish no prices, so an invented range would over-claim.
    address: { "@type": "PostalAddress", addressLocality: c.name, addressRegion: c.region, addressCountry: "CA" },
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
    parentOrganization: { "@id": `${siteConfig.url}/#organization` },
  };
  const cityDef = `${s.name} in ${c.name} means running ${s.name.toLowerCase()} campaigns built specifically for the ${c.name}, ${c.region} market. ${siteConfig.name} is a Google Partner and Meta Business Partner serving ${c.name} service businesses across ${c.region} and Canada — engineering ${s.name.toLowerCase()} around booked jobs and local demand, not clicks.`;

  const otherCities = cities.filter((x) => x.slug !== city).slice(0, 6);

  return (
    <div style={accentVars(service)}>
      <JsonLd data={localSchema} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={`${c.name}, ${c.region}`}
        title={<>{s.name} in <span className="text-gradient">{c.name}</span></>}
        intro={`We help ${c.name} service businesses ${s.verb} that turn into qualified leads and booked jobs. ${c.context}`}
        breadcrumbs={crumbs}
        accent={getAccent(service)}
        art={<CityServiceArt icon={fullService.icon} city={c.name} accent={getAccent(service)} />}
      >
        <Magnetic>
          <Button href="/contact" size="lg" className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]">Get a free {c.name} audit <ArrowRight size={18} /></Button>
        </Magnetic>
      </PageHero>

      <TrustBadgeBar />
      <ServiceIntro name={`${s.name} in ${c.name}`} definition={cityDef} heading={`What is ${s.name} in ${c.name}?`} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionHeading align="left" eyebrow="Why local matters" title={`${s.name} built for the ${c.name} market`} />
            <p className="mt-6 text-[var(--color-ink-dim)]">{c.context}</p>
            <p className="mt-4 text-[var(--color-ink-dim)]">
              As a Google Partner and Meta Business Partner, {siteConfig.name} pairs national-grade
              expertise with on-the-ground knowledge of {c.name} and the wider {c.region} market. We
              build campaigns around your most profitable services and the neighbourhoods that matter —
              from {c.neighbourhoods.slice(0, 3).join(", ")} to {c.neighbourhoods[c.neighbourhoods.length - 1]}.
            </p>
            <div className="mt-7 rounded-[18px] border border-[var(--accent-line)] bg-[var(--accent-soft)] p-5">
              <div className="mono text-[11px] font-bold uppercase tracking-[.1em] text-[var(--accent-strong)]">In {c.name}, we focus on</div>
              <ul className="mt-3 space-y-2.5">
                {c.localFocus.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] text-[var(--color-ink)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />{f}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="mt-7 space-y-3">
              {fullService.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-3 text-[var(--color-ink)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[var(--accent)] text-white"><Check size={13} /></span>
                  {o}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={`/services/${fullService.slug}`} variant="outline">
                Full {fullService.name} details <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          <aside className="h-fit rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold"><MapPin size={16} className="text-[var(--accent)]" /> Neighbourhoods we serve</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.neighbourhoods.map((n) => (
                <span key={n} className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)]">{n}</span>
              ))}
            </div>
            <div className="mt-6 border-t border-[var(--color-border)] pt-5 text-sm font-semibold">Other services in {c.name}</div>
            <div className="mt-3 flex flex-col gap-2">
              {locationServices.filter((x) => x.slug !== service).map((x) => (
                <Link key={x.slug} href={`/${city}/${x.slug}`} className="text-sm text-[var(--color-ink-dim)] hover:text-[var(--accent-strong)]">{x.name} →</Link>
              ))}
            </div>
          </aside>
        </div>
      </Section>

      {/* How we run this service locally */}
      <Section tone="cream">
        <SectionHeading align="left" eyebrow="How we work" title={<>How we run <span className="text-gradient">{s.name.toLowerCase()}</span> in {c.name}</>} />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {fullService.process.map((p, i) => (
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

      {/* Local proof — representative results for this service */}
      <ServiceProof serviceName={fullService.name} proofStats={fullService.proofStats} caseStudySlugs={fullService.caseStudySlugs} />
      <div className="container-page -mt-10 md:-mt-14">
        <p className="text-center text-xs text-[var(--color-ink-faint)]">Figures are representative of results across our client base — not specific to {c.name}. Actual results vary by market, budget, tracking and offer.</p>
      </div>

      <Section className="bg-[var(--color-base-2)]">
        <SectionHeading align="left" eyebrow="Nearby" title={`${s.name} in other ${c.region} cities`} />
        <div className="mt-8 flex flex-wrap gap-3">
          {otherCities.map((x) => (
            <Link key={x.slug} href={`/${x.slug}/${service}`} className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)]">
              {x.name}
            </Link>
          ))}
        </div>
      </Section>

      <LeadBand source={`location:${city}/${service}`} title={`Get a free ${c.name} audit`} />

      <FaqAccordion faqs={fullService.faqs} title={`${s.name} in ${c.name} — questions`} />
      <CtaBlock title={`Grow your ${c.name} business with ${s.name.toLowerCase()}`} />
    </div>
  );
}
