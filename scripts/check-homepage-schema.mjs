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
      aggregateRating: false,
    },
    null,
    2,
  ),
);

