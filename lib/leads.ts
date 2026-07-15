import { supabaseAdmin } from "@/lib/supabase";

/**
 * Server-only reader for the `leads` table (every form submission across the
 * site is mirrored there via app/actions/lead.ts + app/contact/actions.ts).
 * Used by the /admin/leads view. Never throws; returns [] with no DB.
 */
export type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  website: string | null;
  source: string | null;
  budget: string | null;
  service: string | null;
  message: string | null;
  created_at: string;
};

export async function getLeads(limit = 500): Promise<LeadRow[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as LeadRow[];
  } catch {
    return [];
  }
}
