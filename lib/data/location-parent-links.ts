export type LocationParentLink = {
  sentence: string;
  href: string;
  text: string;
};

/**
 * One editorial link from each Google Ads, Meta Ads and SEO city page to its Canada-wide
 * parent. City-specific anchors stay on the city page; these anchors describe
 * the broader service so the hierarchy is clear without geographic cannibalization.
 */
const locationParentLinks: Record<string, LocationParentLink> = {
  "toronto/google-ads": {
    sentence: "Businesses serving markets beyond Toronto can connect this city strategy with our Canada-wide Google Ads management framework.",
    href: "/services/google-ads",
    text: "Canada-wide Google Ads management",
  },
  "mississauga/google-ads": {
    sentence: "Teams advertising beyond Mississauga can review our Google Ads services for Canadian businesses while preserving local campaign control.",
    href: "/services/google-ads",
    text: "Google Ads services for Canadian businesses",
  },
  "brampton/google-ads": {
    sentence: "For campaigns extending beyond Brampton, our Canadian Google Ads management services provide the broader account and measurement framework.",
    href: "/services/google-ads",
    text: "Canadian Google Ads management services",
  },
  "ottawa/google-ads": {
    sentence: "Organizations operating in several markets can review our Google Ads campaign management across Canada while keeping Ottawa targeting specific.",
    href: "/services/google-ads",
    text: "Google Ads campaign management across Canada",
  },
  "vaughan/google-ads": {
    sentence: "Businesses expanding outside Vaughan can connect this local plan with our full-service Google Ads management approach.",
    href: "/services/google-ads",
    text: "full-service Google Ads management",
  },
  "markham/google-ads": {
    sentence: "Multi-market teams can use our Google Ads management for Canadian businesses without flattening Markham into a generic audience.",
    href: "/services/google-ads",
    text: "Google Ads management for Canadian businesses",
  },
  "hamilton/google-ads": {
    sentence: "Companies serving customers beyond Hamilton can review our professional Google Ads services for the wider campaign structure.",
    href: "/services/google-ads",
    text: "professional Google Ads services",
  },
  "etobicoke/google-ads": {
    sentence: "Companies covering several regions can pair this district-level strategy with our Google Ads management for service businesses across Canada.",
    href: "/services/google-ads",
    text: "Google Ads management for service businesses",
  },
  "north-york/google-ads": {
    sentence: "Organizations advertising outside North York can connect this Toronto-area plan with our broader Canada-wide Google Ads strategy.",
    href: "/services/google-ads",
    text: "Canada-wide Google Ads strategy",
  },
  "scarborough/google-ads": {
    sentence: "Businesses targeting markets beyond Scarborough can review our Google Search advertising management approach while keeping local campaigns distinct.",
    href: "/services/google-ads",
    text: "Google Search advertising management",
  },
  "toronto/meta-ads": {
    sentence: "Businesses operating beyond the city can compare this local approach with our Canada-wide Meta Ads management framework.",
    href: "/services/meta-ads",
    text: "Canada-wide Meta Ads management",
  },
  "mississauga/meta-ads": {
    sentence: "Teams serving customers beyond Mississauga can review our Meta Ads services across Canada for the broader campaign framework.",
    href: "/services/meta-ads",
    text: "Meta Ads services across Canada",
  },
  "brampton/meta-ads": {
    sentence: "For campaigns extending beyond Brampton, see how our Canadian Meta Ads management services handle creative, tracking and lead quality at a wider scale.",
    href: "/services/meta-ads",
    text: "Canadian Meta Ads management services",
  },
  "ottawa/meta-ads": {
    sentence: "Organizations advertising in several markets can review our Meta Ads management services in Canada while keeping Ottawa creative locally relevant.",
    href: "/services/meta-ads",
    text: "Meta Ads management services in Canada",
  },
  "vaughan/meta-ads": {
    sentence: "Businesses expanding outside Vaughan can connect this local strategy with our full-service Meta Ads management approach.",
    href: "/services/meta-ads",
    text: "full-service Meta Ads management",
  },
  "markham/meta-ads": {
    sentence: "Multi-market teams can use our Meta Ads campaign management across Canada without flattening Markham into a generic audience.",
    href: "/services/meta-ads",
    text: "Meta Ads campaign management across Canada",
  },
  "hamilton/meta-ads": {
    sentence: "Businesses covering more than Hamilton can review our Canadian Meta advertising services for the broader testing and measurement model.",
    href: "/services/meta-ads",
    text: "Canadian Meta advertising services",
  },
  "etobicoke/meta-ads": {
    sentence: "Companies serving several markets can compare this district-level approach with our Facebook and Instagram advertising services across Canada.",
    href: "/services/meta-ads",
    text: "Facebook and Instagram advertising services",
  },
  "north-york/meta-ads": {
    sentence: "For campaigns extending beyond North York, explore our Meta Ads management for Canadian businesses operating across multiple markets.",
    href: "/services/meta-ads",
    text: "Meta Ads management for Canadian businesses",
  },
  "scarborough/meta-ads": {
    sentence: "Businesses advertising outside Scarborough can review our Canadian Facebook and Instagram ad management approach while keeping local creative distinct.",
    href: "/services/meta-ads",
    text: "Canadian Facebook and Instagram ad management",
  },
  "toronto/seo": {
    sentence: "Businesses with a wider footprint can connect this Toronto strategy with our Canada-wide SEO and local-search services.",
    href: "/services/seo",
    text: "Canada-wide SEO and local-search services",
  },
  "mississauga/seo": {
    sentence: "Organizations competing in several markets can review our SEO services across Canada while preserving Mississauga-specific search intent.",
    href: "/services/seo",
    text: "SEO services across Canada",
  },
  "brampton/seo": {
    sentence: "For visibility beyond Brampton, our Canadian SEO and local-search services provide the broader technical, content and measurement framework.",
    href: "/services/seo",
    text: "Canadian SEO and local-search services",
  },
  "ottawa/seo": {
    sentence: "Organizations targeting several Canadian markets can review our Canada-wide SEO services while keeping Ottawa content locally specific.",
    href: "/services/seo",
    text: "Canada-wide SEO services",
  },
  "vaughan/seo": {
    sentence: "Businesses expanding beyond Vaughan can connect this local plan with our Canadian search engine optimization services.",
    href: "/services/seo",
    text: "Canadian search engine optimization services",
  },
  "markham/seo": {
    sentence: "Multi-location organizations can combine this Markham strategy with our technical and local SEO services for their wider search footprint.",
    href: "/services/seo",
    text: "technical and local SEO services",
  },
  "hamilton/seo": {
    sentence: "Companies targeting customers beyond Hamilton can review our professional SEO services across Canada for the broader program structure.",
    href: "/services/seo",
    text: "professional SEO services across Canada",
  },
  "etobicoke/seo": {
    sentence: "Businesses serving multiple regions can compare this district-level plan with our full-service SEO management approach.",
    href: "/services/seo",
    text: "full-service SEO management",
  },
  "north-york/seo": {
    sentence: "Organizations competing outside North York can review our SEO services for Canadian businesses with broader geographic coverage.",
    href: "/services/seo",
    text: "SEO services for Canadian businesses",
  },
  "scarborough/seo": {
    sentence: "For visibility beyond Scarborough, our Canadian SEO and local-search support connects local execution with a wider search strategy.",
    href: "/services/seo",
    text: "Canadian SEO and local-search support",
  },
};

export function getLocationParentLink(city: string, service: string): LocationParentLink | undefined {
  return locationParentLinks[city + "/" + service];
}
