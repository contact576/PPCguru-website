import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Search, Megaphone, Globe2, MousePointer2, PenTool, Workflow, Check, PanelsTopLeft, ChartNoAxesCombined, Bot, type LucideIcon } from "lucide-react";
import { OverviewClientLogos } from "@/components/overview/client-logos";
import { OverviewHeroCards } from "@/components/overview/hero-cards";
import { BrandIcon } from "@/components/shared/brand-logos";
import { RevealInit } from "@/components/home/reveal-init";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { cities } from "@/lib/data/locations";
import { performanceStats, trustFacts } from "@/lib/data/performance-stats";
import { GOOGLE_PARTNER_PROFILE_URL, META_PARTNER_URL } from "@/lib/data/certifications";
import styles from "./overview.module.css";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
    title: "PPC Guru at a Glance — Services, Clients & Results",
    description: "Meet PPC Guru in one scroll. Explore our paid media, SEO, creative, websites and automation, the clients we work with, and the industries we serve across Canada and the USA.",
    path: "/overview",
  }), "/overview");
}

const capabilities = [
  { title: "Paid search", icon: Search, description: "Show up when your next customer is already looking. Turn intent into calls, leads and booked jobs.", slugs: ["google-ads", "microsoft-ads"] },
  { title: "Paid social", icon: Megaphone, description: "Build demand, reach the right people and bring interested visitors back with campaigns that connect.", slugs: ["meta-ads", "linkedin-ads", "tiktok-ads", "pinterest-ads", "youtube-ads"] },
  { title: "SEO & local search", icon: Globe2, description: "Get found in search and on the map. Build lasting visibility around the services and places you serve.", slugs: ["seo"] },
  { title: "Websites & conversion", icon: MousePointer2, description: "Give every click a better next step. Fast websites, focused landing pages and fewer barriers to enquiring.", slugs: ["web-design", "cro-landing-pages"] },
  { title: "Creative & content", icon: PenTool, description: "Make people stop, understand and act. Ad concepts, design and short-form video built for your audience.", slugs: ["creative"] },
  { title: "CRM & automation", icon: Workflow, description: "Connect the first enquiry to the follow-up. Lead routing, useful AI and reporting that closes the loop.", slugs: ["crm", "ai-automation"] },
];

const shortLabels: Record<string, string> = {
  "google-ads": "Google Ads", "microsoft-ads": "Microsoft Ads", "meta-ads": "Meta",
  "linkedin-ads": "LinkedIn", "tiktok-ads": "TikTok", "pinterest-ads": "Pinterest", "youtube-ads": "YouTube",
  seo: "SEO & local search", "web-design": "Web design", "cro-landing-pages": "Landing pages & CRO",
  creative: "Creative production", crm: "CRM & reporting", "ai-automation": "AI automation",
};

const platformMarks: Record<string, string> = {
  "google-ads": "/platforms/google-ads.svg",
  "meta-ads": "/platforms/meta.svg",
  "tiktok-ads": "/platforms/tiktok.svg",
  "youtube-ads": "/platforms/youtube.svg",
};

const brandMarks: Record<string, string> = {
  "microsoft-ads": "Microsoft Ads",
  "linkedin-ads": "LinkedIn Ads",
  "pinterest-ads": "Pinterest Ads",
};

const serviceIcons: Record<string, LucideIcon> = {
  seo: Search,
  "web-design": PanelsTopLeft,
  "cro-landing-pages": ChartNoAxesCombined,
  creative: PenTool,
  crm: Workflow,
  "ai-automation": Bot,
};

function ServiceMark({ slug }: { slug: string }) {
  if (platformMarks[slug]) {
    // The adjacent label names the platform; the logo is decorative.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={platformMarks[slug]} width="24" height="24" alt="" loading="lazy" />;
  }
  if (brandMarks[slug]) return <BrandIcon name={brandMarks[slug]} size={24} radius={4} />;
  const Icon = serviceIcons[slug];
  return Icon ? <Icon size={23} strokeWidth={1.7} aria-hidden /> : null;
}

const steps = [
  { title: "Audit.", text: "Find the gaps in your ads, tracking and website." },
  { title: "Build.", text: "Connect the right message, campaign and experience." },
  { title: "Optimize.", text: "Test, learn and improve the work every week." },
  { title: "Scale.", text: "Put more behind what earns its place." },
];

