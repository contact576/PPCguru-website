import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { AdCopyGenerator } from "@/components/tools/ad-copy-generator";
import { CtaBlock } from "@/components/sections/cta-block";
import { buildMetadata } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
  title: "AI Ad Copy Generator — Free",
  description:
    "Generate Google & Meta ad headlines and descriptions for your business in seconds with our free AI ad-copy generator. Character-limit aware.",
  path: "/tools/ad-copy-generator",
}), "/tools/ad-copy-generator");
}

export default function AdCopyGeneratorPage() {
  return (
    <>
      <PageHero
        eyebrow="AI-powered · Free"
        title={<>AI <span className="text-gradient">ad copy generator</span></>}
        intro="Tell us your business and what you're advertising. Our AI drafts platform-ready headlines and descriptions within Google's and Meta's character limits — a fast starting point our team would then refine and test."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }, { name: "AI Ad Copy Generator", path: "/tools/ad-copy-generator" }]}
      />
      <Section className="!pt-10">
        <AdCopyGenerator />
      </Section>
      <CtaBlock />
    </>
  );
}
