import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHero } from "@/components/shared/page-hero";
import { PartnerBadges } from "@/components/shared/partner-badges";
import { StatBand } from "@/components/sections/stat-band";
import { WhyUs } from "@/components/sections/why-us";
import { CtaBlock } from "@/components/sections/cta-block";
import { Reveal } from "@/components/ui/reveal";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "About PPC Guru",
  description:
    "PPC Guru is a founder-led, AI-augmented Google Partner & Meta Business Partner agency in the GTA, helping service businesses turn ad spend into booked jobs.",
  path: "/about",
});

const founders = [
  { name: "Jaydeep Patel", role: "Founder & CEO", bio: "Jaydeep founded PPC Guru to bring accountable, results-first marketing to service businesses. He also co-founds and runs Millennial Events Corp, producing large-scale North American comedy and music tours across 30+ cities — real-world proof of large-scale audience-building." },
  { name: "Dhaval Patel", role: "Co-founder", bio: "Dhaval leads delivery and operations, building the AI-augmented systems and playbooks that let PPC Guru produce audits, creative and reporting faster than a traditional agency — without cutting corners." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={<>A results-first agency for <span className="text-gradient">service businesses</span></>}
        intro={`Founded in ${siteConfig.founded} in the Greater Toronto Area, ${siteConfig.name} helps local service businesses across Canada and the USA turn ad spend into booked jobs — with AI doing the heavy lifting and humans owning the judgment.`}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
      >
        <PartnerBadges />
      </PageHero>

      <StatBand />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Built to be accountable" />
            <div className="mt-6 space-y-4 text-[--color-ink-dim]">
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
                <li key={t} className="rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
                  <p className="font-semibold text-[--color-ink]">{t}</p>
                  <p className="mt-1 text-sm text-[--color-ink-dim]">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-[--color-base-2]">
        <SectionHeading eyebrow="Leadership" title="Founder-led, hands-on" intro="Small enough to care, structured enough to deliver." />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-[--color-border] bg-[--color-surface] p-7">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[--color-violet] to-[--color-cyan] text-lg font-bold text-[#0a0a0f]">
                    {f.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="font-semibold text-[--color-ink]">{f.name}</p>
                    <p className="text-sm text-[--color-cyan-bright]">{f.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-[--color-ink-dim]">{f.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[--color-ink-faint]">Team photos &amp; additional team members to be added. Verify founder bio details before launch.</p>
      </Section>

      <WhyUs />
      <CtaBlock />
    </>
  );
}
