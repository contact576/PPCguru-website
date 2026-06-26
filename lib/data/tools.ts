import { Calculator, Gauge, PenLine, TrendingUp, Target, Link2, type LucideIcon } from "lucide-react";

/**
 * Free-tools registry — single source consumed by the tools hub (app/tools/page)
 * AND the sitemap (app/sitemap.ts), so new tool routes never drift out of either.
 * `kind`: engine = projectFunnel-backed · client = pure client math · ai = API route.
 */
export type ToolKind = "engine" | "client" | "ai";

export type Tool = {
  slug: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  kind: ToolKind;
  sitemap: boolean;
};

export const tools: Tool[] = [
  { slug: "google-ads-calculator", name: "Google Ads ROI Calculator", desc: "Estimate clicks, leads, qualified leads, booked calls and revenue from your Google Ads budget — by industry.", icon: Calculator, kind: "engine", sitemap: true },
  { slug: "meta-ads-calculator", name: "Meta Ads ROI Calculator", desc: "See what Facebook & Instagram ads could produce for your industry and budget.", icon: Calculator, kind: "engine", sitemap: true },
  { slug: "lead-quality-calculator", name: "Lead Quality Calculator", desc: "Model how raw leads become qualified leads, booked calls and customers — and your true cost per acquisition.", icon: Target, kind: "engine", sitemap: true },
  { slug: "roas-calculator", name: "ROAS Calculator", desc: "Work out your return on ad spend, profit and break-even ROAS from spend, revenue and margin.", icon: TrendingUp, kind: "client", sitemap: true },
  { slug: "instant-audit", name: "Instant AI Website Audit", desc: "Enter your URL for an instant, AI-written audit of speed, SEO and tracking signals.", icon: Gauge, kind: "ai", sitemap: true },
  { slug: "ad-copy-generator", name: "AI Ad Copy Generator", desc: "Generate Google & Meta ad headlines and descriptions for your offer in seconds.", icon: PenLine, kind: "ai", sitemap: true },
  { slug: "utm-builder", name: "UTM Campaign Builder", desc: "Build clean, consistent UTM-tagged URLs so every click is tracked correctly in GA4.", icon: Link2, kind: "client", sitemap: true },
];

export const toolHref = (slug: string) => `/tools/${slug}`;
