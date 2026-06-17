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
      />
      <div className="mt-14 columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={(i % 3) * 0.05}>
            <figure className="break-inside-avoid rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
              <Quote size={22} className="text-[var(--color-violet-bright)]" />
              <blockquote className="mt-4 text-[var(--color-ink)]">{t.quote}</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-[var(--color-ink)]">{t.author}</span>
                <span className="block text-[var(--color-ink-faint)]">{t.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-[var(--color-ink-faint)]">
        Representative feedback, anonymized. To be replaced with verified, consented client testimonials before launch.
      </p>
    </Section>
  );
}
