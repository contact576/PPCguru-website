import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { AdCalculator } from "@/components/tools/ad-calculator";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Lead Quality Calculator — Leads to Customers",
  description:
    "Free lead-quality calculator. Model how raw leads become qualified leads, booked calls and customers across any platform and industry — and your true cost per acquisition.",
  path: "/tools/lead-quality-calculator",
});

export default function LeadQualityCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Free tool"
        title={<>Lead Quality <span className="text-gradient">Calculator</span></>}
        intro="Not all leads are equal. Pick your platform and industry to model how clicks become leads, qualified leads, booked calls and customers — and what each one really costs."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }, { name: "Lead Quality Calculator", path: "/tools/lead-quality-calculator" }]}
      />
      <Section className="!pt-10">
        <AdCalculator />
      </Section>
      <CtaBlock title="Want better leads, not just more?" intro="Book a free audit — we'll tighten targeting, tracking and follow-up so more leads turn into booked jobs." />
    </>
  );
}
