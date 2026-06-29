import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { PartnerBadges } from "@/components/shared/partner-badges";
import { StatBand } from "@/components/sections/stat-band";
import { WhyUs } from "@/components/sections/why-us";
import { CtaBlock } from "@/components/sections/cta-block";
import { TeamSection } from "@/components/sections/team";
import { AboutArt } from "@/components/illustrations/hero-art";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { performanceStats } from "@/lib/data/performance-stats";

const founderStats = performanceStats.filter((s) => s.proofType === "founder_experience");
const whyAgenciesFail = [
  ["Monthly check-ins", "Most agencies log in once a month. We optimize on a daily, weekly and monthly cadence."],
  ["Vanity metrics", "They report impressions and clicks. We report leads, booked jobs, CAC and revenue."],
  ["Broken tracking", "They build on guesswork. We fix GA4/GTM/conversion tracking first, always."],
  ["Generic playbooks", "They treat every account the same. We run vertical-specific, AI-augmented playbooks."],
];

export const metadata: Metadata = buildMetadata({
  title: "About PPC Guru",
  description:
    "PPC Guru is a founder-led, AI-augmented Google Partner & Meta Business Partner agency in the GTA, helping service businesses turn ad spend into booked jobs.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={<>A results-first agency for <span className="text-gradient">service businesses</span></>}
        intro={`Founded in ${siteConfig.founded} in the Greater Toronto Area, ${siteConfig.name} helps local service businesses across Canada and the USA turn ad spend into booked jobs — with AI doing the heavy lifting and humans owning the judgment.`}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
        art={<AboutArt />}
      >
        <PartnerBadges />
      </PageHero>

      <StatBand />

      {/* Founder experience */}
      <Section>
        <SectionHeading align="left" eyebrow="Founder experience" title={<>Enterprise Google Ads <span className="text-gradient">pedigree</span></>} intro="The thinking behind PPC Guru comes from years inside the Google Ads ecosystem — now applied to local and growth-focused businesses." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {founderStats.map((s) => (
            <div key={s.label} className="rounded-[20px] border border-[#dddbc9] bg-[#fbfaf2] p-7">
              <div className="head text-[clamp(2rem,4vw,2.8rem)] leading-none text-[var(--color-ink)]">{s.value}</div>
              <div className="mt-3 text-sm font-medium text-[var(--color-ink)]">{s.label}</div>
              <div className="mono mt-1 text-[11px] uppercase tracking-[.04em] text-[var(--color-ink-dim)]">{s.context}</div>
            </div>
          ))}
          <div className="rounded-[20px] border border-[#cfe39a] bg-[#eef2dd] p-7">
            <div className="head text-[clamp(2rem,4vw,2.8rem)] leading-none text-[var(--color-ink)]">Google-trained</div>
            <div className="mt-3 text-sm font-medium text-[var(--color-ink)]">thinking, AI-powered execution</div>
            <div className="mono mt-1 text-[11px] uppercase tracking-[.04em] text-[#5f6f17]">daily optimization, not monthly reporting</div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Built to be accountable" />
            <div className="mt-6 space-y-4 text-[var(--color-ink-dim)]">
              <p>Most agencies report on impressions, clicks and "reach." Business owners don&apos;t pay their bills with impressions. We started {siteConfig.name} to fix that — to build a marketing partner that talks about leads, booked jobs and revenue, and proves it.</p>
              <p>Since {siteConfig.founded}, we&apos;ve grown into a Google Partner and Meta Business Partner agency serving service businesses across the GTA, the rest of Canada, and the USA — with deep, repeatable playbooks in healthcare, home services, construction, immigration and real estate.</p>
              <p>What makes us different is how we work: an AI-augmented production system that lets a small, senior team produce more audits, more creative and sharper reporting than agencies many times our size — all directed and reviewed by humans who actually care about your numbers.</p>
            </div>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="What we believe" title="Our principles" />
            <ul className="mt-6 space-y-4">
              {[
                ["Outcomes over vanity metrics", "If it doesn't move leads, booked jobs or revenue, it doesn't matter."],
                ["AI as an engine, not a gimmick", "We use AI to do more and move faster — every output reviewed by a strategist."],
                ["Honesty over hype", "No guaranteed-#1 promises. Just clear expectations and real reporting."],
                ["Niche depth", "We go deep in a handful of verticals rather than being generalists."],
              ].map(([t, b]) => (
                <li key={t} className="rounded-[16px] border border-[#dddbc9] bg-[#fbfaf2] p-5">
                  <p className="head text-[16px] text-[var(--color-ink)]">{t}</p>
                  <p className="mt-1 text-sm text-[var(--color-ink-dim)]">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Meet the team — data-driven (lib/data/team.ts); scales as the roster grows */}
      <TeamSection />

      {/* How we protect your accounts & data — SMB-honest trust signals */}
      <Section>
        <SectionHeading
          align="left"
          eyebrow="Trust & data"
          title={<>Your accounts and data stay <span className="text-gradient">yours</span></>}
          intro="No black box, no hostage-taking. Here's how we keep the relationship safe and transparent."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["You own everything", "Your Google Ads, Meta and analytics accounts, data, history and billing stay in your name — you keep full access even if we part ways."],
            ["Privacy-first", "We follow PIPEDA and handle only the data we need, as set out in our Privacy Policy. Need a data-processing agreement? Just ask."],
            ["Tracking done right", "Clean GA4 / GTM / conversion tracking we set up and document — no shady pixels, no guesswork."],
            ["No lock-in", "Month-to-month, transparent weekly reporting, and a clear explanation of every change. We earn the relationship."],
          ].map(([t, b]) => (
            <div key={t} className="h-full rounded-[18px] border border-[#dddbc9] bg-[#fbfaf2] p-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--color-ink)] text-[var(--color-lime)] text-sm font-bold">✓</div>
              <p className="head text-[15px] text-[var(--color-ink)]">{t}</p>
              <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{b}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-[var(--color-ink-faint)]">
          See our <a href="/privacy" className="underline hover:text-[var(--color-ink)]">Privacy Policy</a> for full details on how we collect, use and protect data.
        </p>
      </Section>

      {/* Why most agencies fail */}
      <Section tone="cream">
        <SectionHeading align="left" eyebrow="Why we're different" title={<>Why most agencies <span className="text-gradient">fall short</span></>} intro="Four patterns we built PPC Guru specifically to fix." />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {whyAgenciesFail.map(([t, b]) => (
            <div key={t} className="flex h-full items-start gap-4 rounded-[18px] border border-[#dddbc9] bg-white p-6">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(242,106,43,.14)] text-[var(--color-coral)] text-sm font-bold">✕</span>
              <div>
                <p className="head text-[16px] text-[var(--color-ink)]">{t}</p>
                <p className="mt-1 text-sm text-[var(--color-ink-dim)]">{b}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <WhyUs />
      <CtaBlock />
    </>
  );
}
