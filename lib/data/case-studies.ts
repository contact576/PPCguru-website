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
};

export const REPRESENTATIVE_DISCLOSURE =
  "Representative case study. Built from typical engagement patterns and industry benchmarks to illustrate our approach; anonymized to protect client confidentiality. Individual results vary.";

export const caseStudies: CaseStudy[] = [
  {
    slug: "physiotherapy-clinic-north-york",
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
    client: "A family & cosmetic dental practice",
    industrySlug: "dental",
    industry: "Dental",
    location: "Etobicoke, ON",
    service: "Google Ads + SEO + CRM",
    headlineMetric: { value: "2.9x", label: "new-patient bookings" },
    secondaryMetrics: [
      { value: "−29%", label: "cost per new patient" },
      { value: "62%", label: "of calls now tracked" },
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
