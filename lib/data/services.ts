import {
  Search,
  Megaphone,
  TrendingUp,
  Palette,
  LayoutTemplate,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  short: string; // nav / card one-liner
  hero: string; // page hero subhead
  description: string; // meta description
  icon: LucideIcon;
  featured: boolean; // show in homepage primary trio
  outcomes: string[];
  deliverables: { title: string; body: string }[];
  process: { step: string; title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "google-ads",
    name: "Google Ads Management",
    short: "Search, Performance Max & shopping campaigns engineered for booked jobs.",
    hero: "Stop paying for clicks that don't convert. We build, manage and optimize Google Ads around one number: your cost per booked job.",
    description:
      "Google Partner Google Ads management for service businesses — Search, PMax and call campaigns optimized for cost-per-conversion, not vanity clicks.",
    icon: Search,
    featured: true,
    outcomes: [
      "Lower cost per qualified lead",
      "Less wasted spend on junk searches",
      "Higher Quality Score & Ad Strength",
      "Conversion tracking you can trust",
    ],
    deliverables: [
      { title: "Full account audit", body: "We start every engagement with a structured audit of your account structure, tracking, search terms and wasted spend." },
      { title: "Campaign build & restructure", body: "Tightly themed ad groups, RSAs at full strength, negative-keyword hygiene and conversion-based bidding." },
      { title: "Performance Max & Search", body: "We blend high-intent Search with PMax for coverage, with asset groups and audience signals tuned to your verticals." },
      { title: "Call & form tracking", body: "Click-to-call, call tracking and offline conversion import so we optimize to real leads, not form fills." },
    ],
    process: [
      { step: "01", title: "Audit", body: "We grade the account against a 60-point checklist and quantify wasted spend." },
      { step: "02", title: "Rebuild", body: "We restructure campaigns around your money-making services and locations." },
      { step: "03", title: "Optimize", body: "Weekly search-term mining, bid strategy tuning and creative testing." },
      { step: "04", title: "Scale", body: "We reinvest the savings into the campaigns and keywords that book jobs." },
    ],
    faqs: [
      { q: "What's the minimum ad budget you work with?", a: "We work best with businesses spending at least a few thousand dollars per month on ads, but the right number depends on your industry's cost-per-click and your average job value. The free calculator will give you a realistic picture." },
      { q: "Do you require long-term contracts?", a: "No. We earn the relationship month to month. Most clients stay because the numbers work, not because they're locked in." },
      { q: "Will I own my Google Ads account?", a: "Always. We build inside your own account so you keep full ownership of the data and history." },
    ],
  },
  {
    slug: "meta-ads",
    name: "Meta Ads (Facebook & Instagram)",
    short: "Lead-gen campaigns and scroll-stopping creative across Facebook & Instagram.",
    hero: "We turn Facebook and Instagram into a predictable lead channel — with creative that stops the scroll and offers that convert.",
    description:
      "Meta Business Partner Facebook & Instagram ads — lead-gen campaigns, Meta lead forms, creative testing and competitor ad intelligence.",
    icon: Megaphone,
    featured: true,
    outcomes: [
      "Lower cost per lead",
      "Instant-form & conversion lead gen",
      "Always-on creative testing",
      "Competitor ad intelligence",
    ],
    deliverables: [
      { title: "Offer & funnel strategy", body: "We engineer the offer and landing experience first — the lever that moves cost-per-lead the most." },
      { title: "Creative production", body: "Static, carousel and short-form video creative produced on a weekly testing cadence." },
      { title: "Lead-form integration", body: "Native Meta instant forms wired straight into your CRM with instant lead routing." },
      { title: "Audience & retargeting", body: "Cold prospecting, lookalikes and warm retargeting sequenced across the funnel." },
    ],
    process: [
      { step: "01", title: "Research", body: "We study your best customers and the ads your competitors are running." },
      { step: "02", title: "Build", body: "Offer, creative and audiences built around your highest-value service." },
      { step: "03", title: "Test", body: "Structured creative testing to find the winners fast." },
      { step: "04", title: "Scale", body: "We scale spend on proven creative while keeping CPL in range." },
    ],
    faqs: [
      { q: "Facebook ads stopped working for us. What's different here?", a: "Most underperforming Meta accounts fail on offer and creative, not targeting. We rebuild from the offer out and test creative every week." },
      { q: "Can you use Meta lead forms?", a: "Yes — and we wire them directly into your CRM so leads are followed up in minutes, which is where most of the ROI is won or lost." },
    ],
  },
  {
    slug: "seo",
    name: "SEO & Local Search",
    short: "Technical SEO, location pages and Google Business Profile that compound over time.",
    hero: "Paid ads turn off when the budget does. SEO compounds. We build the organic engine that brings leads while you sleep.",
    description:
      "Local and technical SEO for GTA service businesses — site audits, location & service pages, Google Business Profile optimization and content.",
    icon: TrendingUp,
    featured: true,
    outcomes: [
      "More local map-pack visibility",
      "Rankings for money keywords",
      "Faster, healthier website",
      "Content that earns links",
    ],
    deliverables: [
      { title: "Technical audit", body: "Core Web Vitals, crawlability, schema and site architecture fixed at the foundation." },
      { title: "Location & service pages", body: "Genuinely useful city-and-service pages — not thin doorway pages — that rank locally." },
      { title: "Google Business Profile", body: "NAP consistency, categories, services, posts and review strategy for the local pack." },
      { title: "Content & topic clusters", body: "Pillar pages and supporting articles that build topical authority over time." },
    ],
    process: [
      { step: "01", title: "Audit", body: "Technical, on-page and local audit with a prioritized roadmap." },
      { step: "02", title: "Fix", body: "We resolve technical debt and optimize your core pages." },
      { step: "03", title: "Build", body: "Location pages, service pages and content clusters go live." },
      { step: "04", title: "Earn", body: "Ongoing content and digital PR to earn links and rankings." },
    ],
    faqs: [
      { q: "How long does SEO take?", a: "Local SEO can move in 60–90 days; competitive organic rankings typically take 6–12 months. We pair it with paid ads so you have leads from day one." },
      { q: "Do you do the content too?", a: "Yes. Our AI-augmented workflow lets us produce well-researched, on-brand content faster than a traditional agency — reviewed by a human before it ships." },
    ],
  },
  {
    slug: "creative",
    name: "Creative Production",
    short: "Scroll-stopping static, carousel and short-form video creative — AI-accelerated.",
    hero: "Creative is the single biggest lever on ad performance. We produce more of it, faster, with an AI-augmented studio.",
    description:
      "Ad creative production — statics, carousels and short-form video, with brand-locked design systems and AI-accelerated turnaround.",
    icon: Palette,
    featured: false,
    outcomes: ["More creative volume", "Faster testing cycles", "Brand-locked consistency", "Lower production cost"],
    deliverables: [
      { title: "Brand-locked design system", body: "A reusable system per client so every asset is on-brand and produced fast." },
      { title: "Static & carousel ads", body: "High-volume static and carousel concepts built for testing." },
      { title: "Short-form video & reels", body: "Hook-first short-form video edited for Meta, TikTok and YouTube Shorts." },
      { title: "AI-accelerated production", body: "We use an internal AI workflow to produce and iterate creative faster — every asset human-reviewed." },
    ],
    process: [
      { step: "01", title: "Brief", body: "We lock your brand system, hooks and messaging angles." },
      { step: "02", title: "Produce", body: "We batch-produce a testing set of creative." },
      { step: "03", title: "Test", body: "Winners and losers identified in-platform." },
      { step: "04", title: "Iterate", body: "We iterate on winning concepts to keep CPL falling." },
    ],
    faqs: [
      { q: "Is the AI creative obviously AI?", a: "No. We use AI to accelerate production, but every asset is directed and reviewed by our team to stay on-brand and credible." },
    ],
  },
  {
    slug: "web-design",
    name: "Websites & Landing Pages",
    short: "Conversion-focused websites and landing pages that turn clicks into leads.",
    hero: "The fastest way to lower your cost per lead is often a better landing page. We build sites engineered to convert.",
    description:
      "Conversion-focused website and landing page design and build for service businesses — fast, mobile-first and tracking-ready.",
    icon: LayoutTemplate,
    featured: false,
    outcomes: ["Higher conversion rate", "Faster load times", "Mobile-first UX", "Built-in tracking"],
    deliverables: [
      { title: "Conversion-focused design", body: "Layouts engineered around a single primary action and clear proof." },
      { title: "Landing pages for ads", body: "Dedicated, fast landing pages matched to each campaign and offer." },
      { title: "Performance & Core Web Vitals", body: "Fast, accessible builds that protect both conversions and SEO." },
      { title: "Tracking & CRM wiring", body: "Forms, calls and events wired to your CRM and ad platforms." },
    ],
    process: [
      { step: "01", title: "Map", body: "We map the offer, proof and primary action." },
      { step: "02", title: "Design", body: "Conversion-first design in your brand system." },
      { step: "03", title: "Build", body: "Fast, mobile-first build with tracking baked in." },
      { step: "04", title: "Optimize", body: "We A/B test and refine to lift conversion rate." },
    ],
    faqs: [
      { q: "Do you only build sites for ad clients?", a: "We build standalone sites and landing pages too, though most clients combine them with paid or SEO so the traffic and the page are optimized together." },
    ],
  },
  {
    slug: "crm",
    name: "CRM & Marketing Operations",
    short: "GoHighLevel pipelines, lead routing and reporting that close the loop.",
    hero: "Leads are only worth something if they're followed up fast. We build the CRM and automation that turn leads into booked jobs.",
    description:
      "CRM setup and marketing operations — GoHighLevel pipelines, calendars, lead routing, automated follow-up and performance dashboards.",
    icon: Workflow,
    featured: false,
    outcomes: ["Faster lead follow-up", "No leads slip through", "Automated nurture", "Clear reporting"],
    deliverables: [
      { title: "CRM build (GoHighLevel)", body: "Pipelines, calendars and lead routing configured to your sales process." },
      { title: "Speed-to-lead automation", body: "Instant SMS/email follow-up so new leads are contacted in minutes." },
      { title: "Nurture sequences", body: "Automated email and SMS nurture for leads that aren't ready yet." },
      { title: "Reporting dashboards", body: "One dashboard tying ad spend to leads, booked jobs and revenue." },
    ],
    process: [
      { step: "01", title: "Map", body: "We map your sales process and lead lifecycle." },
      { step: "02", title: "Build", body: "Pipelines, automations and calendars configured." },
      { step: "03", title: "Connect", body: "Ads, forms and calls flow into one system." },
      { step: "04", title: "Report", body: "A single source of truth from spend to revenue." },
    ],
    faqs: [
      { q: "We already use a CRM. Can you work with it?", a: "Often yes. GoHighLevel is our default because it bundles a lot, but we can integrate with most common CRMs." },
    ],
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
