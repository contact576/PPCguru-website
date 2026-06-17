import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { industries } from "@/lib/data/industries";

const ACCENTS = [
  "var(--color-lime)", "var(--color-lilac)", "var(--color-coral)",
  "var(--color-mint)", "var(--color-pink)", "var(--color-cream)",
];

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
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ind, i) => (
          <Reveal key={ind.slug} delay={(i % 6) * 0.04}>
            <Link
              href={`/industries/${ind.slug}`}
              className="group flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-tile"
            >
              <div className="flex items-start justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-bold text-[var(--color-ink)]"
                  style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight size={18} className="text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-orange)]" />
              </div>
              <h3 className="text-lg font-bold leading-snug text-[var(--color-ink)]">{ind.name}</h3>
              <p className="text-sm text-[var(--color-ink-dim)]">{ind.short}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
