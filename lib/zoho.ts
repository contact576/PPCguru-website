/**
 * Zoho CRM lead sync — mirrors every website form submission into the Leads
 * module, alongside the Supabase row and the team email.
 *
 * This org lives on the **Canada** data centre (crm.zohocloud.ca), so the OAuth
 * and API hosts are the `.ca` ones — NOT the `.com` defaults in most tutorials.
 * Both are env-overridable in case the org is ever migrated:
 *   OAuth:  https://accounts.zohocloud.ca/oauth/v2/token
 *   API:    https://www.zohoapis.ca/crm/v8/Leads/upsert
 * The Self Client that issues the refresh token must also be created on the
 * Canadian console (https://api-console.zohocloud.ca) — a token minted on the
 * US console will 401 here. See ZOHO-CRM-SETUP.md.
 *
 * Design rules, matching the other lead sinks in this codebase:
 *   - NEVER throws. A Zoho outage, an expired token or a rejected picklist must
 *     not break a form or lose a lead — Supabase + email still carry it.
 *   - No-ops (returns false) until the three secrets are set, so local dev and
 *     preview deploys don't need CRM access.
 *   - Server-only. The refresh token never reaches the browser.
 *
 * Upserts (not inserts) keyed on Email, so a repeat submitter updates their
 * existing lead instead of creating duplicates for the sales team to merge.
 */

const ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN || "accounts.zohocloud.ca";
const FALLBACK_API_DOMAIN = process.env.ZOHO_API_DOMAIN || "www.zohoapis.ca";

/**
 * Lead_Source is a PICKLIST in Zoho: an arbitrary string like "popup:audit" is
 * rejected with INVALID_DATA. "Web Download" is a stock option present in a
 * default Leads layout. Override once you've added a tidier option (e.g.
 * "Website") to the picklist in Zoho → Setup → Modules → Leads → Lead Source.
 * If the value isn't in the picklist we retry without the field rather than
 * dropping the lead (see `postLead`).
 */
const LEAD_SOURCE = process.env.ZOHO_LEAD_SOURCE || "Web Download";

const TIMEOUT_MS = 8000;

export type ZohoLead = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  /** Where on the site it came from, e.g. "contact", "popup:audit". */
  source?: string;
  budget?: string;
  service?: string;
  message?: string;
};

/** True once all three OAuth secrets are present. */
export function zohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN,
  );
}

// ---------------------------------------------------------------------------
// Access token (cached)
// ---------------------------------------------------------------------------

type Token = { accessToken: string; apiDomain: string; expiresAt: number };

/**
 * Access tokens last an hour, so we cache in module scope and refresh a minute
 * early. On serverless each warm instance keeps its own copy — harmless, and it
 * still removes almost all of the token round-trips. `inFlight` collapses a
 * burst of concurrent submissions into a single refresh call.
 */
let cached: Token | null = null;
let inFlight: Promise<Token | null> | null = null;

