import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { IndustryGrid } from "@/components/sections/industry-grid";
import { StatBand } from "@/components/sections/stat-band";
import { WhyUs } from "@/components/sections/why-us";
import { CaseStudyCards } from "@/components/sections/case-study-cards";
import { CtaBlock } from "@/components/sections/cta-block";
import { PartnerBadges } from "@/components/shared/partner-badges";
import { industries } from "@/lib/data/industries";
import { IndustriesArt } from "@/components/illustrations/hero-art";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, itemListSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Help — Local Service Business Marketing",
  description:
    "Specialized digital marketing for healthcare, home services, construction, immigration, real estate and more. Repeatable playbooks for local lead-gen.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={itemListSchema("Industries PPC Guru Serves", industries.map((i) => ({ name: i.name, path: `/industries/${i.slug}` })))} />
      <PageHero
        eyebrow="Who we help"
        title={<>Marketing built around <span className="text-gradient">your industry</span></>}
        intro="We don't do generic. We build repeatable, vertical-specific playbooks for the local service businesses we know best."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }]}
        art={<IndustriesArt />}
      >
        <PartnerBadges />
      </PageHero>
      <StatBand />
      <IndustryGrid heading={false} />
      <CaseStudyCards heading limit={3} tone="soft" />
      <WhyUs />
      <CtaBlock />
    </>
  );
}
