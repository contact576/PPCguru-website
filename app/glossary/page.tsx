import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { BlogArt } from "@/components/illustrations/hero-art";
import { accentAt } from "@/components/ui/layout";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";
import { siteConfig } from "@/lib/site-config";
import { glossary, glossaryCategories } from "@/lib/data/glossary";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
  title: "Marketing Glossary — PPC, Meta Ads & SEO Terms Explained",
  description:
    "Plain-English definitions of the Google Ads, Meta Ads and SEO terms service businesses run into — CPC, CPL, ROAS, Quality Score, Performance Max, Local SEO and more. No jargon.",
  path: "/glossary",
}), "/glossary");
}

const glossarySchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": `${siteConfig.url}/glossary`,
  name: "PPC, Meta Ads & SEO Marketing Glossary",
  url: `${siteConfig.url}/glossary`,
  hasDefinedTerm: glossary.map((t) => ({
    "@type": "DefinedTerm",
    "@id": `${siteConfig.url}/glossary#${t.slug}`,
    name: t.term,
    description: t.definition,
    inDefinedTermSet: `${siteConfig.url}/glossary`,
  })),
};

export default function GlossaryPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Glossary", path: "/glossary" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={glossarySchema} />

      <PageHero
        eyebrow="Glossary"
        title={<>Marketing terms, in <span className="text-gradient">plain English</span></>}
        intro="No jargon, no fluff — just clear definitions of the Google Ads, Meta Ads and SEO terms you'll actually hear from us. Skim it, or use it to decode any agency report."
        breadcrumbs={crumbs}
        art={<BlogArt />}
      />

      <Section className="!pb-0">
        <nav aria-label="Glossary categories" className="flex flex-wrap gap-2.5">
          {glossaryCategories.map((cat) => (
            <a key={cat} href={`#${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-4 py-2 text-[11px] uppercase tracking-[.04em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">
              {cat}
            </a>
          ))}
        </nav>
      </Section>

      {glossaryCategories.map((cat, ci) => (
        <Section key={cat} id={cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")} tone={ci % 2 === 1 ? "soft" : "white"}>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-6 w-1.5 rounded-full" style={{ background: accentAt(ci) }} />
            <SectionHeading align="left" eyebrow="Glossary" title={cat} />
          </div>
          <dl className="mt-8 grid gap-5 md:grid-cols-2">
            {glossary.filter((t) => t.category === cat).map((t) => (
              <div key={t.slug} id={t.slug} className="scroll-mt-28 rounded-[18px] border border-[#dddbc9] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-tile" style={{ borderLeft: `3px solid ${accentAt(ci)}` }}>
                <dt className="head text-[16px] text-[var(--color-ink)]">{t.term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--color-ink-dim)]">{t.definition}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ))}

      <CtaBlock title="Want these numbers working for you, not against you?" />
    </>
  );
}
