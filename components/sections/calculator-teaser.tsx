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
          <div className="hidden justify-center lg:flex">
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-[color-mix(in_srgb,var(--color-violet)_14%,transparent)] text-[var(--color-violet-bright)]">
              <Calculator size={72} strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
