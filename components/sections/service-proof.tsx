import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/interactive";
import { AnimatedStat } from "@/components/ui/animated-stat";
import { getCaseStudies, REPRESENTATIVE_DISCLOSURE } from "@/lib/data/case-studies";

/**
 * Proof block for a service page: a representative "what good looks like" stat
 * band plus curated, real (anonymized) case-study cards. All numbers are
 * representative — the disclosure makes that explicit per FTC/Competition-Bureau
 * guidance. [VERIFY] swap for consented client results before launch.
 */
export function ServiceProof({
  serviceName,
  proofStats,
  caseStudySlugs,
}: {
  serviceName: string;
  proofStats: { value: string; label: string }[];
  caseStudySlugs: string[];
}) {
  const studies = getCaseStudies(caseStudySlugs);

  return (
    <Section id="results">
      <SectionHeading
        align="left"
        eyebrow="Proof"
        title={<>Results that show up in the <span className="text-gradient">bank account</span></>}
        intro={`What good looks like when we run ${serviceName.toLowerCase()} — and representative engagements that got there.`}
      />

      {/* "What good looks like" — representative stat band */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {proofStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <SpotlightCard className="h-full rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7">
              <div className="head text-[clamp(1.9rem,3.6vw,2.7rem)] leading-none text-[var(--color-ink)]"><AnimatedStat value={s.value} /></div>
              <p className="mono mt-3 text-[11px] uppercase leading-relaxed tracking-[.04em] text-[var(--color-ink-dim)]">{s.label}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      {/* Curated case-study cards */}
      {studies.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.06}>
              <Link
                href={`/results/${c.slug}`}
                className="group flex h-full flex-col rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-ink)] hover:shadow-tile"
              >
                <div className="flex items-center justify-between">
                  <span className="mono rounded-[7px] bg-[var(--color-lime)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.05em] text-[var(--color-ink)]">{c.industry}</span>
                  <span className="mono text-[10px] tracking-[.04em] text-[var(--color-ink-faint)]">{c.location}</span>
                </div>
                <div className="mt-5">
                  <div className="head text-[46px] leading-none text-[var(--color-ink)]"><AnimatedStat value={c.headlineMetric.value} /></div>
                  <p className="mono mt-1.5 text-[11.5px] uppercase tracking-[.04em] text-[var(--color-ink-dim)]">{c.headlineMetric.label}</p>
                </div>
                <p className="mt-5 flex-1 text-sm text-[var(--color-ink-dim)]">{c.client} · {c.service}</p>
                <div className="mono mt-5 flex items-center gap-1.5 border-t border-[#e3e1d2] pt-4 text-[11px] font-bold uppercase tracking-[.05em] text-[var(--color-ink)]">
                  Read the case study
                  <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-[var(--color-ink-faint)]">{REPRESENTATIVE_DISCLOSURE}</p>
    </Section>
  );
}
