import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { methodology } from "@/lib/data/company";

export function ProcessSteps() {
  return (
    <Section className="bg-[--color-base-2]">
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
              <div className="relative flex h-full flex-col gap-4 rounded-2xl border border-[--color-border] bg-[--color-surface] p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-bold text-[color-mix(in_srgb,var(--color-violet)_45%,transparent)]">
                    {s.step}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-cyan)_16%,transparent)] text-[--color-cyan-bright]">
                    <Icon size={20} />
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-[--color-ink-dim]">{s.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
