import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Check, ClipboardList, MapPin, ShieldCheck, Target } from "lucide-react";
import "../landing.css";
import { siteConfig } from "@/lib/site-config";
import { LandingFooter, LandingHeader } from "@/components/landing/leads-landing";
import { ThankYouActions } from "@/components/landing/thank-you-actions";
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

function clean(v: string | string[] | undefined, max: number) {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return "";
  // Letters, digits, spaces and a few name/brand punctuation marks only.
  return s.replace(/[^\p{L}\p{N} .,'&-]/gu, "").trim().slice(0, max);
}

function whatsappLink(company: string) {
  const base = siteConfig.contact.whatsapp;
  if (!base) return null;
  const text = company
    ? `Hi PPC Guru — I just applied for the 100 qualified leads plan for ${company}. Can we talk about my lead criteria?`
    : "Hi PPC Guru — I just applied for the 100 qualified leads plan. Can we talk about my lead criteria?";
  return `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
}

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const name = clean(sp.n, 40);
  const company = clean(sp.c, 80);

  const nextSteps = [
    { Icon: ClipboardList, title: "We review your market", copy: `Within one business day we check search demand, competition and lead costs${company ? ` around ${company}` : ""}.` },
    { Icon: CalendarCheck, title: "A 15-minute qualification call", copy: "We agree what a qualified lead means for you — service, service area, contact details and intent." },
    { Icon: ShieldCheck, title: "Written terms, then launch", copy: "The 100-lead target and the $0-fee guarantee go in writing before your first ad runs." },
  ];

  return (
    <div className="lp-root">
      <div className="site-shell" id="top">
        <div className="hero-surface">
          <LandingHeader ctaHref={`${LANDING_PATH}#qualification`} />
          <div className="lp-main">
            <section className="thanks-hero" aria-labelledby="thanks-title">
              <div className="thanks-card">
                <div className="success-mark">
                  <Check aria-hidden="true" />
                </div>
                <p className="form-kicker">Application received</p>
                <h1 id="thanks-title">
                  {name ? `You're in, ${name}.` : "You're in."} <em>Your 100-lead plan starts now.</em>
                </h1>
                <p className="thanks-lede">
                  {company ? `${company} is in our review queue.` : "Your business is in our review queue."} Want to skip the wait? Call or WhatsApp us and we’ll walk through your lead criteria, market and budget today.
                </p>
                <ThankYouActions phoneLabel={siteConfig.contact.phone} phoneHref={siteConfig.contact.phoneHref} whatsappHref={whatsappLink(company)} />
                <div className="success-summary">
                  <span>
                    <MapPin aria-hidden="true" /> Canada &amp; USA
                  </span>
                  <span>
                    <Target aria-hidden="true" /> 100-lead target
                  </span>
                  <span>
                    <ShieldCheck aria-hidden="true" /> $0 fee if missed
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="thanks-next" aria-labelledby="next-title">
          <p className="section-kicker">What happens next</p>
          <h2 id="next-title">Three steps between you and a live campaign.</h2>
          <ol className="process-row">
            {nextSteps.map(({ Icon, title, copy }, index) => (
              <li key={title}>
                <span>{index + 1}</span>
                <Icon aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="thanks-footnote">
            Missed something? <Link href={LANDING_PATH}>Go back to the offer</Link> or email <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
          </p>
        </section>
        <LandingFooter />
      </div>
    </div>
  );
}
