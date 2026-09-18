import { readFileSync } from "node:fs";

const html = readFileSync(".next/server/app/index.html", "utf8");
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
  JSON.parse(match[1]),
);

const graph = blocks.find((block) => Array.isArray(block["@graph"]))?.["@graph"];
if (!graph) throw new Error("Homepage is missing the sitewide JSON-LD graph");

const business = graph.find((node) => node["@id"] === "https://ppcguru.ca/#organization");
const website = graph.find((node) => node["@type"] === "WebSite");
const catalog = graph.find((node) => node["@type"] === "OfferCatalog");
const webpage = blocks.find((block) => block["@type"] === "WebPage");
const faq = blocks.find((block) => block["@type"] === "FAQPage");

if (!business || !website || !catalog || !webpage || !faq) {
  throw new Error("Homepage is missing a required LocalBusiness, WebSite, OfferCatalog, WebPage or FAQPage node");
}
if (business["@type"] !== "LocalBusiness") throw new Error("Canonical business node must use LocalBusiness");
if (business.logo !== "https://ppcguru.ca/brand/ppc-guru-logo-720.png") throw new Error("Schema logo URL regressed");
if (business.address?.streetAddress !== "55 Queen Street East") throw new Error("Schema street address regressed");
if (business.address?.postalCode !== "M5C 1R6") throw new Error("Schema postal code must match the verified Google Business Profile NAP");
if (!business.geo || !business.openingHoursSpecification) throw new Error("LocalBusiness geo or opening hours missing");
if ("aggregateRating" in business) throw new Error("Self-serving LocalBusiness AggregateRating must not be emitted");
const requiredSameAs = [
  "https://www.facebook.com/PPCguru.ca/",
  "https://www.youtube.com/@Ppcguru",
  "https://www.instagram.com/ppcguru.ca/",
  "https://www.linkedin.com/company/ppc-guru/",
  "https://clutch.co/profile/ppc-guru",
  "https://www.trustpilot.com/review/ppcguru.ca",
  "https://www.goodfirms.co/company/ppc-guru",
  "https://themanifest.com/company/ppc-guru",
  "https://www.sortlist.com/agency/ppc-guru",
  "https://www.provenexpert.com/en-us/ppc-guru/",
  "https://itprofiles.com/company/ppc-guru",
  "https://techbehemoths.com/company/ppc-guru",
  "https://www.g2.com/products/ppc-guru",
  "https://www.bbb.org/ca/on/toronto/profile/digital-marketing/ppc-guru-0107-1420487",
  "https://www.designrush.com/agency/profile/ppc-guru",
  "https://www.agencyspotter.com/ppc-guru/",
];
for (const url of requiredSameAs) {
  if (!business.sameAs?.includes(url)) throw new Error(`Missing verified LocalBusiness sameAs URL: ${url}`);
}
if (new Set(business.sameAs).size !== business.sameAs.length) throw new Error("LocalBusiness sameAs contains duplicate URLs");
if (business.sameAs.some((url) => /[?&](?:_gl|_ga|_gcl_au|utm_[^=]*)=/.test(url))) {
  throw new Error("LocalBusiness sameAs must use canonical profile URLs without tracking parameters");
}
if (catalog.itemListElement?.length !== 7) throw new Error("Homepage service catalog must contain seven core services");
for (const location of ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Hamilton", "Ottawa"]) {
  if (!business.areaServed?.some((area) => area.name === location)) throw new Error(`Missing LocalBusiness areaServed: ${location}`);
}
if (!business.hasCertification?.every((credential) => credential["@type"] === "Certification")) {
  throw new Error("Partner credentials must use Schema.org Certification nodes");
}

console.log(
  JSON.stringify(
    {
      jsonLdBlocks: blocks.length,
      graphTypes: graph.map((node) => node["@type"]),
      businessType: business["@type"],
      logo: business.logo,
      address: business.address,
      geo: business.geo,
      serviceCount: catalog.itemListElement.length,
      servedLocations: business.areaServed.map((area) => area.name),
      sameAsCount: business.sameAs.length,
      sameAs: business.sameAs,
      aggregateRating: false,
    },
    null,
    2,
  ),
);

