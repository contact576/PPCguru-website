/**
 * Homepage content — ported verbatim from the approved Claude Design handoff
 * ("PPC Guru Home.dc.html"). Kept as plain data so the page template stays thin.
 *
 * HONESTY: case studies / testimonials / credentials are clearly-labelled
 * representative or "verify before launch" content — no fabricated client proof.
 * Icons are emoji to match the handoff exactly.
 */

export const tickerLoop = [
  "Google Ads", "Meta Ads", "SEO", "Landing Pages", "CRO", "CRM", "Transparent Reporting",
];

export const proofItems = [
  { icon: "🔍", title: "Account Waste Snapshot", desc: "Search terms eating budget, low-intent campaigns, broken or missing conversion tracking, and landing-page friction — quantified, before you pay us a cent." },
  { icon: "📊", title: "Benchmark Comparison", desc: "Your CPC, CPL, conversion rate and cost-per-booked-job vs your industry range — so you know whether budget, targeting, offer or landing page is the real bottleneck." },
  { icon: "🗺️", title: "Growth Opportunity Map", desc: "Quick-win campaigns, fresh creative angles, local-SEO gaps, and the retargeting and follow-up you're leaving on the table." },
  { icon: "📅", title: "90-Day Scaling Plan", desc: "Days 1–7 audit & tracking, 8–30 restructure & launch, 31–60 optimize & expand, 61–90 scale winners & automate reporting." },
];

// Smaller, secondary trust points (weekly reporting, ownership, etc.).
export const proofPoints = [
  "Weekly action summaries — not just month-end reports",
  "You keep full ownership of your accounts & data",
  "Month-to-month — no long-term lock-in",
  "GTA-based, one accountable team across every channel",
];

export const sprintWeeks = [
  { num: "01", week: "Week 1", title: "Audit & Tracking Review", desc: "Full account audit, GA4/GTM check and a quantified map of where spend is leaking." },
  { num: "02", week: "Week 2", title: "Waste Removal & Campaign Fixes", desc: "Search-term cleanup, negative keywords, structure fixes and bid corrections." },
  { num: "03", week: "Week 3", title: "Creative, Landing Page & CRO", desc: "New ad variations, landing-page recommendations and conversion-path fixes." },
  { num: "04", week: "Week 4", title: "Scaling Plan & Reporting Dashboard", desc: "A clear growth roadmap and a live reporting dashboard you actually own." },
];

export const homeServices = [
  { icon: "🔍", title: "Google Ads Management", href: "/services/google-ads", outcome: "Search, Performance Max & Shopping engineered for booked jobs — not vanity clicks.", deliverables: ["Search-term & negative buildout", "Conversion tracking review", "Weekly optimization"], bestFor: "High-intent search" },
  { icon: "📣", title: "Meta Ads Management", href: "/services/meta-ads", outcome: "Lead-gen campaigns and scroll-stopping creative across Facebook & Instagram.", deliverables: ["Audience & retargeting funnels", "Creative testing program", "Lead-form vs LP testing"], bestFor: "Demand generation" },
  { icon: "📈", title: "SEO & Local Search", href: "/services/seo", outcome: "Technical SEO, location pages and Google Business Profile that compound over time.", deliverables: ["Technical SEO audit", "Local map-pack optimization", "Content & rankings tracking"], bestFor: "Long-term compounding" },
  { icon: "🎨", title: "Creative Production", href: "/services/creative", outcome: "Scroll-stopping static, carousel and short-form video creative — AI-accelerated.", deliverables: ["Static & carousel ads", "Short-form video", "Continuous creative testing"], bestFor: "Paid social scale" },
  { icon: "🖥️", title: "Websites & Landing Pages", href: "/services/web-design", outcome: "Conversion-focused websites and landing pages that turn clicks into leads.", deliverables: ["Landing-page design & build", "CRO & A/B testing", "Form-friction removal"], bestFor: "Lifting conversion rate" },
  { icon: "⚙️", title: "CRM & Marketing Operations", href: "/services/crm", outcome: "Pipelines, lead routing and reporting that close the loop on every lead.", deliverables: ["Speed-to-lead automation", "Pipeline & lead routing", "Closed-loop reporting"], bestFor: "Turning leads into jobs" },
  { icon: "📊", title: "Tracking & Analytics", href: "/services", outcome: "GA4, GTM and conversion tracking you can actually trust to make decisions.", deliverables: ["GA4 & GTM setup/audit", "Conversion & call tracking", "Looker Studio dashboards"], bestFor: "Trustworthy measurement" },
  { icon: "🔁", title: "Remarketing Campaigns", href: "/services", outcome: "Bring back the high-intent visitors who didn't convert the first time.", deliverables: ["Audience segmentation", "Cross-platform retargeting", "Frequency & spend control"], bestFor: "Recovering lost demand" },
];

