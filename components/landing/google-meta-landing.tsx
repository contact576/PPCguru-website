"use client";

import { ArrowRight, Check, CheckCircle2, ChevronDown, ClipboardList, Crosshair, MapPin, MessageSquare, Phone, Search, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import { PartnerPair } from "@/components/shared/partner-pair";
import { LandingHeader } from "@/components/landing/landing-chrome";
import { QualificationForm } from "@/components/landing/leads-landing";
import { ClientLogoWall, GoogleReviewsBlock } from "@/components/landing/trust";
import { GoogleMetaFooter } from "@/components/landing/google-meta-footer";
import { GoogleMetaResults } from "@/components/landing/google-meta-results";
import { GoogleMetaAnalytics } from "@/components/landing/google-meta-analytics";
import { googleBusinessProfile, googleReviews } from "@/lib/data/google-reviews";
import { GTA_CITIES } from "@/lib/data/landing-gta";
import { GOOGLE_META_LANDING_SOURCE } from "@/lib/data/landing-google-meta";
import { siteConfig } from "@/lib/site-config";

const FORM_COPY = {
  source: GOOGLE_META_LANDING_SOURCE,
  topline: "Your free Google + Meta growth plan",
  stepTwoLede: "Choose a channel, or let us recommend the best starting point for your budget.",
  submitLabel: "Get my free growth plan",
  collectChannel: true,
};

function goTo(id: string) {
  const target = document.getElementById(id);
  target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  target?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
}

const faqItems = [
  ["Google Ads, Meta Ads, or both?", "Google Ads reaches people searching for what you sell. Meta introduces your offer on Facebook and Instagram and helps bring interested visitors back. We recommend the right starting mix for your business, budget and market. You do not have to run both."],
  ["What do I get in the free growth plan?", "We review your business, service area and website, then outline a channel recommendation, an initial ad budget and the first changes to your offer, tracking or landing page. If you already advertise, we can discuss an account review on the call. There is no obligation to hire us."],
  ["How much should I budget?", "The right ad budget depends on your services, location, competition and growth goals. Tell us your range in the form, including if you are unsure. Ad spend is paid directly to Google or Meta; management fees, creative and landing-page work are scoped separately before launch."],
  ["Will I own my accounts and data?", "Yes. Your ad accounts and data stay yours. We work with the access needed to manage your campaigns. Management is month to month, with scope, fees and cancellation terms agreed in writing before work starts."],
  ["Can you help if my current ads are not working?", "Yes. We look at search terms or audiences, your offer and creative, landing pages, conversion tracking and lead follow-up. The aim is to find where enquiries are being lost before recommending more spend."],
  ["Do I need a website or existing ad account?", "No. You can request a plan before those are in place. Share your website or Instagram profile if you have one. We will explain any setup, creative or landing-page work required before launching."],
  ["How soon can we start, and are results guaranteed?", "After your request, you can book a call on the next page. Launch timing depends on account access, creative, tracking and platform approval. The examples on this page are past client outcomes, not a guarantee of your lead volume, cost or sales."],
] as const;

const reviewNames = ["Hunter Harris", "Amy Ramirez", "Natalie Lewis", "Nancy Gonzalez", "Evan Johnson", "Brian Martinez"];
const paidMediaReviews = reviewNames.flatMap((name) => googleReviews.filter((review) => review.name === name));

/* eslint-disable @next/next/no-img-element -- supplied local logos and original evidence */
export function GoogleMetaLanding() {
  return (
    <div className="lp-root lp-google-meta">
      <GoogleMetaAnalytics />
      <div className="site-shell" id="top">
        <div className="hero-surface">
          <LandingHeader ctaLabel="Get my free plan" />
          <section className="hero-section" aria-labelledby="google-meta-title">
            <div className="hero-copy">
              <p className="hero-kicker"><span /> Paid advertising · Canada &amp; USA</p>
              <h1 id="google-meta-title">Google Ads.<br />Meta Ads.<br /><em>More leads.</em></h1>
              <p className="hero-lede">Reach customers on Google, Facebook and Instagram with ads built to bring enquiries. One team for your strategy, creative and tracking.</p>
              <div className="hero-checks">
                <span><Check aria-hidden="true" /> Your accounts stay yours</span>
                <span><Check aria-hidden="true" /> Month-to-month management</span>
                <span><Check aria-hidden="true" /> Clear lead &amp; cost reporting</span>
              </div>
              <div className="gm-hero-actions">
                <button type="button" className="primary-button" onClick={() => goTo("qualification")}>Get my free growth plan <ArrowRight aria-hidden="true" /></button>
                <button type="button" className="gm-text-button" onClick={() => goTo("results")}>See real results <ArrowRight aria-hidden="true" /></button>
              </div>
              <p className="gm-microcopy">No obligation. No account access needed to get started.</p>
              <PartnerPair size="sm" className="gm-partners" />
              <a className="gm-rating" href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer">
                <span aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} aria-hidden="true" />)}</span>
                <strong>{googleBusinessProfile.rating.toFixed(1)} on Google</strong><span>{googleBusinessProfile.reviewCount} client reviews <ArrowRight aria-hidden="true" /></span>
              </a>
            </div>
            <QualificationForm copy={FORM_COPY} />
          </section>
        </div>

        <ClientLogoWall />
        <GoogleMetaResults />

        <section className="gm-section gm-container" id="channels" aria-labelledby="gm-channels-title">
          <div className="gm-section-heading">
            <p className="section-kicker">Two platforms. A connected strategy.</p>
            <h2 id="gm-channels-title">Meet your next customer.<br /><span>Wherever they start.</span></h2>
            <p>Show up when they search. Stay relevant while they decide.</p>
          </div>
          <div className="gm-channel-grid">
            <article className="gm-channel gm-channel-google">
              <div className="gm-channel-top"><img src="/badges/google-ads-logo.svg" alt="Google Ads" width={910} height={230} loading="lazy" /><span>Capture demand</span></div>
              <Search className="gm-channel-icon" aria-hidden="true" />
              <h3>Be the answer<br />to their search.</h3>
              <p>Connect with people actively looking for your service, in the locations that matter to your business.</p>
              <ul><li><Check /> Search campaigns &amp; local targeting</li><li><Check /> Search-term reviews &amp; negative keywords</li><li><Check /> Ads matched to your landing page</li><li><Check /> Call &amp; form conversion tracking</li></ul>
            </article>
            <article className="gm-channel gm-channel-meta">
              <div className="gm-channel-top"><img src="/badges/meta-logo.svg" alt="Meta" width={948} height={191} loading="lazy" /><span>Create demand</span></div>
              <MessageSquare className="gm-channel-icon" aria-hidden="true" />
              <h3>Give them a reason<br />to stop scrolling.</h3>
              <p>Put your offer in front of potential customers on Facebook and Instagram, then reconnect as they decide.</p>
              <ul><li><Check /> Facebook &amp; Instagram campaigns</li><li><Check /> Creative, audience &amp; offer testing</li><li><Check /> Website &amp; instant-form lead campaigns</li><li><Check /> Retargeting &amp; lead-quality reviews</li></ul>
            </article>
          </div>
          <p className="gm-channel-note"><CheckCircle2 aria-hidden="true" /> Start with one channel or both. Your plan follows your opportunity and budget.</p>
        </section>

        <section className="gm-plan-section" id="how-it-works" aria-labelledby="gm-plan-title">
          <div className="gm-container">
            <div className="gm-plan-heading"><div><p className="section-kicker">Your next move, made clear</p><h2 id="gm-plan-title" tabIndex={-1}>A plan before<br /><span>another dollar spent.</span></h2></div><p>Tell us where you are now. We’ll help you see what to fix, where to advertise and what to measure.</p></div>
            <ol className="gm-steps">
              <li><span>01</span><ClipboardList aria-hidden="true" /><h3>Tell us about your business.</h3><p>Share your market, goals and ad budget in the short form above.</p></li>
              <li><span>02</span><Crosshair aria-hidden="true" /><h3>Get a focused growth plan.</h3><p>Review your channel mix, offer and biggest conversion opportunities with our team.</p></li>
              <li><span>03</span><SlidersHorizontal aria-hidden="true" /><h3>Launch. Learn. Improve.</h3><p>If we’re a fit, agree the scope and build campaigns with tracking and regular reviews.</p></li>
            </ol>
            <div className="gm-plan-cta"><button type="button" className="primary-button" onClick={() => goTo("qualification")}>Get my free growth plan <ArrowRight aria-hidden="true" /></button><span>No obligation. Ad spend and management fees agreed separately.</span></div>
          </div>
        </section>

        <section className="gm-section gm-container gm-about" aria-labelledby="gm-about-title">
          <div><p className="section-kicker">A team you can actually talk to</p><h2 id="gm-about-title">Know what’s running.<br /><span>Know why it matters.</span></h2><p>PPC Guru is a Toronto-based team managing paid campaigns for businesses across Canada and the USA. We bring the ads, creative and customer journey into the same conversation.</p><a className="gm-contact-link" href={siteConfig.contact.phoneHref}><Phone aria-hidden="true" /> {siteConfig.contact.phone} <ArrowRight aria-hidden="true" /></a></div>
          <div className="gm-accountability">
            <article><ShieldCheck aria-hidden="true" /><div><h3>Control stays with you.</h3><p>Your accounts, your data and a clear scope before work begins.</p></div></article>
            <article><Crosshair aria-hidden="true" /><div><h3>Lead quality stays in view.</h3><p>Review what happens after the click, including enquiries and your team’s feedback.</p></div></article>
            <article><MessageSquare aria-hidden="true" /><div><h3>Answers in plain English.</h3><p>Understand what changed, what it cost and what we’ll test next.</p></div></article>
          </div>
        </section>

        <section className="gm-reviews-section" aria-label="PPC Guru client reviews">
          <div className="gm-container"><div className="gm-section-heading"><p className="section-kicker">The people behind the reviews</p><h2>Hear it from<br /><span>the businesses we work with.</span></h2><p>Published Google reviews, in our clients’ own words.</p></div><GoogleReviewsBlock reviews={paidMediaReviews} limit={6} /></div>
        </section>

        <section className="gm-section gm-container gm-areas" id="service-areas" aria-labelledby="gm-areas-title">
          <div><p className="section-kicker"><MapPin aria-hidden="true" /> Toronto roots. Wider reach.</p><h2 id="gm-areas-title">Local understanding.<br /><span>Room to grow.</span></h2><p>From one service area to campaigns across Canada and the USA, we build your targeting around where your next customers are.</p></div>
          <div><h3>Across Toronto &amp; the GTA</h3><ul>{GTA_CITIES.map((city) => <li key={city}>{city}</li>)}</ul><p>Also working with businesses across Canada &amp; the USA.</p></div>
        </section>

        <section className="gm-section gm-faq-section" id="faq" aria-labelledby="gm-faq-title"><div className="gm-container gm-faq-grid"><div><p className="section-kicker">Before you take the next step</p><h2 id="gm-faq-title">Good questions.<br /><span>Clear answers.</span></h2><p>Still weighing up your options? We’ll talk through them on your call.</p></div><div className="gm-faq-list">{faqItems.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>

        <section className="gm-final-section" aria-labelledby="gm-final-title"><div className="gm-container gm-final-inner"><p className="section-kicker">Let’s make your next move count.</p><h2 id="gm-final-title">Your next customer<br /><span>starts with a better plan.</span></h2><p>Find out where Google Ads and Meta Ads can take your business.</p><button type="button" className="primary-button" onClick={() => goTo("qualification")}>Get my free growth plan <ArrowRight aria-hidden="true" /></button><a href={siteConfig.contact.phoneHref}>Prefer a conversation? {siteConfig.contact.phone}</a><small>No obligation · Your accounts stay yours · Month-to-month management</small></div></section>
        <GoogleMetaFooter />
      </div>
    </div>
  );
}
/* eslint-enable @next/next/no-img-element */
