import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceGrid } from "@/components/sections/service-grid";
import { ProcessSteps } from "@/components/sections/process-steps";
import { StatBand } from "@/components/sections/stat-band";
import { WhyUs } from "@/components/sections/why-us";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { PartnerBadges } from "@/components/shared/partner-badges";
import { companyFaqs } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { ServicesArt } from "@/components/illustrations/hero-art";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, itemListSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services — Google Ads, Meta Ads, SEO & more",
  description:
    "Full-funnel digital marketing services for service businesses: Google Ads, Meta Ads, SEO, creative, websites and CRM — all measured against booked jobs and revenue.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={itemListSchema("PPC Guru Services", services.map((s) => ({ name: s.name, path: `/services/${s.slug}` })))} />
      <PageHero
        eyebrow="Services"
        title={<>Everything you need to turn ad spend into <span className="text-gradient">booked jobs</span></>}
        intro="Paid ads, SEO, creative and the systems behind them — delivered by one accountable, AI-augmented team and measured against revenue."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]}
        art={<ServicesArt />}
      >
        <PartnerBadges />
      </PageHero>
      <StatBand />
      <ServiceGrid heading={false} />
      <ProcessSteps />
      <WhyUs />
      <FaqAccordion faqs={companyFaqs} title="Services — questions, answered" />
      <CtaBlock />
    </>
  );
}
