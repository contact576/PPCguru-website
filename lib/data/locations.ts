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
  neighbourhoods: string[];
};

export const cities: City[] = [
  { slug: "toronto", name: "Toronto", region: "Ontario", blurb: "Canada's largest and most competitive market.", context: "Toronto's density and competition mean ad auctions are pricey and SEO is hard-fought — precise targeting and strong landing pages are everything.", neighbourhoods: ["Downtown", "North York", "Scarborough", "Etobicoke", "East York"] },
  { slug: "brampton", name: "Brampton", region: "Ontario", blurb: "One of Canada's fastest-growing cities — and our backyard.", context: "Brampton's fast growth and diverse communities reward localized, often multilingual campaigns and strong local search presence.", neighbourhoods: ["Downtown Brampton", "Bramalea", "Springdale", "Mount Pleasant", "Heart Lake"] },
  { slug: "mississauga", name: "Mississauga", region: "Ontario", blurb: "A major business hub west of Toronto.", context: "Mississauga blends dense residential demand with a large business base, making both consumer and B2B campaigns highly effective.", neighbourhoods: ["Square One", "Port Credit", "Streetsville", "Meadowvale", "Erin Mills"] },
  { slug: "etobicoke", name: "Etobicoke", region: "Ontario", blurb: "Established west-Toronto communities with strong local intent.", context: "Etobicoke's mix of established neighbourhoods means high-value local searches and loyal repeat customers for service businesses.", neighbourhoods: ["The Kingsway", "Mimico", "Long Branch", "Rexdale", "Islington"] },
  { slug: "north-york", name: "North York", region: "Ontario", blurb: "A dense, affluent slice of north Toronto.", context: "North York combines high population density with strong purchasing power — ideal for high-value local service campaigns.", neighbourhoods: ["Willowdale", "Don Mills", "Bayview Village", "York Mills", "Downsview"] },
  { slug: "scarborough", name: "Scarborough", region: "Ontario", blurb: "A large, diverse east-Toronto market.", context: "Scarborough's size and diversity reward localized, community-aware campaigns and consistent local SEO.", neighbourhoods: ["Agincourt", "Guildwood", "Malvern", "Birch Cliff", "Rouge"] },
  { slug: "vaughan", name: "Vaughan", region: "Ontario", blurb: "Affluent, fast-growing communities north of Toronto.", context: "Vaughan's growth and higher household incomes make it a strong market for premium home services and real estate.", neighbourhoods: ["Woodbridge", "Maple", "Thornhill", "Concord", "Kleinburg"] },
  { slug: "markham", name: "Markham", region: "Ontario", blurb: "A tech-forward, affluent York Region city.", context: "Markham's affluent, tech-savvy population responds well to polished digital experiences and strong online proof.", neighbourhoods: ["Unionville", "Markham Village", "Cornell", "Berczy", "Cathedraltown"] },
  { slug: "hamilton", name: "Hamilton", region: "Ontario", blurb: "A growing market at the west end of the GTA.", context: "Hamilton's affordability-driven growth is bringing new homeowners and businesses — strong demand for home services and trades.", neighbourhoods: ["Downtown", "Ancaster", "Dundas", "Stoney Creek", "Westdale"] },
  { slug: "ottawa", name: "Ottawa", region: "Ontario", blurb: "The capital region — stable, professional demand.", context: "Ottawa's stable, government-and-tech-driven economy supports steady demand for professional and home services year-round.", neighbourhoods: ["Centretown", "Kanata", "Barrhaven", "Orléans", "Nepean"] },
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
