import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { industries, getIndustry } from "@/lib/data/industries";
import { getService } from "@/lib/data/services";
import { caseStudiesByIndustry } from "@/lib/data/case-studies";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { CaseStudyCards } from "@/components/sections/case-study-cards";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return buildMetadata({ title: `${ind.name} Marketing`, description: ind.description, path: `/industries/${slug}` });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  const relatedServices = ind.services.map(getService).filter(Boolean);
  const cases = caseStudiesByIndustry(slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: ind.name, path: `/industries/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero eyebrow={`${ind.name} marketing`} title={ind.name} intro={ind.hero} breadcrumbs={crumbs}>
        <Button href="/contact" size="lg">Get a free audit <ArrowRight size={18} /></Button>
      </PageHero>

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
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]"><Check size={13} /></span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Related services */}
      <Section className="bg-[var(--color-base-2)]">
        <SectionHeading align="left" eyebrow="Services" title={`What we run for ${ind.name.toLowerCase()}`} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {relatedServices.map((s, i) => {
            if (!s) return null;
            const Icon = s.icon;
            return (
              <Reveal key={s.slug} delay={i * 0.05}>
                <Link href={`/services/${s.slug}`} className="group flex h-full flex-col gap-3 rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-6 transition-all hover:-translate-y-1 hover:border-[var(--color-ink)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--color-ink)] text-[var(--color-lime)]"><Icon size={21} /></span>
                  <h3 className="head text-[17px]">{s.name}</h3>
                  <p className="text-sm text-[var(--color-ink-dim)]">{s.short}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {cases.length > 0 && <CaseStudyCards items={cases} heading />}

      <FaqAccordion faqs={ind.faqs} title={`${ind.name} — questions`} />
      <CtaBlock title={`Ready to grow your ${ind.name.toLowerCase()} business?`} />
    </>
  );
}
