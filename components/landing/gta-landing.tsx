"use client";

import { ArrowRight, Check, ClipboardList, ExternalLink, MapPin, Phone, Search, Star, Target } from "lucide-react";
import { PartnerPair } from "@/components/shared/partner-pair";
import { LandingHeader, LandingFooter } from "@/components/landing/landing-chrome";
import { QualificationForm } from "@/components/landing/leads-landing";
import { ClientLogoWall, GoogleReviewsBlock } from "@/components/landing/trust";
import { googleBusinessProfile, googleReviews } from "@/lib/data/google-reviews";
import { GTA_CITIES, GTA_LANDING_SOURCE } from "@/lib/data/landing-gta";
import { siteConfig } from "@/lib/site-config";

const FORM_COPY = {
  source: GTA_LANDING_SOURCE,
  topline: "Free Google + Meta growth plan",
  stepTwoLede: "Choose a channel, or let us recommend where your budget can work hardest.",
  submitLabel: "Get my free growth plan",
  collectChannel: true,
};

function scrollToForm() {
  const form = document.getElementById("qualification");
  form?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  form?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
}

const channels = [
  {
    name: "Google Ads", logo: "/badges/google-ads-logo.svg", width: 910, height: 230,
    kicker: "Capture demand", title: "Be there when they search.",
    copy: "Reach people actively looking for your service in Toronto and the GTA. Build campaigns around the searches that can turn into calls and enquiries.",
    points: ["Search campaigns and local targeting", "Search-term reviews and negative keywords", "Ad copy and landing-page alignment", "Call and form conversion tracking"],
  },
  {
    name: "Meta", logo: "/badges/meta-logo.svg", width: 948, height: 191,
    kicker: "Create demand", title: "Give them a reason to enquire.",
    copy: "Reach potential customers on Facebook and Instagram with a clear offer and creative built for the feed. Reconnect with interested visitors as they decide.",
    points: ["Facebook and Instagram campaigns", "Creative, audience and offer testing", "Website and instant-form lead campaigns", "Retargeting and lead-quality reviews"],
  },
] as const;

const faqs = [
  ["Should I start with Google Ads, Meta Ads or both?", "Google Ads can capture people searching for your service now. Meta can introduce your offer on Facebook and Instagram and bring interested people back. We recommend a starting mix based on your market, offer, budget and ability to follow up. You do not need to run both."],
  ["What is included in the free growth plan?", "A review of your business, service area and website, a recommended channel mix, an initial ad-budget recommendation, and the first tracking, creative or landing-page fixes to prioritise. If you already run ads, we can discuss an account review on the call. No account access is required to submit the form."],
  ["Is the advertising budget included in your fee?", "No. Ad spend is paid directly to Google or Meta. Management fees, creative and any landing-page work are scoped separately and agreed before launch. The budget you select in the form is your monthly ad spend in Canadian dollars."],
  ["Do I need a website or existing ad account?", "You can request a plan without either. Share a website or Instagram profile if you have one. We will explain what needs to be set up, including any landing-page work, before recommending a launch."],
  ["Who owns my accounts, and am I locked into a contract?", "Your ad accounts and data stay yours. Management is month to month, with the scope, fees and cancellation terms agreed in writing before work begins."],
  ["How soon will I hear back, and are results guaranteed?", "We aim to respond within one business day to arrange a short strategy call. Launch timing depends on account access, tracking, creative and platform review. Lead volume, cost and sales depend on your market, budget, offer and follow-up; they are not guaranteed."],
] as const;
const paidMediaReviews = googleReviews.filter((review) => ["Nancy Gonzalez", "Evan Johnson", "Brian Martinez"].includes(review.name));
const googleReview = googleReviews.find((review) => review.name === "Ankesh");

