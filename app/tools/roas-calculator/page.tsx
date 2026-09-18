import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { RoasCalculator } from "@/components/tools/roas-calculator";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
  title: "ROAS Calculator — Return on Ad Spend",
  description:
    "Free ROAS calculator: enter spend, revenue and gross margin to see your return on ad spend, profit on ad spend, net profit and break-even ROAS.",
  path: "/tools/roas-calculator",
}), "/tools/roas-calculator");
}

export default function RoasCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Free tool"
        title={<>ROAS <span className="text-gradient">Calculator</span></>}
        intro="Return on ad spend only tells half the story. Enter your spend, revenue and gross margin to see real profit, profit-on-ad-spend, and the break-even ROAS you actually need to hit."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }, { name: "ROAS Calculator", path: "/tools/roas-calculator" }]}
      />
      <Section className="!pt-10">
        <RoasCalculator />
        <p className="mx-auto mt-8 max-w-3xl text-sm leading-relaxed text-[var(--color-ink-dim)]">
          If paid search is below break-even, our{" "}
          <Link href="/services/google-ads" className="font-semibold text-[var(--color-ink)] underline decoration-[var(--accent)] underline-offset-4">
            profit-focused Google Ads management
          </Link>{" "}
          works backward from margin, lead quality and booked revenue instead of optimizing to vanity ROAS.
        </p>
      </Section>
      <CtaBlock title="Below break-even on your ads?" intro="Book a free audit — we'll find the wasted spend and rebuild around profit, not vanity ROAS." />
    </>
  );
}
