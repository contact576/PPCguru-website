import Link from "next/link";
import {
  ArrowUpRight, Activity, HeartPulse, Smile, Wind, Droplets, Zap, Hammer,
  Home, Plane, Scale, Building2, Wrench, Dumbbell, Sparkles, Briefcase, type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { industries } from "@/lib/data/industries";

const ACCENTS = [
  "var(--color-lime)", "var(--color-lilac)", "var(--color-coral)",
  "var(--color-mint)", "var(--color-pink)", "var(--color-cream)",
];

// A per-industry icon encodes meaning (the vertical), unlike a decorative 01/02/03 number.
const ICONS: Record<string, LucideIcon> = {
  physiotherapy: Activity,
  "healthcare-clinics": HeartPulse,
  dental: Smile,
  hvac: Wind,
  plumbing: Droplets,
  electrical: Zap,
  "construction-renovation": Hammer,
  roofing: Home,
  immigration: Plane,
  "law-firms": Scale,
  "real-estate": Building2,
  "home-improvement": Wrench,
  "fitness-gyms": Dumbbell,
  "med-spa": Sparkles,
  "professional-services": Briefcase,
};

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
                {(() => {
                  const Icon = ICONS[ind.slug] ?? Briefcase;
                  return (
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--color-ink)]"
                      style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </span>
                  );
                })()}
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
