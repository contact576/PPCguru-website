import { Section, SectionHeading } from "@/components/ui/section";
import { StepFlow } from "@/components/ui/layout";
import { methodology } from "@/lib/data/company";

export function ProcessSteps() {
  return (
    <Section tone="cream">
      <SectionHeading
        eyebrow="How it works"
        title={<>{methodology.name}</>}
        intro="A simple, repeatable loop that compounds results month over month — powered by our AI-augmented workflow."
      />
      <StepFlow steps={methodology.steps.map((s) => ({ step: s.step, title: s.title, body: s.body, icon: s.icon }))} />
    </Section>
  );
}
