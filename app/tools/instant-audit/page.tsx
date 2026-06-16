import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { InstantAudit } from "@/components/tools/instant-audit";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Instant AI Website Audit — Free",
  description:
    "Enter your URL for an instant, AI-written audit of your website's speed, SEO and ad-tracking signals. Free, no sign-up.",
  path: "/tools/instant-audit",
});

export default function InstantAuditPage() {
  return (
    <>
      <PageHero
        eyebrow="AI-powered · Free"
        title={<>Instant <span className="text-gradient">AI website audit</span></>}
        intro="Enter your website and we'll analyze real on-page signals — speed, SEO basics and whether your ad tracking is even installed — then have our AI explain what to fix, in plain English."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }, { name: "Instant AI Audit", path: "/tools/instant-audit" }]}
      />
      <Section className="!pt-10">
        <InstantAudit />
      </Section>
      <CtaBlock title="Want the full picture?" intro="The instant audit checks your page. A full audit checks your live ad accounts, wasted spend and conversion tracking — book yours free." />
    </>
  );
}