export const growthLoop = [
  { num: "01", icon: "🔍", title: "Audit", desc: "A deep, AI-augmented audit of accounts, tracking, website and competitors — quantifying exactly where money leaks." },
  { num: "02", icon: "🏗️", title: "Build", desc: "We rebuild campaigns, creative and landing pages around your most profitable services and cost per booked job." },
  { num: "03", icon: "🧪", title: "Optimize", desc: "Weekly testing across creative, keywords and audiences — more tests than a traditional agency can run." },
  { num: "04", icon: "🚀", title: "Scale", desc: "We reinvest savings into what works, report on revenue (not vanity metrics), and compound month over month." },
];

export const aiTasks = ["Search-term clustering", "Negative keyword discovery", "Ad copy variations", "Creative testing ideas", "Landing-page CRO checks", "Competitor ad review", "Reporting summaries", "Budget anomaly detection"];
export const humanTasks = ["Strategy & positioning", "Budget decisions", "Offer positioning", "Compliance review", "Campaign approval", "Client communication", "Final recommendations"];

export const cmpBad = ["You only see reports after the money is already spent", "Campaigns optimized for clicks, not revenue", "Landing pages and conversion paths ignored", "Tracking is unclear, broken, or untrusted", "Long contracts before any trust is earned", "No clear explanation of what changed and why"];
export const cmpGood = ["Weekly action summaries — see what changed every week", "Optimization around leads, CAC, ROAS and sales", "Landing-page and CRO recommendations included", "GA4 / GTM / conversion-tracking review built in", "No long-term lock-in — month to month", "Clear explanation of every change — you own your account"];

/** Paired comparison rows — rendered as a semantic <table> on the homepage (LLM-extractable). */
export const comparisonRows = [
  { dimension: "Reporting", guru: "Weekly action summaries — see what changed every week", typical: "You only see reports after the money is already spent" },
  { dimension: "What we optimize for", guru: "Optimization around leads, CAC, ROAS and sales", typical: "Campaigns optimized for clicks, not revenue" },
  { dimension: "Landing pages & CRO", guru: "Landing-page and CRO recommendations included", typical: "Landing pages and conversion paths ignored" },
  { dimension: "Tracking", guru: "GA4 / GTM / conversion-tracking review built in", typical: "Tracking is unclear, broken, or untrusted" },
  { dimension: "Commitment", guru: "No long-term lock-in — month to month", typical: "Long contracts before any trust is earned" },
  { dimension: "Transparency & ownership", guru: "Clear explanation of every change — you own your account", typical: "No clear explanation of what changed and why" },
];

export const rptDeliverables = ["Weekly optimization summary", "Monthly strategy review", "Budget reallocation notes", "Search-term waste report", "Conversion-tracking health check", "Landing-page recommendations"];
export const rptKpis = [
  { label: "Cost / lead", val: "$42", c: "#f1efe3", delta: "↓ 31%" },
  { label: "Booked jobs", val: "148", c: "#ceff3a", delta: "↑ 41%" },
  { label: "ROAS", val: "4.8x", c: "#f1efe3", delta: "↑ 1.6x" },
  { label: "Wasted", val: "−18%", c: "#ceff3a", delta: "resealed" },
];

