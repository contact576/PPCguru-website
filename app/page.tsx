import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { AuditForm } from "@/components/home/audit-form";
import { BlogPosts } from "@/components/home/blog-section";
import { CampaignDeck } from "@/components/home/campaign-deck";
import { GrowthJourney } from "@/components/home/growth-journey";
import { GrowthGoals } from "@/components/home/growth-goals";
import { HomePartners, HomeClientMarquee } from "@/components/home/home-trust";
import { HomeCredentials } from "@/components/home/home-credentials";
import { ServiceVisual } from "@/components/home/service-visual";
import { JsonLd } from "@/components/seo/json-ld";
import { googleBusinessProfile, googleReviews } from "@/lib/data/google-reviews";
import { buildMetadata, faqSchema, homepageSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import "./home-revamp.css";
import "./home-visuals.css";
import "./home-growth.css";

// The old database override for / says "#1" without evidence. Keep the
// reviewed homepage metadata authoritative; production stays unchanged until
// this branch is explicitly released.
export function generateMetadata(): Metadata {
  const base = buildMetadata({
    title: "Toronto PPC Agency for Google Ads, Meta Ads & SEO",
    description:
      "PPC Guru is a Toronto PPC agency connecting Google Ads, Meta Ads, SEO, landing pages and tracking. See campaign evidence and get a free website and ads audit.",
    path: "/",
    keywords: ["Toronto PPC agency", "Google Ads management Toronto", "Meta Ads agency", "SEO Toronto"],
  });
  return {
    ...base,
    title: { absolute: "Toronto PPC Agency for Google Ads, Meta Ads & SEO | PPC Guru" },
    alternates: { canonical: `${siteConfig.url}/` },
  };
}

// Keep the newest published articles visible without rebuilding the site.
export const revalidate = 60;

const services = [
  {
    number: "01",
    title: "Google Ads",
    description: "Show up when people search for what you sell. We connect campaigns, search terms, landing pages and call or form tracking.",
    href: "/services/google-ads",
    visual: "google",
    detail: "Capture demand",
  },
  {
    number: "02",
    title: "Meta Ads",
    description: "Make the right offer visible on Facebook and Instagram, then test the creative and audiences that bring useful enquiries.",
    href: "/services/meta-ads",
    visual: "meta",
    detail: "Create interest",
  },
  {
    number: "03",
    title: "SEO & local search",
    description: "Help customers find clear answers about your services and locations through useful pages, technical SEO and local presence.",
    href: "/services/seo",
    visual: "seo",
    detail: "Earn visibility",
  },
  {
    number: "04",
    title: "Websites & landing pages",
    description: "Make the page match the promise in the ad, answer the next question and make it easy to get in touch.",
    href: "/services/web-design",
    visual: "website",
    detail: "Convert attention",
  },
  {
    number: "05",
    title: "Tracking & CRM",
    description: "Connect forms, calls, analytics and follow-up so you can review enquiry quality alongside clicks and cost.",
    href: "/services/crm",
    visual: "tracking",
    detail: "See what happens next",
  },
] as const;

const steps = [
  { number: "01", title: "Find the gaps", text: "We review your website, campaigns and tracking, then identify missed demand and wasted effort." },
  { number: "02", title: "Agree the plan", text: "We set priorities for services, locations, channels and budget, with a clear way to measure progress." },
  { number: "03", title: "Build and connect", text: "We launch or improve campaigns and pages while keeping your accounts, forms and call tracking connected." },
  { number: "04", title: "Learn and improve", text: "We review enquiry quality with your team, test what matters and explain what changed and why." },
] as const;

const industries = [
  { name: "Healthcare & physiotherapy", href: "/industries/physiotherapy" },
  { name: "Home comfort & HVAC", href: "/industries/hvac" },
  { name: "Construction & renovation", href: "/industries/construction-renovation" },
  { name: "Immigration services", href: "/industries/immigration" },
  { name: "Real estate", href: "/industries/real-estate" },
  { name: "Legal services", href: "/industries/law-firms" },
] as const;

const locations = [
  { name: "Toronto", href: "/toronto/google-ads" },
  { name: "Mississauga", href: "/mississauga/google-ads" },
  { name: "Brampton", href: "/brampton/google-ads" },
  { name: "Vaughan", href: "/vaughan/google-ads" },
  { name: "Markham", href: "/markham/google-ads" },
  { name: "Ottawa", href: "/ottawa/google-ads" },
] as const;

const faqItems = [
  { q: "Should I start with Google Ads or Meta Ads?", a: "Google Ads can reach people already searching for your service. Meta Ads can introduce your offer and reconnect with interested people. We recommend a starting mix based on your market, goals and budget; you do not need to run both." },
  { q: "What is included in the free audit?", a: "We review your website, conversion paths and tracking, then identify practical first fixes. If you share access to existing ad accounts, we can review campaign structure and wasted spend too. The audit is free and there is no obligation to hire us." },
  { q: "Who owns my ad accounts and data?", a: "You do. Your Google and Meta accounts, history, data and platform billing stay under your control. We work with the access needed to manage your campaigns." },
  { q: "How are ad spend and agency fees handled?", a: "You pay ad spend directly to the platforms. We agree on management, creative and landing-page scope and fees separately before paid work begins." },
  { q: "How do you measure success?", a: "We track calls, forms and other agreed conversion actions, then review cost and lead quality with your team. Where the data is available, we also look at bookings and work won rather than treating every platform conversion as a sale." },
  { q: "Where does PPC Guru work?", a: "Our team is based in Toronto. We work with businesses across the Greater Toronto Area, Canada and the United States." },
] as const;

const reviews = ["Neel Donda", "Aditi Singh", "Joseph Clary"].flatMap((name) =>
  googleReviews.filter((review) => review.name === name),
);

const heroReview = googleReviews.find((review) => review.name === "Brian Martinez")!;

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="home-text-link" href={href}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>;
}

