/**
 * Programmatic location × service pages. Each city carries real local context
 * so the generated pages are genuinely useful, not thin doorway pages.
 */

export type City = {
  slug: string;
  name: string;
  region: string;
  blurb: string;
  context: string; // local economic/market context used in copy
  /** 3 genuinely city-specific tactical priorities — makes each location page unique. */
  localFocus: string[];
  neighbourhoods: string[];
};

export const cities: City[] = [
  { slug: "toronto", name: "Toronto", region: "Ontario", blurb: "Canada's largest and most competitive market.", context: "Toronto is Canada's largest and most competitive ad market — auction prices run high and organic results are hard-fought across hundreds of distinct neighbourhoods. Winning here is about precise targeting, airtight tracking and landing pages that convert expensive clicks, not simply spending more than the firm next door.", localFocus: ["Neighbourhood-level targeting (downtown vs North York vs Scarborough) to keep CPCs in check", "Aggressive negative-keyword lists — broad 'Toronto' terms burn budget fastest", "Conversion tracking and strong landing pages to justify premium click costs"], neighbourhoods: ["Downtown", "North York", "Scarborough", "Etobicoke", "East York"] },
  { slug: "brampton", name: "Brampton", region: "Ontario", blurb: "One of Canada's fastest-growing cities — and our backyard.", context: "Brampton is one of Canada's fastest-growing and most diverse cities — and PPC Guru's home base. Its multicultural communities and rapid household growth reward localized, often multilingual campaigns paired with a strong local-search presence.", localFocus: ["Multilingual creative tuned to Brampton's diverse communities", "Local-search + Google Business Profile focus for fast-growing subdivisions", "Service-area targeting across Bramalea, Springdale and Mount Pleasant"], neighbourhoods: ["Downtown Brampton", "Bramalea", "Springdale", "Mount Pleasant", "Heart Lake"] },
  { slug: "mississauga", name: "Mississauga", region: "Ontario", blurb: "A major business hub west of Toronto.", context: "Mississauga pairs dense residential demand with one of the GTA's largest business bases, so both consumer and B2B campaigns perform well. From Square One to Port Credit intent is high — but so is competition spilling over from Toronto.", localFocus: ["Split consumer vs B2B intent — Mississauga has both at scale", "Target high-value pockets like Lorne Park and Port Credit for premium services", "Win on local relevance against Toronto-based competitors bidding in"], neighbourhoods: ["Square One", "Port Credit", "Streetsville", "Meadowvale", "Erin Mills"] },
  { slug: "etobicoke", name: "Etobicoke", region: "Ontario", blurb: "Established west-Toronto communities with strong local intent.", context: "Etobicoke's established west-Toronto neighbourhoods mean high-value local searches and loyal, repeat service customers. Areas like The Kingsway skew affluent, rewarding premium positioning and a strong review profile.", localFocus: ["Premium positioning for affluent pockets (The Kingsway, Mimico)", "Reviews + Google Business Profile to win loyal, repeat customers", "Hyper-local landing pages for each established neighbourhood"], neighbourhoods: ["The Kingsway", "Mimico", "Long Branch", "Rexdale", "Islington"] },
  { slug: "north-york", name: "North York", region: "Ontario", blurb: "A dense, affluent slice of north Toronto.", context: "North York combines high population density with strong purchasing power along the Yonge corridor — ideal for high-value local service campaigns. Competition is steep, so tracking quality and conversion rate decide ROI.", localFocus: ["Target the dense, affluent Yonge corridor (Willowdale, York Mills)", "Bias spend toward high-value services where purchasing power is strong", "Tight tracking to stay profitable in a high-CPC market"], neighbourhoods: ["Willowdale", "Don Mills", "Bayview Village", "York Mills", "Downsview"] },
  { slug: "scarborough", name: "Scarborough", region: "Ontario", blurb: "A large, diverse east-Toronto market.", context: "Scarborough is a large, highly diverse east-Toronto market where community-aware, often multilingual campaigns and consistent local SEO outperform generic city-wide ads.", localFocus: ["Community- and language-aware creative across diverse neighbourhoods", "Local SEO + service-area pages for Agincourt, Malvern and Guildwood", "Value-led messaging for a high-volume, price-aware market"], neighbourhoods: ["Agincourt", "Guildwood", "Malvern", "Birch Cliff", "Rouge"] },
  { slug: "vaughan", name: "Vaughan", region: "Ontario", blurb: "Affluent, fast-growing communities north of Toronto.", context: "Vaughan's rapid growth and higher household incomes make it a strong market for premium home services and real estate. Newer communities like Woodbridge and Kleinburg reward polished creative and clear financing offers.", localFocus: ["Premium home-service and real-estate positioning for higher incomes", "Financing offers and portfolio proof for big-ticket Vaughan projects", "Target fast-growing Woodbridge, Maple and Kleinburg"], neighbourhoods: ["Woodbridge", "Maple", "Thornhill", "Concord", "Kleinburg"] },
  { slug: "markham", name: "Markham", region: "Ontario", blurb: "A tech-forward, affluent York Region city.", context: "Markham's affluent, tech-savvy population responds to polished digital experiences and strong online proof. Expect discerning buyers who research thoroughly before they convert.", localFocus: ["Polished landing pages and reviews for research-heavy buyers", "Retargeting for considered, well-researched decisions", "Bilingual creative where it fits Markham's communities"], neighbourhoods: ["Unionville", "Markham Village", "Cornell", "Berczy", "Cathedraltown"] },
  { slug: "hamilton", name: "Hamilton", region: "Ontario", blurb: "A growing market at the west end of the GTA.", context: "Hamilton's affordability-driven growth is drawing new homeowners and businesses, fuelling demand for home services and trades. The market is less saturated than Toronto, so smart local campaigns can win share quickly.", localFocus: ["Capture new-homeowner demand in Ancaster, Dundas and Stoney Creek", "Lower competition than Toronto — move fast to own local search", "Trades and home-service focus where growth is strongest"], neighbourhoods: ["Downtown", "Ancaster", "Dundas", "Stoney Creek", "Westdale"] },
  { slug: "ottawa", name: "Ottawa", region: "Ontario", blurb: "The capital region — stable, professional demand.", context: "Ottawa's stable, government- and tech-driven economy supports steady, year-round demand for professional and home services. Buyers skew professional and value credibility and clear, verifiable proof.", localFocus: ["Credibility-led messaging for a professional, stable market", "Year-round pacing — far less seasonal swing than the GTA", "Target Kanata/Barrhaven growth alongside the Centretown core"], neighbourhoods: ["Centretown", "Kanata", "Barrhaven", "Orléans", "Nepean"] },
];

/** Services offered as location landing pages. */
export const locationServices: { slug: string; name: string; verb: string }[] = [
  { slug: "google-ads", name: "Google Ads Management", verb: "manage Google Ads" },
  { slug: "meta-ads", name: "Meta Ads Management", verb: "run Facebook & Instagram ads" },
  { slug: "seo", name: "SEO Services", verb: "grow organic rankings" },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}
export function getLocationService(slug: string) {
  return locationServices.find((s) => s.slug === slug);
}

/** All city×service combinations for static generation. */
export function allLocationParams() {
  const params: { city: string; service: string }[] = [];
  for (const c of cities) for (const s of locationServices) params.push({ city: c.slug, service: s.slug });
  return params;
}
