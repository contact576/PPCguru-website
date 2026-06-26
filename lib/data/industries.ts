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
    reality:
      "Clinics, specialists and wellness practices compete for high-intent patients against larger groups and hospital networks, often with tighter budgets. The category is also compliance-sensitive — claims have to stay honest and avoid implying guaranteed outcomes — which scares some practices away from advertising that actually works.\n\nThe winners run campaigns by service line (not one generic 'clinic' campaign), track phone enquiries (where most bookings happen), and respond fast. For multi-location practices, per-location visibility and pages are what separate a full schedule from an empty one.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$4–8" },
      { label: "Booking conv. rate", value: "6–10%" },
      { label: "Avg. patient value", value: "$200–1,500+" },
      { label: "Calls now tracked", value: "target 100%" },
    ],
    playbook: [
      { channel: "Google Ads", body: "Service-line Search with compliant messaging and call tracking, so spend optimizes to booked patients, not clicks." },
      { channel: "Local SEO", body: "Google Business Profile and location pages for each clinic, plus a review flow to win the local map pack." },
      { channel: "Website & booking", body: "Service and location pages with online booking and click-to-call front and centre." },
      { channel: "AI & CRM", body: "Speed-to-lead follow-up, appointment reminders and review automation so fewer bookings slip." },
    ],
    hacks: [
      "Run each service line as its own campaign — generic 'clinic' campaigns waste budget.",
      "Make the tracked phone booking the conversion; most clinic bookings happen by call.",
      "Build a per-location GBP + reviews flow for multi-site practices.",
      "Keep copy compliant — drive high intent without implying guaranteed medical outcomes.",
      "Use reminders and recalls to cut no-shows and re-activate lapsed patients.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Track & structure", body: "Wire call tracking, rebuild Search by service line, and tighten compliant landing pages." },
      { window: "Days 31–60", title: "Local & optimize", body: "Optimize GBP and location pages, mine search terms, and launch a review flow." },
      { window: "Days 61–90", title: "Scale", body: "Scale the service lines booking patients and add reminder/recall automation." },
    ],
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
    reality:
      "Plumbing splits into two very different jobs: emergencies (a burst pipe at 2am, where the fastest, most visible plumber wins) and planned projects (repipes, water heaters, bathroom renos, where trust and reviews decide). Emergencies are phone-driven and time-critical; most are won or lost on whether the call gets answered.\n\nThe biggest leaks are untracked calls and missed calls. The plumbers who win run call-only emergency ads during opening hours, capture project work with Search and SEO, and text back every missed call automatically.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$8–18" },
      { label: "Lead conversion rate", value: "7–10%" },
      { label: "Avg. job value", value: "$200–6,000+" },
      { label: "Speed-to-lead target", value: "<5 min" },
    ],
    playbook: [
      { channel: "Google Ads", body: "Call-only emergency Search during opening hours plus project campaigns, with Local Services Ads where available for cheap qualified calls." },
      { channel: "Local SEO", body: "Service-area pages, Google Business Profile and reviews to capture 'plumber near me' demand." },
      { channel: "Website", body: "One-tap call, reviews and trust signals up top, with financing on larger projects." },
      { channel: "AI & CRM", body: "Instant follow-up and missed-call text-back so no emergency lead goes to a competitor." },
    ],
    hacks: [
      "Run call-only ads during business hours — emergencies are decided on the phone.",
      "Use Local Services Ads where available for some of the cheapest qualified calls.",
      "Automate missed-call text-back — it recovers jobs you'd otherwise lose.",
      "Separate emergency from project intent; the messaging and follow-up differ.",
      "Grow reviews relentlessly — they decide both ranking and the click.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Capture calls", body: "Launch call-only emergency Search, wire call tracking and missed-call text-back." },
      { window: "Days 31–60", title: "Local & projects", body: "Build service-area SEO and project campaigns, mine search terms, and grow reviews." },
      { window: "Days 61–90", title: "Scale", body: "Scale the campaigns producing booked jobs and tune toward the most profitable services." },
    ],
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
    reality:
      "Electrical work spans low-value calls and high-value projects — panel upgrades, EV-charger installs, rewiring, generators — and residential vs commercial behave completely differently. Lumping them together means paying premium clicks for jobs that don't pay back. Because it's licensed, safety-critical work, trust signals (licensing, insurance, reviews) do a lot of the converting.\n\nThe winners bias spend toward high-value services, split residential and commercial, and make licensing and reviews obvious on the landing page so a homeowner feels safe booking.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$6–14" },
      { label: "Lead conversion rate", value: "6–9%" },
      { label: "Avg. job value", value: "$300–10,000+" },
      { label: "Calls now tracked", value: "target 100%" },
    ],
    playbook: [
      { channel: "Google Ads", body: "Service-based Search (panel upgrades, EV chargers, rewiring, generators) with residential and commercial split into separate campaigns." },
      { channel: "Local SEO", body: "Service-area pages, Google Business Profile and reviews for 'electrician near me' demand." },
      { channel: "Website", body: "Trust-led pages with licensing, insurance, reviews and click-to-call to convert safety-conscious buyers." },
      { channel: "AI & CRM", body: "Speed-to-lead follow-up and quote chasing so estimates don't stall." },
    ],
    hacks: [
      "Split residential and commercial — different intent, value and messaging.",
      "Bid hardest on high-value services (panels, EV chargers, generators), not cheap call-outs.",
      "Put licensing, insurance and reviews above the fold — trust converts electrical buyers.",
      "Make call tracking the primary conversion and chase every quote.",
      "Build service-area pages to win local 'near me' searches.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Focus & track", body: "Rebuild Search around high-value services, split residential/commercial, and wire call tracking." },
      { window: "Days 31–60", title: "Local & optimize", body: "Launch service-area SEO and reviews, mine search terms, and tune to booked jobs." },
      { window: "Days 61–90", title: "Scale", body: "Scale the highest-value services and add quote-follow-up automation." },
    ],
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
    reality:
      "Renovation and construction leads are expensive and the sales cycle is long, so lead quality matters far more than raw volume — one signed kitchen, basement or addition can be worth tens of thousands. The fastest way to lose money here is paying for tire-kickers and price-shoppers who were never going to build.\n\nThe winners filter hard (budget and timeline qualifiers, project-specific pages), prove craftsmanship with a strong portfolio, and nurture across weeks because homeowners rarely decide on the first click. Financing options widen the pool of buyers who can say yes.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$6–18" },
      { label: "Qualified-lead rate", value: "5–8%" },
      { label: "Avg. project value", value: "$15,000–100,000+" },
      { label: "Decision cycle", value: "weeks–months" },
    ],
    playbook: [
      { channel: "Google Ads", body: "High-intent Search by service and city (basement, kitchen, addition, custom build) with budget/qualifier questions in the funnel." },
      { channel: "Meta Ads", body: "Portfolio-led demand-gen and project inspiration, plus retargeting to stay present across a long decision cycle." },
      { channel: "Website", body: "Portfolio, process, financing, warranties and reviews — the trust a homeowner needs before a big-ticket commitment." },
      { channel: "AI & CRM", body: "Lead qualification and multi-week nurture so good leads don't go cold while they decide." },
    ],
    hacks: [
      "Add budget and timeline qualifiers to filter tire-kickers before they reach your team.",
      "Put your best portfolio work front and centre — craftsmanship is the whole sell.",
      "Offer financing to widen the pool of homeowners who can move forward.",
      "Retarget relentlessly; renovation decisions take weeks, not minutes.",
      "Track to booked consultations and signed jobs, not raw quote requests.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Qualify & track", body: "Rebuild Search by service/city, add qualifying questions, and wire lead + consultation tracking." },
      { window: "Days 31–60", title: "Trust & nurture", body: "Launch portfolio landing pages and retargeting, and build a multi-week nurture for long decisions." },
      { window: "Days 61–90", title: "Scale quality", body: "Scale the services and areas producing signed jobs and refine qualification from close-rate data." },
    ],
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
    reality:
      "Roofing demand is spiky and weather-driven — a storm can create a week of demand overnight — and the jobs are high-ticket, so a single booked replacement can pay for months of ads. Clicks get expensive in peak season, which means the winners are the roofers who can scale proven campaigns fast and follow up leads in minutes.\n\nMost lost roofing jobs come down to two things: not being visible the moment demand spikes, and slow follow-up on the leads you do get. Financing and a free-inspection offer remove the last friction on a big-ticket decision.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$8–20" },
      { label: "Lead conversion rate", value: "6–9%" },
      { label: "Avg. job value", value: "$5,000–25,000+" },
      { label: "Speed-to-lead target", value: "<5 min" },
    ],
    playbook: [
      { channel: "Google Ads", body: "Repair + replacement Search with call-only formats for urgent leaks, plus Local Services Ads where available for cheap qualified calls." },
      { channel: "Meta Ads", body: "Storm- and season-triggered demand-gen with financing and free-inspection offers, plus retargeting for longer replacement decisions." },
      { channel: "Website", body: "Financing, free-inspection offer, warranties and reviews above the fold to convert a high-ticket decision." },
      { channel: "AI & CRM", body: "Instant lead follow-up and appointment setting so storm-season demand turns into booked inspections, not voicemails." },
    ],
    hacks: [
      "Keep proven storm campaigns built and paused, ready to scale the day demand spikes.",
      "Put financing and a free inspection above the fold — they remove the biggest replacement objections.",
      "Separate emergency repair from planned replacement; the intent and follow-up differ.",
      "Speed-to-lead wins roofing — automate first contact within minutes.",
      "Track to booked inspections, not raw form fills, so budget follows revenue.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Capture & speed", body: "Rebuild repair + replacement Search, wire call tracking and instant follow-up, and ready storm campaigns." },
      { window: "Days 31–60", title: "Optimize & offer", body: "Mine search terms, launch financing/inspection offers and Meta demand-gen, and tune to booked inspections." },
      { window: "Days 61–90", title: "Scale", body: "Scale winning campaigns, add retargeting, and keep storm-response playbooks ready to surge." },
    ],
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
    reality:
      "Immigration is high-intent and high-trust, but it spans very different programs — study permits, work permits, PR, family sponsorship, business immigration — each with its own audience, language and value. Treating them as one campaign is where most budgets fail.\n\nLeads also go cold fast: someone researching at midnight expects an answer, and without instant follow-up plus a multi-day nurture, even good leads evaporate. The firms that win segment by program, respond in minutes, nurture over weeks, and keep every claim honest and compliant — no implied guaranteed outcomes.",
    benchmarks: [
      { label: "Typical CPL (Meta/Google)", value: "$10–40" },
      { label: "Consultation booking rate", value: "8–15%" },
      { label: "Avg. client value", value: "$1,500–8,000+" },
      { label: "Speed-to-lead target", value: "<30 min" },
    ],
    playbook: [
      { channel: "Meta Ads", body: "Program-segmented lead-gen (study, work, PR, family) with multilingual creative and retargeting for longer decisions." },
      { channel: "Google Ads", body: "High-intent Search on specific programs and eligibility questions, with negatives to filter government-site and DIY traffic." },
      { channel: "CRM & automation", body: "Instant first contact plus a multi-day nurture sequence, with consultation and signed-client tracking by program." },
      { channel: "Website", body: "Program-specific pages, an eligibility quiz lead magnet, and visible RCIC/credential trust signals." },
    ],
    hacks: [
      "Separate each program into its own campaign and landing page — intent and value differ enormously.",
      "Run multilingual creative for the communities you serve; it lifts both CTR and trust.",
      "Use an eligibility quiz as a lead magnet — it qualifies and captures in one step.",
      "Nurture relentlessly: most consultations come from follow-up, not the first click.",
      "Keep messaging compliant — never imply a guaranteed PR or visa outcome.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Segment & track", body: "Split campaigns by program, wire lead + consultation tracking, and launch instant follow-up." },
      { window: "Days 31–60", title: "Nurture & optimize", body: "Build multi-day nurture sequences, add multilingual creative, and optimize to booked consultations." },
      { window: "Days 61–90", title: "Scale", body: "Scale the programs producing signed clients and add retargeting and referral flows." },
    ],
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
    reality:
      "Legal is one of the most expensive categories in paid search — clicks routinely run $15–80+ in competitive practice areas — so the firms that win don't spend more, they waste less and convert intake better. The money is concentrated in a few high-value matters, and most budget leaks into broad searches, job-seekers and DIY researchers that never become cases.\n\nThe two levers that decide ROI are practice-area focus (never letting personal-injury share a budget with cheap, low-value clicks) and intake: how fast and how well the firm answers the phone. Most lost cases aren't a targeting problem — they're an untracked, slow intake problem.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$15–80+" },
      { label: "Case-enquiry conv. rate", value: "5–9%" },
      { label: "Avg. case value", value: "$1,500–25,000+" },
      { label: "Intake calls tracked", value: "target 100%" },
    ],
    playbook: [
      { channel: "Google Ads", body: "Practice-area Search (e.g. car-accident, family, immigration, business) with aggressive negatives to exclude job-seekers, 'free', DIY and out-of-scope matters — plus call tracking on every campaign." },
      { channel: "Local SEO", body: "Practice-area + city pages, Google Business Profile and reviews to win the local pack for high-intent legal searches." },
      { channel: "Website & intake", body: "Trust-led pages — results, credentials, testimonials and a fast intake form with click-to-call — so qualified enquiries actually reach intake." },
      { channel: "AI & CRM", body: "Speed-to-lead and missed-call follow-up, plus lead scoring that filters non-cases before they eat your team's time." },
    ],
    hacks: [
      "Split every practice area into its own campaign — never let personal injury subsidize low-value clicks.",
      "Build a deep negative-keyword list (jobs, salary, 'how to', 'free', DIY) — it's where most legal budget leaks.",
      "Make the tracked intake call (not a form fill) the conversion the platforms optimize toward.",
      "Geo-target tightly to the jurisdictions you actually serve to avoid out-of-area waste.",
      "Lead the landing page with credibility and a one-tap call — legal buyers decide on trust and speed.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Intake & focus", body: "Wire call tracking and intake measurement, rebuild Search by practice area, and tighten negatives and geo-targeting." },
      { window: "Days 31–60", title: "Optimize & local", body: "Mine search terms, optimize to qualified case enquiries, and publish practice-area + city pages with a review flow." },
      { window: "Days 61–90", title: "Scale", body: "Scale the practice areas producing profitable cases, add retargeting, and refine intake scripting from call data." },
    ],
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
    reality:
      "Most agents' pipelines live and die on referrals — great until they dry up. A predictable pipeline comes from owning two engines beyond word-of-mouth: a seller engine (the home-valuation offer, the highest-converting lead in real estate) and a buyer engine (listing and area-alert campaigns). Both depend on instant routing and long-term nurture, because real estate is a months-long decision.\n\nThe leaks are speed and persistence: valuation and listing leads go cold in minutes without routing, and most deals come from nurture months after the first click — so weekly creative and automated follow-up matter as much as the ad spend.",
    benchmarks: [
      { label: "Typical Meta CPL", value: "$8–25" },
      { label: "Landing-page conv. rate", value: "8–14%" },
      { label: "Avg. commission value", value: "$8,000–25,000+" },
      { label: "Speed-to-lead target", value: "<5 min" },
    ],
    playbook: [
      { channel: "Meta Ads", body: "Seller valuation funnels and buyer listing/area-alert campaigns with weekly creative refreshes to keep CPL low." },
      { channel: "Google Ads", body: "High-intent buyer and seller search plus brand defence, routed to matched landing pages." },
      { channel: "Website & funnels", body: "A fast 'what's my home worth?' valuation funnel and listing/IDX pages built to convert, not just browse." },
      { channel: "AI & CRM", body: "Instant lead routing to the right agent and long-term nurture with market-update automation so leads stay warm for months." },
    ],
    hacks: [
      "Lead sellers with a home-valuation offer — it's the highest-converting real-estate magnet there is.",
      "Route leads to an agent within minutes; speed is the difference between a tour and a dead lead.",
      "Refresh creative weekly — real-estate ad fatigue is fast and quietly inflates CPL.",
      "Run separate buyer and seller funnels; the intent, offer and nurture are completely different.",
      "Nurture for months — most closings come long after the first click, via consistent follow-up.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Funnels & tracking", body: "Launch the valuation funnel and Meta seller lead-gen, wire instant routing and lead tracking." },
      { window: "Days 31–60", title: "Buyers & nurture", body: "Add listing/area-alert buyer campaigns, iterate creative weekly, and build long-term nurture sequences." },
      { window: "Days 61–90", title: "Scale", body: "Scale the winning audiences and add referral/repeat-client automation for a compounding pipeline." },
    ],
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
    reality:
      "Home improvement — windows, kitchens, decks, siding, bathrooms — is high-ticket with a considered, often seasonal buying cycle. Generic 'home improvement' advertising burns money; the winners run product-specific campaigns, prove quality with a portfolio, and qualify hard so the sales team only talks to real buyers.\n\nFinancing widens the pool of homeowners who can say yes, and because decisions take weeks, retargeting and nurture do as much work as the first click. The fastest path to ROI is usually to dominate your single most profitable product line, then expand.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$5–15" },
      { label: "Qualified-lead rate", value: "5–8%" },
      { label: "Avg. project value", value: "$5,000–50,000+" },
      { label: "Decision cycle", value: "weeks" },
    ],
    playbook: [
      { channel: "Google Ads", body: "Product-specific Search (windows, kitchens, decks, siding) by city, with budget/timeline qualifiers in the funnel." },
      { channel: "Meta Ads", body: "Portfolio-led demand-gen and project inspiration, plus retargeting across a multi-week decision." },
      { channel: "Website", body: "Product pages with portfolio, financing, warranties and reviews to convert a high-ticket decision." },
      { channel: "AI & CRM", body: "Lead qualification and nurture so good leads stay warm while homeowners decide." },
    ],
    hacks: [
      "Dominate your single most profitable product line first, then expand.",
      "Add budget and timeline qualifiers to filter browsers from buyers.",
      "Lead with portfolio proof and financing — both move high-ticket decisions.",
      "Plan budget seasonally; many improvement categories spike in spring/summer.",
      "Retarget for weeks — these decisions are rarely made on the first visit.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Focus & qualify", body: "Launch product-specific campaigns for your top line, add qualifiers, and wire lead tracking." },
      { window: "Days 31–60", title: "Prove & nurture", body: "Add portfolio landing pages, financing and retargeting, and build a multi-week nurture." },
      { window: "Days 61–90", title: "Scale", body: "Scale the winning product line and expand into the next most profitable one." },
    ],
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
    reality:
      "Aesthetics is visual, premium and trust-driven. Demand splits across discovery (people scrolling Instagram who can be moved with strong creative) and high intent (people searching for a named treatment like 'lip filler' or 'CoolSculpting near me'). The high-value clients — injectables, laser, body contouring and membership packages — reward polished creative and premium positioning, not price-cutting.\n\nThe biggest profit leaks are weak, generic creative and no-shows. The clinics that win pair scroll-stopping, compliant creative with high-intent search, then protect revenue with deposit and reminder flows so booked consults actually show.",
    benchmarks: [
      { label: "Typical Meta CPL", value: "$8–25" },
      { label: "Search CPC", value: "$3–9" },
      { label: "Avg. client / treatment value", value: "$300–2,500+" },
      { label: "Booking conv. rate", value: "7–12%" },
    ],
    playbook: [
      { channel: "Meta Ads", body: "Treatment-led creative and seasonal offers with compliant before/after-style social proof, plus retargeting of consult-page visitors — the biggest lever in aesthetics." },
      { channel: "Google Ads", body: "High-intent Search for named treatments ('Botox', 'laser hair removal', 'CoolSculpting') in your service area." },
      { channel: "Website & booking", body: "Treatment pages, transparent packages/financing and online booking so high-intent traffic converts without friction." },
      { channel: "AI & CRM", body: "Deposit, confirmation and reminder automation to cut no-shows, plus review requests and win-back sequences that lift lifetime value." },
    ],
    hacks: [
      "Lead with the treatment and the outcome, never the lowest price — premium positioning protects margin.",
      "Sell memberships and treatment packages to lift client lifetime value, not one-off discounts.",
      "Use deposits and reminder flows to slash no-shows — the silent killer of med-spa ROI.",
      "Retarget consultation-page visitors; aesthetic decisions are considered and need a nudge.",
      "Keep claims compliant — show representative results and avoid implying guaranteed medical outcomes.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Creative & tracking", body: "Launch treatment-led creative, wire booking + call tracking, and set up high-intent Search for top treatments." },
      { window: "Days 31–60", title: "Optimize & no-shows", body: "Test creative and offers, add retargeting, and roll out deposit/reminder automation to cut no-shows." },
      { window: "Days 61–90", title: "Scale & LTV", body: "Scale the winning treatments and audiences, and add membership/package and win-back flows to grow LTV." },
    ],
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
    reality:
      "Professional and B2B services — accountants, consultants, finance, agencies — sell considered, relationship-led engagements with longer sales cycles and high client values. A single retained client can be worth tens of thousands, so lead quality and nurture matter far more than raw volume.\n\nThe winners capture high-intent demand on search, use gated value (guides, calculators, assessments) to capture earlier-stage prospects, then nurture with multi-touch sequences because few B2B buyers convert on the first visit. Reporting ties spend to booked calls and signed clients, not vanity leads.",
    benchmarks: [
      { label: "Typical Google CPC", value: "$5–20" },
      { label: "Lead-to-client rate", value: "5–12%" },
      { label: "Avg. client value", value: "$2,000–25,000+" },
      { label: "Sales cycle", value: "weeks–months" },
    ],
    playbook: [
      { channel: "Google Ads", body: "High-intent Search by service, with negatives to filter job-seekers and DIY researchers." },
      { channel: "LinkedIn / Meta", body: "Lead-gen with gated value (guides, calculators, assessments) to capture and qualify earlier-stage prospects." },
      { channel: "Website", body: "Case studies, credentials and an easy way to book a call — the proof a considered buyer needs." },
      { channel: "AI & CRM", body: "Multi-touch nurture and lead scoring so sales focuses on the prospects most likely to sign." },
    ],
    hacks: [
      "Capture high-intent search first — it's the cheapest path to ready-to-buy enquiries.",
      "Use a gated lead magnet (guide, calculator, assessment) to capture earlier-stage demand.",
      "Build multi-touch nurture; most B2B clients convert after several touches, not one.",
      "Score leads so your team spends time on the prospects most likely to sign.",
      "Report to booked calls and signed clients, not raw form fills.",
    ],
    plan90: [
      { window: "Days 1–30", title: "Capture & track", body: "Launch high-intent Search, wire lead + booked-call tracking, and build a gated lead magnet." },
      { window: "Days 31–60", title: "Nurture & qualify", body: "Add LinkedIn/Meta lead-gen, multi-touch nurture and lead scoring." },
      { window: "Days 61–90", title: "Scale", body: "Scale the services producing signed clients and refine targeting from close-rate data." },
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
