/**
 * Case studies.
 *
 * IMPORTANT — these are REPRESENTATIVE, anonymized scenarios built to be
 * realistic and on-brand, NOT named-client results. Per the brand brief and
 * FTC/Competition-Bureau guidance, real named-client results require written
 * consent. Each card surfaces a "Representative results — individual outcomes
 * vary" disclosure. To publish a real, consented case study, edit the matching
 * entry here with the real client, quotes and verified numbers.
 */

export type CaseStudy = {
  slug: string;
  client: string; // anonymized descriptor
  industrySlug: string;
  industry: string;
  location: string;
  service: string;
  headlineMetric: { value: string; label: string };
  secondaryMetrics: { value: string; label: string }[];
  timeframe: string;
  challenge: string;
  approach: string[];
  results: string;
  quote: { text: string; author: string; role: string };

  // ---- Optional deep / storytelling fields. Render only when present. ----
  /** 1–2 sentence narrative summary for the top of the page. */
  executiveSummary?: string;
  /** Before → after comparison rows for the visual. betterIsLower flips the arrow colour. */
  beforeAfter?: { metric: string; before: string; after: string; betterIsLower?: boolean }[];
  /** ROAS (or index) by month — drives the ROI trend chart. */
  roiProgression?: number[];
  /** Key decisions / pivots in the engagement. */
  keyDecisions?: { title: string; body: string }[];
  /** Repurposable lessons. */
  keyTakeaways?: string[];
};

export const REPRESENTATIVE_DISCLOSURE =
  "Representative case study. Built from typical engagement patterns and industry benchmarks to illustrate our approach; anonymized to protect client confidentiality. Individual results vary.";

