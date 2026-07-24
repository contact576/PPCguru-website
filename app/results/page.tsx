import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { CaseStudyCards } from "@/components/sections/case-study-cards";
import { StatBand } from "@/components/sections/stat-band";
import { CtaBlock } from "@/components/sections/cta-block";
import { ResultsArt } from "@/components/illustrations/hero-art";
import { buildMetadata } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";
import { REPRESENTATIVE_DISCLOSURE } from "@/lib/data/case-studies";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
  title: "Results & Case Studies",
  description:
    "See how PPC Guru turns ad spend into booked jobs — representative case studies across healthcare, home services, construction, immigration and real estate.",
  path: "/results",
}), "/results");
}

export default function ResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="Proof"
        title={<>Results that show up in the <span className="text-gradient">bank account</span></>}
        intro="We measure success in leads, booked jobs and revenue — not impressions. Here's how that looks across our core verticals."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Results", path: "/results" }]}
        art={<ResultsArt />}
      />
      <StatBand />
      <CaseStudyCards heading={false} />
      <div className="container-page pb-4">
        <p className="text-center text-xs text-[var(--color-ink-faint)]">{REPRESENTATIVE_DISCLOSURE}</p>
      </div>
      <CtaBlock />
    </>
  );
}
