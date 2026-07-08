/**
 * Decision-content comparisons for the /compare hub. Honest, research-informed (no fabricated
 * numbers, no named third-party competitors). Each comparison = an answer-first verdict + a
 * semantic table + a bottom line, and feeds FAQPage schema (question → verdict).
 */

export type Comparison = {
  slug: string;
  title: string;
  /** Real query a prospect types; used as the H2 and the FAQPage question. */
  question: string;
  /** Answer-first 40–70-word verdict (also the FAQ answer). */
  verdict: string;
  /** 2–3 column headers. */
  headers: string[];
  /** Each row: a dimension label + one cell per header. */
  rows: { dimension: string; cells: string[] }[];
  bottomLine: string;
  related: { label: string; href: string }[];
};

export const comparisons: Comparison[] = [
  {
    slug: "google-ads-vs-meta-ads",
    title: "Google Ads vs Meta Ads",
    question: "Google Ads vs Meta Ads: which is better for a local service business?",
    verdict:
      "For most local service businesses, Google Ads wins first. It captures people who are already searching for your service — like “emergency plumber near me” — so leads convert faster. Meta Ads (Facebook & Instagram) is better at creating demand and staying top-of-mind. The strongest setup runs both, but if budget is tight, start where intent is clearest: Google.",
    headers: ["Google Ads", "Meta Ads"],
    rows: [
      { dimension: "Buyer intent", cells: ["High — people are actively searching now", "Lower — you interrupt the feed and create demand"] },
      { dimension: "Speed to leads", cells: ["Fast — captures existing demand", "Slower — warms up colder audiences first"] },
      { dimension: "Best for", cells: ["Urgent, high-intent services (HVAC, legal, dental)", "Visual offers, awareness and retargeting"] },
      { dimension: "Cost per lead", cells: ["Higher cost per click, higher intent", "Lower cost per click, more nurturing needed"] },
      { dimension: "Creative", cells: ["Text, extensions, some video (PMax/YouTube)", "Scroll-stopping image & video is everything"] },
      { dimension: "Targeting", cells: ["Keywords and search intent", "Interests, behaviours, lookalikes, retargeting"] },
    ],
    bottomLine:
      "Start with Google Ads to capture demand; add Meta to build it once tracking and budget allow. Most growing service businesses end up running both.",
    related: [
      { label: "Google Ads management", href: "/services/google-ads" },
      { label: "Meta Ads management", href: "/services/meta-ads" },
    ],
  },
  {
    slug: "agency-vs-in-house-vs-diy",
    title: "Agency vs in-house vs DIY",
    question: "Should I hire a PPC agency, build an in-house team, or run ads myself?",
    verdict:
      "Run ads yourself if you have time to learn bidding, negatives and tracking on a small budget. Build in-house once paid media is core and you can afford a senior salary plus tools. Hire an agency when wasted spend costs more than the fee and you want senior expertise without the overhead — the sweet spot for most growing service businesses.",
    headers: ["Hire an agency", "Build in-house", "Do it yourself"],
    rows: [
      { dimension: "Real cost", cells: ["Management fee — no salary or tool overhead", "Senior salary + tools + management time", "Ad spend plus your own hours"] },
      { dimension: "Expertise", cells: ["Senior, multi-account, cross-industry", "One hire's skill set", "Self-taught, learning on your budget"] },
      { dimension: "Speed to value", cells: ["Fast — proven playbooks from day one", "Slow — hire, onboard, ramp up", "Slow — steep learning curve"] },
      { dimension: "Tools & tracking", cells: ["Included (GA4/GTM, reporting, AI)", "You buy and maintain them", "Limited / DIY"] },
      { dimension: "Main risk", cells: ["Choosing the wrong agency (we work month-to-month)", "Hiring risk + ramp time", "Wasted spend while you learn"] },
      { dimension: "Best for", cells: ["Growing businesses wanting senior help, lean", "Large advertisers where paid media is core", "Very small budgets with time to learn"] },
    ],
    bottomLine:
      "If wasted spend costs more than a management fee, an agency usually wins on ROI. We work month-to-month and you keep full ownership of your accounts — so there's no lock-in risk in trying it.",
    related: [
      { label: "How we run Google Ads", href: "/services/google-ads" },
      { label: "Get a free audit", href: "/contact" },
    ],
  },
  {
    slug: "google-ads-vs-seo",
    title: "Google Ads vs SEO",
    question: "Google Ads vs SEO: which should a service business invest in first?",
    verdict:
      "They aren't either/or. Google Ads buys leads now — traffic starts within days but stops when you stop paying. SEO compounds: it takes months, but rankings keep working after the work is done and lower your blended cost per lead over time. Most service businesses run paid ads for immediate leads while SEO builds underneath.",
    headers: ["Google Ads (PPC)", "SEO"],
    rows: [
      { dimension: "Speed", cells: ["Leads within days", "Compounds over months"] },
      { dimension: "Cost model", cells: ["Pay per click; stops when you stop", "Invest in content & tech; compounds"] },
      { dimension: "Best for", cells: ["Immediate demand, promotions, testing", "Long-term, lower-cost-per-lead growth"] },
      { dimension: "Control", cells: ["Instant on/off, precise targeting", "Slower to change, algorithm-dependent"] },
      { dimension: "Longevity", cells: ["Traffic stops when budget stops", "Rankings keep working after the work"] },
      { dimension: "Together", cells: ["Use PPC to buy keyword data fast", "Feed winning keywords into SEO"] },
    ],
    bottomLine:
      "Run Google Ads for immediate leads while SEO compounds underneath. PPC funds the data; SEO lowers your blended cost per lead over time.",
    related: [
      { label: "Google Ads management", href: "/services/google-ads" },
      { label: "SEO & Local Search", href: "/services/seo" },
    ],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
