export type Industry = {
  slug: string;
  name: string;
  short: string;
  hero: string;
  description: string;
  painPoints: string[];
  approach: string[];
  services: string[]; // service slugs most relevant
  faqs: { q: string; a: string }[];

  // ---- Optional "deep" blocks. Render only when present. ----
  /** Industry reality / market context paragraph(s). */
  reality?: string;
  /** Expected benchmarks & lead economics for this vertical. */
  benchmarks?: { label: string; value: string }[];
  /** Per-channel strategy (Google, Meta, SEO, website, AI). */
  playbook?: { channel: string; body: string }[];
  /** Industry-specific tactics / "hacks". */
  hacks?: string[];
  /** Sample 90-day growth plan. */
  plan90?: { window: string; title: string; body: string }[];
  /** benchmarks.ts industry slug for the embedded estimate link. */
  calculatorIndustrySlug?: string;
};

export const industries: Industry[] = [
  {
    slug: "physiotherapy",
    name: "Physiotherapy & Rehab Clinics",
    short: "Fill your schedule with high-intent patients searching for treatment now.",
    hero: "We help physiotherapy and rehab clinics turn search and social into a full appointment book — measured in booked assessments, not clicks.",
    description: "Digital marketing for physiotherapy & rehab clinics — Google Ads, SEO and Meta ads that book assessments and grow patient volume.",
    painPoints: ["Gaps in the appointment calendar", "High cost per booked patient", "Ranking on page two for local treatment searches", "No tracking of which marketing books patients"],
    approach: ["High-intent Search campaigns by condition + neighbourhood", "Booking-focused landing pages with online scheduling", "Local SEO + Google Business Profile for the map pack", "Call & form tracking tied to booked assessments"],
    services: ["google-ads", "seo", "web-design"],
    faqs: [
      { q: "Do you understand healthcare advertising rules?", a: "Yes. We keep claims compliant and avoid implying guaranteed medical outcomes, while still driving high-intent bookings." },
      { q: "Can you track phone bookings?", a: "Absolutely — many clinic patients call. We set up call tracking so we optimize to real booked assessments." },
      { q: "How fast can we expect more bookings?", a: "Paid search can lift bookings within the first few weeks once tracking and campaigns are rebuilt; local SEO compounds over 3–6 months. We pair both so you have leads now and a compounding channel later." },
      { q: "Can you help clinics with multiple practitioners or locations?", a: "Yes — we build location- and condition-specific pages and campaigns so each clinic and service line gets its own visibility and tracking." },
    ],
    calculatorIndustrySlug: "physiotherapy",
    reality:
      "Physiotherapy is high-intent and intensely local: patients search by problem — back pain, knee pain, sports injury, post-surgery rehab, pelvic floor, vestibular, WSIB or motor-vehicle-accident rehab — and usually book within a day or two of searching. That means the clinic that shows up with a fast, trustworthy, easy-to-book experience wins the assessment.\n\nThe hard part isn't traffic, it's economics and follow-up: high cost per click in competitive areas, untracked phone bookings, and calendars that swing between full and empty. Our goal is to build systems that outperform generic benchmarks by tightening tracking, conversion rate, lead quality and speed-to-book — not by simply spending more.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$4–6" },
      { label: "Booking conversion rate", value: "6–10%" },
      { label: "Avg. patient value", value: "$400–900" },
      { label: "First local ranking gains", value: "60–90 days" },
    ],
    playbook: [
      { channel: "Google Ads", body: "Structure campaigns by condition + neighbourhood (e.g. 'pelvic floor physio North York'), with rigorous negatives and call tracking so spend optimizes to booked assessments, not clicks." },
      { channel: "Meta Ads", body: "Education- and story-led campaigns around pain awareness and recovery, plus retargeting — useful for treatments patients don't yet search for by name." },
      { channel: "Local SEO", body: "Google Business Profile optimization, reviews, and genuinely useful condition + location pages to win the map pack for high-intent local searches." },
      { channel: "Website & booking", body: "Condition, treatment, insurance/payment, practitioner and location pages with online booking and click-to-call front and centre." },
      { channel: "AI & automation", body: "Missed-call and missed-lead follow-up, review requests, lead scoring and appointment reminders so fewer bookings slip through." },
    ],
    hacks: [
      "Separate WSIB and motor-vehicle-accident rehab into their own campaigns and pages — different intent, different language, often higher value.",
      "Bid hardest on condition + neighbourhood terms; they convert far better than generic 'physiotherapy near me'.",
      "Put insurance/direct-billing and 'book online' above the fold — they remove the two biggest booking objections.",
      "Use call tracking and treat a booked assessment (not a form fill) as the conversion the platforms optimize toward.",
      "Build a review-generation flow — rating and review count materially lift both map-pack rank and conversion.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Audit & tracking", body: "Fix GA4/call tracking, rebuild high-intent Search by condition + area, and launch a booking-focused landing experience." },
      { window: "Days 31–60", title: "Optimize & local", body: "Mine search terms, tune bidding to booked assessments, optimize Google Business Profile and publish condition/location pages." },
      { window: "Days 61–90", title: "Scale & compound", body: "Scale the campaigns booking patients, add retargeting and review automation, and let local SEO start compounding." },
    ],
  },
  {
    slug: "healthcare-clinics",
    name: "Healthcare & Medical Clinics",
    short: "Patient acquisition for clinics, specialists and wellness practices.",
    hero: "From multi-service clinics to specialists, we build measurable patient-acquisition systems that fill schedules and respect compliance.",
    description: "Healthcare marketing for clinics and specialists — compliant, high-intent patient acquisition through Google Ads, SEO and CRM.",
    painPoints: ["Inconsistent new-patient flow", "Untracked phone enquiries", "Compliance concerns with ad copy", "Competing with larger groups"],
    approach: ["Service-line Search campaigns with compliant messaging", "GBP and local SEO for each location", "Speed-to-lead follow-up via CRM", "Revenue-tied reporting by service line"],
    services: ["google-ads", "seo", "crm"],
    faqs: [{ q: "Can you handle multiple locations?", a: "Yes — we build location-specific campaigns and pages so each clinic gets local visibility." }],
  },
  {
    slug: "dental",
    name: "Dental & Orthodontics",
    short: "Win high-value cases — implants, Invisalign, cosmetic — in a crowded market.",
    hero: "Dentistry is one of the most competitive local categories. We focus your spend on the high-value cases and track every call.",
    description: "Dental marketing — Google Ads, SEO, reviews and CRM that win implants, Invisalign and cosmetic cases while tracking every call.",
    painPoints: ["Expensive clicks in a crowded market", "Untracked phone calls", "Inconsistent high-value case flow", "Review profile not growing"],
    approach: ["High-intent Search for implants, Invisalign, emergencies", "Call tracking on every campaign", "Review-generation flow to grow ratings", "Local SEO + service pages by neighbourhood"],
    services: ["google-ads", "seo", "crm"],
    faqs: [{ q: "How do you get more high-value cases?", a: "We bias spend and creative toward implant, ortho and cosmetic intent rather than cheap, low-value searches." }, { q: "Can you track phone calls to specific campaigns?", a: "Yes — call tracking ties every booked call back to the campaign and keyword that drove it, so we optimize to new patients, not clicks." }],
    calculatorIndustrySlug: "dental",
    reality:
      "Dentistry is one of the most competitive and expensive local categories, and the money is concentrated in a few high-value cases — implants, Invisalign/ortho, cosmetic and emergencies. Most practices waste budget on cheap, low-intent clicks and lose the real ROI because phone calls go untracked. The win comes from biasing spend toward high-value intent, tracking every call, and protecting a strong review profile.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$6–9" },
      { label: "Booking conversion rate", value: "6–9%" },
      { label: "Avg. case value", value: "$1,000–6,000+" },
      { label: "Calls now tracked", value: "target 100%" },
    ],
    playbook: [
      { channel: "Google Ads", body: "High-intent Search for implants, Invisalign, cosmetic and emergency dentistry, with call tracking on every campaign." },
      { channel: "Meta Ads", body: "Cosmetic and Invisalign demand-gen with before/after-style social proof and retargeting." },
      { channel: "Local SEO", body: "Google Business Profile, reviews and neighbourhood service pages to win the local map pack." },
      { channel: "AI & CRM", body: "Speed-to-lead and front-desk follow-up so booked calls don't slip, plus review automation." },
    ],
    hacks: [
      "Split high-value services (implants, Invisalign) into their own campaigns — never let them share budget with cheap cleanings.",
      "Run emergency-dentist campaigns with call-only formats during opening hours.",
      "Make call tracking the primary conversion; most dental ROI happens on the phone.",
      "Invest in a review-generation flow — rating and recency move both rankings and conversion in a crowded market.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Track & focus", body: "Call tracking live, budget refocused on high-value case intent, landing pages tightened." },
      { window: "Days 31–60", title: "Local & optimize", body: "GBP and neighbourhood SEO pages, search-term mining, review flow launched." },
      { window: "Days 61–90", title: "Scale", body: "Scale the campaigns producing high-value cases and add retargeting." },
    ],
  },
  {
    slug: "hvac",
    name: "HVAC & Home Comfort",
    short: "Predictable install and service leads — through every season.",
    hero: "We smooth out seasonal swings and follow up leads in minutes, so you book more installs and service calls at a lower cost.",
    description: "HVAC marketing — Google & Meta ads, speed-to-lead automation and reporting that book installs and service calls year-round.",
    painPoints: ["Seasonal demand swings", "Expensive clicks in peak season", "Leads going uncontacted", "No clarity on cost per install"],
    approach: ["Service-split Search with seasonal budget pacing", "Meta lead-gen for tune-ups and replacements", "Speed-to-lead SMS + call automation", "Unified dashboard from spend to installs"],
    services: ["google-ads", "meta-ads", "crm"],
    faqs: [{ q: "Can you handle the seasonal swings?", a: "Yes — we pace budgets and shift between demand-gen and high-intent depending on the season." }, { q: "How do you stop leads going cold?", a: "Speed-to-lead automation contacts every new lead within minutes by SMS and call, which is where most HVAC jobs are won or lost." }],
    calculatorIndustrySlug: "hvac",
    reality:
      "HVAC demand is seasonal and spiky — furnace emergencies in the cold, AC in the heat — so clicks get expensive exactly when you need them. Two things decide profitability: pacing budget to demand by service (furnace, AC, maintenance, install), and contacting leads within minutes before a competitor does. Most lost jobs aren't a targeting problem; they're a follow-up-speed problem.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$9–13" },
      { label: "Lead conversion rate", value: "6–8%" },
      { label: "Avg. job / install value", value: "$300–8,000+" },
      { label: "Speed-to-lead target", value: "<5 min" },
    ],
    playbook: [
      { channel: "Google Ads", body: "Service-split Search (furnace, AC, maintenance, install) with seasonal budget pacing and call-only formats for emergencies." },
      { channel: "Meta Ads", body: "Tune-up and replacement lead-gen with short-form video, plus retargeting for longer install decisions." },
      { channel: "Local SEO", body: "Service-area pages, Google Business Profile and reviews to capture 'near me' emergency demand." },
      { channel: "AI & CRM", body: "Speed-to-lead SMS + call automation and a spend-to-installs dashboard so budget follows what books." },
    ],
    hacks: [
      "Pace budget to weather and season — pull back when demand is thin, push hard in peak.",
      "Separate emergency intent and run call-only ads during opening hours.",
      "Speed-to-lead is the single biggest lever — automate first contact within minutes.",
      "Track to booked installs, not raw leads, so budget shifts to revenue not noise.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Audit & speed-to-lead", body: "Rebuild service-split Search, wire call tracking and instant lead follow-up." },
      { window: "Days 31–60", title: "Optimize & local", body: "Seasonal pacing, search-term mining, service-area SEO and Meta lead-gen." },
      { window: "Days 61–90", title: "Scale", body: "Scale by service line and connect spend to booked installs in one dashboard." },
    ],
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    short: "Be the first call for emergencies and the trusted name for projects.",
    hero: "When a pipe bursts, the fastest, most visible plumber wins. We make sure that's you — and we track every call.",
    description: "Plumbing marketing — high-intent Google Ads, Local Services, call tracking and SEO that win emergency and project work.",
    painPoints: ["Missed emergency calls", "Low visibility vs larger competitors", "Untracked phone leads", "Inconsistent project work"],
    approach: ["Emergency + project Search campaigns", "Call tracking and click-to-call optimization", "Local SEO + Google Business Profile", "Remarketing for larger projects"],
    services: ["google-ads", "seo", "crm"],
    faqs: [{ q: "Do you do Local Services Ads?", a: "Where they're available and a fit, yes — we'll recommend the mix that produces the cheapest qualified calls." }],
  },
  {
    slug: "electrical",
    name: "Electrical Contractors",
    short: "Steady residential and commercial electrical leads that convert.",
    hero: "From panel upgrades to EV chargers, we put your electrical business in front of homeowners and businesses ready to hire.",
    description: "Electrician marketing — Google Ads, SEO and lead automation that generate residential and commercial electrical jobs.",
    painPoints: ["Inconsistent lead flow", "Competing on price", "Untracked phone enquiries", "No clear ROI by service"],
    approach: ["Service-based Search (panels, EV chargers, rewiring)", "Trust-led landing pages with licensing & reviews", "Call & form tracking", "Local SEO for each service area"],
    services: ["google-ads", "seo", "web-design"],
    faqs: [{ q: "Can you target commercial jobs too?", a: "Yes — we build separate campaigns and messaging for residential vs commercial intent." }],
  },
  {
    slug: "construction-renovation",
    name: "Construction & Renovation",
    short: "High-ticket, high-quality leads for renovators and builders.",
    hero: "Renovation leads are expensive — so quality is everything. We filter out tire-kickers and put your portfolio front and centre.",
    description: "Construction & renovation marketing — qualified, high-ticket lead generation with portfolio-led landing pages and remarketing.",
    painPoints: ["Expensive, inconsistent leads", "Low-quality quote requests", "Site doesn't build trust", "Long decision cycles"],
    approach: ["High-intent Search by service and city", "Portfolio-led landing pages with financing", "Qualifying questions to filter leads", "Remarketing across long decision cycles"],
    services: ["google-ads", "web-design", "meta-ads"],
    faqs: [{ q: "How do you improve lead quality?", a: "We add qualifying questions and trust signals so the leads that come through are ready to build, not just browsing." }],
  },
  {
    slug: "roofing",
    name: "Roofing",
    short: "Own storm-season demand and high-value replacement jobs.",
    hero: "Roofing demand spikes fast. We make sure you capture it — with high-intent campaigns and instant lead follow-up.",
    description: "Roofing marketing — Google & Meta ads, landing pages and automation that capture replacement and repair demand.",
    painPoints: ["Demand spikes you can't capture", "Expensive clicks", "Slow lead follow-up", "Inconsistent high-value jobs"],
    approach: ["Repair + replacement Search campaigns", "Storm/seasonal demand-gen on Meta", "Speed-to-lead automation", "Financing-led landing pages"],
    services: ["google-ads", "meta-ads", "web-design"],
    faqs: [{ q: "Can you scale fast during storm season?", a: "Yes — we keep proven campaigns ready and scale budget quickly when demand surges." }],
  },
  {
    slug: "immigration",
    name: "Immigration Consulting",
    short: "Booked consultations and signed clients — with a system that follows up.",
    hero: "We build segmented campaigns by program and automate follow-up, so more leads turn into booked consultations and signed clients.",
    description: "Immigration consultant marketing — Meta & Google lead-gen plus CRM nurture that book consultations and convert clients.",
    painPoints: ["Leads going cold", "No follow-up system", "Can't tell which campaigns produce clients", "High cost per consultation"],
    approach: ["Program-segmented lead campaigns (study, work, PR)", "CRM with instant follow-up + multi-day nurture", "Consultation and signed-client tracking", "Localized, multilingual creative"],
    services: ["meta-ads", "google-ads", "crm"],
    faqs: [{ q: "Do you keep messaging compliant?", a: "Yes — we avoid implying guaranteed immigration outcomes and keep claims honest and compliant." }],
  },
  {
    slug: "law-firms",
    name: "Law Firms & Legal",
    short: "High-value case acquisition in one of the most competitive categories.",
    hero: "Legal clicks are some of the most expensive online. We make every one count — with high-intent targeting and call tracking.",
    description: "Law firm marketing — high-intent Google Ads, SEO and intake tracking that win high-value cases efficiently.",
    painPoints: ["Extremely high cost per click", "Wasted spend on non-cases", "Untracked intake calls", "Competing with large firms"],
    approach: ["Practice-area Search with tight negatives", "Call tracking and intake optimization", "Trust-led landing pages", "Local SEO by practice area + city"],
    services: ["google-ads", "seo", "web-design"],
    faqs: [{ q: "Legal clicks are so expensive — is it worth it?", a: "With tight targeting, strong intake and call tracking, even pricey clicks pay off when case values are high. The calculator shows the math for your practice area." }],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    short: "A predictable buyer & seller pipeline beyond referrals.",
    hero: "We build home-valuation and listing lead systems so your pipeline isn't 100% referral-dependent.",
    description: "Real estate marketing — Meta lead-gen, valuation landing pages and CRM that build a predictable buyer & seller pipeline.",
    painPoints: ["Referral-only, unpredictable pipeline", "No online lead system", "Leads not followed up", "Unclear ROI"],
    approach: ["Valuation + listing lead campaigns on Meta", "High-converting valuation landing pages", "Automatic lead routing to agents", "Weekly creative iteration"],
    services: ["meta-ads", "web-design", "crm"],
    faqs: [{ q: "Do these leads actually close?", a: "With fast follow-up and nurture, yes — real estate is a long game, so the CRM and automation are as important as the ads." }],
  },
  {
    slug: "home-improvement",
    name: "Home Improvement & Remodeling",
    short: "Qualified project leads for windows, kitchens, decks and more.",
    hero: "We connect home-improvement businesses with homeowners actively planning projects — and filter the leads so your team talks to buyers.",
    description: "Home improvement marketing — Google & Meta ads and landing pages that generate qualified remodeling and improvement leads.",
    painPoints: ["Inconsistent project leads", "Low-quality enquiries", "Seasonal swings", "Long sales cycles"],
    approach: ["Project-specific Search and Meta campaigns", "Portfolio + financing landing pages", "Lead qualifying and remarketing", "Seasonal budget planning"],
    services: ["google-ads", "meta-ads", "web-design"],
    faqs: [{ q: "Can you focus on one product line?", a: "Yes — we can concentrate on your most profitable product (e.g. windows or kitchens) and scale from there." }],
  },
  {
    slug: "fitness-gyms",
    name: "Fitness & Gyms",
    short: "Fill memberships and trials with low-cost, high-converting campaigns.",
    hero: "Fitness audiences convert well on social. We build trial and membership offers that fill your floor at a low cost per lead.",
    description: "Fitness & gym marketing — Meta and Google campaigns with trial offers and automation that grow memberships affordably.",
    painPoints: ["Empty class times", "High churn", "Inconsistent trial sign-ups", "No follow-up on leads"],
    approach: ["Trial + membership offers on Meta", "Local Search for 'gym near me' intent", "Speed-to-lead and nurture automation", "Creative testing to keep CPL low"],
    services: ["meta-ads", "google-ads", "crm"],
    faqs: [{ q: "Do you help with retention too?", a: "We focus on acquisition, but the CRM nurture we set up also supports onboarding and re-engagement." }],
  },
  {
    slug: "med-spa",
    name: "Med Spa & Aesthetics",
    short: "High-value aesthetic clients through polished social and search.",
    hero: "Aesthetics is visual and trust-driven. We pair scroll-stopping creative with high-intent search to book premium treatments.",
    description: "Med spa & aesthetics marketing — Meta creative, Google Ads and CRM that book high-value aesthetic treatments.",
    painPoints: ["Inconsistent high-value bookings", "Creative that doesn't stand out", "No-shows and weak follow-up", "Competing on price"],
    approach: ["Treatment-led Meta creative and offers", "High-intent Search for premium treatments", "Booking + reminder automation to cut no-shows", "Local SEO and reviews"],
    services: ["meta-ads", "creative", "crm"],
    faqs: [{ q: "Is creative included?", a: "Yes — strong creative is the biggest lever in aesthetics, so our studio produces it on an ongoing testing cadence." }],
  },
  {
    slug: "professional-services",
    name: "Professional & B2B Services",
    short: "Qualified enquiries for accountants, consultants, finance and more.",
    hero: "We generate qualified enquiries for professional and B2B service firms — and build the follow-up that turns them into clients.",
    description: "Professional & B2B services marketing — Google Ads, LinkedIn/Meta and CRM that generate qualified enquiries and clients.",
    painPoints: ["Inconsistent enquiry flow", "Long sales cycles", "Low-quality leads", "No nurture system"],
    approach: ["High-intent Search by service", "Lead-gen on Meta/LinkedIn with gated value", "Multi-touch nurture in CRM", "Revenue-tied reporting"],
    services: ["google-ads", "meta-ads", "crm"],
    faqs: [{ q: "Do you handle B2B as well as B2C?", a: "Yes — for B2B we lean on high-intent search and longer nurture sequences suited to considered purchases." }],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
