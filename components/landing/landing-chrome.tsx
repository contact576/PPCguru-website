"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/shared/brand-logos";
import { PartnerBadges } from "@/components/landing/trust";
import { LANDING_HEADER_LINKS } from "@/lib/data/landing-100-leads";

/**
 * Header + footer shared by every paid landing page (/100-leads, /seo-visibility
 * and their thank-you pages). The original PPC Guru logo (big), Google Ads +
 * Meta Ads buttons, and one CTA. Styles live in app/100-leads/landing.css.
 */

const LOGO = "/brand/ppc-guru-logo-720.png";

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
}: {
  ctaHref?: string;
  ctaLabel?: string;
  formId?: string;
  tagline?: string;
} = {}) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="PPC Guru home">
        <img src={LOGO} alt="PPC Guru" width={720} height={251} fetchPriority="high" />
      </a>
      <nav className="header-links" aria-label="Services">
        {LANDING_HEADER_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`header-link header-link-${l.brand}`}>
            <BrandIcon name={l.brand === "google" ? "Google Ads" : "Meta Ads"} size={22} radius={6} />
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <span>{tagline}</span>
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

export function LandingFooter({ tagline = "Performance advertising for local service businesses." }: { tagline?: string } = {}) {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <img src={LOGO} alt="PPC Guru" width={720} height={251} loading="lazy" />
        <p>{tagline}</p>
      </div>
      <PartnerBadges size={54} compact />
      <div className="site-footer-links">
        {LANDING_HEADER_LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <span>© {new Date().getFullYear()} PPC Guru</span>
      </div>
    </footer>
  );
}
/* eslint-enable @next/next/no-img-element */
