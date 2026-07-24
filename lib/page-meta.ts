import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { siteConfig } from "@/lib/site-config";

/**
 * Per-page SEO meta overrides, edited at /admin/meta and stored in the Supabase
 * `page_meta` table (keyed by normalized route path). Like the rest of the CMS,
 * this degrades gracefully: with no database (or on any error) NO override is
 * returned and every page keeps its hand-authored default metadata.
 *
 * The public flow is: a page builds its DEFAULT metadata as before, then wraps
 * it in `withMetaOverride(base, path)`. Only fields the admin actually filled in
 * win — an empty field falls through to the page's own default.
 */

export type PageMetaOverride = {
  path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  noindex: boolean;
  updated_at?: string;
};

/** Normalize a route to the canonical key used as the table primary key. */
export function normPath(input: string): string {
  if (!input) return "/";
  let s = input.trim().split(/[?#]/)[0];
  if (!s.startsWith("/")) s = "/" + s;
  s = s.replace(/\/+$/g, ""); // strip trailing slash(es)
  return s || "/";
}

/**
 * All overrides, fetched once per request (React `cache` dedupes across every
 * page/segment in a single render). Returns an empty map with no DB configured.
 */
export const getPageMetaMap = cache(
  async (): Promise<Record<string, PageMetaOverride>> => {
    const sb = supabaseAdmin();
    if (!sb) return {};
    try {
      const { data, error } = await sb
        .from("page_meta")
        .select("path,title,description,keywords,noindex,updated_at");
      if (error || !data) return {};
      const map: Record<string, PageMetaOverride> = {};
      for (const row of data as PageMetaOverride[]) {
        map[normPath(row.path)] = row;
      }
      return map;
    } catch {
      return {};
    }
  },
);

export async function getPageMeta(path: string): Promise<PageMetaOverride | null> {
  const map = await getPageMetaMap();
  return map[normPath(path)] ?? null;
}

const nonEmpty = (v: string | null | undefined): v is string =>
  typeof v === "string" && v.trim().length > 0;

/* ── Admin writes (service-role only) ──────────────────────────────────────── */

/** Fresh list of every override, newest-edited first. For the /admin/meta UI. */
export async function listPageMeta(): Promise<PageMetaOverride[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];
  const { data, error } = await sb
    .from("page_meta")
    .select("path,title,description,keywords,noindex,updated_at")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data as PageMetaOverride[];
}

const trimOrNull = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, 600) : null;
};

/**
 * Upsert one page's override. Empty title/description/keywords are stored as
 * NULL so they cleanly fall back to the page default. Returns the saved row, or
 * null if there's no DB / a write error.
 */
export async function savePageMeta(input: {
  path: string;
  title?: string;
  description?: string;
  keywords?: string;
  noindex?: boolean;
}): Promise<PageMetaOverride | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;
  const path = normPath(input.path);
  const row = {
    path,
    title: trimOrNull(input.title),
    description: trimOrNull(input.description),
    keywords: trimOrNull(input.keywords),
    noindex: Boolean(input.noindex),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await sb
    .from("page_meta")
    .upsert(row, { onConflict: "path" })
    .select("path,title,description,keywords,noindex,updated_at")
    .maybeSingle();
  if (error) return null;
  return (data as PageMetaOverride) ?? row;
}

/** Remove a page's override entirely (revert to defaults). */
export async function deletePageMeta(path: string): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;
  const { error } = await sb.from("page_meta").delete().eq("path", normPath(path));
  return !error;
}

/**
 * Merge a CMS override on top of a page's default Metadata. Only non-empty
 * override fields replace the defaults; OG/Twitter title+description are kept in
 * sync so a single edit updates the social cards too. Never throws.
 */
export async function withMetaOverride(base: Metadata, path: string): Promise<Metadata> {
  const o = await getPageMeta(path);
  if (!o) return base;

  const out: Metadata = { ...base };
  const og = { ...(base.openGraph as Record<string, unknown> | undefined) };
  const tw = { ...(base.twitter as Record<string, unknown> | undefined) };

  if (nonEmpty(o.title)) {
    out.title = o.title;
    const social = `${o.title} | ${siteConfig.name}`;
    og.title = social;
    tw.title = social;
  }
  if (nonEmpty(o.description)) {
    out.description = o.description;
    og.description = o.description;
    tw.description = o.description;
  }
  if (nonEmpty(o.keywords)) {
    out.keywords = o.keywords.split(",").map((k) => k.trim()).filter(Boolean);
  }
  if (o.noindex) {
    out.robots = { index: false, follow: false };
  }

  if (Object.keys(og).length) out.openGraph = og as Metadata["openGraph"];
  if (Object.keys(tw).length) out.twitter = tw as Metadata["twitter"];
  return out;
}
