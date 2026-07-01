import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { ServicesArt } from "@/components/illustrations/hero-art";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { comparisons } from "@/lib/data/comparisons";

export const metadata: Metadata = buildMetadata({
  title: "Compare: Google Ads vs Meta, Agency vs In-House, PPC vs SEO",
  description:
    "Straight answers to the marketing decisions service businesses agonise over — Google Ads vs Meta Ads, hiring an agency vs in-house vs DIY, and PPC vs SEO. Honest verdicts, side-by-side tables.",
  path: "/compare",
});

export default function ComparePage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Compare", path: "/compare" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={faqSchema(comparisons.map((c) => ({ q: c.question, a: c.verdict })))} />

      <PageHero
        eyebrow="Compare"
        title={<>Straight answers to the <span className="text-gradient">tough marketing calls</span></>}
        intro="Google Ads or Meta? Hire an agency, build in-house, or DIY? PPC or SEO? Here's how we'd actually advise a Canadian service business — no sales spin, just the trade-offs."
        breadcrumbs={crumbs}
        art={<ServicesArt />}
      />

      {comparisons.map((c, i) => (
        <Section key={c.slug} id={c.slug} tone={i % 2 === 1 ? "cream" : undefined}>
          <SectionHeading align="left" eyebrow={c.title} title={c.question} />
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-[var(--color-ink-dim)]">{c.verdict}</p>

          <div className="mt-8 overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">{c.title} comparison</caption>
              <thead>
                <tr className="bg-[var(--color-ink)] text-[var(--color-navy-ink)]">
                  <th scope="col" className="mono py-3.5 pl-5 pr-4 text-[10.5px] uppercase tracking-[.05em]">What matters</th>
                  {c.headers.map((h, j) => (
                    <th key={h} scope="col" className={`mono px-4 py-3.5 text-[10.5px] uppercase tracking-[.05em] ${j === 0 ? "text-[var(--color-lime)]" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr key={r.dimension} className="border-b border-[var(--color-border)] align-top transition-colors odd:bg-[#faf9f0] hover:bg-[var(--color-base-2)]">
                    <th scope="row" className="py-4 pl-5 pr-4 text-left text-sm font-semibold text-[var(--color-ink)]">{r.dimension}</th>
                    {r.cells.map((cell, j) => (
                      <td key={j} className={`px-4 py-4 ${j === 0 ? "font-medium text-[var(--color-ink)]" : "text-[var(--color-ink-dim)]"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className="mt-7 rounded-[16px] border border-[#cfe39a] bg-[#eef2dd] p-5">
            <p className="mono text-[11px] font-bold uppercase tracking-[.08em] text-[#5f6f17]">Bottom line</p>
            <p className="mt-2 text-[15px] text-[var(--color-ink)]">{c.bottomLine}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {c.related.map((r) => (
              <Link key={r.href} href={r.href} className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-5 py-2.5 text-xs uppercase tracking-[.05em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">{r.label} →</Link>
            ))}
          </div>
        </Section>
      ))}

      <CtaBlock title="Still not sure what's right for you?" intro="Book a free, no-pressure audit. We'll look at your situation and tell you honestly where your next dollar is best spent — even if that's not with us." />
    </>
  );
}
