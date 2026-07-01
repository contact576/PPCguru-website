import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { ResultsArt } from "@/components/illustrations/hero-art";
import { CtaBlock } from "@/components/sections/cta-block";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema, CONTENT_UPDATED_ISO } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { industryEconomics, BENCHMARK_SOURCES, BENCHMARK_DISCLAIMER } from "@/lib/data/benchmarks";

export const metadata: Metadata = buildMetadata({
  title: "Digital Marketing Benchmarks by Industry (Canada, 2024–2025)",
  description:
    "Typical Google Ads cost-per-click, lead conversion rate, cost-per-lead and cost-per-customer by industry for Canadian service businesses — sourced from WordStream/LocalIQ benchmarks.",
  path: "/benchmarks",
});

const usd = (n: number) => `$${n >= 100 ? Math.round(n).toLocaleString() : n.toFixed(2)}`;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const rows = [...industryEconomics]
  .filter((e) => e.slug !== "generic")
  .sort((a, b) => a.label.localeCompare(b.label))
  .map((e) => {
    const cpc = e.baseSearchCpc;
    const cvr = e.baseCvr;
    const cpl = cpc / cvr; // cost per lead = cost per click / lead conversion rate
    const cpa = cpl / e.closeRate; // cost per customer = CPL / close rate
    return { label: e.label, cpc, cvr, cpl, ticket: e.avgTicket, close: e.closeRate, cpa };
  });

const maxCpl = Math.max(...rows.map((r) => r.cpl));

const faqs = [
  {
    q: "What is a typical cost per lead for Google Ads in Canada?",
    a: "It varies widely by industry. A typical Canadian service business sees a Google Search cost-per-click around $2–$9 and a lead conversion rate around 5–9%, which puts cost-per-lead roughly in the $30–$150 range. High-value verticals like legal, financial and home services sit at the higher end. These are representative 2024–2025 benchmarks, not guarantees.",
  },
  {
    q: "How is cost per lead calculated?",
    a: "Cost per lead (CPL) = average cost per click ÷ lead conversion rate. For example, a $5 CPC at a 7% conversion rate gives a CPL of about $71. Cost per customer (CAC) then = CPL ÷ close rate — so a 30% close rate on that $71 CPL is roughly $238 per won customer.",
  },
  {
    q: "Are these benchmark numbers a guarantee of results?",
    a: "No. They are industry-average reference points (sourced from WordStream/LocalIQ 2024–2025 and corroborating sources) to help set expectations. Real results depend on your offer, location, landing page, season, budget and competition. PPC Guru reports against your actual numbers, not averages.",
  },
];

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Canadian digital marketing benchmarks by industry (2024–2025)",
  description:
    "Average Google Ads cost-per-click, lead conversion rate, cost-per-lead, average customer value, close rate and cost-per-customer across ~35 service-business industries in Canada.",
  creator: { "@id": `${siteConfig.url}/#organization` },
  isAccessibleForFree: true,
  license: "https://creativecommons.org/licenses/by/4.0/",
  url: `${siteConfig.url}/benchmarks`,
  dateModified: CONTENT_UPDATED_ISO,
  temporalCoverage: "2024/2025",
  spatialCoverage: "Canada",
  variableMeasured: ["Cost per click", "Lead conversion rate", "Cost per lead", "Average customer value", "Close rate", "Cost per customer"],
};

export default function BenchmarksPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Benchmarks", path: "/benchmarks" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={datasetSchema} />
      <PageHero
        eyebrow="Industry benchmarks"
        title={<>Digital marketing benchmarks by <span className="text-gradient">industry</span></>}
        intro="Typical Google Ads cost-per-click, lead conversion rate, cost-per-lead and cost-per-customer for Canadian service businesses — a free, sourced reference set you can use to sanity-check your own numbers. All figures are 2024–2025 industry averages, not guarantees."
        breadcrumbs={crumbs}
        art={<ResultsArt />}
      />

      <Section>
        <SectionHeading
          align="left"
          eyebrow="By the numbers"
          title={<>Benchmark <span className="text-gradient">reference table</span></>}
          intro="Cost-per-lead = cost-per-click ÷ conversion rate. Cost-per-customer = cost-per-lead ÷ close rate. Use these as starting points; your real numbers depend on offer, location and landing page."
        />
        <div className="mt-8 overflow-hidden rounded-[18px] border border-[var(--color-border)]">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">Typical Google Ads cost-per-click, conversion rate, cost-per-lead, average job value, close rate and cost-per-customer by industry for Canadian service businesses, 2024–2025.</caption>
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-navy-ink)]">
                <th scope="col" className="mono py-3.5 pl-5 pr-4 text-[10.5px] uppercase tracking-[.05em]">Industry</th>
                <th scope="col" className="mono px-3 py-3.5 text-[10.5px] uppercase tracking-[.05em]">Avg CPC</th>
                <th scope="col" className="mono px-3 py-3.5 text-[10.5px] uppercase tracking-[.05em]">Conv. rate</th>
                <th scope="col" className="mono px-3 py-3.5 text-[10.5px] uppercase tracking-[.05em]">Cost / lead</th>
                <th scope="col" className="mono px-3 py-3.5 text-[10.5px] uppercase tracking-[.05em]">Avg job value</th>
                <th scope="col" className="mono px-3 py-3.5 text-[10.5px] uppercase tracking-[.05em]">Close rate</th>
                <th scope="col" className="mono py-3.5 pr-5 pl-3 text-[10.5px] uppercase tracking-[.05em]">Cost / customer</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-[var(--color-border)] transition-colors odd:bg-[#faf9f0] hover:bg-[var(--color-base-2)]">
                  <th scope="row" className="py-3 pl-5 pr-4 text-left font-semibold text-[var(--color-ink)]">{r.label}</th>
                  <td className="px-3 py-3 text-[var(--color-ink-dim)]">{usd(r.cpc)}</td>
                  <td className="px-3 py-3 text-[var(--color-ink-dim)]">{pct(r.cvr)}</td>
                  <td className="px-3 py-3 font-medium text-[var(--color-ink)]">
                    <span className="tabular-nums">{usd(r.cpl)}</span>
                    <span aria-hidden className="mt-1 block h-1.5 rounded-full bg-[var(--color-lime)]" style={{ width: `${Math.max(8, Math.round((r.cpl / maxCpl) * 100))}%` }} />
                  </td>
                  <td className="px-3 py-3 text-[var(--color-ink-dim)]">{usd(r.ticket)}</td>
                  <td className="px-3 py-3 text-[var(--color-ink-dim)]">{pct(r.close)}</td>
                  <td className="py-3 pr-5 pl-3 font-medium text-[var(--color-ink)]">{usd(r.cpa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        <div className="mt-6 space-y-1.5">
          <p className="text-xs text-[var(--color-ink-faint)]">{BENCHMARK_DISCLAIMER}</p>
          <p className="text-xs text-[var(--color-ink-faint)]">Sources: {BENCHMARK_SOURCES.join(" · ")}.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tools/google-ads-calculator" className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-5 py-2.5 text-xs uppercase tracking-[.05em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">Model your own numbers →</Link>
          <Link href="/services/google-ads" className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-5 py-2.5 text-xs uppercase tracking-[.05em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">Google Ads management →</Link>
        </div>
      </Section>

      <FaqAccordion faqs={faqs} title="Benchmark questions, answered" />
      <CtaBlock title="Want your real numbers, not averages?" />
    </>
  );
}
