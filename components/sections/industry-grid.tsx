import Link from "next/link";
import {
  ArrowUpRight, Activity, HeartPulse, Smile, Wind, Droplets, Zap, Hammer,
  Home, Plane, Scale, Building2, Wrench, Dumbbell, Sparkles, Briefcase, type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/interactive";
import { industries } from "@/lib/data/industries";

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
            <SpotlightCard className="h-full rounded-[18px] border border-[#e3e0d0] bg-white">
              <Link
                href={`/industries/${ind.slug}`}
                className="group flex h-full flex-col gap-3 rounded-[18px] p-6"
              >
                <div className="flex items-start justify-between">
                  {(() => {
                    const Icon = ICONS[ind.slug] ?? Briefcase;
                    return (
                      <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-[#eef2dd] text-[#5f6f17]">
                        <Icon size={21} strokeWidth={2} />
                      </span>
                    );
                  })()}
                  <ArrowUpRight size={18} className="text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-ink)]" />
                </div>
                <h3 className="head text-[16px] leading-tight text-[var(--color-ink)]">{ind.name}</h3>
                <p className="text-sm text-[var(--color-ink-dim)]">{ind.short}</p>
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
