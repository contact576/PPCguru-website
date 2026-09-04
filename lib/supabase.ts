import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase access. All DB reads/writes go through the service-role
 * client (bypasses RLS — never import this into client components). Everything
 * is optional: when env is missing, the helpers return null and callers fall
 * back gracefully (e.g. the blog falls back to markdown files).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabase() {
  return Boolean(url && serviceKey);
}

let admin: SupabaseClient | null = null;

/** Service-role client (server only). Returns null when Supabase isn't configured. */
export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!admin) {
    admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}

/** Storage bucket used for blog cover images / inline uploads. */
export const BLOG_BUCKET = "blog-images";

export type LeadInput = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  source?: string;
  budget?: string;
  service?: string;
  message?: string;
};

/**
 * Lead persistence that hands back the new row's id. Never throws. Returns null
 * when Supabase is unconfigured or the insert failed; form actions require a
 * successful save when Supabase is configured before delivering to the CRM.
 *
 * The id matters: it's the key visitor identity stitching hangs off (see
 * lib/identity.ts), so prefer this over `saveLead` at any call site that will
 * go on to call `identifyVisitor`.
 */
export async function saveLeadReturning(lead: LeadInput): Promise<string | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("leads")
      .insert({
        name: lead.name || null,
        email: lead.email || null,
        phone: lead.phone || null,
        company: lead.company || null,
        website: lead.website || null,
        source: lead.source || null,
        budget: lead.budget || null,
        service: lead.service || null,
        message: lead.message || null,
      })
      .select("id")
      .single();
    if (error || !data) return null;
    return (data.id as string) ?? null;
  } catch {
    return null;
  }
}

/** Boolean-returning wrapper kept for callers that don't need the id. */
export async function saveLead(lead: LeadInput): Promise<boolean> {
  return (await saveLeadReturning(lead)) !== null;
}

export type DbPost = {
  id: string;
  slug: string;
  title: string;
  /** Optional shorter <title>/OG title. Falls back to `title` when unset. */
  seo_title: string | null;
  description: string | null;
  category: string | null;
  author: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
