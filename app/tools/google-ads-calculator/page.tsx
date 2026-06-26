import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { AdCalculator } from "@/components/tools/ad-calculator";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Google Ads ROI Calculator — Free",
  description:
    "Free Google Ads calculator. Pick your industry and budget to estimate clicks, leads, cost per lead and projected revenue using real industry benchmarks.",
  path: "/tools/google-ads-calculator",
});

export default function GoogleAdsCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Free tool"
        title={<>Google Ads <span className="text-gradient">ROI Calculator</span></>}
        intro="See what your Google Ads budget could realistically produce in your industry — clicks, leads, cost per lead and projected revenue. Adjust the inputs to match your business."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }, { name: "Google Ads Calculator", path: "/tools/google-ads-calculator" }]}
      />
      <Section className="!pt-10">
        <AdCalculator platform="google-search" />
      </Section>
      <CtaBlock title="Want to actually hit these numbers?" intro="Book a free Google Ads audit and we'll show you exactly how to close the gap between benchmark and reality." />
    </>
  );
}
