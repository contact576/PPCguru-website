/**
 * Location × service content overrides — genuinely UNIQUE per-city copy for the
 * programmatic /[city]/[service] pages, keyed by "city/service".
 *
 * Why this file exists: the base template (app/[city]/[service]/page.tsx) generates
 * every city page from ONE shared structure — same definition sentence with the city
 * name swapped in, same process steps, same FAQs reused verbatim across all 10 cities.
 * That reads to Google (and to LLM answer engines) as near-duplicate content: pages
 * competing against each other instead of each owning a distinct local intent. See
 * CLAUDE.md "AEO/GEO" section for the sitewide content-layer pattern this follows.
 *
 * Each entry here REPLACES the generic block for that specific city+service combo only;
 * every other combo falls back to the original templated copy unchanged (zero regression
 * risk). Content is grounded in real, defensible, publicly-known civic/market facts
 * (census population, known industries, registered business address) — never fabricated
 * client counts, invented CPC figures or city-specific results we haven't verified.
 *
 * Populate more combos here over time — start with the highest-intent city pages.
 */

export type LocationServiceContent = {
  /**
   * Short hero standfirst — deliberately OUTCOME-focused (not market-stat framing), so it
   * doesn't echo the definition/whyLocal blocks lower on the page and read repetitive.
   */
  heroIntro: string;
  /** Answer-first AEO definition (60–90 words) — must differ in SUBSTANCE, not just the city name. */
  definition: string;
  /** Question-shaped H2 for the definition block. */
  definitionHeading: string;
  /** Replaces the generic "why local matters" paragraph — genuinely different market reasoning per city. */
  whyLocal: string;
  /** City-specific FAQ set — replaces the generic, sitewide-reused service FAQs on this page only. */
  faqs: { q: string; a: string }[];
  /** Unique meta description (~150–160 chars) — replaces the generic, name-swapped default. */
  metaDescription: string;
  /** Extra long-tail keywords beyond the auto-generated "{service} {city}" pair. */
  metaKeywords: string[];
};

