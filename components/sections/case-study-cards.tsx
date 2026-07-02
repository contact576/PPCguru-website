import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/interactive";
import { StatCounter } from "@/components/ui/stat-counter";
import { caseStudies, type CaseStudy } from "@/lib/data/case-studies";

/**
 * Compact, horizontal-scroll strip of slim result cards — big count-up metric,
 * industry, one-line result, link. Far shorter than the old 3-col box grid
 * (keeps mobile pages short) and reads as an interactive, swipeable row.
 */
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
          align="left"
          eyebrow="Proof"
          title={<>Results that show up in the <span className="text-gradient">bank account</span></>}
          intro="Representative engagements showing how we turn spend into booked jobs. (Anonymized — individual results vary.)"
        />
      ) : null}
      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
        {list.map((c) => (
          <SpotlightCard key={c.slug} className="w-[230px] shrink-0 snap-start rounded-[18px] border border-[#dddbc9] bg-[#fbfaf2] transition-colors duration-300 hover:border-[var(--color-ink)]">
            <Link href={`/results/${c.slug}`} className="group flex h-full flex-col rounded-[18px] p-5">
              <div className="flex items-center justify-between">
                <span className="mono rounded-[6px] bg-[var(--color-lime)] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[.04em] text-[var(--color-ink)]">{c.industry}</span>
                <span className="mono text-[9.5px] tracking-[.03em] text-[var(--color-ink-faint)]">{c.location}</span>
              </div>
              <div className="head mt-3 text-[38px] leading-none text-[var(--color-ink)]"><StatCounter value={c.headlineMetric.value} /></div>
              <p className="mono mt-1 text-[10.5px] uppercase leading-tight tracking-[.03em] text-[var(--color-ink-dim)]">{c.headlineMetric.label}</p>
              <p className="mt-3 flex-1 text-[12.5px] leading-snug text-[var(--color-ink-dim)]">{c.client} · {c.service}</p>
              <span className="mono mt-3 flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[.05em] text-[var(--color-ink)]">
                Read <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
