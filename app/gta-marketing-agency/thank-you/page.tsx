import type { Metadata } from "next";
import { CalendarCheck, ClipboardList, Rocket } from "lucide-react";
import "../../100-leads/landing.css";
import "../gta.css";
import { LandingThankYou } from "@/components/landing/landing-thank-you";
import { GTA_LANDING_PATH, GTA_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-gta";
import { readLandingConversionReceipt } from "@/lib/landing-conversion";
import { ConfirmedLandingConversion } from "@/components/landing/confirmed-conversion";

/**
 * /gta-marketing-agency/thank-you — where `submitLandingLead` redirects after a
 * saved GTA-page submission. A REAL URL on purpose (ad-platform conversion page).
 */
export const metadata: Metadata = {
  title: "Request received — next steps",
  robots: { index: false, follow: false },
  alternates: { canonical: GTA_LANDING_THANK_YOU_PATH },
};

export default async function GtaThankYouPage() {
  const eventId = await readLandingConversionReceipt();

  return (
    <>
    <ConfirmedLandingConversion eventId={eventId} />
    <LandingThankYou
      className="lp-gta"
      name=""
      kicker="Request received"
      title="Thanks"
      titleEm="Your GTA growth plan is underway."
      lede="Your request has been received. We aim to respond within one business day. Choose a time below to discuss your Google and Meta opportunities, or call or WhatsApp our team."
      steps={[
        { Icon: ClipboardList, title: "We review your business", copy: "We review your services, service area and website to identify a practical starting point." },
        { Icon: CalendarCheck, title: "A short strategy call", copy: "We discuss Google Ads, Meta Ads or both, your budget and what a useful enquiry looks like for your team." },
        { Icon: Rocket, title: "Your plan, then launch", copy: "You get a written plan with budget and targets before anything goes live." },
      ]}
      whatsappOpener="Hi PPC Guru — I just requested a GTA growth plan. Can we talk?"
      backHref={`${GTA_LANDING_PATH}#qualification`}
      source="landing:gta-agency:thank-you"
      headerCtaLabel="Get my growth plan"
      footerTagline="Google Ads and Meta Ads for businesses across Toronto and the GTA."
    />
    </>
  );
}
