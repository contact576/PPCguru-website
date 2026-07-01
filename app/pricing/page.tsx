import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { ToolsArt } from "@/components/illustrations/hero-art";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { LeadBand } from "@/components/sections/lead-band";
import { CtaBlock } from "@/components/sections/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — How PPC Guru Charges (Transparent & Honest)",
  description:
    "How marketing-agency pricing actually works, and how PPC Guru charges: your ad spend is separate and 100% yours, our fee is based on scope, and we work month-to-month with no lock-in.",
  path: "/pricing",
});

// The three common fee models (educational — helps prospects evaluate any agency, not just us).
const models = [
  ["Percentage of ad spend", "Most agencies charge 10–20% of your monthly ad budget. Simple, but the agency earns more when you spend more — the incentives aren't always aligned with efficiency."],
  ["Flat monthly retainer", "A fixed fee based on the scope of work, regardless of spend. Predictable, and the agency is paid to make your budget efficient, not just bigger."],
  ["Performance-based", "Part of the fee is tied to results (leads or revenue). Appealing, but only fair when attribution and tracking are airtight — otherwise it rewards the wrong things."],
];

const included = [
  "A senior strategist who actually runs your account",
  "Full account & tracking audit before we scale",
  "GA4 / GTM / conversion-tracking setup and upkeep",
  "Daily/weekly optimization, not monthly check-ins",
  "Weekly reporting tied to leads, booked jobs and revenue",
  "AI-augmented creative & keyword testing",
];

const principles = [
  ["100% of ad spend is yours", "Your ad budget is paid straight to Google/Meta from your own account. Our fee is separate and never skims your spend."],
  ["You own everything", "Your ad accounts, data, history and billing stay in your name — even if we part ways."],
  ["Month-to-month", "No long-term contracts. We earn the relationship with results, not lock-in clauses."],
  ["No surprises", "We confirm your exact scope and fee after a free review, in writing. No hidden charges."],
];

const faqs = [
  { q: "How much does PPC management cost?", a: "It depends on scope — your budget, how many channels and locations you run, account complexity and creative needs. After a free audit we give you an exact fee in writing, so there are no surprises. Most agencies fall between a flat retainer and 10–20% of ad spend; we confirm yours based on the actual work." },
  { q: "Do you charge a percentage of my ad spend?", a: "We price around the scope of work rather than skimming your budget, so our incentives are to make your spend efficient — not just bigger. Whichever structure fits your situation, it's agreed in writing before we start. [VERIFY-client]: confirm the exact model + any starting fee here before launch." },
  { q: "Is ad spend included in your fee?", a: "No. Ad spend is separate and paid directly to the ad platforms from your own account — 100% of it goes to media. Our management fee covers strategy, campaign management, optimization and reporting." },
  { q: "Is there a setup fee?", a: "Onboarding (audit, tracking setup, account rebuild) is scoped up front and confirmed in writing. We'll tell you exactly what's involved before you commit — no surprise charges later." },
  { q: "Do you require a long-term contract?", a: "No. We work month-to-month. You can pause or leave with notice and keep full ownership of your accounts and data either way." },
  { q: "What's the minimum budget you work with?", a: "We work best with businesses spending at least a few thousand dollars a month on ads, because that's where there's enough data to optimize meaningfully. SEO, web and CRO engagements are scoped separately. Not sure? The free audit will tell you honestly whether paid ads are worth it yet for your business." },
];

export default function PricingPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Pricing"
        title={<>Transparent pricing, <span className="text-gradient">no games</span></>}
        intro="The fastest way to spot a risky agency is one that won't talk about money. Here's exactly how marketing-agency pricing works — and how we charge — before you ever get on a call."
        breadcrumbs={crumbs}
        art={<ToolsArt />}
      />

      {/* Core principles */}
      <Section className="!pb-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {principles.map(([t, b]) => (
            <div key={t} className="h-full rounded-[18px] border border-[#dddbc9] bg-[#fbfaf2] p-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--color-ink)] text-[var(--color-lime)] text-sm font-bold">✓</div>
              <p className="head text-[15px] text-[var(--color-ink)]">{t}</p>
              <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* The three models */}
      <Section>
        <SectionHeading align="left" eyebrow="How agency pricing works" title={<>The three ways agencies <span className="text-gradient">charge</span></>} intro="Understanding these helps you evaluate any agency — including us. Each has trade-offs; what matters is that it's transparent and agreed in writing." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {models.map(([t, b]) => (
            <div key={t} className="h-full rounded-[22px] border border-[#dddbc9] bg-white p-7">
              <h3 className="head text-[18px]">{t}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* What's included */}
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading align="left" eyebrow="What's included" title={<>What every engagement <span className="text-gradient">includes</span></>} intro="Whatever the fee, this is the baseline — no upsells to get the basics." />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {included.map((it) => (
              <li key={it} className="flex items-start gap-3 rounded-[12px] border border-[#dddbc9] bg-white px-4 py-3.5 text-sm text-[var(--color-ink)]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-lime)] text-[var(--color-ink)]"><Check size={12} /></span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <LeadBand source="pricing" title="Get a custom quote" blurb="Tell us a bit about your business and we'll send back a clear scope and fee — no obligation, no pressure." />

      <FaqAccordion faqs={faqs} title="Pricing questions, answered" />
      <CtaBlock title="Want an exact number for your business?" intro="Book a free audit. We'll review your accounts and send you a clear scope and fee in writing." />
    </>
  );
}
