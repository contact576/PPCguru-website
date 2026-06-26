import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { UtmBuilder } from "@/components/tools/utm-builder";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "UTM Campaign Builder — Free URL Tagger",
  description:
    "Free UTM builder. Create clean, consistent UTM-tagged URLs so every click is tracked correctly in Google Analytics 4 and your ad platforms.",
  path: "/tools/utm-builder",
});

export default function UtmBuilderPage() {
  return (
    <>
      <PageHero
        eyebrow="Free tool"
        title={<>UTM Campaign <span className="text-gradient">Builder</span></>}
        intro="Consistent UTM tags are the difference between clean attribution and guesswork. Build properly tagged URLs in seconds and copy them straight into your campaigns."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }, { name: "UTM Builder", path: "/tools/utm-builder" }]}
      />
      <Section className="!pt-10">
        <UtmBuilder />
      </Section>
      <CtaBlock title="Tracking a mess?" intro="Book a free audit — we'll set up GA4, conversion tracking and UTM hygiene so your data is finally trustworthy." />
    </>
  );
}
