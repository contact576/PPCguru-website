import type { Metadata } from "next";
import { CalendarCheck, Bot, ClipboardList, MapPin, Search, Target } from "lucide-react";
import "../../100-leads/landing.css";
import { LandingThankYou, cleanParam } from "@/components/landing/landing-thank-you";
import { SEO_LANDING_PATH, SEO_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-seo";

/**
 * /seo-visibility/thank-you — where `submitSeoLead` redirects after a saved
 * submission. A REAL URL on purpose (ad-platform conversion page).
 * `?n=` first name, `?c=` business, `?q=` the target search — all optional.
 */
export const metadata: Metadata = {
  title: "Visibility check received — next steps",
  robots: { index: false, follow: false },
  alternates: { canonical: SEO_LANDING_THANK_YOU_PATH },
};

type Params = Record<string, string | string[] | undefined>;

export default async function SeoThankYouPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const name = cleanParam(sp.n, 40);
  const company = cleanParam(sp.c, 80);
  const query = cleanParam(sp.q, 120);

  return (
    <LandingThankYou
      name={name}
      kicker="Visibility check received"
      title="Thanks"
      titleEm="We’re checking how you show up right now."
      lede={`We’ll capture how ${company || "your business"} appears${query ? ` for “${query}”` : ""} across Google, Maps and AI answers, then contact you to agree a measurable 30-day target. Want it faster? Call or WhatsApp us now.`}
      chips={[
        { Icon: Search, label: query || "Google Search + Maps" },
        { Icon: Bot, label: "AI-answer visibility" },
        { Icon: Target, label: "30-day measured target" },
      ]}
      steps={[
        { Icon: ClipboardList, title: "We capture your baseline", copy: `Within one business day we record how ${company || "your business"} appears today for the searches that matter — Google, Maps and selected AI answers.` },
        { Icon: CalendarCheck, title: "A 15-minute target call", copy: "We agree the services, cities and searches to measure, and what “visible” means for you." },
        { Icon: MapPin, title: "Signals, then the 30-day recheck", copy: "We strengthen the pages and sources that describe your business, then recheck the same searches and report what moved." },
      ]}
      whatsappOpener={
        company
          ? `Hi PPC Guru — I just requested a search visibility check for ${company}${query ? ` (“${query}”)` : ""}. Can we talk about the 30-day target?`
          : "Hi PPC Guru — I just requested a search visibility check. Can we talk about the 30-day target?"
      }
      backHref={`${SEO_LANDING_PATH}#visibility-check`}
      source="landing:seo-visibility:thank-you"
      headerCtaLabel="Get my visibility plan"
      headerTagline="SEO + AI visibility"
      footerTagline="Search visibility for local and service businesses."
    />
  );
}