export const caseStudies: CaseStudy[] = [
  {
    slug: "physiotherapy-clinic-north-york",
    executiveSummary:
      "A North York pelvic-floor physiotherapy clinic was paying premium prices for clicks that rarely turned into booked assessments. By rebuilding Google Ads around condition-and-neighbourhood intent, fixing tracking, and adding a booking-first landing experience, cost per booked assessment fell sharply while monthly bookings more than tripled — and local SEO began compounding as a second channel.",
    beforeAfter: [
      { metric: "Cost per booked assessment", before: "$210", after: "$122", betterIsLower: true },
      { metric: "Booked assessments / month", before: "11", after: "34" },
      { metric: "Local map-pack rank", before: "Page 2", after: "#1–3" },
      { metric: "Tracked conversions", before: "~40%", after: "~100%" },
    ],
    roiProgression: [1.4, 1.9, 2.5, 3.0, 3.4, 3.8],
    keyDecisions: [
      { title: "Optimize to booked assessments, not clicks", body: "We wired call + form tracking and told the bid strategy to chase booked assessments — instantly cutting spend on curious-but-not-ready traffic." },
      { title: "Split by condition + neighbourhood", body: "Pelvic-floor, MVA rehab and sports-injury each got their own tightly-themed campaigns and pages, lifting relevance and Quality Score." },
      { title: "Booking-first landing experience", body: "Online booking and click-to-call moved above the fold with insurance/direct-billing messaging — removing the two biggest objections." },
    ],
    keyTakeaways: [
      "In physio, the conversion is a booked assessment — track and bid to that, not clicks.",
      "Condition + neighbourhood intent converts far better than generic 'physio near me'.",
      "Pairing paid with local SEO builds a second, compounding channel within 90 days.",
    ],
    client: "A pelvic-floor physiotherapy clinic",
    industrySlug: "physiotherapy",
    industry: "Physiotherapy",
    location: "North York, ON",
    service: "Google Ads + SEO",
    headlineMetric: { value: "−42%", label: "cost per booked assessment" },
    secondaryMetrics: [
      { value: "3.1x", label: "more booked assessments / month" },
      { value: "#1–3", label: "local map-pack for core terms" },
      { value: "61 days", label: "to first ranking gains" },
    ],
    timeframe: "First 6 months",
    challenge:
      "The clinic was spending on Google Ads with broad keywords and an outdated landing page. Cost per booking was high, the calendar had gaps, and they ranked on page two for their highest-intent local searches.",
    approach: [
      "Rebuilt Search campaigns around high-intent treatment + neighbourhood keywords and added rigorous negative-keyword lists.",
      "Launched a conversion-focused landing page with online booking and click-to-call.",
      "Optimized the Google Business Profile and published genuinely useful condition + location pages for local SEO.",
      "Wired form and call tracking so we optimized to booked assessments, not clicks.",
    ],
    results:
      "Within six months, cost per booked assessment fell sharply while monthly bookings more than tripled, and the clinic moved into the local map pack for its core treatment terms — giving it a second, compounding lead source alongside paid.",
    quote: {
      text: "For the first time we can actually see which dollars turn into booked patients. The calendar is full and we stopped guessing.",
      author: "Clinic Director",
      role: "Physiotherapy clinic, North York",
    },
  },
  {
    slug: "hvac-mississauga-lead-gen",
    executiveSummary:
      "A Mississauga HVAC company lost jobs to faster competitors and watched cost per lead spike every peak season. Service-split Search with seasonal pacing, Meta lead-gen, and speed-to-lead automation that called every lead within minutes cut cost per lead by a third while qualified install leads more than doubled.",
    beforeAfter: [
      { metric: "Cost per lead", before: "$96", after: "$64", betterIsLower: true },
      { metric: "Qualified install leads / mo", before: "22", after: "57" },
      { metric: "Avg. lead follow-up time", before: "~3 hrs", after: "<5 min" },
      { metric: "Return on ad spend", before: "2.1x", after: "4.8x" },
    ],
    roiProgression: [2.1, 2.8, 3.6, 4.2, 4.8],
    keyDecisions: [
      { title: "Speed-to-lead automation", body: "Every new lead triggered an instant SMS + call attempt — the single biggest lever on booked installs." },
      { title: "Seasonal budget pacing", body: "Budgets followed demand by service (furnace, AC, maintenance), pulling back in lulls and pushing in peaks." },
    ],
    keyTakeaways: [
      "Most lost HVAC jobs are a follow-up-speed problem, not a targeting problem.",
      "Track to booked installs so budget shifts to revenue, not raw leads.",
      "Separate emergency intent and pace budget to the season.",
    ],
    client: "A residential HVAC & home-comfort company",
    industrySlug: "hvac",
    industry: "HVAC",
    location: "Mississauga, ON",
    service: "Google Ads + Meta Ads",
    headlineMetric: { value: "−33%", label: "cost per lead" },
    secondaryMetrics: [
      { value: "2.6x", label: "qualified install leads" },
      { value: "4.8x", label: "return on ad spend" },
      { value: "<5 min", label: "average lead follow-up time" },
    ],
    timeframe: "First 4 months",
    challenge:
      "Seasonal demand swings and expensive clicks meant the company's cost per lead spiked in peak season and leads often went uncontacted for hours, losing jobs to faster competitors.",
    approach: [
      "Split Search campaigns by service (furnace, AC, maintenance) and intent, with seasonal budget pacing.",
      "Added Meta lead-gen for tune-up and replacement offers with short-form video creative.",
      "Built speed-to-lead automation so every lead got an SMS + call attempt within minutes.",
      "Connected ads, calls and forms into one dashboard tying spend to booked installs.",
    ],
    results:
      "Cost per lead dropped by a third while qualified install leads more than doubled. Instant follow-up lifted booking rates, and the unified dashboard let the owner shift budget to the campaigns producing real installs.",
    quote: {
      text: "They treat our ad budget like it's their own money. Every month we book more installs for less.",
      author: "Owner",
      role: "HVAC company, Mississauga",
    },
  },
  {
    slug: "basement-renovation-gta",
    executiveSummary:
      "A GTA basement-renovation contractor had inconsistent, expensive, low-quality quote requests and a site that didn't build trust. A portfolio-led landing page, qualifying form questions and high-intent search by service and city more than doubled qualified consultations at a lower cost — pushing ROAS past 5x on high-ticket projects.",
    beforeAfter: [
      { metric: "Cost per qualified quote", before: "$320", after: "$198", betterIsLower: true },
      { metric: "Consultation requests / mo", before: "9", after: "20" },
      { metric: "Return on ad spend", before: "2.4x", after: "5.3x" },
    ],
    roiProgression: [2.4, 3.1, 3.9, 4.6, 5.3],
    keyDecisions: [
      { title: "Portfolio-led landing page", body: "Project galleries, financing and a quote flow replaced a generic homepage — quote quality jumped." },
      { title: "Qualify before the sales call", body: "Form questions filtered tire-kickers so the team spent time on ready-to-build homeowners." },
    ],
    keyTakeaways: [
      "For high-ticket reno, the landing page is often the bottleneck, not the ads.",
      "Qualifying questions raise lead quality more than tighter targeting.",
      "Remarketing matters — reno decisions take weeks.",
    ],
    client: "A basement & home renovation contractor",
    industrySlug: "construction-renovation",
    industry: "Construction & Renovation",
    location: "Greater Toronto Area",
    service: "Google Ads + Landing Pages",
    headlineMetric: { value: "5.3x", label: "return on ad spend" },
    secondaryMetrics: [
      { value: "−38%", label: "cost per qualified quote" },
      { value: "2.2x", label: "consultation requests" },
      { value: "$25k+", label: "average project value" },
    ],
    timeframe: "First 5 months",
    challenge:
      "High-ticket renovation leads were inconsistent and expensive, and the existing site didn't communicate trust or showcase past projects, so quote requests were low quality.",
    approach: [
      "Focused spend on high-intent renovation searches by service and city.",
      "Built a portfolio-led landing page with project galleries, financing and a quote request flow.",
      "Added qualifying questions to the form to filter tire-kickers before the sales call.",
      "Layered remarketing to stay in front of homeowners during long decision cycles.",
    ],
    results:
      "Qualified consultation requests more than doubled at a materially lower cost, and with a higher-trust landing experience the contractor closed more high-value projects — pushing return on ad spend above 5x.",
    quote: {
      text: "The quality of leads changed completely. We're talking to homeowners who are ready to build.",
      author: "Founder",
      role: "Renovation contractor, GTA",
    },
  },
  {
    slug: "immigration-consultant-brampton",
    executiveSummary:
      "A Brampton immigration consultancy generated leads but had no system to follow up, so prospects went cold. Program-segmented Meta lead campaigns plus a CRM with instant follow-up and a 7-day nurture sequence more than tripled booked consultations while cutting cost per consultation nearly in half.",
    beforeAfter: [
      { metric: "Cost per consultation", before: "$78", after: "$41", betterIsLower: true },
      { metric: "Booked consultations / mo", before: "14", after: "48" },
      { metric: "Lead-to-client rate", before: "9%", after: "18%" },
    ],
    roiProgression: [1.6, 2.2, 2.9, 3.4],
    keyDecisions: [
      { title: "Segment by program", body: "Study, work and PR each got their own creative and landing pages with localized, multilingual messaging." },
      { title: "Automated nurture", body: "A 7-day email + SMS sequence revived 'not yet' leads, lifting lead-to-client conversion." },
    ],
    keyTakeaways: [
      "Lead-gen without follow-up automation wastes most of the spend.",
      "Program-level segmentation beats one generic 'immigration' campaign.",
      "Tie signed clients back to the originating ad to find true ROI.",
    ],
    client: "A licensed immigration consultancy",
    industrySlug: "immigration",
    industry: "Immigration Consulting",
    location: "Brampton, ON",
    service: "Meta Ads + CRM",
    headlineMetric: { value: "−47%", label: "cost per consultation" },
    secondaryMetrics: [
      { value: "3.4x", label: "booked consultations" },
      { value: "18%", label: "lead-to-client rate" },
      { value: "7-day", label: "automated nurture sequence" },
    ],
    timeframe: "First 4 months",
    challenge:
      "The consultancy generated leads but had no system to follow up, so prospects went cold and the team couldn't tell which campaigns produced paying clients.",
    approach: [
      "Built Meta lead campaigns segmented by program (study, work, PR) with localized creative.",
      "Implemented a CRM with instant follow-up and a 7-day nurture sequence in email + SMS.",
      "Tracked consultations and signed clients back to the originating ad.",
      "Reallocated spend to the programs with the best lead-to-client economics.",
    ],
    results:
      "Booked consultations more than tripled while cost per consultation dropped by nearly half. With automated nurture, more leads converted into signed clients and the team finally knew which campaigns drove revenue.",
    quote: {
      text: "We went from chasing leads to having a system that books consultations while we sleep.",
      author: "Managing Consultant",
      role: "Immigration consultancy, Brampton",
    },
  },
  {
    slug: "real-estate-team-gta",
    executiveSummary:
      "A Vaughan real-estate team relied on referrals with an unpredictable pipeline. Home-valuation and new-listing lead campaigns on Meta with neighbourhood targeting, fast valuation landing pages and automatic agent routing quadrupled lead volume at a low cost per lead — adding a steady stream on top of referrals.",
    beforeAfter: [
      { metric: "Cost per buyer/seller lead", before: "$38", after: "$14", betterIsLower: true },
      { metric: "Leads / month", before: "31", after: "127" },
      { metric: "Landing-page conversion", before: "4%", after: "11%" },
    ],
    roiProgression: [1.8, 2.6, 3.2, 3.7],
    keyDecisions: [
      { title: "Lead with a home valuation", body: "A high-converting valuation page turned cold scrolls into appointments." },
      { title: "Route + follow up instantly", body: "Leads auto-routed to agents with immediate follow-up, protecting conversion." },
    ],
    keyTakeaways: [
      "A valuation offer converts far better than 'contact us'.",
      "Weekly creative refreshes keep cost per lead low on Meta.",
      "Predictable lead-gen reduces referral dependence.",
    ],
    client: "A residential real-estate team",
    industrySlug: "real-estate",
    industry: "Real Estate",
    location: "Vaughan, ON",
    service: "Meta Ads + Landing Pages",
    headlineMetric: { value: "$14", label: "cost per buyer/seller lead" },
    secondaryMetrics: [
      { value: "4.1x", label: "lead volume" },
      { value: "11%", label: "landing-page conversion rate" },
      { value: "2", label: "extra closings / month" },
    ],
    timeframe: "First 3 months",
    challenge:
      "The team relied on referrals and had an unpredictable pipeline, with no reliable way to generate buyer and seller leads online.",
    approach: [
      "Launched home-valuation and new-listing lead campaigns on Meta with neighbourhood targeting.",
      "Built fast valuation and listing landing pages with instant lead capture.",
      "Set up automatic lead routing and follow-up to agents.",
      "Iterated creative weekly to keep cost per lead low.",
    ],
    results:
      "Lead volume quadrupled at a low cost per lead, and a high-converting valuation page turned more of those leads into appointments — adding a steady, predictable stream on top of referrals.",
    quote: {
      text: "We finally have a predictable pipeline that isn't 100% referral-dependent.",
      author: "Team Lead",
      role: "Real-estate team, Vaughan",
    },
  },
  {
    slug: "dental-practice-etobicoke",
    executiveSummary:
      "An Etobicoke dental practice couldn't tell which marketing produced new patients, and high-value cosmetic cases were inconsistent. High-intent Search for implants/Invisalign with call tracking, local SEO, a review-generation flow and CRM follow-up nearly tripled new-patient bookings while cutting cost per new patient.",
    beforeAfter: [
      { metric: "Cost per new patient", before: "$185", after: "$131", betterIsLower: true },
      { metric: "New-patient bookings / mo", before: "26", after: "75" },
      { metric: "Calls tracked", before: "0%", after: "100%" },
      { metric: "Review rating", before: "4.3★", after: "4.9★" },
    ],
    roiProgression: [1.5, 2.0, 2.4, 2.7, 2.9],
    keyDecisions: [
      { title: "Call tracking as the conversion", body: "Most dental ROI happens on the phone — tracking it let us optimize to real new patients." },
      { title: "Bias to high-value cases", body: "Budget and creative leaned into implants, Invisalign and cosmetic intent, not cheap cleanings." },
    ],
    keyTakeaways: [
      "Untracked calls hide the true ROI of dental marketing — fix that first.",
      "Concentrate spend on high-value case intent.",
      "A strong review profile lifts both rankings and conversion.",
    ],
    client: "A family & cosmetic dental practice",
    industrySlug: "dental",
    industry: "Dental",
    location: "Etobicoke, ON",
    service: "Google Ads + SEO + CRM",
    headlineMetric: { value: "2.9x", label: "new-patient bookings" },
    secondaryMetrics: [
      { value: "−29%", label: "cost per new patient" },
      { value: "100%", label: "of calls now tracked" },
      { value: "4.9★", label: "review rating grown" },
    ],
    timeframe: "First 6 months",
    challenge:
      "A competitive local market and untracked phone calls meant the practice couldn't tell which marketing produced new patients, and high-value cosmetic cases were inconsistent.",
    approach: [
      "Ran high-intent Search for implants, Invisalign and emergency dentistry with call tracking.",
      "Optimized the Google Business Profile and launched service + neighbourhood SEO pages.",
      "Added a review-generation flow to grow and protect the practice's rating.",
      "Connected calls and forms to a CRM so front desk follow-up was consistent.",
    ],
    results:
      "New-patient bookings nearly tripled while cost per new patient fell, call tracking revealed the true ROI of each channel, and a stronger review profile improved both rankings and conversion.",
    quote: {
      text: "Now we know exactly where our new patients come from — and we get more of the high-value cases.",
      author: "Practice Manager",
      role: "Dental practice, Etobicoke",
    },
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

/** Return case studies for the given slugs, preserving order; skips unknown slugs. */
export function getCaseStudies(slugs: string[]) {
  return slugs
    .map((s) => caseStudies.find((c) => c.slug === s))
    .filter((c): c is CaseStudy => Boolean(c));
}

export function caseStudiesByIndustry(industrySlug: string) {
  return caseStudies.filter((c) => c.industrySlug === industrySlug);
}
