import { Section, SectionHeading } from "@/components/ui/section";
import { AdCalculator } from "@/components/tools/ad-calculator";
import type { PlatformId } from "@/lib/data/benchmarks";

/**
 * Embeddable per-page calculator. Pick your industry → the engine auto-fills
 * CPC/CTR/CVR and projects clicks → leads → booked calls → customers → revenue
 * from your spend + ticket. Reused on service & industry pages.
 */
export function EstimateBand({
  platform,
  defaultIndustry,
  title,
  intro,
}: {
  platform?: PlatformId;
  defaultIndustry?: string;
  title?: React.ReactNode;
  intro?: string;
}) {
  return (
    <Section id="estimate">
      <SectionHeading
        align="left"
        eyebrow="Free revenue estimate"
        title={title ?? <>See how much revenue you could <span className="text-gradient">generate</span></>}
        intro={intro ?? "Pick your industry and monthly budget — we'll model clicks, leads, booked calls and estimated revenue from real industry benchmarks and your average ticket."}
      />
      <div className="mt-10">
        <AdCalculator platform={platform} defaultIndustry={defaultIndustry} />
      </div>
    </Section>
  );
}
