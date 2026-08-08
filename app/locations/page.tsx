import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cities, locationServices } from "@/lib/data/locations";
import { Section } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBlock } from "@/components/sections/cta-block";
import { LocationsArt } from "@/components/illustrations/hero-art";
import { buildMetadata } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
  title: "Locations We Serve — GTA & Ontario Digital Marketing",
  description:
    "Local Google Ads, Meta Ads and SEO across the Greater Toronto Area and Ontario — Toronto, Brampton, Mississauga, Vaughan, Hamilton, Ottawa and more.",
  path: "/locations",
}), "/locations");
}

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Where we work"
        title={<>Local marketing across the <span className="text-gradient">GTA & Ontario</span></>}
        intro="We combine GTA-local market knowledge with national reach. Find your city and the service you need below."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }]}
        art={<LocationsArt />}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {cities.map((c) => (
            <div key={c.slug} className="rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7">
              <div className="flex items-center gap-2.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[var(--color-ink)] text-[var(--color-lime)]"><MapPin size={19} /></span>
                <h2 className="head text-[20px]">{c.name}</h2>
              </div>
              <p className="mt-3 text-sm text-[var(--color-ink-dim)]">{c.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {locationServices.map((s) => (
                  <Link key={s.slug} href={`/${c.slug}/${s.slug}`} className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-4 py-2 text-xs uppercase tracking-[.05em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">
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
