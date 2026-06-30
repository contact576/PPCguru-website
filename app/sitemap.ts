import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { allLocationParams } from "@/lib/data/locations";
import { caseStudies } from "@/lib/data/case-studies";
import { tools } from "@/lib/data/tools";
import { getAllPostSlugs } from "@/lib/blog";
import { allServiceIndustryPairs } from "@/lib/data/service-industry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  // Stable content-updated stamp (not new Date()) so lastModified isn't "always now" each build.
  const now = new Date("2026-06-30T00:00:00Z");

  const staticRoutes = [
    "", "/services", "/industries", "/locations", "/results", "/about",
    "/blog", "/contact", "/tools", "/benchmarks", "/privacy", "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const toolRoutes = tools.filter((t) => t.sitemap).map((t) => ({ url: `${base}/tools/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));

  const serviceRoutes = services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }));
  const serviceIndustryRoutes = allServiceIndustryPairs().map((p) => ({ url: `${base}/services/${p.service}/${p.industry}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  const industryRoutes = industries.map((i) => ({ url: `${base}/industries/${i.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));
  const locationRoutes = allLocationParams().map((p) => ({ url: `${base}/${p.city}/${p.service}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  const caseRoutes = caseStudies.map((c) => ({ url: `${base}/results/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  const blogRoutes = getAllPostSlugs().map((slug) => ({ url: `${base}/blog/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));

  return [...staticRoutes, ...toolRoutes, ...serviceRoutes, ...serviceIndustryRoutes, ...industryRoutes, ...locationRoutes, ...caseRoutes, ...blogRoutes];
}
