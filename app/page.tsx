import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Check,
  CircleCheck,
  MapPin,
  Megaphone,
  PanelsTopLeft,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
} from "lucide-react";
import { AuditForm } from "@/components/home/audit-form";
import { BlogPosts } from "@/components/home/blog-section";
import { PartnerPair } from "@/components/shared/partner-pair";
import { JsonLd } from "@/components/seo/json-ld";
import { googleBusinessProfile, googleReviews } from "@/lib/data/google-reviews";
import { googleAdsResults, metaAdsResults } from "@/lib/data/landing-google-meta-results";
import { buildMetadata, faqSchema, homepageSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import "./home-revamp.css";

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
    icon: Search,
    detail: "Capture demand",
  },
  {
    number: "02",
    title: "Meta Ads",
    description: "Make the right offer visible on Facebook and Instagram, then test the creative and audiences that bring useful enquiries.",
    href: "/services/meta-ads",
    icon: Megaphone,
    detail: "Create interest",
  },
  {
    number: "03",
    title: "SEO & local search",
    description: "Help customers find clear answers about your services and locations through useful pages, technical SEO and local presence.",
    href: "/services/seo",
    icon: MapPin,
    detail: "Earn visibility",
  },
  {
    number: "04",
    title: "Websites & landing pages",
    description: "Make the page match the promise in the ad, answer the next question and make it easy to get in touch.",
    href: "/services/web-design",
    icon: PanelsTopLeft,
    detail: "Convert attention",
  },
  {
    number: "05",
    title: "Tracking & CRM",
    description: "Connect forms, calls, analytics and follow-up so you can review enquiry quality alongside clicks and cost.",
    href: "/services/crm",
    icon: Workflow,
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

const selectedLogos = [
  { name: "Millennial Events", src: "/landing/logos/opt/millennial-events.webp" },
  { name: "True Life Wellness", src: "/landing/logos/opt/true-life-wellness-and-physiotherapy.webp" },
  { name: "Project Pioneer Construction", src: "/landing/logos/opt/project-pioneer-construction.webp" },
  { name: "Norths Construction", src: "/landing/logos/opt/norths-construction.webp" },
  { name: "JK Appliance Repair", src: "/landing/logos/opt/jk-appliance-repair-inc.webp" },
] as const;

const faqItems = [
  { q: "Should I start with Google Ads or Meta Ads?", a: "Google Ads can reach people already searching for your service. Meta Ads can introduce your offer and reconnect with interested people. We recommend a starting mix based on your market, goals and budget; you do not need to run both." },
  { q: "What is included in the free audit?", a: "We review your website, conversion paths and tracking, then identify practical first fixes. If you share access to existing ad accounts, we can review campaign structure and wasted spend too. The audit is free and there is no obligation to hire us." },
  { q: "Who owns my ad accounts and data?", a: "You do. Your Google and Meta accounts, history, data and platform billing stay under your control. We work with the access needed to manage your campaigns." },
  { q: "How are ad spend and agency fees handled?", a: "You pay ad spend directly to the platforms. We agree on management, creative and landing-page scope and fees separately before paid work begins." },
  { q: "How do you measure success?", a: "We track calls, forms and other agreed conversion actions, then review cost and lead quality with your team. Where the data is available, we also look at bookings and work won rather than treating every platform conversion as a sale." },
  { q: "Where does PPC Guru work?", a: "Our team is based in Toronto. We work with businesses across the Greater Toronto Area, Canada and the United States." },
] as const;

const reviews = ["Brian Martinez", "Aditi Singh", "Joseph Clary"].flatMap((name) =>
  googleReviews.filter((review) => review.name === name),
);

const featuredReports = [
  { ...googleAdsResults[0], platform: "Google Ads", className: "home-report-google" },
  { ...metaAdsResults[0], platform: "Meta Ads", className: "home-report-meta" },
] as const;

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
            <h1 id="home-title">More of the <em>right leads.</em><br />A clearer way to grow.</h1>
            <p className="home-hero-lede">PPC Guru connects Google Ads, Meta Ads, SEO, landing pages and tracking so you can see what brings enquiries and what to improve next.</p>
            <div className="home-hero-actions">
              <a className="home-button home-button-lime" href="#audit">Get my free audit <ArrowRight size={18} aria-hidden="true" /></a>
              <a className="home-button home-button-outline" href="#proof">See campaign evidence <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <p className="home-hero-note"><CircleCheck size={16} aria-hidden="true" /> Your ad accounts stay yours. Scope and fees are agreed before paid work.</p>
          </div>
          <div className="home-hero-visual" aria-label="Preview of PPC Guru-supplied Google Ads and Meta Ads campaign reports">
            <div className="home-visual-header"><span className="home-live-dot" /> THE WORK BEHIND THE RESULTS <span>01 / 02</span></div>
            <div className="home-visual-window home-visual-window-back">
              <Image src={metaAdsResults[0].src} alt="PPC Guru-supplied Meta Ads campaign report visual for an events campaign" width={metaAdsResults[0].width} height={metaAdsResults[0].height} priority sizes="(max-width: 700px) 42vw, 250px" />
            </div>
            <div className="home-visual-window home-visual-window-front">
              <Image src={googleAdsResults[0].src} alt="PPC Guru-supplied Google Ads campaign report visual for wellness and physiotherapy" width={googleAdsResults[0].width} height={googleAdsResults[0].height} priority sizes="(max-width: 700px) 52vw, 305px" />
            </div>
            <div className="home-visual-caption"><span>GOOGLE ADS + META ADS</span><strong>Campaign reports<br />you can inspect.</strong></div>
          </div>
        </div>
      </section>

      <section className="home-trust" aria-labelledby="home-trust-title">
        <div className="home-wrap">
          <div className="home-trust-top">
            <div><p className="home-kicker">Independent platform credentials</p><h2 id="home-trust-title">A partner you can look up.</h2></div>
            <PartnerPair size="sm" className="home-partners" />
          </div>
          <div className="home-logo-line">
            <span>Selected client work</span>
            <div className="home-logo-grid">
              {selectedLogos.map((logo) => (
                <div className="home-logo" key={logo.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- already optimized static WebP logos with different aspect ratios */}
                  <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-services" id="services" aria-labelledby="home-services-title">
        <div className="home-wrap">
          <div className="home-section-head"><div><p className="home-kicker">What we do</p><h2 id="home-services-title">One team, from first search <em>to follow-up.</em></h2></div><p>People discover you in different places. The experience should feel connected from the first impression to the first conversation.</p></div>
          <div className="home-services-grid">{services.map((service) => { const Icon = service.icon; return <Link href={service.href} className="home-service-card" key={service.title}><div className="home-service-top"><span>{service.number} / {service.detail}</span><ArrowUpRight size={21} aria-hidden="true" /></div><span className="home-service-icon"><Icon size={28} strokeWidth={1.7} aria-hidden="true" /></span><h3>{service.title}</h3><p>{service.description}</p><span className="home-card-link">Explore service <ArrowRight size={16} aria-hidden="true" /></span></Link>; })}</div>
          <div className="home-section-bottom"><TextLink href="/services">View all PPC Guru services</TextLink><TextLink href="/toronto/google-ads">Google Ads management in Toronto</TextLink></div>
        </div>
      </section>

      <section className="home-section home-proof" id="proof" aria-labelledby="home-proof-title">
        <div className="home-wrap">
          <div className="home-section-head home-proof-head"><div><p className="home-kicker">Campaign evidence</p><h2 id="home-proof-title">See the work behind <em>the numbers.</em></h2></div><p>Explore PPC Guru-supplied, styled campaign report visuals. The labels below follow the platforms: Google reports conversions; Meta reports leads.</p></div>
          <div className="home-report-grid">{featuredReports.map((report) => <Link href="/google-ads-and-meta-ads#results" className={`home-report-card ${report.className}`} key={report.src} aria-label={`Explore ${report.platform} campaign reports, including ${report.client}`}><div className="home-report-top"><span className="home-report-platform">{report.platform}</span><span>{report.period}</span></div><div className="home-report-image"><Image src={report.src} alt={`${report.platform} report visual for ${report.client}: ${report.result}, ${report.cost}, spend ${report.spend}, ${report.period}`} width={report.width} height={report.height} sizes="(max-width: 700px) 86vw, 45vw" loading="lazy" /></div><div className="home-report-copy"><div><p>{report.client}</p><h3>{report.result}</h3><span>{report.cost} · {report.spend} spend</span></div><ArrowUpRight size={22} aria-hidden="true" /></div></Link>)}</div>
          <div className="home-proof-foot"><p>These styled, redacted visuals were supplied by PPC Guru. Their figures have not been independently verified in the ad accounts. A conversion or lead is not necessarily a sale, and past results do not predict future performance.</p><Link className="home-button home-button-dark" href="/google-ads-and-meta-ads#results">Explore all campaign reports <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="home-section home-principle" aria-labelledby="home-principle-title"><div className="home-wrap home-principle-grid"><div><p className="home-kicker">The difference is in the connection</p><h2 id="home-principle-title">A click is only <em>the beginning.</em></h2><p>Good marketing connects the search, the offer, the page and the follow-up. We look beyond platform dashboards to understand which enquiries your team can actually use.</p><TextLink href="/about">Meet the PPC Guru team</TextLink></div><div className="home-principle-list"><div><Search size={23} aria-hidden="true" /><span><strong>Relevant demand</strong><small>Reach people in the right market, at the right moment.</small></span></div><div><PanelsTopLeft size={23} aria-hidden="true" /><span><strong>A clearer destination</strong><small>Make the next step easy on a page that answers real questions.</small></span></div><div><ChartNoAxesCombined size={23} aria-hidden="true" /><span><strong>Decisions you can explain</strong><small>Connect costs to enquiries, then review quality and follow-up.</small></span></div></div></div></section>

      <section className="home-section home-process" id="process" aria-labelledby="home-process-title"><div className="home-wrap"><div className="home-section-head"><div><p className="home-kicker">How we work</p><h2 id="home-process-title">A clear plan. <em>Steady improvement.</em></h2></div><p>You should know what happens next, what is being measured and why a campaign changes.</p></div><ol className="home-steps">{steps.map((step) => <li key={step.number}><span className="home-step-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol><div className="home-process-promise"><ShieldCheck size={24} aria-hidden="true" /><p><strong>Account ownership stays with you.</strong> We agree on access, scope, budget and reporting before launch.</p><a href="#audit">Start with a free audit <ArrowRight size={17} aria-hidden="true" /></a></div></div></section>

      <section className="home-section home-organic" aria-labelledby="home-organic-title"><div className="home-wrap home-organic-grid"><div className="home-organic-symbol" aria-hidden="true"><Sparkles size={34} /><span>SEARCH<br />MAPS<br />ANSWERS</span><div className="home-organic-orbit" /></div><div><p className="home-kicker">Organic &amp; AI-assisted discovery</p><h2 id="home-organic-title">Be useful wherever <em>customers search.</em></h2><p>Paid campaigns bring demand now. Clear service and location pages help people understand your business when they search in Google, Maps or AI-assisted products. We work on technical SEO, local signals and genuinely useful answers that make your expertise easier to find and evaluate.</p><p className="home-organic-note">No one can promise a ranking or an AI citation. We focus on accurate information, strong pages and evidence that stands up to a closer look.</p><TextLink href="/services/seo">Explore SEO &amp; local search</TextLink></div></div></section>

      <section className="home-section home-markets" id="industries" aria-labelledby="home-markets-title"><div className="home-wrap"><div className="home-section-head"><div><p className="home-kicker">Who we help</p><h2 id="home-markets-title">Built for businesses where <em>an enquiry matters.</em></h2></div><p>From a Toronto clinic to a multi-location service team, the right plan starts with your market and the work you want more of.</p></div><div className="home-markets-grid"><div><h3>Industries</h3><div className="home-link-list">{industries.map((industry) => <Link href={industry.href} key={industry.name}>{industry.name}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div><TextLink href="/industries">Explore all industries</TextLink></div><div><h3>Toronto &amp; beyond</h3><p>Based at {siteConfig.contact.streetAddress}, Toronto. We work throughout the GTA and with teams across Canada and the US.</p><div className="home-location-links">{locations.map((location) => <Link href={location.href} key={location.name}>{location.name}</Link>)}</div><TextLink href="/locations">Explore service areas</TextLink></div></div></div></section>

      <section className="home-section home-reviews" id="reviews" aria-labelledby="home-reviews-title"><div className="home-wrap"><div className="home-section-head"><div><p className="home-kicker">Client voices</p><h2 id="home-reviews-title">What clients say <em>about the work.</em></h2></div><p>Named comments from PPC Guru&apos;s public Google Business Profile. Read them in context on Google.</p></div><div className="home-review-grid">{reviews.map((review) => <blockquote className="home-review-card" key={review.name}><div className="home-review-stars" aria-label={`${review.stars} out of 5 stars`}>{Array.from({ length: review.stars }, (_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}</div><p>“{review.text}”</p><footer><strong>{review.name}</strong><a href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer">Google review <ArrowUpRight size={15} aria-hidden="true" /></a></footer></blockquote>)}</div><div className="home-reviews-foot"><a href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer" className="home-text-link">Read reviews on Google <ArrowUpRight size={17} aria-hidden="true" /></a></div></div></section>

      <section className="home-section home-faq" id="faq" aria-labelledby="home-faq-title"><div className="home-wrap home-faq-grid"><div><p className="home-kicker">Before you get started</p><h2 id="home-faq-title">Straight answers, <em>no black box.</em></h2><p>Still have a question about your market, budget or current campaigns? We can look at it together.</p><TextLink href="/contact">Talk to our team</TextLink></div><div className="home-faq-list">{faqItems.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></div></section>

      <section className="home-section home-insights" id="blog" aria-labelledby="home-insights-title"><div className="home-wrap"><div className="home-section-head"><div><p className="home-kicker">Practical ideas</p><h2 id="home-insights-title">Useful reads for <em>the next decision.</em></h2></div><p>Guides on paid media, local search, landing pages and measurement from the PPC Guru team.</p></div><BlogPosts limit={3} /></div></section>

      <section className="home-section home-audit" id="audit" aria-labelledby="home-audit-title"><div className="home-wrap home-audit-grid"><div><p className="home-kicker home-kicker-light">Start with clarity</p><h2 id="home-audit-title">Find out what your marketing <em>could do better.</em></h2><p>Get a free review of your website, tracking and first growth opportunities. Share an ad account if you want us to assess existing campaigns too.</p><ul><li><Check size={17} aria-hidden="true" /> Practical first fixes, in plain English</li><li><Check size={17} aria-hidden="true" /> Your accounts and data remain yours</li><li><Check size={17} aria-hidden="true" /> No obligation to work with us</li></ul><div className="home-audit-contact"><span>Prefer a conversation?</span><a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></div></div><AuditForm /></div></section>
    </div>
  );
}
