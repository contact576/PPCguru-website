import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Quote, ArrowRight } from "lucide-react";
import { caseStudies, getCaseStudy, REPRESENTATIVE_DISCLOSURE } from "@/lib/data/case-studies";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return buildMetadata({
    title: `${c.industry} case study — ${c.headlineMetric.value} ${c.headlineMetric.label}`,
    description: `${c.client} in ${c.location}: ${c.challenge.slice(0, 140)}`,
    path: `/results/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Results", path: "/results" },
    { name: c.industry, path: `/results/${slug}` },
  ];
  const others = caseStudies.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero
        eyebrow={`${c.industry} · ${c.location}`}
        title={c.client}
        intro={`${c.service} · ${c.timeframe}`}
        breadcrumbs={crumbs}
      />

      {/* Metrics band */}
      <Section className="!pt-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[--color-violet] bg-[color-mix(in_srgb,var(--color-violet)_10%,transparent)] p-6">
            <div className="text-4xl font-bold text-gradient">{c.headlineMetric.value}</div>
            <p className="mt-1 text-sm text-[--color-ink-dim]">{c.headlineMetric.label}</p>
          </div>
          {c.secondaryMetrics.map((m) => (
            <div key={m.label} className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-6">
              <div className="text-3xl font-bold text-[--color-ink]">{m.value}</div>
              <p className="mt-1 text-sm text-[--color-ink-dim]">{m.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <div>
              <SectionHeading align="left" eyebrow="The challenge" title="Where they started" />
              <p className="mt-5 text-[--color-ink-dim]">{c.challenge}</p>
            </div>
            <div>
              <SectionHeading align="left" eyebrow="What we did" title="Our approach" />
              <ul className="mt-6 space-y-3">
                {c.approach.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-[--color-ink]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[--color-success]"><Check size={13} /></span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading align="left" eyebrow="The outcome" title="What changed" />
              <p className="mt-5 text-[--color-ink-dim]">{c.results}</p>
            </div>

            <figure className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-7">
              <Quote size={24} className="text-[--color-violet-bright]" />
              <blockquote className="mt-3 text-lg text-[--color-ink]">{c.quote.text}</blockquote>
              <figcaption className="mt-4 text-sm text-[--color-ink-faint]">— {c.quote.author}, {c.quote.role}</figcaption>
            </figure>

            <p className="rounded-xl border border-[--color-border] bg-[--color-base-2] p-4 text-xs text-[--color-ink-faint]">{REPRESENTATIVE_DISCLOSURE}</p>
          </div>

          <aside className="h-fit space-y-4">
            <div className="rounded-2xl border border-[--color-border-bright] bg-[--color-surface] p-6">
              <h3 className="font-semibold">Want results like these?</h3>
              <p className="mt-2 text-sm text-[--color-ink-dim]">Get a free audit of your accounts and a realistic projection for your business.</p>
              <Button href="/contact" className="mt-5 w-full">Get a free audit <ArrowRight size={16} /></Button>
            </div>
            <Link href={`/industries/${c.industrySlug}`} className="block rounded-2xl border border-[--color-border] bg-[--color-surface] p-6 transition-colors hover:border-[--color-cyan]">
              <p className="text-sm text-[--color-ink-faint]">Industry</p>
              <p className="mt-1 font-semibold text-[--color-cyan-bright]">{c.industry} marketing →</p>
            </Link>
          </aside>
        </div>
      </Section>

      <Section className="bg-[--color-base-2]">
        <SectionHeading align="left" eyebrow="More proof" title="Other case studies" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/results/${o.slug}`} className="group rounded-2xl border border-[--color-border] bg-[--color-surface] p-6 transition-all hover:-translate-y-1 hover:border-[--color-violet]">
              <div className="text-4xl font-bold text-gradient">{o.headlineMetric.value}</div>
              <p className="mt-1 text-sm text-[--color-ink-dim]">{o.headlineMetric.label}</p>
              <p className="mt-4 text-sm text-[--color-ink-faint]">{o.industry} · {o.location}</p>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBlock />
    </>
  );
}
