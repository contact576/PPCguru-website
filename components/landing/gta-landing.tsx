"use client";

import { ArrowRight, Building2, Check, MapPin, Megaphone, Search, Star, Target, type LucideIcon } from "lucide-react";
import { PartnerPair } from "@/components/shared/partner-pair";
import { LandingHeader, LandingFooter } from "@/components/landing/landing-chrome";
import { QualificationForm } from "@/components/landing/leads-landing";
import { ProofGallery } from "@/components/landing/seo-landing";
import { ClientLogoWall, TrustSection } from "@/components/landing/trust";
import { googleBusinessProfile } from "@/lib/data/google-reviews";
import { GTA_CITIES, GTA_LANDING_SOURCE } from "@/lib/data/landing-gta";

/**
 * "Best marketing agency across the GTA" paid-traffic landing page. Same
 * building blocks as /100-leads and /seo-visibility — the 100-leads
 * qualification form (posting to `submitLandingLead`, routed by its `source`),
 * partner badges, client logo marquee, ChatGPT proof and Google reviews — with
 * GTA-focused copy. Runs on the shared landing.css (.lp-root, .lp-seo for the
 * proof gallery, .lp-gta for the city grid).
 */

const FORM_COPY = {
  source: GTA_LANDING_SOURCE,
  topline: "Free GTA growth plan",
  stepTwoLede: "This tells us which channels and budget make sense for your market.",
  submitLabel: "Get my growth plan",
};

function scrollToForm() {
  document.getElementById("qualification")?.scrollIntoView({ behavior: "smooth", block: "center" });
}
function scrollToProof() {
  document.getElementById("ai-proof")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const services: { Icon: LucideIcon; title: string; copy: string }[] = [
  { Icon: Search, title: "Google Ads", copy: "Show up when people across the GTA search for what you sell, with every call and form tracked back to the keyword." },
  { Icon: Megaphone, title: "Meta Ads", copy: "Facebook and Instagram campaigns that reach the right neighbourhoods and turn scrollers into enquiries." },
  { Icon: Target, title: "SEO + AI search", copy: "Rank in Google Search, Maps and AI answers for the service and city searches that bring in revenue." },
];

function WhySection() {
  return (
    <section className="quality-section" aria-labelledby="why-title">
      <div className="quality-copy">
        <p className="section-kicker">Why GTA businesses choose PPC Guru</p>
        <h2 id="why-title">
          One Toronto team for <span>ads, SEO and leads.</span>
        </h2>
        <p>No juggling three agencies. We plan, launch and report on every channel together, so you can see which one brings in customers.</p>
        <ul>
          {["Toronto-based team that knows GTA markets", "Google Ads, Meta Ads and SEO under one roof", "Your ad accounts and data stay yours", "Every lead tracked back to its source"].map((item) => (
            <li key={item}>
              <Check aria-hidden="true" /> {item}
            </li>
          ))}
        </ul>
      </div>
      <aside className="guarantee-card">
        <div className="guarantee-number">
          <Star aria-hidden="true" />
          <strong>{googleBusinessProfile.rating.toFixed(1)}</strong>
          <span>Google rating from {googleBusinessProfile.reviewCount} client reviews</span>
        </div>
        <div className="guarantee-zero">
          <small>Businesses served</small>
          <strong>200+</strong>
          <span>franchises, national brands and local businesses</span>
        </div>
        <p>Ad spend is separate and paid directly to Google or Meta. Results vary by offer, market, budget and follow-up.</p>
      </aside>
      <ol className="process-row">
        {services.map(({ Icon, title, copy }, index) => (
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
    </section>
  );
}

function CitiesSection() {
  return (
    <section className="gta-cities" aria-labelledby="cities-title">
      <p className="section-kicker">Across the Greater Toronto Area</p>
      <h2 id="cities-title">
        From downtown Toronto <span>to Durham and Halton.</span>
      </h2>
      <ul>
        {GTA_CITIES.map((city) => (
          <li key={city}>
            <MapPin aria-hidden="true" /> {city}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GtaLanding() {
  return (
    <div className="lp-root lp-seo lp-gta">
      <div className="site-shell" id="top">
        <div className="hero-surface">
          <LandingHeader ctaLabel="Get my growth plan" />
          <div className="lp-main">
            <section className="hero-section">
              <div className="hero-copy">
                <p className="hero-kicker">
                  <span /> Google Ads · Meta Ads · SEO · Toronto &amp; GTA
                </p>
                <h1>
                  The GTA’s 5-star marketing agency. <em>Built to bring you customers.</em>
                </h1>
                <p className="hero-lede">
                  Toronto businesses hire PPC Guru to fill their calendars, not to collect clicks. We run your Google Ads, Meta Ads and SEO as one plan, track every lead, and show you what each dollar brings back.
                </p>
                <div className="hero-checks">
                  <span>
                    <Check aria-hidden="true" /> Google Partner + Meta Business Partner
                  </span>
                  <span>
                    <Check aria-hidden="true" /> Every lead tracked
                  </span>
                  <span>
                    <Check aria-hidden="true" /> Month-to-month, no lock-in
                  </span>
                </div>
                <div className="hero-assurance">
                  <div>
                    <Star aria-hidden="true" />
                    <span>
                      <strong>{googleBusinessProfile.rating.toFixed(1)} on Google</strong> from {googleBusinessProfile.reviewCount} reviews
                    </span>
                  </div>
                  <div>
                    <Building2 aria-hidden="true" />
                    <span>
                      <strong>200+ businesses</strong> trusted PPC Guru
                    </span>
                  </div>
                  <button type="button" onClick={scrollToProof}>
                    See what ChatGPT says <ArrowRight aria-hidden="true" />
                  </button>
                </div>
                <PartnerPair size="sm" style={{ marginTop: 14, maxWidth: 470 }} />
              </div>
              <QualificationForm copy={FORM_COPY} />
            </section>
          </div>
        </div>
        <ClientLogoWall />
        <ProofGallery onCta={scrollToForm} ctaLabel="Get my GTA growth plan" />
        <WhySection />
        <CitiesSection />
        <TrustSection />
        <section className="final-cta" aria-labelledby="final-title">
          <div>
            <p className="section-kicker">A 60-second fit check</p>
            <h2 id="final-title">Ready to be the business the GTA calls first?</h2>
          </div>
          <button className="primary-button" type="button" onClick={scrollToForm}>
            Build my growth plan <ArrowRight aria-hidden="true" />
          </button>
        </section>
        <LandingFooter tagline="Google Ads, Meta Ads and SEO for businesses across the GTA." />
      </div>
    </div>
  );
}
