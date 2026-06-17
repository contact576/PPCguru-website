import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { industries } from "@/lib/data/industries";

export function IndustryGrid({ heading = true, limit }: { heading?: boolean; limit?: number }) {
  const list = limit ? industries.slice(0, limit) : industries;
  return (
    <Section id="industries" tone="soft">
      {heading ? (
        <SectionHeading
          eyebrow="Who we help"
          title={<>Deep expertise in <span className="text-gradient">local service verticals</span></>}
          intro="We build repeatable playbooks for the industries we know best — niche depth beats generalist agencies for local lead-gen."
        />
      ) : null}
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ind, i) => (
          <Reveal key={ind.slug} delay={(i % 6) * 0.04}>
            <Link
              href={`/industries/${ind.slug}`}
              className="group flex h-full flex-col gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-cyan)] hover:bg-[var(--color-surface-2)]"
            >
              <h3 className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-cyan-bright)]">{ind.name}</h3>
              <p className="text-sm text-[var(--color-ink-dim)]">{ind.short}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
