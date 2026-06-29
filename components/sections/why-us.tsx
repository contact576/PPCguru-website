import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { differentiators } from "@/lib/data/company";

export function WhyUs() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why PPC Guru"
        title={<>Built different, on <span className="text-gradient">purpose</span></>}
        intro="Most agencies hide behind vanity metrics. We tie everything back to leads, booked jobs and revenue."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {differentiators.map((d, i) => (
          <Reveal key={d.title} delay={(i % 3) * 0.05}>
            <div className="flex h-full gap-4 rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-ink)] hover:shadow-tile">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-ink)] text-[var(--color-lime)]">
                <Check size={16} />
              </span>
              <div>
                <h3 className="head text-[17px] text-[var(--color-ink)]">{d.title}</h3>
                <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{d.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