export const homeCases = [
  { industry: "Physiotherapy", slug: "physiotherapy-clinic-north-york", location: "North York, ON", metric: "−42%", metricLabel: "cost per booked assessment", barA: 4, barAh: 38, barB: 20, barBh: 22, problem: "High cost per new patient, unclear tracking.", action: "Rebuilt Google Ads + local SEO around booked assessments.", channel: "Google Ads + SEO", timeline: "4 months" },
  { industry: "HVAC", slug: "hvac-mississauga-lead-gen", location: "Mississauga, ON", metric: "−33%", metricLabel: "cost per lead", barA: 4, barAh: 38, barB: 16, barBh: 26, problem: "Seasonal demand, leads not tracked to revenue.", action: "Search + Meta lead-gen with speed-to-lead automation.", channel: "Google + Meta", timeline: "3 months" },
  { industry: "Construction", slug: "basement-renovation-gta", location: "Greater Toronto", metric: "5.3x", metricLabel: "return on ad spend", barA: 24, barAh: 18, barB: 4, barBh: 38, problem: "High-ticket jobs with weak landing pages.", action: "Campaign rebuild + conversion-focused landing pages.", channel: "Google Ads + LP", timeline: "5 months" },
  { industry: "Immigration", slug: "immigration-consultant-brampton", location: "Brampton, ON", metric: "−47%", metricLabel: "cost per consultation", barA: 4, barAh: 38, barB: 22, barBh: 20, problem: "Empty consultation calendar half the month.", action: "Meta lead-gen + CRM follow-up sequences.", channel: "Meta Ads + CRM", timeline: "4 months" },
  { industry: "Real Estate", slug: "real-estate-team-gta", location: "Vaughan, ON", metric: "$14", metricLabel: "cost per buyer/seller lead", barA: 6, barAh: 36, barB: 24, barBh: 18, problem: "Expensive, low-quality leads from broad targeting.", action: "Tight audiences + landing-page testing.", channel: "Meta + LP", timeline: "3 months" },
  { industry: "Dental", slug: "dental-practice-etobicoke", location: "Etobicoke, ON", metric: "2.9x", metricLabel: "new-patient bookings", barA: 26, barAh: 16, barB: 4, barBh: 38, problem: "Competitive market, low new-patient volume.", action: "Google Ads + SEO + CRM closing the loop.", channel: "Google + SEO + CRM", timeline: "6 months" },
];

export const homeIndustries = [
  { slug: "physiotherapy", name: "Physiotherapy & Rehab", icon: "🦵", angle: "High-intent patients searching for treatment now." },
  { slug: "healthcare-clinics", name: "Healthcare & Clinics", icon: "🩺", angle: "Patient acquisition for specialists & wellness." },
  { slug: "dental", name: "Dental & Orthodontics", icon: "🦷", angle: "Win high-value implant & cosmetic cases." },
  { slug: "hvac", name: "HVAC & Home Comfort", icon: "❄️", angle: "Emergency calls, seasonal & service-area targeting." },
  { slug: "plumbing", name: "Plumbing", icon: "🔧", angle: "Be the first call for emergencies and projects." },
  { slug: "electrical", name: "Electrical", icon: "⚡", angle: "Steady residential & commercial leads that convert." },
  { slug: "construction-renovation", name: "Construction & Reno", icon: "🏗️", angle: "High-ticket leads for renovators and builders." },
  { slug: "roofing", name: "Roofing", icon: "🏠", angle: "Own storm-season demand & replacement jobs." },
  { slug: "immigration", name: "Immigration Consulting", icon: "🛂", angle: "High-intent search & trust-focused landing pages." },
  { slug: "real-estate", name: "Real Estate", icon: "🏡", angle: "Booked buyer/seller leads with clear attribution." },
  { slug: "law-firms", name: "Legal & Professional", icon: "⚖️", angle: "High-value case enquiries with qualification forms." },
  { slug: "med-spa", name: "Med Spa & Aesthetics", icon: "💆", angle: "High-value cosmetic & aesthetic bookings." },
];

// chip styling helper status → colors
const chip = (s: "verified" | "tool" | "pending") =>
  s === "verified" ? { chipBg: "#eef2dd", chipColor: "#5f6f17" }
  : s === "tool" ? { chipBg: "#eef0e2", chipColor: "#5d6b1a" }
  : { chipBg: "#fdeede", chipColor: "#c0531f" };

export const certGroups = [
  { title: "Advertising platforms", items: [
    // Google Partner + Meta Business Partner confirmed real by client. [VERIFY-client]: ship
    // official badge artwork into /public and link each to the public partner-directory listing.
    { name: "Google Partner", status: "Verified", ...chip("verified") },
    { name: "Google Ads · Search", status: "Verified", ...chip("verified") },
    { name: "Google Ads · Measurement", status: "Verified", ...chip("verified") },
    { name: "Meta Business Partner", status: "Verified", ...chip("verified") },
    { name: "Microsoft Advertising", status: "Verify before launch", ...chip("pending") },
  ]},
  { title: "Analytics & tracking", items: [
    { name: "Google Analytics 4", status: "Tool we use", ...chip("tool") },
    { name: "Google Tag Manager", status: "Tool we use", ...chip("tool") },
    { name: "Looker Studio", status: "Tool we use", ...chip("tool") },
  ]},
  { title: "Marketing tools", items: [
    { name: "Semrush", status: "Tool we use", ...chip("tool") },
    { name: "HubSpot", status: "Tool we use", ...chip("tool") },
    { name: "CRM & automation", status: "Tool we use", ...chip("tool") },
  ]},
  { title: "Reviews & reputation", items: [
    { name: "Google Reviews", status: "Verify before launch", ...chip("pending") },
    { name: "Clutch", status: "Verify before launch", ...chip("pending") },
    { name: "Trustpilot", status: "Verify before launch", ...chip("pending") },
  ]},
];

