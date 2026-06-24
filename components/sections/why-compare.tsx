import { Check, X } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const problems = [
  "You only see reports after the money is already spent",
  "Campaigns optimized for clicks, not revenue",
  "Landing pages and conversion paths ignored",
  "Tracking is unclear, broken, or untrusted",
  "Long contracts before any trust is earned",
  "No clear explanation of what changed and why",
];

const theWay = [
  "Weekly action summaries — see what changed every week",
  "Optimization around leads, CAC, ROAS and sales",
  "Landing-page and CRO recommendations included",
  "GA4 / GTM / conversion-tracking review built in",
  "No long-term lock-in",
  "Clear reporting — and you own your account and data",
];

export function WhyCompare() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why PPC Guru"
        title={<>Most agencies keep you in the <span className="text-gradient">dark</span></>}
        intro="The difference isn't just better bidding — it's transparency, ownership, and optimizing for revenue instead of vanity clicks."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-7 md:p-8">
          <h3 className="text-xl font-bold text-[var(--color-ink)]">Typical agency problems</h3>
          <ul className="mt-5 space-y-3.5">
            {problems.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[var(--color-ink-dim)]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-danger)_15%,transparent)] text-[var(--color-danger)]"><X size={13} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[var(--radius-lg)] border-2 border-[var(--color-orange)] bg-[var(--color-surface)] p-7 shadow-tile md:p-8">
          <h3 className="text-xl font-bold text-[var(--color-ink)]">The PPC Guru way</h3>
          <ul className="mt-5 space-y-3.5">
            {theWay.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[var(--color-ink)]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]"><Check size={13} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