const agencyStats = [
  ...performanceStats.filter((stat) => stat.proofType === "agency_aggregate" && stat.verified),
  { value: trustFacts.clientsServed, label: "Clients served", context: "Across our agency portfolio" },
];

export default function OverviewPage() {
  return (
    <div className={styles.page}>
      <RevealInit />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Agency overview", path: "/overview" }])} />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" aria-label="PPC Guru home" className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size original brand artwork */}
            <img src="/brand/ppc-guru-logo-light-420.webp" alt="PPC Guru" width="144" height="50" fetchPriority="high" />
          </Link>
          <span className={styles.headerNote}>The agency<br />at a glance</span>
          <nav aria-label="Overview sections" className={styles.nav}>
            <a href="#services">Services</a>
            <a href="#clients">Clients</a>
            <a href="#industries">Industries</a>
          </nav>
          <a href="#contact" className={styles.headerCta}>Let’s talk <ArrowUpRight size={17} aria-hidden /></a>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="overview-title">
        <div className={styles.wrap}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span className={styles.dot} /> Toronto roots. North American reach.</p>
              <h1 id="overview-title">Attention.<br />Action.<br /><em>Growth.</em></h1>
              <p className={styles.heroDescription}>Your next chapter starts with the right attention. We connect ads, creative, websites and follow-up to turn it into business.</p>
              <div className={styles.actions}>
                <Link href="/free-audit" className={styles.button}>Get your free audit <ArrowUpRight size={20} aria-hidden /></Link>
                <a href="#services" className={styles.textLink}>Explore what we do <ArrowDown size={17} aria-hidden /></a>
              </div>
            </div>

            <OverviewHeroCards />
          </div>

          <div className={styles.heroBottom}>
            <div className={styles.partners}>
              <a href={GOOGLE_PARTNER_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element -- small local platform mark */}
                <img src="/platforms/google.svg" width="23" height="23" alt="" /> Google Partner <ArrowUpRight size={13} aria-hidden />
              </a>
              <a href={META_PARTNER_URL} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element -- small local platform mark */}
                <img src="/platforms/meta.svg" width="25" height="23" alt="" /> Meta Business Partner <ArrowUpRight size={13} aria-hidden />
              </a>
            </div>
            <a href="#services" className={styles.scrollCue}>Meet your growth team <ArrowDown size={15} aria-hidden /></a>
          </div>
        </div>
      </section>

      <div className={styles.statement}>
        <span>Strategy meets execution.</span><span aria-hidden>✳</span><span>Every channel. One team.</span><span aria-hidden>✳</span><span>Built around your business.</span>
      </div>

      <section id="services" className={styles.services} aria-labelledby="services-title">
        <div className={styles.wrap}>
          <div className={styles.sectionHeading} data-reveal>
            <div><p className={styles.eyebrow}>01 / What we do</p><h2 id="services-title">Big picture.<br /><em>Every detail.</em></h2></div>
            <p>From the first search to the next sale. A connected mix of services, built around where your business needs to go.</p>
          </div>
          <div className={styles.serviceGrid}>
            {capabilities.map(({ title, icon: Icon, description, slugs }, index) => (
              <article className={styles.service} key={title} data-reveal>
                <div className={styles.serviceTop}><span>0{index + 1}</span><Icon size={30} strokeWidth={1.5} aria-hidden /></div>
                <h3>{title}</h3><p>{description}</p>
                <div className={styles.serviceLinks}>
                  {slugs.map((slug) => {
                    const service = services.find((item) => item.slug === slug)!;
                    return (
                      <Link href={`/services/${slug}`} key={slug} aria-label={`Explore ${service.name}`}>
                        <span className={styles.serviceMark} aria-hidden><ServiceMark slug={slug} /></span>
                        <span>{shortLabels[slug]}</span>
                        <ArrowUpRight className={styles.serviceArrow} size={12} aria-hidden />
                      </Link>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
          <div className={styles.serviceFoot}><p>Tracking, analytics and transparent reporting connect it all.</p><Link href="/services" className={styles.textLink}>All our services <ArrowUpRight size={17} aria-hidden /></Link></div>
        </div>
      </section>

      <section id="impact" className={styles.impact} aria-labelledby="impact-title">
        <div className={styles.wrap}>
          <div className={styles.impactIntro} data-reveal><p className={styles.eyebrow}>02 / The work adds up</p><h2 id="impact-title">Small details.<br /><em>Real impact.</em></h2><Link href="/results" className={styles.textLink}>Explore our work <ArrowUpRight size={18} aria-hidden /></Link></div>
          <div className={styles.stats}>
            {agencyStats.map((stat) => <div className={styles.stat} key={stat.label} data-reveal><strong>{stat.value}</strong><h3>{stat.label}</h3><p>{stat.context}</p></div>)}
          </div>
          <p className={styles.statNote}>PPC Guru agency totals and blended results. Individual outcomes vary.</p>
        </div>
      </section>

      <section id="clients" className={styles.clients} aria-labelledby="clients-title">
        <div className={`${styles.wrap} ${styles.sectionHeading}`} data-reveal>
          <div><p className={styles.eyebrow}>03 / The company we keep</p><h2 id="clients-title">Familiar names.<br /><em>Shared ambition.</em></h2></div>
          <p>Local favourites. Growing businesses. National brands. Meet the clients we run Google and Meta Ads for.</p>
        </div>
        <OverviewClientLogos />
      </section>

      <section id="industries" className={styles.industries} aria-labelledby="industries-title">
        <div className={styles.wrap}>
          <div className={styles.sectionHeading} data-reveal>
            <div><p className={styles.eyebrow}>04 / Who we work with</p><h2 id="industries-title">Your world.<br /><em>Our focus.</em></h2></div>
            <p>We learn your market, your customers and what a good lead means for your business. Then we build around it.</p>
          </div>
          <div className={styles.sectorGrid}>
            <nav aria-label="Industries we serve" className={styles.industryLinks}>
              {industries.map((industry) => <Link href={`/industries/${industry.slug}`} key={industry.slug}>{industry.name}<ArrowUpRight size={17} aria-hidden /></Link>)}
            </nav>
            <aside className={styles.reach} aria-label="Our service areas">
              <Globe2 size={42} strokeWidth={1.2} aria-hidden />
              <p className={styles.eyebrow}>Based in Toronto. Built to go further.</p>
              <h3>Canada.<br />United States.</h3>
              <p>A GTA-based team working with businesses on both sides of the border.</p>
              <div className={styles.cityLinks}>{cities.filter((city) => ["toronto", "mississauga", "brampton", "vaughan", "markham", "ottawa"].includes(city.slug)).map((city) => <Link href={`/${city.slug}/google-ads`} key={city.slug}>{city.name}</Link>)}</div>
              <Link href="/locations" className={styles.textLink}>Explore our service areas <ArrowUpRight size={16} aria-hidden /></Link>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.method} aria-labelledby="method-title">
        <div className={styles.wrap}>
          <div className={styles.methodHeading}><p className={styles.eyebrow}>05 / How we make it happen</p><h2 id="method-title">A clear way forward.</h2></div>
          <div className={styles.steps}>{steps.map((step, index) => <div key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div>
          <div className={styles.promises}>{["You own your accounts & data", "Weekly action summaries", "Month-to-month relationships", "Human-led, AI-powered"].map((promise) => <span key={promise}><Check size={15} aria-hidden />{promise}</span>)}</div>
        </div>
      </section>

      <section id="contact" className={styles.contact} aria-labelledby="contact-title">
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>Your next chapter. Let’s build it.</p>
          <div className={styles.contactGrid}>
            <h2 id="contact-title">Let’s get<br /><em>growing.</em><ArrowUpRight aria-hidden /></h2>
            <div><p>Tell us where you want to go. We’ll start with a free website and ad-account audit, and a clear plan for what comes next.</p><Link href="/free-audit" className={`${styles.button} ${styles.darkButton}`}>Get your free audit <ArrowUpRight size={20} aria-hidden /></Link><span className={styles.noPressure}>No contract. No setup fee. No obligation.</span></div>
          </div>
          <div className={styles.contactDetails}><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email} <ArrowUpRight size={16} aria-hidden /></a><a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone} <ArrowUpRight size={16} aria-hidden /></a><a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <ArrowUpRight size={16} aria-hidden /></a></div>
        </div>
      </section>

      <footer className={styles.footer}><div className={styles.wrap}><span>© {new Date().getFullYear()} PPC Guru.</span><p>Toronto, Canada · Working across {siteConfig.trust.serviceArea}</p><nav aria-label="Overview footer"><Link href="/">Full website <ArrowUpRight size={13} aria-hidden /></Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav></div></footer>
    </div>
  );
}
