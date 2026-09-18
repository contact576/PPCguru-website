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
  title: "Lead Quality Calculator — Leads to Customers",
  description:
    "Free lead-quality calculator. Model how raw leads become qualified leads, booked calls and customers across any platform and industry — and your true cost per acquisition.",
  path: "/tools/lead-quality-calculator",
}), "/tools/lead-quality-calculator");
}

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
        <p className="mx-auto mt-8 max-w-3xl text-sm leading-relaxed text-[var(--color-ink-dim)]">
          When Google Search produces enquiries but too few customers, our{" "}
          <Link href="/services/google-ads" className="font-semibold text-[var(--color-ink)] underline decoration-[var(--accent)] underline-offset-4">
            Google Ads lead-generation management
          </Link>{" "}
          connects search terms, conversion tracking and qualified-lead feedback.
        </p>
      </Section>
      <CtaBlock title="Want better leads, not just more?" intro="Book a free audit — we'll tighten targeting, tracking and follow-up so more leads turn into booked jobs." />
    </>
  );
}