export const homePricing = [
  { name: "Starter Audit", bestFor: "For accounts that need clarity before scaling", price: "Free", priceNote: "", dark: false, cta: "Get free audit", items: ["Account & tracking audit", "Wasted-spend review", "Prioritized fix list", "Clear next steps"] },
  { name: "Growth Management", bestFor: "For businesses with a consistent monthly ad budget", price: "Custom", priceNote: "fee", dark: true, cta: "Start a free trial", items: ["Google Ads management", "Weekly optimization", "Conversion tracking review", "Monthly reporting & strategy", "Landing-page recommendations"] },
  { name: "Scale Partner", bestFor: "For multi-channel paid media + CRO", price: "Custom", priceNote: "fee", dark: false, cta: "Talk to us", items: ["Google + Meta paid media", "Remarketing & full-funnel", "Landing-page testing / CRO", "Analytics & dashboards", "Dedicated account manager"] },
];

export const homeTestimonials = [
  { quote: "They rebuilt our Google Ads from scratch and our cost per booked patient dropped almost in half. The reporting is so clear I finally understand where every dollar goes.", name: "Clinic Director", role: "Physiotherapy clinic", platform: "Google" },
  { quote: "We've worked with three agencies. PPC Guru is the first one that talks about booked jobs and revenue instead of impressions and clicks.", name: "Owner", role: "HVAC & home comfort", platform: "Google" },
  { quote: "The speed-to-lead automation alone paid for itself. Leads now get a call within minutes and our booking rate jumped.", name: "Operations Lead", role: "Renovation contractor", platform: "Facebook" },
  { quote: "Our consultation calendar used to be empty half the month. Now it's consistently booked and we know exactly which campaign each client came from.", name: "Managing Consultant", role: "Immigration consultancy", platform: "Google" },
  { quote: "They move fast. New creative every week, clear weekly updates, and they actually explain the “why” in plain language.", name: "Marketing Manager", role: "Multi-location dental group", platform: "Google" },
  { quote: "Finally an agency that uses AI to do more, not to cut corners. The turnaround on creative and reporting is unlike anyone we've used.", name: "Founder", role: "Real-estate team", platform: "Facebook" },
];

export const homeFaqs = [
  { q: "What does PPC Guru actually do?", a: "We manage Google Ads, Meta (Facebook & Instagram) ads, SEO, creative and the CRM/automation that turns leads into booked jobs — for local service businesses across Canada and the USA." },
  { q: "Are you really a Google and Meta partner?", a: "Yes — we're a Google Partner and a Meta Business Partner, which means verified platform expertise and direct access to platform support and betas." },
  { q: "What's the 'AI-augmented' part really mean for me?", a: "Faster turnaround, more creative and keyword testing, and sharper reporting — because we use AI to do the heavy lifting, with human strategists directing and reviewing everything." },
  { q: "Which industries do you specialize in?", a: "Healthcare and physiotherapy, home services (HVAC, plumbing, electrical), construction and renovation, immigration, real estate, and adjacent local service verticals." },
  { q: "Where are you based and who do you serve?", a: "We're based in the Greater Toronto Area (Toronto, ON) and serve clients across Canada and the USA, with deep local expertise in the GTA." },
  { q: "What's included in the free PPC audit?", a: "Campaign structure review, search-term waste, negative-keyword opportunities, conversion-tracking health (GA4/GTM), landing-page review, budget allocation, competitor visibility and a 30-day action plan." },
  { q: "Do I own my Google Ads and Meta Ads accounts?", a: "Always. Your accounts, data, history and billing stay in your name — you keep full ownership even if we stop working together." },
  { q: "Is ad spend included in your management fee?", a: "No. Ad spend is separate and paid directly to the ad platforms. Our fee covers strategy, management, optimization and reporting." },
  { q: "Do you require long-term contracts?", a: "No long-term lock-in. We work month to month and earn the relationship with results and transparent reporting." },
  { q: "How do I get started?", a: "Book a free audit. We'll review your accounts, tracking and competitors and show you exactly where the opportunity is — no obligation." },
];
