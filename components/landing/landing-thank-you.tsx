import Link from "next/link";
import { Check, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { LandingFooter, LandingHeader } from "@/components/landing/landing-chrome";
import { ThankYouActions } from "@/components/landing/thank-you-actions";
import { PartnerBadges, GoogleReviewsBlock } from "@/components/landing/trust";

/**
 * Thank-you page body shared by /100-leads/thank-you and
 * /seo-visibility/thank-you. A REAL URL on purpose: it's the conversion page
 * Google Ads / Meta Pixel fire on. `name` / `company` personalise the headline
 * and the WhatsApp opener (both optional + already sanitised by the caller).
 */

export type ThankYouStep = { Icon: LucideIcon; title: string; copy: string };
export type ThankYouChip = { Icon: LucideIcon; label: string };

/** Sanitise a `?n=` / `?c=` query value: letters, digits, spaces and a few name/brand marks only. */
export function cleanParam(v: string | string[] | undefined, max: number) {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return "";
  return s.replace(/[^\p{L}\p{N} .,'&-]/gu, "").trim().slice(0, max);
}

export function whatsappLink(opener: string) {
  const base = siteConfig.contact.whatsapp;
  if (!base) return null;
  return `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(opener)}`;
}

export function LandingThankYou({
  name,
  kicker,
  title,
  titleEm,
  lede,
  chips,
  steps,
  whatsappOpener,
  backHref,
  source,
  headerCtaLabel,
  headerTagline,
  footerTagline,
}: {
  name: string;
  kicker: string;
  title: string;
  titleEm: string;
  lede: string;
  chips: ThankYouChip[];
  steps: ThankYouStep[];
  whatsappOpener: string;
  backHref: string;
  /** analytics source for the call / WhatsApp taps, e.g. "landing:100-leads:thank-you". */
  source: string;
  headerCtaLabel: string;
  headerTagline: string;
  footerTagline: string;
}) {
  return (
    <div className="lp-root">
      <div className="site-shell" id="top">
        <div className="hero-surface">
          <LandingHeader ctaHref={backHref} ctaLabel={headerCtaLabel} tagline={headerTagline} />
          <div className="lp-main">
            <section className="thanks-hero" aria-labelledby="thanks-title">
              <div className="thanks-card">
                <div className="success-mark">
                  <Check aria-hidden="true" />
                </div>
                <p className="form-kicker">{kicker}</p>
                <h1 id="thanks-title">
                  {name ? `${title}, ${name}.` : `${title}.`} <em>{titleEm}</em>
                </h1>
                <p className="thanks-lede">{lede}</p>
                <ThankYouActions phoneLabel={siteConfig.contact.phone} phoneHref={siteConfig.contact.phoneHref} whatsappHref={whatsappLink(whatsappOpener)} source={source} />
                <div className="success-summary">
                  {chips.map(({ Icon, label }) => (
                    <span key={label}>
                      <Icon aria-hidden="true" /> {label}
                    </span>
                  ))}
                </div>
                <div className="thanks-badges">
                  <PartnerBadges size={46} compact />
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="thanks-next" aria-labelledby="next-title">
          <p className="section-kicker">What happens next</p>
          <h2 id="next-title">Three steps between you and a live campaign.</h2>
          <ol className="process-row">
            {steps.map(({ Icon, title: t, copy }, index) => (
              <li key={t}>
                <span>{index + 1}</span>
                <Icon aria-hidden="true" />
                <div>
                  <h3>{t}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="thanks-footnote">
            Missed something? <Link href={backHref}>Go back to the offer</Link> or email <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
          </p>
        </section>

        <section className="lp-trust lp-trust-thanks" aria-label="Recent Google reviews">
          <GoogleReviewsBlock limit={3} />
        </section>
        <LandingFooter tagline={footerTagline} />
      </div>
    </div>
  );
}
