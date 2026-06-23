import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
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
            <Link
              href={`/results/${c.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-violet)]"
            >
              <div className="flex items-center gap-2 text-xs text-[var(--color-ink-faint)]">
                <span>{c.industry}</span>
                <span>·</span>
                <span>{c.location}</span>
              </div>
              <div className="mt-5">
                <div className="text-5xl font-bold text-gradient">{c.headlineMetric.value}</div>
                <p className="mt-1 text-sm text-[var(--color-ink-dim)]">{c.headlineMetric.label}</p>
              </div>
              <p className="mt-5 flex-1 text-sm text-[var(--color-ink-dim)]">{c.client} · {c.service}</p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[var(--color-cyan-bright)]">
                Read the case study
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
