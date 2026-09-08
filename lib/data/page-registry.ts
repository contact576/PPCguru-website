import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { tools } from "@/lib/data/tools";
import { cities, locationServices } from "@/lib/data/locations";
import { caseStudies } from "@/lib/data/case-studies";
import { allServiceIndustryPairs, serviceIndustryLabel } from "@/lib/data/service-industry";

/**
 * The catalogue of pages surfaced in the /admin/meta editor, grouped for the UI.
 * Derived from the same typed data modules the pages render from, so new
 * services/industries/tools/cities appear automatically.
 *
 * This list must stay EXHAUSTIVE over the indexable routes. Meta overrides work
 * for any path, but a page that isn't listed here is a page nobody knows they
 * can edit — which is how the 30 location pages and the 45 service × industry
 * combos ended up with no way to change their meta description from the
 * dashboard even though `withMetaOverride` was already wired into both
 * templates. Add a route family here at the same time you add its template.
 */

export type PageRef = { path: string; label: string };
export type PageGroup = { group: string; pages: PageRef[] };

const core: PageRef[] = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services (hub)" },
  { path: "/industries", label: "Industries (hub)" },
  { path: "/locations", label: "Locations (hub)" },
  { path: "/results", label: "Results / case studies" },
  { path: "/tools", label: "Free tools (hub)" },
  { path: "/pricing", label: "Pricing" },
  { path: "/benchmarks", label: "Benchmarks" },
  { path: "/compare", label: "Compare" },
  { path: "/glossary", label: "Glossary" },
  { path: "/blog", label: "Blog index" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/free-audit", label: "Free audit" },
  { path: "/privacy", label: "Privacy policy" },
  { path: "/terms", label: "Terms" },
];

/** Blog posts are read at request time, so the caller passes them in. */
export type BlogRef = { slug: string; title: string };

export function pageRegistry(posts: BlogRef[] = []): PageGroup[] {
  const groups: PageGroup[] = [
    { group: "Core pages", pages: core },
    {
      group: "Services",
      pages: services.map((s) => ({ path: `/services/${s.slug}`, label: s.name })),
    },
    {
      group: "Industries",
      pages: industries.map((i) => ({ path: `/industries/${i.slug}`, label: i.name })),
    },
    {
      // /[city]/[service] — 10 cities × 3 services.
      group: "Locations",
      pages: cities.flatMap((c) =>
        locationServices.map((s) => ({
          path: `/${c.slug}/${s.slug}`,
          label: `${s.name} — ${c.name}`,
        })),
      ),
    },
    {
      // /services/[slug]/[industry] — the 45 "[service] for [industry]" combos.
      group: "Service × industry",
      pages: allServiceIndustryPairs().map((p) => ({
        path: `/services/${p.service}/${p.industry}`,
        label: serviceIndustryLabel(p.service, p.industry),
      })),
    },
    {
      group: "Tools",
      pages: tools.map((t) => ({ path: `/tools/${t.slug}`, label: t.name })),
    },
    {
      group: "Case studies",
      pages: caseStudies.map((c) => ({ path: `/results/${c.slug}`, label: `${c.client} — ${c.service}` })),
    },
  ];

  if (posts.length) {
    groups.push({
      group: "Blog posts",
      pages: posts.map((p) => ({ path: `/blog/${p.slug}`, label: p.title })),
    });
  }
  return groups;
}

/** Flat set of all known registry paths (for validation / labelling). */
export function knownPaths(posts: BlogRef[] = []): Set<string> {
  return new Set(pageRegistry(posts).flatMap((g) => g.pages.map((p) => p.path)));
}
