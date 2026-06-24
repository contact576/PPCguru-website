import { Check, ArrowRight, Clock } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

const included = [
  "Full account audit + tracking check",
  "Wasted-spend & search-term review",
  "Campaign rebuild recommendations",
  "Weekly optimization notes",
  "Short-term growth roadmap",
  "No long-term lock-in",
];

/**
 * Prominent one-month trial offer. The 30-Day PPC Growth Sprint is a real,
 * client-confirmed offer. Scope/terms kept honest — no guarantees.
 */
export function TrialOffer() {
  return (
    <Section tone="coral">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <span className="eyebrow inline-flex items-center gap-2 text-[var(--color-ink)]">
            <Clock size={14} className="text-[var(--color-orange-deep)]" /> 30-Day PPC Growth Sprint
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl text-balance">
            Try PPC Guru for one month <span className="text-gradient">before you commit</span>
          </h2>
          <p className="mt-5 text-lg text-[var(--color-ink-dim)]">
            Start with a focused 30-day sprint: we audit your account, fix the obvious leaks,
            and show you a clear plan — so you can judge us on results, not promises.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/contact" size="lg" variant="accent">
              Claim the 30-Day Trial <ArrowRight size={18} />
            </Button>
            <Button href="#waste-audit" size="lg" variant="outline">Run the free audit first</Button>
          </div>
          <p className="mt-5 max-w-lg text-xs text-[var(--color-ink-dim)]">
            Trial does not include ad spend. Final scope is confirmed after an account review.
            Results vary by industry, budget, tracking quality and offer strength.
            {/* [VERIFY]: Confirm final 30-Day Growth Sprint terms, pricing and any refund policy before launch. */}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-tile md:p-8">
          <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">What&apos;s in the sprint</p>
          <ul className="mt-4 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[var(--color-ink)]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]">
                  <Check size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
