import { supabaseAdmin } from "@/lib/supabase";

/**
 * CMS settings — a single-row JSON blob in Supabase (`app_settings`), edited via
 * /admin/settings. Like everything else, it degrades gracefully: with no database
 * configured (or on any error) the typed defaults below are returned, so the site
 * and CMS keep working. `getSettings()` is safe to call from any server context.
 */

export type CmsSettings = {
  /** Pre-filled as the author on every NEW post. */
  defaultAuthor: string;
  /** Pre-filled as the category on every NEW post. */
  defaultCategory: string;
  /** <title> + heading used for the public /blog index. */
  blogTitle: string;
  /** Meta description + hero intro for the public /blog index. */
  blogDescription: string;
};

export const DEFAULT_SETTINGS: CmsSettings = {
  defaultAuthor: "PPC Guru",
  defaultCategory: "Marketing",
  blogTitle: "Blog & Resources",
  blogDescription:
    "Practical guides on Google Ads, Meta Ads, SEO and lead generation for local service businesses — from the PPC Guru team.",
};

/** Singleton row id — there is only ever one settings record. */
const SETTINGS_ID = 1;

function clean(input: Partial<CmsSettings> | null | undefined): Partial<CmsSettings> {
  if (!input || typeof input !== "object") return {};
  const out: Partial<CmsSettings> = {};
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof CmsSettings)[]) {
    const v = input[key];
    if (typeof v === "string") out[key] = v.trim().slice(0, 400);
  }
  return out;
}

/** Current settings, merged over defaults. Never throws. */
export async function getSettings(): Promise<CmsSettings> {
  const sb = supabaseAdmin();
  if (!sb) return DEFAULT_SETTINGS;
  try {
    const { data: row, error } = await sb
      .from("app_settings")
      .select("data")
      .eq("id", SETTINGS_ID)
      .maybeSingle();
    if (error || !row) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...clean(row.data as Partial<CmsSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Persist a partial update. Returns the merged settings, or null if no DB / failure. */
export async function saveSettings(partial: Partial<CmsSettings>): Promise<CmsSettings | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;
  const current = await getSettings();
  const next: CmsSettings = { ...current, ...clean(partial) };
  const { error } = await sb
    .from("app_settings")
    .upsert({ id: SETTINGS_ID, data: next, updated_at: new Date().toISOString() });
  if (error) return null;
  return next;
}
