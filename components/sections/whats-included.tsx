import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const deliverables = [
  "Weekly optimization summary",
  "Monthly strategy review",
  "Budget reallocation notes",
  "Search-term waste report",
  "Conversion-tracking health check",
  "Landing-page recommendations",
];

const included = [
  "Account audit", "Keyword research", "Search-term review", "Negative keyword buildout",
  "Campaign restructuring", "Ad copy testing", "Conversion tracking review", "GA4 / GTM support",
  "Landing-page recommendations", "Remarketing setup", "Weekly optimization", "Monthly reporting",
  "Budget allocation review", "Competitor review", "Quality Score guidance", "Call / form tracking",
];

export function WhatsIncluded() {
  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Transparent reporting"
        title={<>No agency <span className="text-gradient">black box</span></>}
        intro="You should never have to guess what your agency did this month. Here's what you get, and what's included."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Deliverables / dashboard */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-7">
          <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">You receive, on a clear cadence</p>
          <ul className="mt-4 space-y-3">
            {deliverables.map((d) => (
              <li key={d} className="flex items-center gap-3 font-medium text-[var(--color-ink)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-orange)_16%,transparent)] text-[var(--color-orange-deep)]"><Check size={13} /></span>
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-5">
            {["Spend", "Leads", "Cost / lead", "Conv. rate", "ROAS", "Wasted spend"].map((m) => (
              <div key={m} className="rounded-xl bg-[var(--color-surface-2)] px-3 py-2.5 text-center">
                <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-ink-faint)]">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Included checklist */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-7">
          <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">What management includes</p>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {included.map((i) => (
              <span key={i} className="flex items-center gap-2.5 text-sm text-[var(--color-ink-dim)]">
                <Check size={15} className="shrink-0 text-[var(--color-success)]" /> {i}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
