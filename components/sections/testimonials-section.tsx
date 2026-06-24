import { Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialsSection() {
  return (
    <Section tone="mint">
      <SectionHeading
        eyebrow="In their words"
        title={<>What working with us <span className="text-gradient">feels like</span></>}
        intro="Representative feedback from the kind of service businesses we partner with."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={(i % 3) * 0.05}>
            <figure className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-tile">
              <Quote size={22} className="text-[var(--color-orange)]" />
              <blockquote className="mt-4 flex-1 text-[var(--color-ink)]">{t.quote}</blockquote>
              <figcaption className="mt-6 border-t border-[var(--color-border)] pt-4 text-sm">
                <span className="font-semibold text-[var(--color-ink)]">{t.author}</span>
                <span className="block text-[var(--color-ink-faint)]">{t.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-dim)]">
        Representative feedback, anonymized · replace with verified client testimonials before launch
      </p>
    </Section>
  );
}
