import { Hero } from "@/components/home/hero";
import { StatBand } from "@/components/sections/stat-band";
import { PlatformBadges } from "@/components/sections/platform-badges";
import { TrialOffer } from "@/components/sections/trial-offer";
import { WasteAudit } from "@/components/sections/waste-audit";
import { ServiceGrid } from "@/components/sections/service-grid";
import { ProcessSteps } from "@/components/sections/process-steps";
import { AiShowcase } from "@/components/sections/ai-showcase";
import { WhyCompare } from "@/components/sections/why-compare";
import { WhatsIncluded } from "@/components/sections/whats-included";
import { CaseStudyCards } from "@/components/sections/case-study-cards";
import { IndustryGrid } from "@/components/sections/industry-grid";
import { CalculatorTeaser } from "@/components/sections/calculator-teaser";
import { PricingGuidance } from "@/components/sections/pricing-guidance";
import { WhyUs } from "@/components/sections/why-us";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { companyFaqs } from "@/lib/data/company";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PlatformBadges />
      <StatBand />
      <TrialOffer />
      <WasteAudit />
      <ServiceGrid />
      <ProcessSteps />
      <AiShowcase />
      <WhyCompare />
      <WhatsIncluded />
      <CaseStudyCards limit={6} tone="coral" />
      <IndustryGrid limit={9} />
      <CalculatorTeaser />
      <PricingGuidance />
      <WhyUs />
      <TestimonialsSection />
      <FaqAccordion faqs={companyFaqs} />
      <CtaBlock />
    </>
  );
}
