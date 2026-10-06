import type { Metadata } from "next";
import { CalendarCheck, ClipboardList, Rocket } from "lucide-react";
import "../../100-leads/landing.css";
import "../google-meta.css";
import { LandingThankYou } from "@/components/landing/landing-thank-you";
import { GoogleMetaFooter } from "@/components/landing/google-meta-footer";
import { ConfirmedLandingConversion } from "@/components/landing/confirmed-conversion";
import { readLandingConversionReceipt } from "@/lib/landing-conversion";
import { GOOGLE_META_LANDING_PATH, GOOGLE_META_LANDING_SOURCE, GOOGLE_META_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-google-meta";

export const metadata: Metadata = {
  title: "Book your Google Ads and Meta Ads strategy call",
  description: "Choose a time to discuss your Google Ads and Meta Ads growth plan with PPC Guru.",
  robots: { index: false, follow: false },
  alternates: { canonical: GOOGLE_META_LANDING_THANK_YOU_PATH },
};

export default async function GoogleMetaThankYouPage() {
  const eventId = await readLandingConversionReceipt(GOOGLE_META_LANDING_SOURCE);
  const confirmed = Boolean(eventId);

  return (
    <>
      <ConfirmedLandingConversion eventId={eventId} source={GOOGLE_META_LANDING_SOURCE} />
      <LandingThankYou
        className="lp-google-meta lp-google-meta-thanks"
        name=""
        confirmed={confirmed}
        kicker={confirmed ? "Request received" : "Book your strategy call"}
        title={confirmed ? "Thanks" : "Let’s talk"}
        titleEm={confirmed ? "Let’s talk about your next campaign." : "Plan your next campaign with us."}
        lede="Choose a time below for your Google Ads and Meta Ads strategy call. We’ll discuss your business, the channels that fit and a practical starting budget. Prefer to speak directly? Call or WhatsApp our team."
        steps={[
          confirmed
            ? { Icon: ClipboardList, title: "We review your business", copy: "We review your service area, website and channel preferences before the conversation." }
            : { Icon: ClipboardList, title: "Prepare for your call", copy: "Bring your website, service area and campaign questions so we can make the conversation useful." },
          { Icon: CalendarCheck, title: "Book your strategy call", copy: "Use the calendar to pick a convenient time to discuss your goals, current campaigns and lead quality." },
          { Icon: Rocket, title: "Agree the next steps", copy: "We recommend a channel mix and outline the tracking, creative and landing-page work needed before launch." },
        ]}
        whatsappOpener={confirmed ? "Hi PPC Guru — I just requested a Google Ads and Meta Ads growth plan. Can we talk?" : "Hi PPC Guru — I’d like to discuss Google Ads and Meta Ads for my business. Can we talk?"}
        backHref={`${GOOGLE_META_LANDING_PATH}#qualification`}
        source={`${GOOGLE_META_LANDING_SOURCE}:thank-you`}
        headerCtaLabel="Back to the plan"
        backLabel="Review the growth plan"
        footerTagline="Google Ads and Meta Ads. One team focused on your growth."
        footer={<GoogleMetaFooter fromThankYou />}
      />
    </>
  );
}