/* eslint-disable @next/next/no-img-element -- original local artwork and campaign evidence */
export function GtaLanding() {
  return (
    <div className="lp-root lp-gta">
      <div className="site-shell" id="top">
        <div className="hero-surface">
          <LandingHeader ctaLabel="Get my free plan" />
          <div className="lp-main">
            <section className="hero-section" aria-labelledby="gta-title">
              <div className="hero-copy">
                <p className="hero-kicker"><span /> Google Ads + Meta Ads · Toronto &amp; GTA</p>
                <h1 id="gta-title">More of the right leads.<br /><em>Google + Meta.<br />One team.</em></h1>
                <p className="hero-lede">Reach customers searching on Google and discovering businesses on Facebook and Instagram. PPC Guru connects your ads, creative and landing page around one goal: enquiries your team can turn into customers.</p>
                <div className="hero-checks">
                  <span><Check aria-hidden="true" /> Your accounts stay yours</span>
                  <span><Check aria-hidden="true" /> Month-to-month management</span>
                  <span><Check aria-hidden="true" /> Clear reporting on leads and cost</span>
                </div>
                <div className="gta-hero-actions">
                  <button type="button" className="primary-button" onClick={scrollToForm}>Get my free growth plan <ArrowRight aria-hidden="true" /></button>
                  <a href={siteConfig.contact.phoneHref}><Phone aria-hidden="true" /> {siteConfig.contact.phone}</a>
                </div>
                <p className="gta-microcopy">A clear starting plan. No obligation or account access needed.</p>
                <a className="gta-rating" href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer"><Star aria-hidden="true" /><strong>{googleBusinessProfile.rating.toFixed(1)} on Google</strong><span>{googleBusinessProfile.reviewCount} reviews</span><ExternalLink aria-hidden="true" /></a>
                <PartnerPair size="sm" style={{ marginTop: 18, maxWidth: 470 }} />
              </div>
              <QualificationForm copy={FORM_COPY} />
            </section>
          </div>
        </div>
        <ClientLogoWall />
        <section className="gta-section" aria-labelledby="channels-title">
          <div className="gta-section-heading">
            <p className="section-kicker">Two channels. One acquisition plan.</p>
            <h2 id="channels-title">Get found. <span>Get considered. Get enquiries.</span></h2>
            <p>Start with the right channel for your business, then build from what works. Your Google and Meta campaigns share the same offer, conversion journey and reporting priorities.</p>
          </div>
          <div className="gta-channel-grid">
            {channels.map((channel) => <article className="gta-channel" key={channel.name}>
              <div className="gta-channel-top"><img src={channel.logo} alt={channel.name} width={channel.width} height={channel.height} loading="lazy" /><span>{channel.kicker}</span></div>
              <h3>{channel.title}</h3><p>{channel.copy}</p>
              <ul>{channel.points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul>
            </article>)}
          </div>
          <div className="gta-connected"><Target aria-hidden="true" /><p><strong>The work between the click and the customer matters.</strong> We review landing-page friction, conversion tracking and lead follow-up alongside campaign performance.</p></div>
        </section>
        <section className="gta-plan" aria-labelledby="plan-title">
          <div className="gta-section gta-plan-inner">
            <div className="gta-section-heading">
              <p className="section-kicker">Your free growth plan</p>
              <h2 id="plan-title">Know what to fix.<br /><span>Know where to start.</span></h2>
              <p>Tell us about your business. We will review the opportunity and arrange a short call to walk you through the next steps.</p>
              <button className="primary-button" type="button" onClick={scrollToForm}>Build my growth plan <ArrowRight aria-hidden="true" /></button>
              <p className="gta-microcopy">We aim to respond within one business day.</p>
            </div>
            <ol className="gta-plan-list">
              {[
                { Icon: Search, title: "A channel recommendation", copy: "Google, Meta or both — based on your services, market and growth priorities." },
                { Icon: ClipboardList, title: "The first fixes to prioritise", copy: "Gaps in the offer, landing page, creative or tracking that could hold back your campaigns." },
                { Icon: Target, title: "A practical starting budget", copy: "A recommended ad budget and clear scope before you commit to management." },
              ].map(({ Icon, title, copy }, i) => <li key={title}><span>0{i + 1}</span><div><Icon aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></div></li>)}
            </ol>
          </div>
        </section>
        <section className="gta-section" id="campaign-proof" aria-labelledby="proof-title">
          <div className="gta-section-heading"><p className="section-kicker">Client experience + campaign evidence</p><h2 id="proof-title">See the work <span>behind the promise.</span></h2><p>Feedback from an existing Google Ads client and an original Meta campaign screenshot supplied by PPC Guru.</p></div>
          <div className="gta-proof-grid">
            <article className="gta-proof-card gta-google-proof">
              <img className="gta-proof-platform" src="/badges/google-ads-logo.svg" alt="Google Ads" width={910} height={230} loading="lazy" />
              <p className="section-kicker">Client feedback · Toronto law practice</p><h3>Ads and service pages working together.</h3>
              {googleReview && <><blockquote>“{googleReview.text}”</blockquote><p className="gta-proof-byline"><strong>{googleReview.name}</strong> · Google review · September 2026</p></>}
              <a href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer">View PPC Guru’s Google reviews <ExternalLink aria-hidden="true" /></a>
            </article>
            <article className="gta-proof-card gta-meta-proof">
              <div><img className="gta-proof-platform" src="/badges/meta-logo.svg" alt="Meta" width={948} height={191} loading="lazy" /><p className="section-kicker">Meta instant-form campaign</p><h3>True Life Wellness</h3>
                <dl><div><dt>Form leads</dt><dd>93</dd></div><div><dt>Cost per form lead</dt><dd>CA$12.43</dd></div><div><dt>Campaign spend</dt><dd>CA$1,156.04</dd></div></dl>
                <p className="gta-evidence-note">Period shown: 1 July–9 September. Form submissions are not the same as qualified leads or booked patients.</p>
              </div>
              <a className="gta-campaign-image" href="/landing/results/true-life-wellness.jpeg" target="_blank" rel="noopener noreferrer" aria-label="Open original True Life Wellness Meta campaign screenshot in a new tab">
                <img src="/landing/results/true-life-wellness.jpeg" alt="Original Meta Ads screenshot for True Life Wellness showing 93 form leads, CA$12.43 per lead and CA$1,156.04 spent" width={736} height={1600} loading="lazy" decoding="async" /><span>Open original screenshot <ExternalLink aria-hidden="true" /></span>
              </a>
            </article>
          </div>
          <p className="gta-evidence-note">Historical client experience and results, not a forecast. Results vary by offer, market, budget, tracking and follow-up.</p>
        </section>
        <section className="gta-section gta-review-section" aria-labelledby="reviews-title"><div className="gta-section-heading"><p className="section-kicker">In our clients’ words</p><h2 id="reviews-title">Clear communication. <span>Accountable management.</span></h2></div><GoogleReviewsBlock reviews={paidMediaReviews} limit={3} /></section>
        <section className="gta-cities" aria-labelledby="cities-title">
          <p className="section-kicker">Local strategy, across the GTA</p><h2 id="cities-title">Your service area. <span>Your next customers.</span></h2><p>Campaign geography is agreed around where you actually serve customers.</p>
          <ul>{GTA_CITIES.map((city) => <li key={city}><MapPin aria-hidden="true" />{city}</li>)}</ul>
        </section>
        <section className="gta-section gta-faq" aria-labelledby="faq-title"><div className="gta-section-heading"><p className="section-kicker">Before you get started</p><h2 id="faq-title">A few things <span>worth knowing.</span></h2></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
        <section className="final-cta" aria-labelledby="final-title"><div><p className="section-kicker">Google Ads + Meta Ads · Toronto &amp; GTA</p><h2 id="final-title">Let’s find your next growth opportunity.</h2><p>Get a free plan before committing to a campaign.</p></div><button className="primary-button" type="button" onClick={scrollToForm}>Get my free growth plan <ArrowRight aria-hidden="true" /></button></section>
        <div className="gta-contact-line"><a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><span>{siteConfig.contact.hours}</span></div>
        <LandingFooter tagline="Google Ads and Meta Ads management for businesses across Toronto and the GTA." />
      </div>
    </div>
  );
}
