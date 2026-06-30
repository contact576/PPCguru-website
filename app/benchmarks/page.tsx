import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBlock } from "@/components/sections/cta-block";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
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
      />

      <Section>
        <SectionHeading
          align="left"
          eyebrow="By the numbers"
          title={<>Benchmark <span className="text-gradient">reference table</span></>}
          intro="Cost-per-lead = cost-per-click ÷ conversion rate. Cost-per-customer = cost-per-lead ÷ close rate. Use these as starting points; your real numbers depend on offer, location and landing page."
        />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="mono py-3 pr-4 text-[11px] uppercase tracking-[.05em] text-[var(--color-ink-faint)]">Industry</th>
                <th className="mono px-3 py-3 text-[11px] uppercase tracking-[.05em] text-[var(--color-ink-faint)]">Avg CPC</th>
                <th className="mono px-3 py-3 text-[11px] uppercase tracking-[.05em] text-[var(--color-ink-faint)]">Conv. rate</th>
                <th className="mono px-3 py-3 text-[11px] uppercase tracking-[.05em] text-[var(--color-ink-faint)]">Cost / lead</th>
                <th className="mono px-3 py-3 text-[11px] uppercase tracking-[.05em] text-[var(--color-ink-faint)]">Avg job value</th>
                <th className="mono px-3 py-3 text-[11px] uppercase tracking-[.05em] text-[var(--color-ink-faint)]">Close rate</th>
                <th className="mono py-3 pl-3 text-[11px] uppercase tracking-[.05em] text-[var(--color-ink-faint)]">Cost / customer</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-[var(--color-border)]">
                  <td className="py-3 pr-4 font-semibold text-[var(--color-ink)]">{r.label}</td>
                  <td className="px-3 py-3 text-[var(--color-ink-dim)]">{usd(r.cpc)}</td>
                  <td className="px-3 py-3 text-[var(--color-ink-dim)]">{pct(r.cvr)}</td>
                  <td className="px-3 py-3 font-medium text-[var(--color-ink)]">{usd(r.cpl)}</td>
                  <td className="px-3 py-3 text-[var(--color-ink-dim)]">{usd(r.ticket)}</td>
                  <td className="px-3 py-3 text-[var(--color-ink-dim)]">{pct(r.close)}</td>
                  <td className="py-3 pl-3 font-medium text-[var(--color-ink)]">{usd(r.cpa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
