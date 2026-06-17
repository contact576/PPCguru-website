import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, MapPin } from "lucide-react";
import { allLocationParams, getCity, getLocationService, cities, locationServices } from "@/lib/data/locations";
import { getService } from "@/lib/data/services";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
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
  return buildMetadata({
    title: `${s.name} in ${c.name}, ${c.region}`,
    description: `${siteConfig.name} is a Google Partner & Meta Business Partner agency helping ${c.name} service businesses ${s.verb} that turn into booked jobs. Get a free audit.`,
    path: `/${city}/${service}`,
    keywords: [`${s.name} ${c.name}`, `${c.name} ${service}`, `digital marketing ${c.name}`],
  });
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
    telephone: siteConfig.contact.phone,
    parentOrganization: { "@id": `${siteConfig.url}/#organization` },
  };

  const otherCities = cities.filter((x) => x.slug !== city).slice(0, 6);

  return (
    <>
      <JsonLd data={localSchema} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow={`${c.name}, ${c.region}`}
        title={<>{s.name} in <span className="text-gradient">{c.name}</span></>}
        intro={`We help ${c.name} service businesses ${s.verb} that turn into qualified leads and booked jobs. ${c.context}`}
        breadcrumbs={crumbs}
      >
        <Button href="/contact" size="lg">Get a free {c.name} audit <ArrowRight size={18} /></Button>
      </PageHero>

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
            <ul className="mt-7 space-y-3">
              {fullService.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-3 text-[var(--color-ink)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]"><Check size={13} /></span>
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

          <aside className="h-fit rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold"><MapPin size={16} className="text-[var(--color-cyan-bright)]" /> Neighbourhoods we serve</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.neighbourhoods.map((n) => (
                <span key={n} className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)]">{n}</span>
              ))}
            </div>
            <div className="mt-6 border-t border-[var(--color-border)] pt-5 text-sm font-semibold">Other services in {c.name}</div>
            <div className="mt-3 flex flex-col gap-2">
              {locationServices.filter((x) => x.slug !== service).map((x) => (
                <Link key={x.slug} href={`/${city}/${x.slug}`} className="text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-cyan-bright)]">{x.name} →</Link>
              ))}
            </div>
          </aside>
        </div>
      </Section>

      <Section className="bg-[var(--color-base-2)]">
        <SectionHeading align="left" eyebrow="Nearby" title={`${s.name} in other ${c.region} cities`} />
        <div className="mt-8 flex flex-wrap gap-3">
          {otherCities.map((x) => (
            <Link key={x.slug} href={`/${x.slug}/${service}`} className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan-bright)]">
              {x.name}
            </Link>
          ))}
        </div>
      </Section>

      <FaqAccordion faqs={fullService.faqs} title={`${s.name} in ${c.name} — questions`} />
      <CtaBlock title={`Grow your ${c.name} business with ${s.name.toLowerCase()}`} />
    </>
  );
}
