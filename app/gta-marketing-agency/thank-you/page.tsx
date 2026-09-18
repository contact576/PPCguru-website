import type { Metadata } from "next";
import { CalendarCheck, ClipboardList, Rocket } from "lucide-react";
import "../../100-leads/landing.css";
import { LandingThankYou, cleanParam } from "@/components/landing/landing-thank-you";
import { GTA_LANDING_PATH, GTA_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-gta";

/**
 * /gta-marketing-agency/thank-you — where `submitLandingLead` redirects after a
 * saved GTA-page submission. A REAL URL on purpose (ad-platform conversion page).
 */
export const metadata: Metadata = {
  title: "Request received — next steps",
  robots: { index: false, follow: false },
  alternates: { canonical: GTA_LANDING_THANK_YOU_PATH },
};

type Params = Record<string, string | string[] | undefined>;

export default async function GtaThankYouPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const name = cleanParam(sp.n, 40);
  const company = cleanParam(sp.c, 80);

  return (
    <LandingThankYou
      name={name}
      kicker="Request received"
      title="Thanks"
      titleEm="Your GTA growth plan is underway."
      lede={`${company ? `${company} is in our review queue.` : "Your business is in our review queue."} Want it faster? Book a time below — or call/WhatsApp us and we’ll walk through your market, channels and budget today.`}
      steps={[
        { Icon: ClipboardList, title: "We review your market", copy: `Within one business day we check search demand, competition and lead costs${company ? ` around ${company}` : ""} in your part of the GTA.` },
        { Icon: CalendarCheck, title: "A 15-minute strategy call", copy: "We agree which channels fit — Google Ads, Meta Ads, SEO — and what a good lead looks like for you." },
        { Icon: Rocket, title: "Your plan, then launch", copy: "You get a written plan with budget and targets before anything goes live." },
      ]}
      whatsappOpener={
        company
          ? `Hi PPC Guru — I just requested a GTA growth plan for ${company}. Can we talk?`
          : "Hi PPC Guru — I just requested a GTA growth plan. Can we talk?"
      }
      backHref={`${GTA_LANDING_PATH}#qualification`}
      source="landing:gta-agency:thank-you"
      headerCtaLabel="Get my growth plan"
      footerTagline="Google Ads, Meta Ads and SEO for businesses across the GTA."
    />
  );
}
