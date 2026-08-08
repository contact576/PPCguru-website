import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { allLocationParams } from "@/lib/data/locations";
import { caseStudies } from "@/lib/data/case-studies";
import { tools } from "@/lib/data/tools";
import { getAllPosts } from "@/lib/blog";
import { allServiceIndustryPairs } from "@/lib/data/service-industry";

// Re-generate at most once a minute so newly published blog posts (read from
// Supabase / markdown at request time) appear in the sitemap without a redeploy.
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  // Stable content-updated stamp (not new Date()) so lastModified isn't "always now" each build.
  const now = new Date("2026-06-30T00:00:00Z");

  const staticRoutes = [
    "", "/services", "/industries", "/locations", "/results", "/about",
    "/blog", "/contact", "/free-audit", "/tools", "/pricing", "/benchmarks", "/compare", "/glossary", "/privacy", "/terms",
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
  // Blog posts carry their OWN publish date as lastModified — a fresh CMS post
  // stamped with the site-wide `now` constant would look months old to Google.
  const posts = await getAllPosts();
  const blogRoutes = posts.map((p) => {
    const d = new Date(p.date);
    return {
      url: `${base}/blog/${p.slug}`,
      lastModified: isNaN(+d) ? now : d,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  // /blog itself is as fresh as its newest post.
  const newestPost = blogRoutes.reduce<Date | null>(
    (acc, r) => (acc && acc >= r.lastModified ? acc : r.lastModified),
    null,
  );

  const staticRoutesDated = staticRoutes.map((r) =>
    newestPost && r.url === `${base}/blog` ? { ...r, lastModified: newestPost } : r,
  );

  return [...staticRoutesDated, ...toolRoutes, ...serviceRoutes, ...serviceIndustryRoutes, ...industryRoutes, ...locationRoutes, ...caseRoutes, ...blogRoutes];
}