export default function HomePage() {
  return (
    <div className="home-revamp">
      <JsonLd data={homepageSchema()} />
      <JsonLd data={faqSchema(faqItems.map(({ q, a }) => ({ q, a })))} />

      <section className="home-hero" id="top" aria-labelledby="home-title">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-wrap home-hero-grid">
          <div className="home-hero-copy">
            <p className="home-kicker home-kicker-light"><span className="home-kicker-dot" /> Toronto PPC agency <span className="home-kicker-divider">/</span> Canada &amp; the US</p>
            <h1 id="home-title">Turn clicks into <em>real conversations.</em></h1>
            <p className="home-hero-lede">Reach the right people. Give them a reason to choose you. We connect Google Ads, Meta Ads, SEO and your website to turn interest into enquiries worth following up.</p>
            <div className="home-hero-actions">
              <a className="home-button home-button-lime" href="#audit">Get my free audit <ArrowRight size={18} aria-hidden="true" /></a>
              <a className="home-button home-button-outline" href="#proof">See the work <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <p className="home-hero-note"><CircleCheck size={16} aria-hidden="true" /> Free audit. No obligation. Your accounts stay yours.</p>
            <blockquote className="home-hero-review"><Image src="/platforms/google.svg" alt="Google" width={32} height={32} /><div><p>“{heroReview.text}”</p><footer>{heroReview.name} · <a href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer">Read on Google</a></footer></div></blockquote>
          </div>
          <GrowthJourney />
        </div>
        <div className="home-wrap home-hero-waypoints"><span><Check size={15} aria-hidden="true" /> Ads that reach</span><span><Check size={15} aria-hidden="true" /> Pages that persuade</span><span><Check size={15} aria-hidden="true" /> Follow-up that connects</span><a href="#growth-plan">Find your starting point <ArrowRight size={16} aria-hidden="true" /></a></div>
      </section>

      <section className="home-trust" aria-labelledby="home-trust-title">
        <div className="home-wrap">
          <div className="home-trust-top">
            <div><p className="home-kicker">Platform partnerships</p><h2 id="home-trust-title">A partner you can look up.</h2></div>
            <HomePartners />
          </div>
        </div>
      </section>

      <HomeClientMarquee />

      <GrowthGoals />

      <section className="home-section home-proof" id="proof" aria-labelledby="home-proof-title">
        <div className="home-wrap home-evidence-layout">
          <div className="home-evidence-copy">
            <p className="home-kicker">The work behind the results</p>
            <h2 id="home-proof-title">Less guesswork.<br /><em>More to go on.</em></h2>
            <p>See the campaigns, the costs and the outcomes. Browse Google and Meta report visuals with the context you need to understand each result.</p>
            <ul className="home-evidence-points">
              <li><Image src="/platforms/google-ads.svg" alt="" width={29} height={29} /><div><strong>Google Ads campaign reports</strong><span>Conversions, cost per conversion and campaign spend.</span></div></li>
              <li><Image src="/platforms/meta.svg" alt="" width={29} height={29} /><div><strong>Meta Ads campaign reports</strong><span>Leads, cost per lead and campaign spend.</span></div></li>
            </ul>
            <Link className="home-button home-button-dark" href="/google-ads-and-meta-ads#results">Explore all campaign reports <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <p className="home-proof-disclosure" id="report-context">Styled, redacted report visuals supplied by PPC Guru; figures have not been independently verified in the ad accounts. A lead or conversion is not necessarily a sale. Past results do not predict future performance.</p>
          </div>
          <CampaignDeck />
        </div>
      </section>

      <section className="home-section home-services" id="services" aria-labelledby="home-services-title">
        <div className="home-wrap">
          <div className="home-section-head"><div><p className="home-kicker">What we do</p><h2 id="home-services-title">Everything your next customer <em>needs to say yes.</em></h2></div><p>From the ad they notice to the page they trust, choose the support your business needs. Each service works on its own or as part of one plan.</p></div>
          <div className="home-services-grid">{services.map((service) => <Link href={service.href} className="home-service-card" key={service.title}><div className="home-service-top"><span>{service.number} / {service.detail}</span><ArrowUpRight size={21} aria-hidden="true" /></div><ServiceVisual kind={service.visual} /><h3>{service.title}</h3><p>{service.description}</p><span className="home-card-link">Explore service <ArrowRight size={16} aria-hidden="true" /></span></Link>)}</div>
          <div className="home-section-bottom"><TextLink href="/services">View all PPC Guru services</TextLink><TextLink href="/toronto/google-ads">Google Ads management in Toronto</TextLink></div>
        </div>
      </section>

      <section className="home-section home-process" id="process" aria-labelledby="home-process-title"><div className="home-wrap"><div className="home-section-head"><div><p className="home-kicker">How we work</p><h2 id="home-process-title">A clear plan. <em>Steady improvement.</em></h2></div><p>Meet the people behind the plan. You should know who is doing the work, what happens next and why a campaign changes. <Link href="/about" className="home-text-link">Meet PPC Guru <ArrowUpRight size={16} aria-hidden="true" /></Link></p></div><ol className="home-steps">{steps.map((step) => <li key={step.number}><span className="home-step-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol><div className="home-process-promise"><ShieldCheck size={24} aria-hidden="true" /><p><strong>Account ownership stays with you.</strong> We agree on access, scope, budget and reporting before launch.</p><a href="#audit">Start with a free audit <ArrowRight size={17} aria-hidden="true" /></a></div></div></section>

      <section className="home-section home-organic" aria-labelledby="home-organic-title"><div className="home-wrap home-organic-grid"><div className="home-organic-symbol" aria-hidden="true"><Sparkles size={34} /><span>SEARCH<br />MAPS<br />ANSWERS</span><div className="home-organic-orbit" /></div><div><p className="home-kicker">Organic &amp; AI-assisted discovery</p><h2 id="home-organic-title">Be useful wherever <em>customers search.</em></h2><p>Paid campaigns bring demand now. Clear service and location pages help people understand your business when they search in Google, Maps or AI-assisted products. We work on technical SEO, local signals and genuinely useful answers that make your expertise easier to find and evaluate.</p><p className="home-organic-note">No one can promise a ranking or an AI citation. We focus on accurate information, strong pages and evidence that stands up to a closer look.</p><TextLink href="/services/seo">Explore SEO &amp; local search</TextLink></div></div></section>

      <section className="home-section home-markets" id="industries" aria-labelledby="home-markets-title"><div className="home-wrap"><div className="home-section-head"><div><p className="home-kicker">Who we help</p><h2 id="home-markets-title">Built for businesses where <em>an enquiry matters.</em></h2></div><p>From a Toronto clinic to a multi-location service team, the right plan starts with your market and the work you want more of.</p></div><div className="home-markets-grid"><div><h3>Industries</h3><div className="home-link-list">{industries.map((industry) => <Link href={industry.href} key={industry.name}>{industry.name}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div><TextLink href="/industries">Explore all industries</TextLink></div><div><h3>Toronto &amp; beyond</h3><p>Based at {siteConfig.contact.streetAddress}, Toronto. We work throughout the GTA and with teams across Canada and the US.</p><div className="home-location-links">{locations.map((location) => <Link href={location.href} key={location.name}>{location.name}</Link>)}</div><TextLink href="/locations">Explore service areas</TextLink></div></div></div></section>

      <section className="home-section home-reviews" id="reviews" aria-labelledby="home-reviews-title"><div className="home-wrap"><div className="home-section-head"><div><p className="home-kicker">Client voices</p><h2 id="home-reviews-title">What clients say <em>about the work.</em></h2></div><p>Named comments from PPC Guru&apos;s public Google Business Profile. Read them in context on Google.</p></div><div className="home-review-grid">{reviews.map((review) => <blockquote className="home-review-card" key={review.name}><div className="home-review-source"><Image src="/platforms/google.svg" alt="Google" width={26} height={26} /><div className="home-review-stars" aria-label={`${review.stars} out of 5 stars`}>{Array.from({ length: review.stars }, (_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}</div></div><p>“{review.text}”</p><footer><strong>{review.name}</strong><a href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer">Google review <ArrowUpRight size={15} aria-hidden="true" /></a></footer></blockquote>)}</div><div className="home-reviews-foot"><a href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer" className="home-text-link">Read reviews on Google <ArrowUpRight size={17} aria-hidden="true" /></a></div></div></section>

      <HomeCredentials />

      <section className="home-section home-faq" id="faq" aria-labelledby="home-faq-title"><div className="home-wrap home-faq-grid"><div><p className="home-kicker">Before you get started</p><h2 id="home-faq-title">Straight answers, <em>no black box.</em></h2><p>Still have a question about your market, budget or current campaigns? We can look at it together.</p><TextLink href="/contact">Talk to our team</TextLink></div><div className="home-faq-list">{faqItems.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></div></section>

      <section className="home-section home-insights" id="blog" aria-labelledby="home-insights-title"><div className="home-wrap"><div className="home-section-head"><div><p className="home-kicker">Practical ideas</p><h2 id="home-insights-title">Useful reads for <em>the next decision.</em></h2></div><p>Guides on paid media, local search, landing pages and measurement from the PPC Guru team.</p></div><BlogPosts limit={3} /></div></section>

      <section className="home-section home-audit" id="audit" aria-labelledby="home-audit-title"><div className="home-wrap home-audit-grid"><div><p className="home-kicker home-kicker-light">Start with clarity</p><h2 id="home-audit-title">Know what to fix.<br /><em>Know what’s next.</em></h2><p className="home-audit-intro">Get a practical review of the journey from first click to enquiry. We’ll identify the gaps and recommend where to focus first.</p><ul className="home-audit-deliverables"><li><Check size={17} aria-hidden="true" /> Website and enquiry-path review</li><li><Check size={17} aria-hidden="true" /> Tracking gaps to investigate</li><li><Check size={17} aria-hidden="true" /> Priorities for your goals and budget</li><li><Check size={17} aria-hidden="true" /> Campaign review when you share account access</li></ul><p className="home-audit-reassurance">Free, with no obligation to hire us. Your accounts stay yours.</p><div className="home-audit-contact"><span>Prefer a conversation?</span><a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></div></div><AuditForm /></div></section>
    </div>
  );
}