async function fetchToken(): Promise<Token | null> {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  try {
    const res = await fetch(`https://${ACCOUNTS_DOMAIN}/oauth/v2/token?${params}`, {
      method: "POST",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as {
      access_token?: string;
      expires_in?: number;
      api_domain?: string;
      error?: string;
    } | null;

    // Zoho answers 200 with an { error } body for a revoked/invalid token.
    if (!res.ok || !json?.access_token) {
      console.warn(`[zoho] token refresh failed (${res.status}): ${json?.error ?? "no access_token"}`);
      return null;
    }

    return {
      accessToken: json.access_token,
      // The token response tells us the authoritative API host for this org.
      apiDomain: (json.api_domain || `https://${FALLBACK_API_DOMAIN}`).replace(/\/+$/, ""),
      expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 - 60_000,
    };
  } catch (err) {
    console.warn("[zoho] token refresh error:", err instanceof Error ? err.message : err);
    return null;
  }
}

async function getToken(force = false): Promise<Token | null> {
  if (!force && cached && cached.expiresAt > Date.now()) return cached;
  if (force) cached = null;
  if (!inFlight) {
    inFlight = fetchToken().then((t) => {
      cached = t;
      inFlight = null;
      return t;
    });
  }
  return inFlight;
}

// ---------------------------------------------------------------------------
// Field mapping
// ---------------------------------------------------------------------------

/** Zoho requires Last_Name; our forms collect one free-text "name". */
function splitName(full: string | undefined): { First_Name?: string; Last_Name: string } {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { Last_Name: "Unknown" };
  if (parts.length === 1) return { Last_Name: parts[0] };
  return { First_Name: parts.slice(0, -1).join(" "), Last_Name: parts[parts.length - 1] };
}

/** Company is mandatory on Zoho Leads; most of our forms don't ask for it. */
function companyFor(lead: ZohoLead): string {
  const given = lead.company?.trim();
  if (given) return given;

  const site = lead.website?.trim();
  if (site) {
    try {
      const host = new URL(/^https?:\/\//i.test(site) ? site : `https://${site}`).hostname;
      const clean = host.replace(/^www\./i, "");
      if (clean) return clean;
    } catch {
      // Not a parseable URL — fall through to the generic placeholder.
    }
  }
  return "Unknown (website lead)";
}

/**
 * Budget / service / site-source have no standard Zoho Lead fields, so they go
 * into Description where they're always visible regardless of the org's layout.
 * (Promote them to custom fields later if sales wants to filter on them.)
 */
function descriptionFor(lead: ZohoLead): string {
  return [
    lead.source ? `Form: ${lead.source}` : null,
    lead.service ? `Interested in: ${lead.service}` : null,
    lead.budget ? `Budget: ${lead.budget}` : null,
    lead.website ? `Website: ${lead.website}` : null,
    lead.message ? `\n${lead.message}` : null,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 32000);
}

function toZohoRecord(lead: ZohoLead): Record<string, unknown> {
  const record: Record<string, unknown> = {
    ...splitName(lead.name),
    Company: companyFor(lead),
    Lead_Source: LEAD_SOURCE,
    Description: descriptionFor(lead),
  };
  if (lead.email) record.Email = lead.email;
  if (lead.phone) record.Phone = lead.phone;
  if (lead.website) record.Website = lead.website;
  if (process.env.ZOHO_LEAD_OWNER_ID) record.Owner = process.env.ZOHO_LEAD_OWNER_ID;
  return record;
}

// ---------------------------------------------------------------------------
// Upsert
// ---------------------------------------------------------------------------

type ZohoRowResult = {
  code?: string;
  status?: string;
  message?: string;
  action?: string;
  details?: { id?: string; api_name?: string };
};

/** One HTTP attempt. Returns the parsed row result plus the status code. */
async function postLead(
  token: Token,
  record: Record<string, unknown>,
): Promise<{ status: number; row: ZohoRowResult | null }> {
  const res = await fetch(`${token.apiDomain}/crm/v8/Leads/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token.accessToken}`,
      "Content-Type": "application/json",
    },
    // Match on Email so repeat enquiries update one record instead of duplicating.
    body: JSON.stringify({ data: [record], duplicate_check_fields: ["Email"] }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as { data?: ZohoRowResult[] } | null;
  return { status: res.status, row: json?.data?.[0] ?? null };
}

/**
 * Push one lead into Zoho CRM. Best-effort: returns true only if Zoho confirmed
 * the write. Never throws.
 */
export async function sendLeadToZoho(lead: ZohoLead): Promise<boolean> {
  if (!zohoConfigured()) return false;

  try {
    let token = await getToken();
    if (!token) return false;

    const record = toZohoRecord(lead);
    let { status, row } = await postLead(token, record);

    // 401 → the cached token was revoked or rotated. Refresh once and retry.
    if (status === 401) {
      token = await getToken(true);
      if (!token) return false;
      ({ status, row } = await postLead(token, record));
    }

    // The org's Lead_Source picklist doesn't contain our value. Rather than lose
    // the lead, resend without the field and warn so it can be fixed in Zoho.
    if (row?.code === "INVALID_DATA" && row.details?.api_name === "Lead_Source") {
      console.warn(
        `[zoho] Lead_Source "${LEAD_SOURCE}" is not in the Leads picklist — retrying without it. ` +
          "Add the option in Zoho or set ZOHO_LEAD_SOURCE to an existing one.",
      );
      const { Lead_Source: _dropped, ...withoutSource } = record;
      ({ status, row } = await postLead(token, withoutSource));
    }

    if (row?.status === "success") return true;

    console.warn(
      `[zoho] lead upsert failed (HTTP ${status}): ${row?.code ?? "unknown"} — ${row?.message ?? "no message"}` +
        (row?.details?.api_name ? ` [field: ${row.details.api_name}]` : ""),
    );
    return false;
  } catch (err) {
    console.warn("[zoho] lead upsert error:", err instanceof Error ? err.message : err);
    return false;
  }
}
