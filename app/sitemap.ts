import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { allLocationParams } from "@/lib/data/locations";
import { caseStudies } from "@/lib/data/case-studies";
import { tools } from "@/lib/data/tools";
import { getAllPostSlugs } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    "", "/services", "/industries", "/locations", "/results", "/about",
    "/blog", "/contact", "/tools", "/privacy", "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const toolRoutes = tools.filter((t) => t.sitemap).map((t) => ({ url: `${base}/tools/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));

  const serviceRoutes = services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }));
  const industryRoutes = industries.map((i) => ({ url: `${base}/industries/${i.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));
  const locationRoutes = allLocationParams().map((p) => ({ url: `${base}/${p.city}/${p.service}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  const caseRoutes = caseStudies.map((c) => ({ url: `${base}/results/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  const blogRoutes = getAllPostSlugs().map((slug) => ({ url: `${base}/blog/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));

  return [...staticRoutes, ...toolRoutes, ...serviceRoutes, ...industryRoutes, ...locationRoutes, ...caseRoutes, ...blogRoutes];
}
