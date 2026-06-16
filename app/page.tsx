import { Hero } from "@/components/home/hero";
import { StatBand } from "@/components/sections/stat-band";
import { ServiceGrid } from "@/components/sections/service-grid";
import { ProcessSteps } from "@/components/sections/process-steps";
import { AiShowcase } from "@/components/sections/ai-showcase";
import { IndustryGrid } from "@/components/sections/industry-grid";
import { CaseStudyCards } from "@/components/sections/case-study-cards";
import { CalculatorTeaser } from "@/components/sections/calculator-teaser";
import { WhyUs } from "@/components/sections/why-us";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBlock } from "@/components/sections/cta-block";
import { companyFaqs } from "@/lib/data/company";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatBand />
      <ServiceGrid />
      <ProcessSteps />
      <AiShowcase />
      <CaseStudyCards limit={6} />
      <IndustryGrid limit={9} />
      <CalculatorTeaser />
      <WhyUs />
      <TestimonialsSection />
      <FaqAccordion faqs={companyFaqs} />
      <CtaBlock />
    </>
  );
}
