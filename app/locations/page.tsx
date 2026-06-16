import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cities, locationServices } from "@/lib/data/locations";
import { Section } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Locations We Serve — GTA & Ontario Digital Marketing",
  description:
    "Local Google Ads, Meta Ads and SEO across the Greater Toronto Area and Ontario — Toronto, Brampton, Mississauga, Vaughan, Hamilton, Ottawa and more.",
  path: "/locations",
});

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Where we work"
        title={<>Local marketing across the <span className="text-gradient">GTA & Ontario</span></>}
        intro="We combine GTA-local market knowledge with national reach. Find your city and the service you need below."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }]}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {cities.map((c) => (
            <div key={c.slug} className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-7">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-cyan)_16%,transparent)] text-[--color-cyan-bright]"><MapPin size={17} /></span>
                <h2 className="text-xl font-semibold">{c.name}</h2>
              </div>
              <p className="mt-3 text-sm text-[--color-ink-dim]">{c.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {locationServices.map((s) => (
                  <Link key={s.slug} href={`/${c.slug}/${s.slug}`} className="rounded-full border border-[--color-border] px-4 py-2 text-sm transition-colors hover:border-[--color-violet] hover:text-[--color-violet-bright]">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <CtaBlock />
    </>
  );
}
