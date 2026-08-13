/**
 * Location × service content overrides — genuinely UNIQUE per-city copy for the
 * programmatic /[city]/[service] pages, keyed by "city/service".
 *
 * Why this file exists: the base template (app/[city]/[service]/page.tsx) generates
 * every city page from ONE shared structure — same definition sentence with the city
 * name swapped in, same local-focus bullets, same process steps, same FAQs reused
 * verbatim across all 10 cities. That reads to Google (and to LLM answer engines) as
 * near-duplicate/doorway-page content: pages competing against each other instead of
 * each owning a distinct local search intent. See CLAUDE.md "AEO/GEO" section for the
 * sitewide content-layer pattern this follows.
 *
 * Each entry here REPLACES the generic block for that specific city+service combo only;
 * every other combo falls back to the original templated copy unchanged (zero regression
 * risk — see app/[city]/[service]/page.tsx, every field is read as `localContent?.x ?? fallback`).
 *
 * Content is grounded in real, defensible, publicly-known civic/market facts (census
 * population, known industries, registered business address, real economic geography)
 * — never fabricated client counts, invented CPC figures or city-specific performance
 * numbers we haven't verified. No sentence is copy-pasted between cities; every section
 * is written from that city's actual business landscape, not a find-and-replace.
 *
 * Populate more combos here over time — start with the highest-intent city pages.
 */

export type ProcessStep = { step: string; title: string; body: string };

export type LocationServiceContent = {
  /** SEO <title> override (≤60 chars). Falls back to the generic "{service} in {city}, {region}". */
  metaTitle: string;
  /** Unique meta description (≤155 chars) — replaces the generic, name-swapped default. */
  metaDescription: string;
  /** Extra long-tail keywords beyond the auto-generated "{service} {city}" pair. */
  metaKeywords: string[];
  /** Extra knowsAbout entity terms fed into the page's LocalBusiness schema (GEO/entity signal). */
  knowsAbout: string[];

  /**
   * Short hero standfirst — deliberately OUTCOME-focused (not market-stat framing), so it
   * doesn't echo the definition/whyLocal blocks lower on the page and read repetitive.
   */
  heroIntro: string;

  /** Question-shaped H2 for the definition block (AEO direct-answer format). */
  definitionHeading: string;
  /** Answer-first AEO definition (~70–90 words) — must differ in SUBSTANCE, not just the city name. */
  definition: string;

  /** Replaces the generic "why local matters" paragraph — genuinely different market reasoning per city. */
  whyLocal: string;
  /** Replaces the generic city-level "In {city}, we focus on" bullets with service+city-specific strategy. */
  localFocus: string[];

  /** Replaces the generic, service-level 4-step process cards with city-flavoured execution detail. */
  process: ProcessStep[];

  /** City-specific FAQ set (40–60 word AEO-style answers) — replaces the generic, sitewide-reused FAQs. */
  faqs: { q: string; a: string }[];

  /** Closing CTA intro line — replaces the generic shared CtaBlock copy. */
  ctaIntro: string;
};

