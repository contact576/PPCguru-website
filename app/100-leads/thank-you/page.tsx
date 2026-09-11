import type { Metadata } from "next";
import { CalendarCheck, ClipboardList, MapPin, ShieldCheck, Target } from "lucide-react";
import "../landing.css";
import { LandingThankYou, cleanParam } from "@/components/landing/landing-thank-you";
import { LANDING_PATH, LANDING_THANK_YOU_PATH } from "@/lib/data/landing-100-leads";

/**
 * /100-leads/thank-you — where `submitLandingLead` redirects after a saved
 * submission. A REAL URL on purpose: it's the conversion page Google Ads /
 * Meta Pixel fire on (add the tag in GTM against this path).
 *
 * `?n=` (first name) and `?c=` (business) personalise the headline and the
 * WhatsApp opener; both are optional and sanitised, so the page also works
 * when opened cold.
 */
export const metadata: Metadata = {
  title: "You're in — next steps",
  robots: { index: false, follow: false },
  alternates: { canonical: LANDING_THANK_YOU_PATH },
};

type Params = Record<string, string | string[] | undefined>;

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const name = cleanParam(sp.n, 40);
  const company = cleanParam(sp.c, 80);

  return (
    <LandingThankYou
      name={name}
      kicker="Application received"
      title="You're in"
      titleEm="Your 100-lead plan starts now."
      lede={`${company ? `${company} is in our review queue.` : "Your business is in our review queue."} Want to skip the wait? Call or WhatsApp us and we’ll walk through your lead criteria, market and budget today.`}
      chips={[
        { Icon: MapPin, label: "Canada & USA" },
        { Icon: Target, label: "100-lead target" },
        { Icon: ShieldCheck, label: "$0 fee if missed" },
      ]}
      steps={[
        { Icon: ClipboardList, title: "We review your market", copy: `Within one business day we check search demand, competition and lead costs${company ? ` around ${company}` : ""}.` },
        { Icon: CalendarCheck, title: "A 15-minute qualification call", copy: "We agree what a qualified lead means for you — service, service area, contact details and intent." },
        { Icon: ShieldCheck, title: "Written terms, then launch", copy: "The 100-lead target and the $0-fee guarantee go in writing before your first ad runs." },
      ]}
      whatsappOpener={
        company
          ? `Hi PPC Guru — I just applied for the 100 qualified leads plan for ${company}. Can we talk about my lead criteria?`
          : "Hi PPC Guru — I just applied for the 100 qualified leads plan. Can we talk about my lead criteria?"
      }
      backHref={`${LANDING_PATH}#qualification`}
      source="landing:100-leads:thank-you"
      headerCtaLabel="Get my lead plan"
      headerTagline="Google Ads + Meta Ads"
      footerTagline="Performance advertising for local service businesses."
    />
  );
}
