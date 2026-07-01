import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { LeadBand } from "@/components/sections/lead-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { StepFlow } from "@/components/ui/layout";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { masterOffer } from "@/lib/data/service-offers";
import { trustFacts } from "@/lib/data/performance-stats";

export const metadata: Metadata = buildMetadata({
  title: "Free Google & Meta Ads Audit + 30-Day Free Trial | PPC Guru",
  description:
    "Get a free, no-obligation audit of your Google or Meta Ads — wasted spend, tracking gaps and the first fixes we'd make. Or start a 30-day free trial: no contract, no setup fee, no upfront payment. GTA & Canada.",
  path: "/free-audit",
});

const auditIncludes = [
  "A line-by-line review of wasted spend and where it's going",
  "Conversion-tracking & attribution health check (are your leads even measured?)",
  "Campaign structure, match types and negative-keyword gaps",
  "Landing-page & creative conversion review",
  "How you benchmark against your industry",
  "A prioritized, plain-English 30-day action plan — yours to keep",
];

const trialSteps = [
  { step: 1, kicker: "Day 0", title: "Free audit & plan", body: "We review your account and show you exactly where the opportunity is — no obligation. If we're not a fit, we'll tell you." },
  { step: 2, kicker: "Days 1–30", title: "We run your ads — free", body: "We rebuild and manage your Google or Meta campaigns for 30 days. No contract, no setup fee, no upfront management payment. You only pay the platforms for ad spend, as always." },
  { step: 3, kicker: "Day 30", title: "You decide", body: "Happy with the lead quality and performance? We move forward. Not for you? Walk away — you keep your accounts, data and everything we built. No strings." },
];

const faqs = [
  { q: "What does the 30-day free trial actually include?", a: "We audit, rebuild and manage your Google or Meta Ads for 30 days with no management fee, no contract, no setup fee and no upfront payment. The only cost is your ad spend, which is billed directly by Google/Meta from your own account (that money buys your clicks). At the end of 30 days you decide whether to continue — no obligation." },
  { q: "Is the audit really free?", a: "Yes — completely free and no obligation. You get a written, prioritized action plan you can keep and use, whether or not you work with us." },
  { q: "Who is the free trial for?", a: "It's built for businesses that are switching agencies, unhappy with their current results, or want to test us before committing. If you're spending at least a few thousand dollars a month on ads, there's usually enough data for the trial to prove itself." },
  { q: "What's the catch?", a: "There isn't one. We'd rather prove the opportunity first than sell you a contract up front. If we can't move your numbers, we don't expect you to stay — and you keep everything we build either way." },
  { q: "Do I keep my accounts and data?", a: "Always. Your ad accounts, data, history and billing stay in your name from day one — even if we part ways." },
  { q: "What about the up-to-$3,600 Google Ads credit?", a: "As a Google Partner we can set up to $3,600 in Google Ads credit for eligible new accounts. Eligibility and the exact amount are set by Google; we confirm the details on your audit call." },
];

export default function FreeAuditPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Free audit", path: "/free-audit" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Free audit + 30-day free trial"
        title={<>See where your ad spend is <span className="text-gradient">leaking</span> — free</>}
        intro="Get a free, no-obligation audit of your Google or Meta account, or start a 30-day free trial and let us prove it. No contract, no setup fee, no upfront payment — you only continue if you're happy with the leads."
        breadcrumbs={crumbs}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono rounded-full border border-[#cfe39a] bg-[#eef2dd] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.04em] text-[#4f5f14]">30-day free trial</span>
          {masterOffer.riskReversal.map((r) => (
            <span key={r} className="mono rounded-full border border-[var(--color-border-bright)] bg-white px-3 py-1.5 text-[11px] uppercase tracking-[.04em] text-[var(--color-ink-dim)]">{r}</span>
          ))}
          <span className="mono rounded-full border border-[#cfe39a] bg-[#eef2dd] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.04em] text-[#4f5f14]">Up to $3,600 Google Ads credit</span>
        </div>
        <p className="mono mt-6 text-[11px] uppercase tracking-[.12em] text-[var(--color-ink-faint)]">
          {trustFacts.googlePartner ? "Google Partner" : ""} · {trustFacts.metaBusinessPartner ? "Meta Business Partner" : ""} · {trustFacts.adSpendManaged} ad spend managed
        </p>
      </PageHero>

      {/* The form, high on the page */}
      <LeadBand
        source="offer:free-audit"
        title="Claim your free audit"
        blurb="Tell us where to send it. We'll review your account and reply within one business day — and if you want the 30-day trial, we'll set it up. No obligation."
        points={auditIncludes.slice(0, 3)}
        ctaLabel="Get my free audit"
      />

      {/* What's in the audit */}
      <Section>
        <SectionHeading align="left" eyebrow="What you get" title={<>What&apos;s in your <span className="text-gradient">free audit</span></>} intro="Built like a mini audit report — not a sales call. Yours to keep either way." />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {auditIncludes.map((it) => (
            <div key={it} className="flex items-start gap-3 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[var(--color-ink)] text-[var(--color-lime)]"><Check size={13} /></span>
              <span className="text-[15px] text-[var(--color-ink)]">{it}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* How the trial works */}
      <Section tone="cream">
        <SectionHeading align="left" eyebrow="How the 30-day free trial works" title={<>We prove it <span className="text-gradient">first</span></>} intro="Most agencies ask you to sign before you've seen anything work. We flip it." />
        <StepFlow steps={trialSteps} />
      </Section>

      <FaqAccordion faqs={faqs} title="Free audit & trial — questions" />
      <CtaBlock title="Ready to see where your budget is leaking?" intro="Get your free audit, or start the 30-day free trial. No contract, no setup fee, no obligation." />
    </>
  );
}
