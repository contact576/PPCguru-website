import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { AdCalculator } from "@/components/tools/ad-calculator";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
  title: "Meta Ads ROI Calculator — Free",
  description:
    "Free Meta (Facebook & Instagram) ads calculator. Estimate leads, cost per lead and revenue for your industry and budget using real benchmark data.",
  path: "/tools/meta-ads-calculator",
}), "/tools/meta-ads-calculator");
}

export default function MetaAdsCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Free tool"
        title={<>Meta Ads <span className="text-gradient">ROI Calculator</span></>}
        intro="Estimate what Facebook & Instagram ads could produce for your business — leads, cost per lead and projected revenue, based on real industry benchmarks."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }, { name: "Meta Ads Calculator", path: "/tools/meta-ads-calculator" }]}
      />
      <Section className="!pt-10">
        <AdCalculator platform="meta" />
      </Section>
      <CtaBlock
        title="Want a predictable lead channel on Meta?"
        intro={<>Estimates are a starting point. Our <Link href="/services/meta-ads" className="font-semibold underline underline-offset-4">Meta Ads management services</Link> connect the offer, creative, targeting and conversion tracking to qualified lead outcomes.</>}
      />
    </>
  );
}
