import { Check, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

/*
  Pricing guidance — ranges/structure only, not a quote.
  [VERIFY]: Confirm real management-fee ranges and trial pricing before launch.
*/
const tiers = [
  {
    name: "Starter Audit",
    price: "Free",
    sub: "For accounts that need clarity before scaling",
    features: ["Account & tracking audit", "Wasted-spend review", "Prioritized fix list", "Clear next steps"],
    cta: { label: "Get free audit", href: "/contact" },
    featured: false,
  },
  {
    name: "Growth Management",
    price: "Custom",
    sub: "For businesses with a consistent monthly ad budget",
    features: ["Google Ads management", "Weekly optimization", "Conversion tracking review", "Monthly reporting & strategy", "Landing-page recommendations"],
    cta: { label: "Start a 30-Day Sprint", href: "/contact" },
    featured: true,
  },
  {
    name: "Scale Partner",
    price: "Custom",
    sub: "For multi-channel paid media + CRO",
    features: ["Google + Meta paid media", "Remarketing & full-funnel", "Landing-page testing / CRO", "Analytics & dashboards", "Dedicated account manager"],
    cta: { label: "Talk to us", href: "/contact" },
    featured: false,
  },
];

export function PricingGuidance() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Pricing"
        title={<>Built around your budget, not <span className="text-gradient">agency guesswork</span></>}
        intro="Management fees depend on account complexity, channels, tracking and goals. Here's the structure — your exact scope is confirmed after a review."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`flex h-full flex-col rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-7 ${t.featured ? "border-2 border-[var(--color-orange)] shadow-tile" : "border-[var(--color-border)]"}`}
          >
            {t.featured && <span className="mb-3 inline-block w-fit rounded-full bg-[var(--color-orange)] px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-white">Most popular</span>}
            <h3 className="text-xl font-bold">{t.name}</h3>
            <p className="mt-3 text-3xl font-extrabold text-[var(--color-ink)]">
              {t.price}
              {t.price === "Custom" && <span className="ml-1 align-middle font-mono text-xs font-normal text-[var(--color-ink-faint)]">{/* [VERIFY]: add real fee range */}fee</span>}
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{t.sub}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--color-ink-dim)]">
                  <Check size={15} className="mt-0.5 shrink-0 text-[var(--color-success)]" /> {f}
                </li>
              ))}
            </ul>
            <Button href={t.cta.href} variant={t.featured ? "accent" : "outline"} className="mt-6 w-full">
              {t.cta.label} <ArrowRight size={16} />
            </Button>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-[var(--color-ink-faint)]">
        Ad spend is separate from management fees and paid directly to the ad platforms. Pricing depends on
        account complexity, channels, tracking setup, landing-page needs and growth goals.
      </p>
    </Section>
  );
}
