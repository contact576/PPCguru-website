import crypto from "node:crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Visitor identity stitching — the piece that turns anonymous traffic into
 * "we know this is Jay from Acme, and here is everything he ever looked at".
 *
 * HOW IT WORKS (and how it deliberately does NOT work)
 *   We never buy, guess, or reverse-look-up who an anonymous visitor is. There
 *   is no identity-graph vendor here. A person becomes known in exactly one
 *   way: they type their email into one of our forms. At that moment we:
 *     1. write a `visitor_identities` row for their device (`ppcg_sid`),
 *     2. RETRO-STITCH — back-fill `visitor_events.lead_id` for everything that
 *        device did before it had a name, so their whole pre-signup research
 *        history becomes readable,
 *     3. MERGE ACROSS DEVICES — any other device that has ever submitted the
 *        same email is stitched too (phone → laptop is the common case),
 *     4. set a signed, httpOnly `ppcg_vid` cookie so future visits are
 *        recognised instantly, even from a fresh tab or after localStorage is
 *        cleared.
 *
 * Everything is best-effort: no function here throws, and all of them no-op
 * cleanly when Supabase isn't configured, so form submission can never break
 * because identity stitching had a bad day.
 */

export const IDENTITY_COOKIE = "ppcg_vid";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

/**
 * Signing key for the identity cookie. Prefers a dedicated secret; falls back
 * to the admin password so the feature works on an existing deployment without
 * new env. Both are salted so the raw secret is never the signing key.
 */
function secret(): string {
  const s = process.env.IDENTITY_SECRET || process.env.ADMIN_PASSWORD || "";
  return `ppcguru-identity::${s}`;
}

