import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { GOOGLE_META_LANDING_PATH, GOOGLE_META_WHATSAPP_URL } from "@/lib/data/landing-google-meta";
import { addressLines, siteConfig } from "@/lib/site-config";

/** A complete landing-page footer, with useful links that preserve the funnel. */
export function GoogleMetaFooter({ fromThankYou = false }: { fromThankYou?: boolean }) {
  const section = (id: string) => `${fromThankYou ? GOOGLE_META_LANDING_PATH : ""}#${id}`;
  return (
    <footer className="gm-footer">
      <div className="gm-container gm-footer-grid">
        <div className="gm-footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element -- shared local brand asset */}
          <img src="/brand/ppc-guru-logo-420.webp" alt="PPC Guru" width={420} height={146} loading="lazy" />
          <p>Google Ads. Meta Ads.<br />One team invested in your growth.</p>
          <span>Based in Toronto.<br />Working across Canada &amp; the USA.</span>
        </div>
        <nav aria-label="Explore this landing page">
          <h2>Explore</h2>
          <a href={section("results")}>Campaign results</a>
          <a href={section("how-it-works")}>How it works</a>
          <a href={section("reviews")}>Client reviews</a>
          <a href={section("service-areas")}>Where we work</a>
          <a href={section("faq")}>Your questions</a>
          <a className="gm-footer-plan" href={section("qualification")}>See if my account qualifies <ArrowUpRight aria-hidden="true" /></a>
        </nav>
        <div className="gm-footer-contact">
          <h2>Let’s talk</h2>
          <a href={siteConfig.contact.phoneHref} data-phone-link="business"><Phone aria-hidden="true" /> {siteConfig.contact.phone}</a>
          <a href={`mailto:${siteConfig.contact.salesEmail}`}><Mail aria-hidden="true" /> {siteConfig.contact.salesEmail}</a>
          <a href={`mailto:${siteConfig.contact.email}`}><Mail aria-hidden="true" /> {siteConfig.contact.email}</a>
          <a href={GOOGLE_META_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <ArrowUpRight aria-hidden="true" /></a>
          <small>{siteConfig.contact.hours}</small>
        </div>
        <div className="gm-footer-location">
          <h2>Find us</h2>
          <a href={siteConfig.maps.mapUrl} target="_blank" rel="noopener noreferrer" className="gm-address"><MapPin aria-hidden="true" /><address>{addressLines().map((line) => <span key={line}>{line}</span>)}</address></a>
        </div>
      </div>
      <div className="gm-container gm-footer-bottom">
        <span>© {new Date().getFullYear()} PPC Guru. All rights reserved.</span>
        <div><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of service</Link><a href="#top">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
