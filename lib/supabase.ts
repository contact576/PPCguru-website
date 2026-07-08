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

/** Best-effort lead persistence. Never throws — form delivery must not depend
 *  on the DB being reachable. Returns true if the row was written. */
export async function saveLead(lead: {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  source?: string;
  budget?: string;
  service?: string;
  message?: string;
}): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;
  try {
    const { error } = await sb.from("leads").insert({
      name: lead.name || null,
      email: lead.email || null,
      phone: lead.phone || null,
      company: lead.company || null,
      website: lead.website || null,
      source: lead.source || null,
      budget: lead.budget || null,
      service: lead.service || null,
      message: lead.message || null,
    });
    return !error;
  } catch {
    return false;
  }
}

export type DbPost = {
  id: string;
  slug: string;
  title: string;
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
