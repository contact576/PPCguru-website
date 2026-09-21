"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Header + footer shared by every paid landing page (/100-leads, /seo-visibility
 * and their thank-you pages): the PPC Guru logo and ONE call to action.
 *
 * Deliberately link-free — these are paid ad destinations, so the header
 * carries no navigation off the page (the Google Ads / Meta Ads service links
 * that used to sit here leaked paid traffic back into the main site). Only the
 * legal links remain in the footer. Styles: app/100-leads/landing.css.
 */

const LOGO = "/brand/ppc-guru-logo-420.webp";

/** The OFFICIAL Google Ads + Meta logos shown beside the header CTA (artwork in
 *  public/badges/, the brands' own marks — not redrawn icons). Pages that
 *  aren't about these platforms pass `platforms={[]}` and the slot is empty:
 *  no tagline text next to the button (client request 2026-09-16). */
export type HeaderPlatform = { src: string; alt: string; width: number; height: number };
const HEADER_PLATFORMS: HeaderPlatform[] = [
  { src: "/badges/google-ads-logo.svg", alt: "Google Ads", width: 910, height: 230 },
  { src: "/badges/meta-logo.svg", alt: "Meta", width: 948, height: 191 },
];

function scrollTo(id: string) {
  const form = document.getElementById(id);
  form?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  form?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
}

/* eslint-disable @next/next/no-img-element -- brand PNG */

/**
 * `ctaHref`: on pages without the form (thank-you) the CTA navigates back to the
 * offer instead of scrolling. `formId`: the element the CTA scrolls to.
 * `platforms`: official logos beside the CTA; `[]` renders nothing there.
 */
export function LandingHeader({
  ctaHref,
  ctaLabel = "Get my lead plan",
  formId = "qualification",
  platforms = HEADER_PLATFORMS,
}: {
  ctaHref?: string;
  ctaLabel?: string;
  formId?: string;
  platforms?: HeaderPlatform[];
} = {}) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="PPC Guru — back to top">
        <img src={LOGO} alt="PPC Guru" width={420} height={146} fetchPriority="high" />
      </a>
      <div className="header-actions">
        {platforms.length ? (
          <span className="header-platforms">
            {platforms.map((p) => (
              <img key={p.src} src={p.src} alt={p.alt} width={p.width} height={p.height} />
            ))}
          </span>
        ) : null}
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
 *  duplication the client flagged (2026-09-16).
 *
 *  Both inboxes are shown (client request 2026-09-22): sales@ first because a
 *  paid-traffic visitor reading the footer is asking to buy, contact@ second as
 *  the general line. Addresses come from siteConfig so they can never drift
 *  from the rest of the site. mailto only — still no navigation off the page. */
export function LandingFooter({ tagline = "Performance advertising for local service businesses." }: { tagline?: string } = {}) {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <img src={LOGO} alt="PPC Guru" width={420} height={146} loading="lazy" />
        <p>{tagline}</p>
        <p className="site-footer-contact">
          <Mail aria-hidden="true" />
          <a href={`mailto:${siteConfig.contact.salesEmail}`}>{siteConfig.contact.salesEmail}</a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
        </p>
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
