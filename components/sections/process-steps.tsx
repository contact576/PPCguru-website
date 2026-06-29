import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { methodology } from "@/lib/data/company";

export function ProcessSteps() {
  return (
    <Section tone="cream">
      <SectionHeading
        eyebrow="How it works"
        title={<>{methodology.name}</>}
        intro="A simple, repeatable loop that compounds results month over month — powered by our AI-augmented workflow."
      />
      <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {methodology.steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.step} delay={i * 0.08}>
              <div className="relative flex h-full flex-col gap-4 rounded-[22px] border border-[var(--color-border)] bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-ink)] hover:shadow-tile">
                <div className="flex items-center justify-between">
                  <span className="head text-[42px]" style={{ color: "rgba(111,125,34,.3)" }}>
                    {s.step}
                  </span>
                  <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#eef2dd] text-[#5f6f17]">
                    <Icon size={21} />
                  </span>
                </div>
                <h3 className="head text-[19px]">{s.title}</h3>
                <p className="text-sm text-[var(--color-ink-dim)]">{s.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
