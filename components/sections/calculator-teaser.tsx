import { Calculator, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CalculatorTeaser() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-lime)] p-8 md:p-14">
        <div className="pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white/40 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>Free interactive tool</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl text-balance">
              See what your budget could earn — by industry
            </h2>
            <p className="mt-4 max-w-xl text-[var(--color-ink-dim)]">
              Pick your industry, platform and monthly budget. Our calculator uses real
              2024–2025 industry benchmarks to estimate your clicks, leads, cost per lead
              and projected revenue — so you can see if you&apos;re getting optimal results.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Button href="/tools/google-ads-calculator" size="lg">
                Google Ads calculator <ArrowRight size={18} />
              </Button>
              <Button href="/tools/meta-ads-calculator" size="lg" variant="outline">
                Meta Ads calculator
              </Button>
            </div>
          </div>
          {/* Compact sample-projection card so the block reads as the tool, not a lone icon. */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-tile">
              <div className="flex items-center gap-2 text-[var(--color-ink-faint)]">
                <Calculator size={16} /> <span className="font-mono text-[11px] uppercase tracking-wide">Sample · HVAC · $3,000/mo</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Est. clicks", value: "310" },
                  { label: "Est. leads", value: "20" },
                  { label: "Projected revenue", value: "$44.7k", strong: true },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 last:border-0 last:pb-0">
                    <span className="text-sm text-[var(--color-ink-dim)]">{r.label}</span>
                    <span className={r.strong ? "text-xl font-extrabold text-gradient" : "text-lg font-bold text-[var(--color-ink)]"}>{r.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-[var(--color-ink-faint)]">Illustrative — run the calculator for your numbers.</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
