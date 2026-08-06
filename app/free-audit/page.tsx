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
import { withMetaOverride } from "@/lib/page-meta";
import { masterOffer } from "@/lib/data/service-offers";
import { trustFacts } from "@/lib/data/performance-stats";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
  title: "Free Website Audit | PPC Guru",
  description:
    "Get a free, no-obligation website audit — conversion gaps, tracking problems, wasted ad spend and the first fixes we'd make. No contract, no setup fee. GTA & Canada.",
  path: "/free-audit",
}), "/free-audit");
}

const auditIncludes = [
  "A page-by-page review of what's stopping visitors converting",
  "Conversion-tracking & attribution health check (are your leads even measured?)",
  "Site speed, mobile experience and Core Web Vitals",
  "A line-by-line review of wasted ad spend and where it's going",
  "How your site and offer benchmark against your competitors",
  "A prioritized, plain-English 30-day action plan — yours to keep",
];

const auditSteps = [
  { step: 1, kicker: "Day 0", title: "You send us your site", body: "Tell us your website, what you sell and where your leads come from today. It takes about two minutes — no call required to get started." },
  { step: 2, kicker: "Days 1–2", title: "We audit it properly", body: "A strategist reviews your website, tracking, and any Google or Meta accounts you share — conversion gaps, wasted spend, technical problems and competitor position." },
  { step: 3, kicker: "Day 3", title: "You get the plan", body: "A written, prioritized action plan in plain English. Yours to keep and act on, whether you work with us or not. No obligation, no pressure." },
];

const faqs = [
  { q: "What does the free website audit actually include?", a: "A written review of your website and marketing: what's stopping visitors from converting, whether your leads are being tracked properly, how fast the site is on mobile, where ad budget is being wasted if you're running ads, and how you compare to competitors. You get a prioritized action plan you can hand to any developer or agency." },
  { q: "Is the audit really free?", a: "Yes — completely free and no obligation. You get a written, prioritized action plan you can keep and use, whether or not you work with us." },
  { q: "Who is the free audit for?", a: "Any business that has a website and wants more from it — whether you're already running ads, thinking about starting, or getting leads that never convert. If you don't have a website yet, tell us anyway and we'll review what you do have." },
  { q: "What's the catch?", a: "There isn't one. We'd rather prove the opportunity first than sell you a contract up front. If we're not the right fit, we'll tell you — and you keep the plan either way." },
  { q: "Do I keep my accounts and data?", a: "Always. Your ad accounts, data, history and billing stay in your name from day one — even if we part ways." },
  { q: "What about the up-to-$3,600 Google Ads credit?", a: "As a Google Partner we can set up to $3,600 in Google Ads credit for eligible new accounts. Eligibility and the exact amount are set by Google; we confirm the details on your audit call." },
];

export default function FreeAuditPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Free audit", path: "/free-audit" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Free website audit"
        title={<>See where your website is <span className="text-gradient">leaking</span> leads — free</>}
        intro="Get a free, no-obligation audit of your website and marketing — the conversion gaps, tracking problems and wasted ad spend costing you leads, plus the first fixes we'd make. No contract, no setup fee."
        breadcrumbs={crumbs}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono rounded-full border border-[#cfe39a] bg-[#eef2dd] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.04em] text-[#4f5f14]">Free website audit</span>
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
        title="Claim your free website audit"
        blurb="Tell us where to send it. We'll review your website and reply within one business day. No obligation."
        points={auditIncludes.slice(0, 3)}
        ctaLabel="Get my free website audit"
      />

      {/* What's in the audit */}
      <Section>
        <SectionHeading align="left" eyebrow="What you get" title={<>What&apos;s in your <span className="text-gradient">free website audit</span></>} intro="Built like a mini audit report — not a sales call. Yours to keep either way." />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {auditIncludes.map((it) => (
            <div key={it} className="flex items-start gap-3 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[var(--color-ink)] text-[var(--color-lime)]"><Check size={13} /></span>
              <span className="text-[15px] text-[var(--color-ink)]">{it}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* How the audit works */}
      <Section tone="cream">
        <SectionHeading align="left" eyebrow="How the free website audit works" title={<>We prove it <span className="text-gradient">first</span></>} intro="Most agencies ask you to sign before you've seen anything work. We flip it." />
        <StepFlow steps={auditSteps} />
      </Section>

      <FaqAccordion faqs={faqs} title="Free website audit — questions" />
      <CtaBlock title="Ready to see where your budget is leaking?" intro="Get your free website audit. No contract, no setup fee, no obligation." />
    </>
  );
}
