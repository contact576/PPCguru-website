import { supabaseAdmin } from "@/lib/supabase";

/**
 * Read side for /admin/people — the identified counterpart to /admin/visitors.
 *
 * /admin/visitors answers "what happened on the site". This answers "who did
 * it, and how badly do they want to buy". One row per PERSON (keyed on email,
 * so a phone and a laptop collapse into one human), each carrying their full
 * stitched timeline including everything they read before they ever gave us
 * their name.
 *
 * Never throws; returns [] when Supabase or the identity tables are missing.
 */

const DAY_MS = 86_400_000;

/** Mirrors lib/journeys.ts — pages that mean "buying", not "browsing". */
const MONEY_PAGES = [/^\/pricing/, /^\/free-audit/, /^\/contact/, /^\/services\//, /^\/compare/, /^\/benchmarks/];
const isMoneyPage = (p: string | null) => Boolean(p) && MONEY_PAGES.some((re) => re.test(p as string));

export type PersonEvent = {
  id: string;
  event: string;
  path: string | null;
  target: string | null;
  referrer: string | null;
  utm: Record<string, string> | null;
  city: string | null;
  region: string | null;
  country: string | null;
  created_at: string;
};

export type PersonJourney = { journey: string; created_at: string; path: string | null };

export type Person = {
  leadId: string | null;
  email: string;
  name: string | null;
  /** Distinct browsers/devices merged under this address. */
  devices: number;
  identifiedAt: string | null;
  lastSeen: string | null;
  unsubscribedAt: string | null;
  events: PersonEvent[];
  pageviews: number;
  /** Money-page views in the last 7 days — the intent signal. */
  moneyHits: number;
  /** Events recorded BEFORE they identified themselves (the retro-stitch payoff). */
  preIdentifyEvents: number;
  intent: "hot" | "warm" | "cold";
  location: string;
  journeys: PersonJourney[];
};

type IdentityRow = {
  session_id: string;
  lead_id: string | null;
  email: string;
  name: string | null;
  identified_at: string | null;
  last_seen: string | null;
  unsubscribed_at: string | null;
};

function scoreIntent(moneyHits: number, lastSeen: string | null): Person["intent"] {
  const daysAgo = lastSeen ? (Date.now() - new Date(lastSeen).getTime()) / DAY_MS : Infinity;
  if (moneyHits >= 3 && daysAgo <= 7) return "hot";
  if (moneyHits >= 1 && daysAgo <= 30) return "warm";
  return "cold";
}

export async function getPeople(limit = 100): Promise<Person[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];

  try {
    // 1) Every known device, newest activity first.
    const { data: identities, error } = await sb
      .from("visitor_identities")
      .select("session_id, lead_id, email, name, identified_at, last_seen, unsubscribed_at")
      .order("last_seen", { ascending: false })
      .limit(limit * 4); // over-fetch: several devices collapse into one person
    if (error || !identities) return [];

    // 2) Collapse devices → people, keyed on the email.
    const byEmail = new Map<string, IdentityRow[]>();
    for (const row of identities as IdentityRow[]) {
      const key = (row.email || "").toLowerCase();
      if (!key) continue;
      const list = byEmail.get(key);
      if (list) list.push(row);
      else byEmail.set(key, [row]);
    }
    const people = Array.from(byEmail.entries()).slice(0, limit);
    if (!people.length) return [];

    const leadIds = Array.from(
      new Set(people.flatMap(([, rows]) => rows.map((r) => r.lead_id).filter(Boolean) as string[]))
    );
    const emails = people.map(([email]) => email);

    // 3) Their events + any automated mail we've already sent them.
    const [{ data: events }, { data: sends }] = await Promise.all([
      leadIds.length
        ? sb
            .from("visitor_events")
            .select("id, lead_id, event, path, target, referrer, utm, city, region, country, created_at")
            .in("lead_id", leadIds)
            .order("created_at", { ascending: false })
            .limit(4000)
        : Promise.resolve({ data: [] as never[] }),
      sb
        .from("journey_sends")
        .select("journey, email, path, created_at")
        .in("email", emails)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const eventsByLead = new Map<string, PersonEvent[]>();
    for (const e of (events ?? []) as (PersonEvent & { lead_id: string })[]) {
      const list = eventsByLead.get(e.lead_id);
      if (list) list.push(e);
      else eventsByLead.set(e.lead_id, [e]);
    }

    const sendsByEmail = new Map<string, PersonJourney[]>();
    for (const s of (sends ?? []) as (PersonJourney & { email: string })[]) {
      const key = (s.email || "").toLowerCase();
      const list = sendsByEmail.get(key);
      if (list) list.push(s);
      else sendsByEmail.set(key, [s]);
    }

    // 4) Assemble.
    const since = Date.now() - 7 * DAY_MS;
    const out: Person[] = people.map(([email, rows]) => {
      const newest = rows[0];
      const personEvents = rows
        .flatMap((r) => (r.lead_id ? eventsByLead.get(r.lead_id) ?? [] : []))
        .filter((e, i, a) => a.findIndex((x) => x.id === e.id) === i) // dedupe merged leads
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

      const identifiedAt = rows
        .map((r) => r.identified_at)
        .filter(Boolean)
        .sort()[0] ?? null;
      const lastSeen =
        rows
          .map((r) => r.last_seen)
          .filter(Boolean)
          .sort()
          .reverse()[0] ?? personEvents[0]?.created_at ?? null;

      const moneyHits = personEvents.filter(
        (e) => e.event === "pageview" && +new Date(e.created_at) >= since && isMoneyPage(e.path)
      ).length;

      const withPlace = personEvents.find((e) => e.city || e.region || e.country);

      return {
        leadId: newest.lead_id,
        email,
        name: rows.find((r) => r.name)?.name ?? null,
        devices: rows.length,
        identifiedAt,
        lastSeen,
        unsubscribedAt: rows.find((r) => r.unsubscribed_at)?.unsubscribed_at ?? null,
        events: personEvents.slice(0, 200),
        pageviews: personEvents.filter((e) => e.event === "pageview").length,
        moneyHits,
        preIdentifyEvents: identifiedAt
          ? personEvents.filter((e) => +new Date(e.created_at) < +new Date(identifiedAt)).length
          : 0,
        intent: scoreIntent(moneyHits, lastSeen),
        location: withPlace
          ? [withPlace.city, withPlace.region, withPlace.country].filter(Boolean).join(", ")
          : "—",
        journeys: sendsByEmail.get(email) ?? [],
      };
    });

    // Hot first, then most recently active.
    const rank = { hot: 0, warm: 1, cold: 2 } as const;
    return out.sort(
      (a, b) => rank[a.intent] - rank[b.intent] || +new Date(b.lastSeen ?? 0) - +new Date(a.lastSeen ?? 0)
    );
  } catch {
    return [];
  }
}
