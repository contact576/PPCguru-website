import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function CtaBlock({
  title = "Find out what your ad budget could be doing.",
  intro = "Get a free, no-obligation audit of your Google Ads, Meta Ads and tracking. We'll show you exactly where the opportunity is.",
}: {
  title?: string;
  intro?: string;
}) {
  return (
    <section className="py-6 md:py-10">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-navy)] px-8 py-16 text-center md:px-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--color-orange)] opacity-30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white md:text-5xl text-balance">{title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">{intro}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button href={siteConfig.cta.primaryHref} size="lg" variant="accent">
                {siteConfig.cta.primaryLabel} <ArrowRight size={18} />
              </Button>
              <Button
                href="/tools/google-ads-calculator"
                size="lg"
                className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
              >
                Try the ROI calculator
              </Button>
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-white/60">
              No long-term contracts · You keep ownership of your accounts
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
