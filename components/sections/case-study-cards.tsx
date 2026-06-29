import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/interactive";
import { caseStudies, type CaseStudy } from "@/lib/data/case-studies";

export function CaseStudyCards({
  heading = true,
  limit,
  items,
  tone = "white",
}: {
  heading?: boolean;
  limit?: number;
  items?: CaseStudy[];
  tone?: "white" | "coral" | "soft";
}) {
  const list = items ?? (limit ? caseStudies.slice(0, limit) : caseStudies);
  return (
    <Section id="results" tone={tone}>
      {heading ? (
        <SectionHeading
          eyebrow="Proof"
          title={<>Results that show up in the <span className="text-gradient">bank account</span></>}
          intro="Representative engagements showing how we turn spend into booked jobs. (Anonymized — individual results vary.)"
        />
      ) : null}
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 0.06}>
            <SpotlightCard className="h-full rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] transition-colors duration-300 hover:border-[var(--color-ink)]">
            <Link
              href={`/results/${c.slug}`}
              className="group flex h-full flex-col rounded-[22px] p-7"
            >
              <div className="flex items-center justify-between">
                <span className="mono rounded-[7px] bg-[var(--color-lime)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.05em] text-[var(--color-ink)]">{c.industry}</span>
                <span className="mono text-[10px] tracking-[.04em] text-[var(--color-ink-faint)]">{c.location}</span>
              </div>
              <div className="mt-5">
                <div className="head text-[46px] text-[var(--color-ink)]">{c.headlineMetric.value}</div>
                <p className="mono mt-1 text-[11.5px] uppercase tracking-[.04em] text-[var(--color-ink-dim)]">{c.headlineMetric.label}</p>
              </div>
              <p className="mt-5 flex-1 text-sm text-[var(--color-ink-dim)]">{c.client} · {c.service}</p>
              <div className="mono mt-5 flex items-center gap-1.5 border-t border-[#e3e1d2] pt-4 text-[11px] font-bold uppercase tracking-[.05em] text-[var(--color-ink)]">
                Read the case study
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