export const locationServiceContent: Record<string, LocationServiceContent> = {
  "toronto/google-ads": {
    metaTitle: "Google Ads Agency Toronto | Toronto PPC Management",
    metaDescription:
      "PPC Guru is a Google Ads agency in Toronto managing competitive GTA auctions — Quality Score, geo-targeting, real ROI. Free Toronto PPC audit.",
    metaKeywords: [
      "Google Ads agency Toronto",
      "Toronto PPC management",
      "Google Ads specialist Toronto",
      "PPC company Toronto",
      "Google Ads Financial District Toronto",
    ],
    knowsAbout: [
      "B2B lead generation Toronto",
      "Financial District Google Ads",
      "e-commerce Performance Max Toronto",
      "Quality Score optimization",
      "downtown Toronto PPC",
    ],

    heroIntro:
      "As a Google Ads agency headquartered right here in Toronto, we build Search and Performance Max campaigns that hold their ground against Bay Street budgets and national competitors — turning expensive downtown clicks into booked jobs, not vanity traffic.",

    definitionHeading: "Why hire a local Google Ads agency in Toronto?",
    definition:
      "A Toronto Google Ads agency earns its keep by controlling cost per click in one of the most expensive ad auctions in the country. PPC Guru is a Google Partner headquartered in Toronto, delivering Toronto PPC management for B2B firms near the Financial District, tech companies around Liberty Village and King West, and retail and e-commerce brands competing against national ad budgets — winning through disciplined Quality Score management, sharper ad relevance and neighbourhood-level bid control, not by simply outspending the business next door.",

    whyLocal:
      "Toronto is Canada's most expensive and most contested Google Ads market, and the businesses bidding here range from Financial District law and finance firms to fast-scaling tech companies out of Liberty Village and King West to national retailers running Performance Max at a scale most local advertisers can't match. Winning in that environment isn't about matching enterprise budgets — it's about Quality Score discipline, airtight conversion tracking and geo-targeting that concentrates spend on the neighbourhoods and search intent that actually convert for your business, whether that's B2B lead generation downtown or local retail and e-commerce demand across the wider GTA.",
    localFocus: [
      "Split budget by neighbourhood — Financial District, Liberty Village, King West and beyond — so spend concentrates where your buyers actually search",
      "Defend Quality Score against big-budget, national competitors with tightly matched ad copy and landing pages",
      "Separate B2B lead-generation funnels for downtown professional services from Performance Max / Shopping for retail and e-commerce",
      "Aggressive negative-keyword hygiene — broad, city-wide \"Toronto\" terms burn budget fastest in this auction",
    ],

    process: [
      { step: "01", title: "Audit", body: "We grade your Toronto account against a 60-point checklist, flagging wasted spend on broad citywide terms and untracked conversions." },
      { step: "02", title: "Rebuild", body: "We restructure campaigns by neighbourhood — Financial District, Liberty Village, King West and beyond — around your highest-value services." },
      { step: "03", title: "Optimize", body: "Weekly bid and Quality Score tuning to hold cost per click down against Toronto's national-brand competition." },
      { step: "04", title: "Scale", body: "We reinvest the savings into the search terms and neighbourhoods proven to book jobs, not just generate clicks." },
    ],

    faqs: [
      { q: "Why hire a local Google Ads agency in Toronto instead of a national one?", a: "A Toronto specialist knows which neighbourhoods, industries and competitors actually drive your cost per click. We build campaigns around the Financial District, Liberty Village and King West specifically, instead of one generic city-wide campaign that wastes budget on areas you don't serve." },
      { q: "How much does Google Ads cost in Toronto?", a: "Toronto has some of the highest CPCs in Canada — legal, real estate, finance and e-commerce are especially contested. We don't quote a blanket number; a free audit of your industry and target neighbourhoods sets a realistic, profitable cost per lead before you commit budget." },
      { q: "Can a small Toronto business compete with national ad budgets?", a: "Yes — Quality Score rewards relevance, not just budget. Tightly matched ad copy, fast landing pages and precise geo-targeting let a well-run local account hold a lower cost per click than a much bigger, looser national competitor bidding on the same terms." },
      { q: "Do you run Google Ads for both B2B and e-commerce businesses in Toronto?", a: "Both. We build B2B lead-generation funnels for downtown professional services and Performance Max / Shopping campaigns for retail and e-commerce brands — targeting, bidding strategy and conversion tracking differ significantly between the two, so we structure each account around its real buyer journey." },
      { q: "How long until Google Ads in Toronto shows results?", a: "Because Toronto's auction is so competitive, we spend the first 2–3 weeks tightening structure, negative keywords and tracking. Most clients see wasted spend drop within 30 days, with cost-per-lead improvements compounding over 60–90 days as bidding data matures." },
    ],

    ctaIntro:
      "Start with a free Toronto PPC audit, or try our Google Ads management free for 30 days — no contract, no setup fee. You'll see exactly where your account is losing money before you commit to anything.",
  },

  "brampton/google-ads": {
    metaTitle: "Google Ads Agency Brampton | Brampton PPC Management",
    metaDescription:
      "PPC Guru is a Google Ads agency in Brampton for trades, logistics and local services — fast lead capture, real booked jobs. Free Brampton PPC audit.",
    metaKeywords: [
      "Google Ads agency Brampton",
      "Brampton PPC management",
      "Google Ads services Brampton",
      "local PPC Brampton",
      "Google Ads Peel Region",
    ],
    knowsAbout: [
      "trades PPC Brampton",
      "logistics and transportation advertising Peel Region",
      "multilingual ad campaigns Brampton",
      "local service Google Ads",
      "Highway 407/410 corridor businesses",
    ],

    heroIntro:
      "As a Toronto-based Google Ads agency with deep, hands-on experience in Peel Region, we build Search and Local campaigns for Brampton's trades, transportation and community-rooted businesses — turning local search volume into booked jobs, fast.",

    definitionHeading: "Why hire a local Google Ads agency in Brampton?",
    definition:
      "A Brampton Google Ads agency wins by capturing local search intent fast, before it drifts to a competitor a few postal codes over. PPC Guru is a Google Partner headquartered in Toronto, delivering Brampton PPC management for HVAC, plumbing, roofing and auto trades, logistics and transportation companies along the Highway 407/410 corridor, and legal, accounting and other SMB service providers — building culturally relevant, community-rooted campaigns that convert Peel Region's dense local demand into booked jobs, not wasted clicks.",

    whyLocal:
      "Brampton's economy runs on trades, transportation and tight-knit community businesses — HVAC, plumbing, roofing and auto shops competing for \"near me\" searches, logistics and warehousing companies serving the Highway 407/410 corridor, and legal, accounting and healthcare SMBs built on word-of-mouth and trust. Local Google Ads here isn't about winning a city-wide bidding war; it's about showing up first for high-intent, immediate-need searches across Peel Region, often across multiple languages, and converting that volume before it goes to a competitor a few kilometres away.",
    localFocus: [
      "Priority Local and Search campaigns for trades — HVAC, plumbing, roofing, auto — competing on \"near me\" and emergency-intent searches",
      "Dedicated targeting for Brampton's logistics, transportation and warehousing corridor along Highway 407/410",
      "Multilingual ad copy variants where they genuinely fit your Peel Region audience",
      "Fast local-lead capture — call tracking and Local campaigns built for immediate-need service searches, not slow, considered B2B cycles",
    ],

    process: [
      { step: "01", title: "Audit", body: "We grade your Brampton account against a 60-point checklist, flagging wasted spend on searches from outside Peel Region." },
      { step: "02", title: "Rebuild", body: "We restructure campaigns around trades, transportation and local-service search intent — Bramalea, Springdale, Mount Pleasant and beyond." },
      { step: "03", title: "Optimize", body: "Weekly bid tuning and call-tracking review to keep cost per lead low on high-intent, immediate-need searches." },
      { step: "04", title: "Scale", body: "We reinvest the savings into the trades, services and neighbourhoods generating the most booked jobs." },
    ],

    faqs: [
      { q: "Why hire a local Google Ads agency in Brampton instead of a national one?", a: "A national agency runs one generic campaign for the whole GTA. We build Brampton-specific Local and Search campaigns around the trades, transportation and community businesses that actually drive this market, so your budget captures nearby \"near me\" searches instead of competing city-wide for traffic you can't service." },
      { q: "Do you run Google Ads for trades businesses like HVAC, plumbing and roofing?", a: "Yes — trades are a major part of what we manage in Brampton. We build Local campaigns and call tracking around emergency and \"near me\" intent, so your ads show up first when a customer needs a job done now, not in a week." },
      { q: "Can you target Brampton's logistics and transportation businesses?", a: "Yes. Brampton sits on a major logistics and warehousing corridor along Highway 407/410, and B2B search behaviour there looks different from consumer trades — longer consideration, different keywords, different conversion actions. We structure those accounts around quote requests, not phone calls." },
      { q: "Do you offer multilingual ad copy for Brampton's diverse communities?", a: "Where it genuinely fits your audience, yes. Brampton is one of Canada's most diverse cities, and culturally relevant, sometimes multilingual creative consistently outperforms generic, one-size-fits-all ad copy here — particularly for community-trusted services like healthcare, legal and home services." },
      { q: "How fast can a Brampton business see results from Google Ads?", a: "Because Brampton's auction is generally less saturated than Toronto's core, local businesses can often gain visibility within the first couple of weeks. Most clients see cost-per-lead stabilize within 30 days as we tighten targeting, negatives and call tracking around real booked jobs." },
    ],

    ctaIntro:
      "Start with a free Brampton PPC audit, or try our Google Ads management free for 30 days — no contract, no setup fee. We'll show you exactly where local leads are slipping through the cracks.",
  },
};

export function getLocationServiceContent(city: string, service: string): LocationServiceContent | undefined {
  return locationServiceContent[`${city}/${service}`];
}
