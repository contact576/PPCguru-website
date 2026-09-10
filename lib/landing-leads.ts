import { supabaseAdmin } from "@/lib/supabase";
import { LANDING_SOURCE } from "@/lib/data/landing-100-leads";

/**
 * Server-only persistence + reader for `landing_page_leads` (see
 * supabase/landing-leads.sql) — the structured record behind every /100-leads
 * submission. The canonical `leads` row is written first by the action; this
 * table adds the landing-specific answers (service area, business type, budget
 * tier, attribution) and a follow-up `status` the admin panel can work.
 *
 * Never throws. If the table hasn't been created yet, writes fail soft (the
 * lead is already safe in `leads`) and `getLandingLeads` falls back to
 * `leads.source like 'landing:%'` so the panel is never empty by accident.
 */

export const LANDING_LEAD_STATUSES = ["new", "contacted", "qualified", "booked", "lost"] as const;
export type LandingLeadStatus = (typeof LANDING_LEAD_STATUSES)[number];

export function isLandingLeadStatus(v: unknown): v is LandingLeadStatus {
  return typeof v === "string" && (LANDING_LEAD_STATUSES as readonly string[]).includes(v);
}

export type LandingLeadInput = {
  leadId?: string | null;
  landing?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  location?: string;
  businessType?: string;
  budget?: string;
  utm?: Record<string, string> | null;
};

export type LandingLeadRow = {
  id: string;
  lead_id: string | null;
  landing: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  location: string | null;
  business_type: string | null;
  budget: string | null;
  utm: Record<string, string> | null;
  status: LandingLeadStatus;
  created_at: string;
};

let warnedMissing = false;
function warnOnce(where: string, error: unknown) {
  if (warnedMissing) return;
  warnedMissing = true;
  const msg = error instanceof Error ? error.message : JSON.stringify(error);
  console.warn(`[landing-leads] ${where} failed — has supabase/landing-leads.sql been run? ${msg}`);
}

/** Insert one structured landing row. Returns the new id, or null (never throws). */
export async function saveLandingLead(input: LandingLeadInput): Promise<string | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("landing_page_leads")
      .insert({
        lead_id: input.leadId || null,
        landing: input.landing || "100-leads",
        name: input.name || null,
        email: input.email || null,
        phone: input.phone || null,
        company: input.company || null,
        location: input.location || null,
        business_type: input.businessType || null,
        budget: input.budget || null,
        utm: input.utm && Object.keys(input.utm).length ? input.utm : null,
      })
      .select("id")
      .single();
    if (error || !data) {
      warnOnce("insert", error);
      return null;
    }
    return (data.id as string) ?? null;
  } catch (e) {
    warnOnce("insert", e);
    return null;
  }
}

export type LandingLeadsResult = {
  rows: LandingLeadRow[];
  /**
   * true when the dedicated table was unreachable and the rows were derived from
   * `leads` (status editing is unavailable in that mode — the panel says so).
   */
  fallback: boolean;
};

/** Newest first. Falls back to `leads` rows whose source starts with "landing:". */
export async function getLandingLeads(limit = 500): Promise<LandingLeadsResult> {
  const sb = supabaseAdmin();
  if (!sb) return { rows: [], fallback: false };
  try {
    const { data, error } = await sb
      .from("landing_page_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (!error && data) return { rows: data as LandingLeadRow[], fallback: false };
    warnOnce("select", error);
  } catch (e) {
    warnOnce("select", e);
  }

  // Fallback: the canonical mirror. Location / business type live inside the
  // free-text message there, so we surface what we can.
  try {
    const { data, error } = await sb
      .from("leads")
      .select("*")
      .like("source", `${LANDING_SOURCE.split(":")[0]}:%`)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return { rows: [], fallback: true };
    const rows = (data as Array<Record<string, unknown>>).map((r) => {
      const message = String(r.message ?? "");
      const pick = (label: string) => message.match(new RegExp(`${label}:\\s*(.+)`))?.[1]?.trim() ?? null;
      return {
        id: String(r.id),
        lead_id: String(r.id),
        landing: String(r.source ?? "").replace(/^landing:/, "") || "100-leads",
        name: (r.name as string) ?? null,
        email: (r.email as string) ?? null,
        phone: (r.phone as string) ?? null,
        company: (r.company as string) ?? null,
        location: pick("Location"),
        business_type: pick("Business type"),
        budget: pick("Budget") ?? ((r.budget as string) ?? null),
        utm: null,
        status: "new" as const,
        created_at: String(r.created_at),
      } satisfies LandingLeadRow;
    });
    return { rows, fallback: true };
  } catch {
    return { rows: [], fallback: true };
  }
}

/** Admin: move a landing lead through the follow-up pipeline. */
export async function updateLandingLeadStatus(id: string, status: LandingLeadStatus): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;
  try {
    const { error } = await sb.from("landing_page_leads").update({ status }).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}
