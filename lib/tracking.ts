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
};

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
    return data as VisitorEventRow[];
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
    });
    return !error;
  } catch {
    return false;
  }
}