/** Cookie signing is only meaningful once a secret exists. */
export function identityConfigured(): boolean {
  return Boolean(process.env.IDENTITY_SECRET || process.env.ADMIN_PASSWORD);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** `<leadId>.<hmac>` — opaque to the browser, unforgeable without the secret. */
function encode(leadId: string): string {
  return `${leadId}.${sign(leadId)}`;
}

function decode(token: string | undefined): string | null {
  if (!token || !identityConfigured()) return null;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const leadId = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  if (!leadId || !mac) return null;
  try {
    return safeEqual(mac, sign(leadId)) ? leadId : null;
  } catch {
    return null;
  }
}

/**
 * Persist the identity cookie. Only callable from a Server Action or Route
 * Handler — Next throws on cookie writes during render, which we swallow.
 */
async function setIdentityCookie(leadId: string): Promise<void> {
  try {
    const store = await cookies();
    store.set(IDENTITY_COOKIE, encode(leadId), {
      httpOnly: true, // never readable by page JS
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE_SECONDS,
    });
  } catch {
    /* not in a writable context — the DB mapping still identifies them */
  }
}

/** Read + verify the identity cookie. Returns the lead id, or null. */
export async function readIdentityCookie(): Promise<string | null> {
  try {
    const store = await cookies();
    return decode(store.get(IDENTITY_COOKIE)?.value);
  } catch {
    return null;
  }
}

/** Clear the identity cookie (used by the visitor-facing opt-out). */
export async function clearIdentityCookie(): Promise<void> {
  try {
    const store = await cookies();
    store.set(IDENTITY_COOKIE, "", { path: "/", maxAge: 0 });
  } catch {
    /* ignore */
  }
}

export type KnownVisitor = {
  leadId: string | null;
  email: string;
  name: string | null;
};

export type StitchResult = {
  /** How many previously-anonymous events were retro-assigned to this person. */
  backfilled: number;
  /** How many devices are now merged under this email. */
  devices: number;
};

/**
 * Called on every successful form submit. Records the device→person mapping,
 * retro-stitches their anonymous history, merges their other devices, and sets
 * the recognition cookie.
 */
export async function identifyVisitor(input: {
  sessionId?: string | null;
  leadId?: string | null;
  email?: string | null;
  name?: string | null;
}): Promise<StitchResult> {
  const empty: StitchResult = { backfilled: 0, devices: 0 };
  const email = (input.email || "").trim().toLowerCase();
  if (!email) return empty;

  // The cookie is worth setting even with no DB — it's what makes them
  // recognisable on the next visit.
  if (input.leadId) await setIdentityCookie(input.leadId);

  const sb = supabaseAdmin();
  if (!sb) return empty;

  try {
    const now = new Date().toISOString();

    // 1) Map this device to this person. Upsert so a repeat submitter just
    //    refreshes their row rather than erroring on the PK.
    if (input.sessionId) {
      await sb.from("visitor_identities").upsert(
        {
          session_id: input.sessionId,
          lead_id: input.leadId || null,
          email,
          name: input.name || null,
          identified_at: now,
          last_seen: now,
        },
        { onConflict: "session_id" }
      );
    }

    // 2) Every device this email has ever used — the cross-device merge.
    const { data: sibling } = await sb
      .from("visitor_identities")
      .select("session_id")
      .ilike("email", email);

    const sessions = Array.from(
      new Set([...(sibling ?? []).map((r) => r.session_id as string), input.sessionId].filter(Boolean) as string[])
    );
    if (!sessions.length) return empty;

    // 3) Keep the whole cluster pointing at the newest lead row, so a person
    //    who submits twice doesn't end up split across two identities.
    if (input.leadId) {
      await sb
        .from("visitor_identities")
        .update({ lead_id: input.leadId, name: input.name || null })
        .in("session_id", sessions);
    }

    // 4) THE STITCH — claim all their unowned history in one statement. The
    //    count is the genuinely new claim: events that had no owner until now.
    const { count } = await sb
      .from("visitor_events")
      .update({ lead_id: input.leadId || null }, { count: "exact" })
      .in("session_id", sessions)
      .is("lead_id", null);

    // 5) Consolidate. Someone who submits a second form gets a second `leads`
    //    row, and without this their earlier events would stay pinned to the
    //    first one — the same human split across two identities in every view.
    //    Re-point the whole cluster at the newest lead id.
    if (input.leadId) {
      await sb
        .from("visitor_events")
        .update({ lead_id: input.leadId })
        .in("session_id", sessions)
        .neq("lead_id", input.leadId);
    }

    return { backfilled: count ?? 0, devices: sessions.length };
  } catch (err) {
    console.error("[identity] stitch failed:", err instanceof Error ? err.message : err);
    return empty;
  }
}

/**
 * Who is this request? Cookie first (survives a cleared localStorage), then the
 * device mapping (survives a cleared cookie). Returns null for genuinely
 * anonymous traffic — which is most of it, and that's fine.
 */
export async function resolveVisitor(sessionId?: string | null): Promise<KnownVisitor | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;

  const cookieLeadId = await readIdentityCookie();

  try {
    if (cookieLeadId) {
      // Prefer the identity table (already has name+email denormalised)…
      const { data } = await sb
        .from("visitor_identities")
        .select("lead_id, email, name")
        .eq("lead_id", cookieLeadId)
        .limit(1)
        .maybeSingle();
      if (data?.email) return { leadId: cookieLeadId, email: data.email as string, name: (data.name as string) ?? null };

      // …falling back to the lead row itself if the mapping was never written
      // (e.g. they submitted from a browser with localStorage disabled).
      const { data: lead } = await sb
        .from("leads")
        .select("id, email, name")
        .eq("id", cookieLeadId)
        .limit(1)
        .maybeSingle();
      if (lead?.email) return { leadId: cookieLeadId, email: lead.email as string, name: (lead.name as string) ?? null };
    }

    if (sessionId) {
      const { data } = await sb
        .from("visitor_identities")
        .select("lead_id, email, name")
        .eq("session_id", sessionId)
        .limit(1)
        .maybeSingle();
      if (data?.email) {
        return { leadId: (data.lead_id as string) ?? null, email: data.email as string, name: (data.name as string) ?? null };
      }
    }
  } catch {
    /* identity is an enhancement — never block the request */
  }
  return null;
}

/** Bump `last_seen` so the People view can sort by genuine recency. */
export async function touchIdentity(sessionId?: string | null): Promise<void> {
  if (!sessionId) return;
  const sb = supabaseAdmin();
  if (!sb) return;
  try {
    await sb.from("visitor_identities").update({ last_seen: new Date().toISOString() }).eq("session_id", sessionId);
  } catch {
    /* ignore */
  }
}
