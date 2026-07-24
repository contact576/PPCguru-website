import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { tools } from "@/lib/data/tools";

/**
 * The catalogue of pages surfaced in the /admin/meta editor, grouped for the UI.
 * Derived from the same typed data modules the pages render from, so new
 * services/industries/tools appear automatically. Meta overrides work for ANY
 * path (the editor also lets you add a custom one), but these are the primary
 * SEO surfaces the client edits day-to-day.
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

export function pageRegistry(): PageGroup[] {
  return [
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
      group: "Tools",
      pages: tools.map((t) => ({ path: `/tools/${t.slug}`, label: t.name })),
    },
  ];
}

/** Flat set of all known registry paths (for validation / labelling). */
export function knownPaths(): Set<string> {
  return new Set(pageRegistry().flatMap((g) => g.pages.map((p) => p.path)));
}
