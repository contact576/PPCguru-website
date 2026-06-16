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
    <section className="relative py-20 md:py-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-[--color-border-bright] bg-[--color-surface] px-8 py-16 text-center md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-80" />
          <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-violet)_25%,transparent)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold md:text-5xl text-balance">{title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-[--color-ink-dim]">{intro}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button href={siteConfig.cta.primaryHref} size="lg">
                {siteConfig.cta.primaryLabel} <ArrowRight size={18} />
              </Button>
              <Button href="/tools/google-ads-calculator" size="lg" variant="outline">
                Try the ROI calculator
              </Button>
            </div>
            <p className="mt-6 text-sm text-[--color-ink-faint]">
              No long-term contracts · You keep ownership of your accounts
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
