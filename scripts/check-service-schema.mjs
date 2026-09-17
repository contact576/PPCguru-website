import { readFileSync } from "node:fs";

function readJsonLd(path) {
  const html = readFileSync(path, "utf8");
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  );
}

function pageGraph(path, serviceId) {
  const blocks = readJsonLd(path);
  const block = blocks.find((candidate) =>
    candidate["@graph"]?.some((node) => node["@id"] === serviceId),
  );
  if (!block) throw new Error(`${path} is missing its service-page @graph`);
  const graph = block["@graph"];
  const faqCount = blocks.flatMap((candidate) => candidate["@graph"] ?? [candidate])
    .filter((node) => node["@type"] === "FAQPage").length;
  if (faqCount !== 1) throw new Error(`${path} must emit exactly one FAQPage, found ${faqCount}`);
  return graph;
}

function requireNode(graph, id, type) {
  const node = graph.find((candidate) => candidate["@id"] === id);
  if (!node || node["@type"] !== type) throw new Error(`Missing ${type} node ${id}`);
  return node;
}

const seoBase = "https://ppcguru.ca/services/seo";
const seoGraph = pageGraph(".next/server/app/services/seo.html", `${seoBase}#service`);
const seoService = requireNode(seoGraph, `${seoBase}#service`, "Service");
const seoPage = requireNode(seoGraph, `${seoBase}#webpage`, "WebPage");
const seoFaq = requireNode(seoGraph, `${seoBase}#faq`, "FAQPage");
requireNode(seoGraph, `${seoBase}#breadcrumb`, "BreadcrumbList");

for (const area of ["Canada", "Toronto", "Mississauga", "Brampton", "Ottawa"]) {
  if (!seoService.areaServed.some((candidate) => candidate.name === area)) throw new Error(`SEO schema is missing ${area}`);
}
if (seoService.areaServed.some((candidate) => candidate.name === "United States")) {
  throw new Error("Canada SEO page must not claim the United States as its Service area");
}
if ("dateModified" in seoService) throw new Error("dateModified is invalid on a Service node");
if (!seoPage.dateModified) throw new Error("SEO WebPage must carry the page freshness date");
if (seoPage.mainEntity?.["@id"] !== `${seoBase}#service`) throw new Error("SEO WebPage mainEntity is not the Service");
if (seoFaq.isPartOf?.["@id"] !== `${seoBase}#webpage`) throw new Error("SEO FAQ is not linked to its WebPage");

const torontoBase = "https://ppcguru.ca/toronto/google-ads";
const torontoGraph = pageGraph(".next/server/app/toronto/google-ads.html", `${torontoBase}#service`);
const torontoService = requireNode(torontoGraph, `${torontoBase}#service`, "Service");
const torontoPage = requireNode(torontoGraph, `${torontoBase}#webpage`, "WebPage");
const torontoFaq = requireNode(torontoGraph, `${torontoBase}#faq`, "FAQPage");
requireNode(torontoGraph, `${torontoBase}#breadcrumb`, "BreadcrumbList");

for (const area of ["Toronto", "Downtown Toronto", "North York", "Scarborough", "Etobicoke", "East York"]) {
  if (!torontoService.areaServed.some((candidate) => candidate.name === area)) throw new Error(`Toronto schema is missing ${area}`);
}
for (const outsideArea of ["Mississauga", "Brampton", "Vaughan", "Markham", "Ottawa", "Canada"]) {
  if (torontoService.areaServed.some((candidate) => candidate.name === outsideArea)) {
    throw new Error(`Toronto service must not absorb the separate ${outsideArea} service area`);
  }
}
if (torontoGraph.some((node) => node["@type"] === "LocalBusiness")) {
  throw new Error("Location service graph must not invent a Toronto branch LocalBusiness");
}
if (torontoService.isRelatedTo?.["@id"] !== "https://ppcguru.ca/services/google-ads#service") {
  throw new Error("Toronto Google Ads service is not connected to the national service");
}
if ("dateModified" in torontoService) throw new Error("dateModified is invalid on a Service node");
if (!torontoPage.dateModified) throw new Error("Toronto WebPage must carry the page freshness date");
if (torontoPage.mainEntity?.["@id"] !== `${torontoBase}#service`) throw new Error("Toronto WebPage mainEntity is not the Service");
if (torontoFaq.isPartOf?.["@id"] !== `${torontoBase}#webpage`) throw new Error("Toronto FAQ is not linked to its WebPage");

console.log(JSON.stringify({
  seoGraphTypes: seoGraph.map((node) => node["@type"]),
  seoAreas: seoService.areaServed.map((area) => area.name),
  torontoGraphTypes: torontoGraph.map((node) => node["@type"]),
  torontoAreas: torontoService.areaServed.map((area) => area.name),
}, null, 2));

