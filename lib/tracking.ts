import { supabaseAdmin } from "@/lib/supabase";

/**
 * Server-only visitor-event persistence (writes to the `visitor_events` table via
 * the service-role client). Best-effort: never throws, returns false if Supabase
 * is unconfigured or the table doesn't exist yet (run supabase/visitor-tracking.sql).
 */
export type VisitorEvent = {
  session_id?: string;
  event: string;
  path?: string;
  referrer?: string;
  target?: string;
  utm?: Record<string, string> | null;
  ip?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  ua?: string | null;
  /** Set when the visitor is already known (see lib/identity.ts). Null = anonymous. */
  lead_id?: string | null;
};

/** A full visitor_events row as stored (read side, for /admin/visitors). */
export type VisitorEventRow = {
  id: string;
  session_id: string | null;
  event: string;
  path: string | null;
  referrer: string | null;
  target: string | null;
  utm: Record<string, string> | null;
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  ua: string | null;
  lead_id: string | null;
  created_at: string;
  /** Resolved from `lead_id` — who this event belongs to. Null = anonymous. */
  person_name?: string | null;
  person_email?: string | null;
};

/**
 * Recent events, newest first, with the person attached wherever we know one.
 *
 * `lead_id` alone is a UUID nobody can read at a glance, so this resolves it to
 * the actual name/email in a single extra query — that's what turns the
 * Visitors table from a list of anonymous ids into a list of people.
 */
export async function getVisitorEvents(limit = 400): Promise<VisitorEventRow[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("visitor_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];

    const rows = data as VisitorEventRow[];
    const leadIds = Array.from(new Set(rows.map((r) => r.lead_id).filter(Boolean) as string[]));
    if (!leadIds.length) return rows;

    // One lookup for the whole page of events, not one per row.
    const { data: leads } = await sb.from("leads").select("id, name, email").in("id", leadIds);
    if (!leads?.length) return rows;

    const byId = new Map(leads.map((l) => [l.id as string, l as { name: string | null; email: string | null }]));
    for (const r of rows) {
      const person = r.lead_id ? byId.get(r.lead_id) : undefined;
      r.person_name = person?.name ?? null;
      r.person_email = person?.email ?? null;
    }
    return rows;
  } catch {
    return [];
  }
}

export async function saveVisitorEvent(e: VisitorEvent): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;
  try {
    const { error } = await sb.from("visitor_events").insert({
      session_id: e.session_id || null,
      event: e.event,
      path: e.path || null,
      referrer: e.referrer || null,
      target: e.target || null,
      utm: e.utm && Object.keys(e.utm).length ? e.utm : null,
      ip: e.ip || null,
      country: e.country || null,
      region: e.region || null,
      city: e.city || null,
      ua: e.ua || null,
      lead_id: e.lead_id || null,
    });
    return !error;
  } catch {
    return false;
  }
}