export const locationServiceContent: Record<string, LocationServiceContent> = {
  "toronto/google-ads": {
    heroIntro:
      "We help Toronto service businesses turn Google Ads clicks into booked jobs — engineered around your specific neighbourhoods and competitors, not a generic city-wide template.",
    definitionHeading: "What does Google Ads management in Toronto involve?",
    definition:
      "Google Ads management in Toronto means building Search, Performance Max and Local campaigns for one of the most competitive ad auctions in Canada, where local businesses bid against national brands and next-door competitors across dozens of distinct neighbourhoods. PPC Guru is a Google Partner agency based in the Greater Toronto Area, running Toronto Google Ads accounts engineered around booked jobs and revenue — tight neighbourhood-level targeting, aggressive negative-keyword hygiene and airtight conversion tracking that justify Toronto's premium click costs, instead of simply outspending the business next door.",
    whyLocal:
      "Toronto is Canada's largest and most contested Google Ads market — auction prices for competitive service categories like legal, real estate, home renovation and healthcare routinely run among the highest in the country, and it's where most national Canadian brands concentrate their ad spend. Winning here isn't about outbidding everyone; it's about neighbourhood-level precision. We split budget by borough — downtown core, North York, Scarborough, Etobicoke, East York — because a single \"Toronto-wide\" campaign burns budget on searches from neighbourhoods you don't serve, or that convert at a completely different rate than your core area.",
    faqs: [
      { q: "How much does Google Ads cost in Toronto?", a: "Toronto has some of the highest cost-per-click rates in Canada, because it's the country's largest, most competitive ad market — legal, real estate, home services and healthcare categories are especially contested. Rather than quote a blanket number, we start with a free audit of your industry and target neighbourhoods so your budget is set around a realistic, profitable cost per lead, not a guess." },
      { q: "Can you target specific Toronto neighbourhoods instead of the whole city?", a: "Yes, and for most Toronto businesses we'd recommend it. We build geo-targeted campaigns around the specific boroughs you actually serve — downtown, North York, Scarborough, Etobicoke, East York — with bid adjustments so budget concentrates where you convert, instead of spreading thin across a city-wide campaign." },
      { q: "We're already running Google Ads in Toronto but not seeing results — can you help?", a: "This is one of the most common accounts we inherit. Toronto's auction is unforgiving of loose account structure, weak negative-keyword lists and broken conversion tracking. We start every new Toronto account with a full audit to find exactly where budget is leaking before we touch a single bid." },
      { q: "Do we end up competing with national brands bidding on the same Toronto keywords?", a: "Often, yes — Toronto is where most national Canadian brands concentrate ad spend, so local businesses are bidding in the same auction as much larger budgets. We win that fight on relevance: tightly matched ad copy, fast landing pages and precise targeting that keep your cost per click down even against bigger competitors." },
      { q: "How long does it take to see results from Google Ads in Toronto?", a: "Because Toronto's auction is so competitive, we typically spend the first 2–3 weeks tightening account structure, negative keywords and tracking before scaling spend. Most Toronto clients see wasted spend drop within the first 30 days, with cost-per-lead improvements compounding over 60–90 days as Google's algorithm matures on cleaner data." },
    ],
    metaDescription:
      "Google Ads management for Toronto service businesses in Canada's most competitive ad market — neighbourhood-level targeting, tight tracking and campaigns built for booked jobs. Free audit.",
    metaKeywords: ["Google Ads agency Toronto", "Google Ads management Toronto", "PPC agency Toronto", "Toronto Google Ads company"],
  },
  "brampton/google-ads": {
    heroIntro:
      "We help Brampton service businesses turn Google Ads clicks into booked jobs — built around this city's fast-growing subdivisions and diverse communities, from our Brampton HQ.",
    definitionHeading: "What does Google Ads management in Brampton involve?",
    definition:
      "Google Ads management in Brampton means running Search, Local and Performance Max campaigns tuned to one of Canada's fastest-growing and most diverse cities, where culturally relevant creative and a strong Google Business Profile presence consistently outperform generic, copy-pasted city-wide ads. PPC Guru is a Google Partner agency headquartered in Brampton, building campaigns around the city's rapidly expanding subdivisions — Bramalea, Springdale, Mount Pleasant — and its large South Asian community, so ad budget turns into booked jobs, not clicks that never convert.",
    whyLocal:
      "Brampton is one of Canada's fastest-growing cities, and it's PPC Guru's home base — we're headquartered here, not running a page generated by swapping in a city name. Its population has expanded rapidly through new subdivisions across Bramalea, Springdale, Mount Pleasant and Heart Lake, and its large South Asian community means the businesses that win aren't running the same generic ad copy as everywhere else. They're using culturally relevant, sometimes multilingual creative, backed by a fully optimized Google Business Profile that builds trust in a community-driven, word-of-mouth-heavy market — and because Brampton's auction is generally less saturated than Toronto's core, local businesses can often win visibility faster and at a lower cost per click.",
    faqs: [
      { q: "Do you write ad copy for Brampton's South Asian community?", a: "Yes. Brampton has one of the largest South Asian populations of any city in Canada, and generic, one-size-fits-all ad copy consistently underperforms here. We build culturally relevant creative — and multilingual variants where they fit your audience — alongside a fully optimized Google Business Profile that builds trust in a community-driven market." },
      { q: "Is Google Ads worth it for a growing Brampton business?", a: "Brampton is one of the fastest-growing cities in Canada, with new subdivisions like Bramalea, Springdale and Mount Pleasant adding households every year. That growth means steady, compounding local search demand, and because Brampton's auction is generally less saturated than Toronto's core, local businesses can often win visibility faster and at a lower cost per click." },
      { q: "Do you serve specific Brampton neighbourhoods like Springdale or Mount Pleasant?", a: "Yes — we build Local and Search campaigns geo-targeted to Brampton's specific growth areas, including Bramalea, Springdale, Mount Pleasant and Heart Lake, so budget concentrates on the subdivisions where your customers actually are." },
      { q: "Are you actually based in Brampton, or is this just another location page?", a: "We're genuinely headquartered in Brampton — it's our home market. That means real, on-the-ground familiarity with the neighbourhoods, local competitors and community, not a templated campaign with the city name swapped in." },
      { q: "What kind of Brampton businesses do you run Google Ads for?", a: "Mostly local service businesses — trades and home services, healthcare and dental clinics, immigration consultants, and B2B companies tied to Brampton's logistics and manufacturing corridor along Highway 407/410 — anywhere local search demand is growing alongside the city." },
    ],
    metaDescription:
      "Google Ads management for Brampton businesses, from our Brampton HQ — culturally relevant creative, local Google Business Profile optimization and campaigns built for booked jobs. Free audit.",
    metaKeywords: ["Google Ads agency Brampton", "Google Ads management Brampton", "PPC agency Brampton", "Brampton digital marketing agency"],
  },
};

export function getLocationServiceContent(city: string, service: string): LocationServiceContent | undefined {
  return locationServiceContent[`${city}/${service}`];
}
