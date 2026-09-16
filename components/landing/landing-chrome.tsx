"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/shared/brand-logos";

/**
 * Header + footer shared by every paid landing page (/100-leads, /seo-visibility
 * and their thank-you pages): the PPC Guru logo and ONE call to action.
 *
 * Deliberately link-free — these are paid ad destinations, so the header
 * carries no navigation off the page (the Google Ads / Meta Ads service links
 * that used to sit here leaked paid traffic back into the main site). Only the
 * legal links remain in the footer. Styles: app/100-leads/landing.css.
 */

const LOGO = "/brand/ppc-guru-logo-720.png";

/** Ad platforms shown as MARKS (not the words "Google Ads + Meta Ads") next to
 *  the header CTA. `tagline` stays as the accessible name for the row. Pass
 *  `platforms={[]}` on pages whose tagline isn't a platform list (/seo-visibility). */
const HEADER_PLATFORMS = ["Google Ads", "Meta Ads"];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* eslint-disable @next/next/no-img-element -- brand PNG */

/**
 * `ctaHref`: on pages without the form (thank-you) the CTA navigates back to the
 * offer instead of scrolling. `formId`: the element the CTA scrolls to.
 * `tagline`: the small label next to the buttons on desktop.
 */
export function LandingHeader({
  ctaHref,
  ctaLabel = "Get my lead plan",
  formId = "qualification",
  tagline = "Google Ads + Meta Ads",
  platforms = HEADER_PLATFORMS,
}: {
  ctaHref?: string;
  ctaLabel?: string;
  formId?: string;
  tagline?: string;
  platforms?: string[];
} = {}) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="PPC Guru home">
        <img src={LOGO} alt="PPC Guru" width={720} height={251} fetchPriority="high" />
      </a>
      <div className="header-actions">
        {platforms.length ? (
          <span className="header-platforms" role="img" aria-label={tagline} title={tagline}>
            {platforms.map((name, i) => (
              <span key={name} className="header-platform">
                {i > 0 ? <i aria-hidden="true">+</i> : null}
                <BrandIcon name={name} size={30} radius={8} />
              </span>
            ))}
          </span>
        ) : (
          <span>{tagline}</span>
        )}
        {ctaHref ? (
          <Link href={ctaHref}>
            {ctaLabel} <ArrowRight aria-hidden="true" />
          </Link>
        ) : (
          <button type="button" onClick={() => scrollTo(formId)}>
            {ctaLabel} <ArrowRight aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}

/** No partner badges down here: they sit in the hero (landing) and in the
 *  thank-you card, and repeating them above + below the footer rule was the
 *  duplication the client flagged (2026-09-16). */
export function LandingFooter({ tagline = "Performance advertising for local service businesses." }: { tagline?: string } = {}) {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <img src={LOGO} alt="PPC Guru" width={720} height={251} loading="lazy" />
        <p>{tagline}</p>
      </div>
      <div className="site-footer-links">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <span>© {new Date().getFullYear()} PPC Guru</span>
      </div>
    </footer>
  );
}
/* eslint-enable @next/next/no-img-element */
