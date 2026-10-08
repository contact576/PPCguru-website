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
  title: "Book your Google Ads eligibility review | PPC Guru",
  description: "Choose a time to review your Google Ads baseline and eligibility for PPC Guru’s qualified-lead management-fee offer.",
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
        kicker={confirmed ? "Eligibility review requested" : "Book your eligibility review"}
        title={confirmed ? "Thanks" : "Let’s talk"}
        titleEm="Let’s see if your account qualifies."
        lede="Book a time below to review your previous 30-day Google Ads performance. The offer is available to eligible existing advertisers; submitting a request does not confirm eligibility. If we don’t generate more qualified leads during the agreed comparison period, our management fee for that period is $0. Ad spend is separate and non-refundable."
        steps={[
          confirmed
            ? { Icon: ClipboardList, title: "We review your account", copy: "We review your request and verify your previous 30-day Google Ads performance before launch." }
            : { Icon: ClipboardList, title: "Prepare for your review", copy: "Have your previous 30-day Google Ads results and your definition of a qualified lead ready to discuss." },
          { Icon: CalendarCheck, title: "Book your eligibility review", copy: "Choose a time to discuss your existing campaigns, lead quality and whether your account qualifies." },
          { Icon: Rocket, title: "Confirm the comparison", copy: "Before launch, we agree lead criteria, baseline, attribution, campaign period and a comparable advertising budget. We’ll also discuss where Meta Ads can support your growth." },
        ]}
        whatsappOpener={confirmed ? "Hi PPC Guru — I just requested an eligibility review for your Google Ads qualified-lead offer. Can we talk?" : "Hi PPC Guru — I’d like to check whether my Google Ads account qualifies for your qualified-lead offer. Can we talk?"}
        backHref={`${GOOGLE_META_LANDING_PATH}#qualification`}
        source={`${GOOGLE_META_LANDING_SOURCE}:thank-you`}
        headerCtaLabel="Review the offer"
        backLabel="Review the offer and eligibility"
        footerTagline="Google Ads and Meta Ads. One team focused on your growth."
        footer={<GoogleMetaFooter fromThankYou />}
      />
    </>
  );
}
