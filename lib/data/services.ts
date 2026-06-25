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
  // Problem framing — "signs you're leaving money on the table".
  symptoms: string[];
  // Best-fit clients for this service.
  whoFor: string[];
  // Quick "every engagement includes" checklist (complements the detailed deliverables).
  included: string[];
  deliverables: { title: string; body: string }[];
  // Campaign types / platforms / tools we run for this service.
  platforms: { name: string; body: string }[];
  process: { step: string; title: string; body: string }[];
  // KPIs we report on (transparency block).
  metrics: string[];
  // What shapes the investment (honest, no fabricated numbers).
  pricingFactors: string[];
  faqs: { q: string; a: string }[];
  // Curated representative case studies (slugs from case-studies.ts) to surface
  // as proof on this service page.
  caseStudySlugs: string[];
  // "What good looks like" — representative benchmark ranges, framed as typical
  // targets, NOT guarantees. [VERIFY] swap for real, consented numbers at launch.
  proofStats: { value: string; label: string }[];
};

export const services: Service[] = [
  {
    slug: "google-ads",
    caseStudySlugs: ["physiotherapy-clinic-north-york", "hvac-mississauga-lead-gen", "basement-renovation-gta"],
    proofStats: [
      { value: "−30–45%", label: "typical cut in wasted spend, first 90 days" },
      { value: "2–3×", label: "more qualified leads as bidding matures" },
      { value: "60 days", label: "to a cleaner cost-per-lead signal" },
    ],
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
    symptoms: [
      "Your cost per lead keeps climbing and you can't see why",
      "Clicks are up but the phone isn't ringing with real jobs",
      "You suspect you're paying for irrelevant or competitor searches",
      "You can't tell which campaigns actually make money",
    ],
    whoFor: [
      "Service businesses spending (or ready to spend) a few thousand dollars a month",
      "Owners who care about booked jobs and revenue, not clicks and impressions",
      "Accounts inherited from another agency that need a clean rebuild",
      "Businesses with a real offer and the capacity to take on more leads",
    ],
    included: [
      "60-point account & tracking audit",
      "Search, Performance Max & call campaigns",
      "Negative-keyword & search-term hygiene",
      "Conversion-based bidding (tROAS / tCPA)",
      "Call tracking & offline conversion import",
      "Weekly optimization + transparent reporting",
    ],
    deliverables: [
      { title: "Full account audit", body: "We start every engagement with a structured audit of your account structure, tracking, search terms and wasted spend." },
      { title: "Campaign build & restructure", body: "Tightly themed ad groups, RSAs at full strength, negative-keyword hygiene and conversion-based bidding." },
      { title: "Performance Max & Search", body: "We blend high-intent Search with PMax for coverage, with asset groups and audience signals tuned to your verticals." },
      { title: "Call & form tracking", body: "Click-to-call, call tracking and offline conversion import so we optimize to real leads, not form fills." },
    ],
    platforms: [
      { name: "Search campaigns", body: "High-intent keyword campaigns built around your most profitable services and locations." },
      { name: "Performance Max", body: "Goal-based campaigns with tuned asset groups and audience signals for coverage beyond Search." },
      { name: "Call & Local", body: "Call-only and Local campaigns that drive phone calls and visits for service businesses." },
      { name: "Remarketing", body: "Re-engage visitors who didn't convert the first time, across Search and Display." },
    ],
    process: [
      { step: "01", title: "Audit", body: "We grade the account against a 60-point checklist and quantify wasted spend." },
      { step: "02", title: "Rebuild", body: "We restructure campaigns around your money-making services and locations." },
      { step: "03", title: "Optimize", body: "Weekly search-term mining, bid strategy tuning and creative testing." },
      { step: "04", title: "Scale", body: "We reinvest the savings into the campaigns and keywords that book jobs." },
    ],
    metrics: [
      "Cost per qualified lead",
      "Cost per booked job",
      "Conversion rate by campaign",
      "Search-term & wasted-spend report",
      "Impression share vs competitors",
      "Return on ad spend (ROAS)",
    ],
    pricingFactors: [
      "Monthly ad budget and number of campaigns",
      "How many services and locations you target",
      "Current account health and tracking setup",
      "Whether landing pages and creative are also needed",
    ],
    faqs: [
      { q: "What's the minimum ad budget you work with?", a: "We work best with businesses spending at least a few thousand dollars per month on ads, but the right number depends on your industry's cost-per-click and your average job value. The free calculator will give you a realistic picture." },
      { q: "Do you require long-term contracts?", a: "No. We earn the relationship month to month. Most clients stay because the numbers work, not because they're locked in." },
      { q: "Will I own my Google Ads account?", a: "Always. We build inside your own account so you keep full ownership of the data and history." },
      { q: "How soon will I see results?", a: "We usually cut obvious wasted spend in the first 30 days. Meaningful improvements in cost per lead typically show within 60–90 days as the data and bidding mature." },
    ],
  },
  {
    slug: "meta-ads",
    caseStudySlugs: ["immigration-consultant-brampton", "real-estate-team-gta", "hvac-mississauga-lead-gen"],
    proofStats: [
      { value: "−25–40%", label: "cost per lead after creative testing" },
      { value: "Weekly", label: "fresh creative tested to beat fatigue" },
      { value: "<5 min", label: "automated speed-to-lead follow-up" },
    ],
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
    symptoms: [
      "Facebook ads 'used to work' and quietly stopped",
      "You're boosting posts with no real strategy or tracking",
      "Leads come in but they're low-quality or never answer",
      "Your creative looks like everyone else's in the feed",
    ],
    whoFor: [
      "Service businesses with a strong offer and fast follow-up",
      "Brands that can supply (or let us produce) fresh creative regularly",
      "Local businesses wanting demand above pure high-intent search",
      "Owners ready to treat creative as the main performance lever",
    ],
    included: [
      "Offer & funnel strategy",
      "Weekly creative testing (static, carousel, video)",
      "Meta instant forms wired to your CRM",
      "Audience, lookalike & retargeting build",
      "Pixel / Conversions API setup",
      "Competitor ad-library intelligence",
    ],
    deliverables: [
      { title: "Offer & funnel strategy", body: "We engineer the offer and landing experience first — the lever that moves cost-per-lead the most." },
      { title: "Creative production", body: "Static, carousel and short-form video creative produced on a weekly testing cadence." },
      { title: "Lead-form integration", body: "Native Meta instant forms wired straight into your CRM with instant lead routing." },
      { title: "Audience & retargeting", body: "Cold prospecting, lookalikes and warm retargeting sequenced across the funnel." },
    ],
    platforms: [
      { name: "Lead-gen campaigns", body: "Conversion and instant-form campaigns built to bring in qualified, contactable leads." },
      { name: "Creative testing", body: "Structured weekly testing of hooks, formats and angles to drive cost per lead down." },
      { name: "Retargeting", body: "Warm sequences for site visitors, video viewers and engaged audiences." },
      { name: "Tracking & CAPI", body: "Pixel and Conversions API so Meta optimizes on real, server-side conversions." },
    ],
    process: [
      { step: "01", title: "Research", body: "We study your best customers and the ads your competitors are running." },
      { step: "02", title: "Build", body: "Offer, creative and audiences built around your highest-value service." },
      { step: "03", title: "Test", body: "Structured creative testing to find the winners fast." },
      { step: "04", title: "Scale", body: "We scale spend on proven creative while keeping CPL in range." },
    ],
    metrics: [
      "Cost per lead",
      "Lead-to-booked-job rate",
      "Creative win rate & frequency",
      "Hook rate / thumb-stop ratio",
      "ROAS on retargeting vs cold",
      "Spend by audience & angle",
    ],
    pricingFactors: [
      "Monthly ad budget and number of campaigns",
      "Creative volume produced each month",
      "Whether we build the landing page / funnel too",
      "CRM and follow-up automation requirements",
    ],
    faqs: [
      { q: "Facebook ads stopped working for us. What's different here?", a: "Most underperforming Meta accounts fail on offer and creative, not targeting. We rebuild from the offer out and test creative every week." },
      { q: "Can you use Meta lead forms?", a: "Yes — and we wire them directly into your CRM so leads are followed up in minutes, which is where most of the ROI is won or lost." },
      { q: "Do you produce the creative or do we?", a: "We can do either. Most clients use our AI-augmented creative studio so we always have fresh variations to test; if you have an in-house team we'll direct and brief them." },
    ],
  },
  {
    slug: "seo",
    caseStudySlugs: ["physiotherapy-clinic-north-york", "dental-practice-etobicoke"],
    proofStats: [
      { value: "60–90 days", label: "to first local ranking gains" },
      { value: "Top-3", label: "local map-pack visibility we target" },
      { value: "24/7", label: "leads that don't switch off with budget" },
    ],
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
    symptoms: [
      "Competitors outrank you in the local map pack",
      "You rely entirely on paid ads for every single lead",
      "Your site is slow, dated or hard to use on mobile",
      "You've never had a real keyword or content strategy",
    ],
    whoFor: [
      "Businesses that want a lead source that isn't rented from ad platforms",
      "Multi-location or multi-service businesses with room to rank locally",
      "Owners playing a 6–12 month game, not chasing overnight wins",
      "Companies pairing SEO with paid for leads now and compounding later",
    ],
    included: [
      "Technical & Core Web Vitals audit",
      "Local + on-page keyword strategy",
      "Optimized location & service pages",
      "Google Business Profile optimization",
      "Content clusters & internal linking",
      "Rank tracking & monthly reporting",
    ],
    deliverables: [
      { title: "Technical audit", body: "Core Web Vitals, crawlability, schema and site architecture fixed at the foundation." },
      { title: "Location & service pages", body: "Genuinely useful city-and-service pages — not thin doorway pages — that rank locally." },
      { title: "Google Business Profile", body: "NAP consistency, categories, services, posts and review strategy for the local pack." },
      { title: "Content & topic clusters", body: "Pillar pages and supporting articles that build topical authority over time." },
    ],
    platforms: [
      { name: "Local SEO", body: "Google Business Profile, citations, reviews and local pages to win the map pack." },
      { name: "Technical SEO", body: "Site speed, Core Web Vitals, schema and crawlability fixed at the foundation." },
      { name: "Content & on-page", body: "Pillar pages and topic clusters that build authority for your money keywords." },
      { name: "Digital PR & links", body: "Earning relevant links and mentions to build domain authority over time." },
    ],
    process: [
      { step: "01", title: "Audit", body: "Technical, on-page and local audit with a prioritized roadmap." },
      { step: "02", title: "Fix", body: "We resolve technical debt and optimize your core pages." },
      { step: "03", title: "Build", body: "Location pages, service pages and content clusters go live." },
      { step: "04", title: "Earn", body: "Ongoing content and digital PR to earn links and rankings." },
    ],
    metrics: [
      "Map-pack & local rankings",
      "Organic rankings for money keywords",
      "Organic traffic & leads",
      "Google Business Profile actions",
      "Core Web Vitals & site health",
      "Referring domains earned",
    ],
    pricingFactors: [
      "How competitive your market and keywords are",
      "Site size, technical debt and current health",
      "Content volume produced each month",
      "Number of locations and service pages targeted",
    ],
    faqs: [
      { q: "How long does SEO take?", a: "Local SEO can move in 60–90 days; competitive organic rankings typically take 6–12 months. We pair it with paid ads so you have leads from day one." },
      { q: "Do you do the content too?", a: "Yes. Our AI-augmented workflow lets us produce well-researched, on-brand content faster than a traditional agency — reviewed by a human before it ships." },
      { q: "Are the location pages just thin doorway pages?", a: "No. We build genuinely useful, distinct pages with real local context — the kind Google rewards, not the thin templates that get filtered out." },
    ],
  },
  {
    slug: "creative",
    caseStudySlugs: ["real-estate-team-gta", "immigration-consultant-brampton", "hvac-mississauga-lead-gen"],
    proofStats: [
      { value: "3–5×", label: "more creative volume vs in-house" },
      { value: "Days", label: "brief-to-live turnaround" },
      { value: "Always-on", label: "testing to outrun ad fatigue" },
    ],
    name: "Creative Production",
    short: "Scroll-stopping static, carousel and short-form video creative — AI-accelerated.",
    hero: "Creative is the single biggest lever on ad performance. We produce more of it, faster, with an AI-augmented studio.",
    description:
      "Ad creative production — statics, carousels and short-form video, with brand-locked design systems and AI-accelerated turnaround.",
    icon: Palette,
    featured: false,
    outcomes: ["More creative volume", "Faster testing cycles", "Brand-locked consistency", "Lower production cost"],
    symptoms: [
      "You run the same tired ads until they stop working",
      "Creative turnaround is too slow to test properly",
      "Production costs make volume testing impossible",
      "Your ads don't look or sound like your brand",
    ],
    whoFor: [
      "Advertisers who've hit a creative ceiling on Meta or TikTok",
      "Brands that need consistent, on-brand volume — fast",
      "Teams that want to test more angles without blowing the budget",
      "Businesses scaling spend and burning through creative quickly",
    ],
    included: [
      "Brand-locked design system",
      "Static & carousel concepts",
      "Short-form video & reels editing",
      "Hook & messaging angle testing",
      "AI-accelerated, human-reviewed production",
      "Performance feedback loop with media buying",
    ],
    deliverables: [
      { title: "Brand-locked design system", body: "A reusable system per client so every asset is on-brand and produced fast." },
      { title: "Static & carousel ads", body: "High-volume static and carousel concepts built for testing." },
      { title: "Short-form video & reels", body: "Hook-first short-form video edited for Meta, TikTok and YouTube Shorts." },
      { title: "AI-accelerated production", body: "We use an internal AI workflow to produce and iterate creative faster — every asset human-reviewed." },
    ],
    platforms: [
      { name: "Static & carousel", body: "Concept-driven image ads and carousels designed specifically for testing." },
      { name: "Short-form video", body: "Hook-first reels and shorts edited for Meta, TikTok and YouTube." },
      { name: "Design systems", body: "A reusable brand kit so every asset ships on-brand and on time." },
      { name: "AI-accelerated studio", body: "An internal AI workflow that multiplies output — directed and reviewed by humans." },
    ],
    process: [
      { step: "01", title: "Brief", body: "We lock your brand system, hooks and messaging angles." },
      { step: "02", title: "Produce", body: "We batch-produce a testing set of creative." },
      { step: "03", title: "Test", body: "Winners and losers identified in-platform." },
      { step: "04", title: "Iterate", body: "We iterate on winning concepts to keep CPL falling." },
    ],
    metrics: [
      "Creative win rate",
      "Hook rate / thumb-stop ratio",
      "Cost per lead by concept",
      "Creative volume shipped",
      "Ad fatigue / frequency",
      "Time from brief to live",
    ],
    pricingFactors: [
      "Monthly volume of concepts and edits",
      "Mix of static, carousel and video",
      "Whether we build the brand system from scratch",
      "Sourcing of footage and raw assets",
    ],
    faqs: [
      { q: "Is the AI creative obviously AI?", a: "No. We use AI to accelerate production, but every asset is directed and reviewed by our team to stay on-brand and credible." },
      { q: "Can you work with our existing brand guidelines?", a: "Yes. We lock your brand into a reusable system first, so volume never comes at the cost of consistency." },
    ],
  },
  {
    slug: "web-design",
    caseStudySlugs: ["basement-renovation-gta", "real-estate-team-gta"],
    proofStats: [
      { value: "+20–40%", label: "typical lift in landing-page conversion" },
      { value: "<2.5s", label: "Core Web Vitals load target" },
      { value: "Mobile-first", label: "where most of your clicks land" },
    ],
    name: "Websites & Landing Pages",
    short: "Conversion-focused websites and landing pages that turn clicks into leads.",
    hero: "The fastest way to lower your cost per lead is often a better landing page. We build sites engineered to convert.",
    description:
      "Conversion-focused website and landing page design and build for service businesses — fast, mobile-first and tracking-ready.",
    icon: LayoutTemplate,
    featured: false,
    outcomes: ["Higher conversion rate", "Faster load times", "Mobile-first UX", "Built-in tracking"],
    symptoms: [
      "Your ads send traffic to a slow or generic homepage",
      "Visitors land, look around and leave without converting",
      "The site is hard to use — or barely works — on mobile",
      "You can't tell which page or form produced a lead",
    ],
    whoFor: [
      "Advertisers whose landing page is the bottleneck, not the ads",
      "Service businesses with a dated or DIY website",
      "Brands launching a new offer or campaign that needs its own page",
      "Owners who want tracking and CRM wiring done right from day one",
    ],
    included: [
      "Conversion-first page strategy",
      "Custom, on-brand design",
      "Fast, mobile-first build",
      "Dedicated campaign landing pages",
      "Forms, calls & event tracking",
      "CRM & ad-platform wiring",
    ],
    deliverables: [
      { title: "Conversion-focused design", body: "Layouts engineered around a single primary action and clear proof." },
      { title: "Landing pages for ads", body: "Dedicated, fast landing pages matched to each campaign and offer." },
      { title: "Performance & Core Web Vitals", body: "Fast, accessible builds that protect both conversions and SEO." },
      { title: "Tracking & CRM wiring", body: "Forms, calls and events wired to your CRM and ad platforms." },
    ],
    platforms: [
      { name: "Landing pages", body: "Dedicated, message-matched pages for each campaign and offer." },
      { name: "Full websites", body: "Conversion-focused, fast, mobile-first websites for service businesses." },
      { name: "Performance", body: "Core Web Vitals, accessibility and speed that protect conversions and SEO." },
      { name: "Tracking setup", body: "GA4, GTM, call and form events wired to your CRM and ad platforms." },
    ],
    process: [
      { step: "01", title: "Map", body: "We map the offer, proof and primary action." },
      { step: "02", title: "Design", body: "Conversion-first design in your brand system." },
      { step: "03", title: "Build", body: "Fast, mobile-first build with tracking baked in." },
      { step: "04", title: "Optimize", body: "We A/B test and refine to lift conversion rate." },
    ],
    metrics: [
      "Landing-page conversion rate",
      "Cost per lead (vs old page)",
      "Bounce / engagement rate",
      "Core Web Vitals scores",
      "Form & call completions",
      "A/B test win rate",
    ],
    pricingFactors: [
      "Number of pages or templates",
      "Single landing page vs full website",
      "Copywriting and creative needs",
      "Integrations, tracking and CRM complexity",
    ],
    faqs: [
      { q: "Do you only build sites for ad clients?", a: "We build standalone sites and landing pages too, though most clients combine them with paid or SEO so the traffic and the page are optimized together." },
      { q: "What platform do you build on?", a: "We choose the platform around your needs — from fast modern frameworks to WordPress or a funnel builder — always prioritizing speed, tracking and ease of editing." },
    ],
  },
  {
    slug: "crm",
    caseStudySlugs: ["immigration-consultant-brampton", "hvac-mississauga-lead-gen", "dental-practice-etobicoke"],
    proofStats: [
      { value: "<5 min", label: "automated first follow-up to new leads" },
      { value: "7-day+", label: "nurture sequences for unready leads" },
      { value: "1 dashboard", label: "from ad spend to booked revenue" },
    ],
    name: "CRM & Marketing Operations",
    short: "GoHighLevel pipelines, lead routing and reporting that close the loop.",
    hero: "Leads are only worth something if they're followed up fast. We build the CRM and automation that turn leads into booked jobs.",
    description:
      "CRM setup and marketing operations — GoHighLevel pipelines, calendars, lead routing, automated follow-up and performance dashboards.",
    icon: Workflow,
    featured: false,
    outcomes: ["Faster lead follow-up", "No leads slip through", "Automated nurture", "Clear reporting"],
    symptoms: [
      "Leads sit for hours (or days) before anyone follows up",
      "Enquiries get lost in inboxes, texts and sticky notes",
      "No nurture, so 'not yet' leads quietly disappear",
      "You can't connect ad spend to actual booked revenue",
    ],
    whoFor: [
      "Businesses generating leads faster than they can follow up",
      "Owners with no central system for tracking enquiries",
      "Teams that want speed-to-lead and nurture automated",
      "Anyone who wants spend-to-revenue reporting in one place",
    ],
    included: [
      "CRM build (GoHighLevel or yours)",
      "Pipeline & lead-stage setup",
      "Speed-to-lead SMS/email automation",
      "Nurture sequences for unready leads",
      "Calendar & booking integration",
      "Spend-to-revenue dashboard",
    ],
    deliverables: [
      { title: "CRM build (GoHighLevel)", body: "Pipelines, calendars and lead routing configured to your sales process." },
      { title: "Speed-to-lead automation", body: "Instant SMS/email follow-up so new leads are contacted in minutes." },
      { title: "Nurture sequences", body: "Automated email and SMS nurture for leads that aren't ready yet." },
      { title: "Reporting dashboards", body: "One dashboard tying ad spend to leads, booked jobs and revenue." },
    ],
    platforms: [
      { name: "CRM setup", body: "Pipelines, stages and lead routing configured around your real sales process." },
      { name: "Speed-to-lead", body: "Instant SMS and email so new leads are contacted within minutes, not hours." },
      { name: "Nurture automation", body: "Long-term email/SMS sequences that revive leads who weren't ready yet." },
      { name: "Reporting", body: "A single dashboard from ad spend through to leads, booked jobs and revenue." },
    ],
    process: [
      { step: "01", title: "Map", body: "We map your sales process and lead lifecycle." },
      { step: "02", title: "Build", body: "Pipelines, automations and calendars configured." },
      { step: "03", title: "Connect", body: "Ads, forms and calls flow into one system." },
      { step: "04", title: "Report", body: "A single source of truth from spend to revenue." },
    ],
    metrics: [
      "Speed to first contact",
      "Lead-to-booked-job rate",
      "Leads worked vs missed",
      "Nurture re-engagement rate",
      "Pipeline value by stage",
      "Cost per booked job",
    ],
    pricingFactors: [
      "Number of pipelines and automations",
      "Whether we use GoHighLevel or integrate your CRM",
      "Volume of nurture sequences and templates",
      "Reporting and integration complexity",
    ],
    faqs: [
      { q: "We already use a CRM. Can you work with it?", a: "Often yes. GoHighLevel is our default because it bundles a lot, but we can integrate with most common CRMs." },
      { q: "Why does speed-to-lead matter so much?", a: "Contacting a new lead within a few minutes dramatically increases the odds of reaching and booking them. Automating that first touch is one of the highest-ROI things most businesses can fix." },
    ],
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
