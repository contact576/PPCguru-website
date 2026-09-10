/** Server-side GoHighLevel delivery. Supabase retains the submission for retries. */
const DEFAULT_API_BASE = "https://services.leadconnectorhq.com";
const TIMEOUT_MS = 6000;
const RETRY_DELAYS_MS = [250, 750];

export type GhlLead = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  source?: string;
  budget?: string;
  service?: string;
  message?: string;
  /** Stable Supabase lead row ID. Reuse it when retrying this submission. */
  submissionId?: string;
  createdAt?: string;
};

export type GhlSyncResult = {
  ok: boolean;
  configured: boolean;
  contactSynced: boolean;
  tagsSynced: boolean;
  noteSynced: boolean;
  /**
   * Whether budget/services/message reached real custom fields. Deliberately
   * NOT part of `ok`: a location that blocks custom fields must still count as
   * a delivered lead, exactly as it did before fields existed.
   */
  fieldsSynced: boolean;
  contactId?: string;
  noteId?: string;
};

type ApiResult = { ok: boolean; status: number; data: unknown };
type Note = { id?: string; body?: string };

export function ghlConfigured(): boolean {
  return Boolean(process.env.GHL_API_TOKEN?.trim() && process.env.GHL_LOCATION_ID?.trim());
}

function headers(): Record<string, string> {
  return {
    Authorization: "Bearer " + process.env.GHL_API_TOKEN?.trim(),
    Version: process.env.GHL_API_VERSION || "2021-07-28",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/** Only reads, contact upserts and additive tag writes may be retried. */
async function request(path: string, method: string, body?: unknown, retrySafe = false): Promise<ApiResult> {
  const apiBase = (process.env.GHL_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, "");
  for (let attempt = 0; ; attempt++) {
    let result: ApiResult;
    let retryAfter = 0;
    try {
      const response = await fetch(apiBase + path, {
        method,
        headers: headers(),
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      const retryHeader = response.headers.get("retry-after");
      if (retryHeader) {
        const seconds = Number(retryHeader);
        retryAfter = Number.isFinite(seconds)
          ? Math.max(0, seconds * 1000)
          : Math.max(0, Date.parse(retryHeader) - Date.now());
      }
      result = { ok: response.ok, status: response.status, data: await response.json().catch(() => null) };
    } catch {
      // Do not print upstream errors: they can contain contact data or credentials.
      result = { ok: false, status: 0, data: null };
    }
    const transient = result.status === 0 || result.status === 429 || result.status >= 500;
    if (result.ok || !retrySafe || !transient || attempt >= RETRY_DELAYS_MS.length || retryAfter > 1000) {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, Math.max(RETRY_DELAYS_MS[attempt], retryAfter || 0)));
  }
}

function warn(operation: string, status: number): void {
  console.warn("[ghl] " + operation + " incomplete (" + (status ? "HTTP " + status : "network error") + "); retry from the saved submission.");
}

function slugTag(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function tagsFor(lead: GhlLead, backfill: boolean): string[] {
  const tags = backfill
    ? ["website-backfill"]
    : (process.env.GHL_LEAD_TAGS || "website-lead").split(",").map((tag) => tag.trim()).filter(Boolean);
  const source = slugTag(lead.source || "website");
  tags.push((backfill ? "form-backfill-" : "form-") + (source || "website"));
  return [...new Set(tags)];
}

/** IDs are preferred. A key may be written as contact.example or key:example. */
export function ghlCustomFieldReference(value: string): { id: string } | { key: string } {
  const field = value.trim();
  if (field.startsWith("key:")) return { key: field.slice(4) };
  if (field.startsWith("contact.")) return { key: field };
  return { id: field.startsWith("id:") ? field.slice(3) : field };
}

function contactPayload(lead: GhlLead): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    locationId: process.env.GHL_LOCATION_ID?.trim(),
    source: lead.source?.trim() || "PPC Guru Website",
    createNewIfDuplicateAllowed: false,
    country: process.env.GHL_DEFAULT_COUNTRY || "CA",
  };
  const names = lead.name?.trim().split(/\s+/).filter(Boolean) || [];
  if (names.length) payload.firstName = names.length > 1 ? names.slice(0, -1).join(" ") : names[0];
  if (names.length > 1) payload.lastName = names[names.length - 1];
  if (lead.email?.trim()) payload.email = lead.email.trim().toLowerCase();
  if (lead.phone?.trim()) payload.phone = lead.phone.trim();
  if (lead.company?.trim()) payload.companyName = lead.company.trim();
  if (lead.website?.trim()) payload.website = lead.website.trim();
  if (process.env.GHL_ASSIGNED_USER_ID?.trim()) payload.assignedTo = process.env.GHL_ASSIGNED_USER_ID.trim();
  // Custom fields are NOT sent here on purpose. They are applied in a separate
  // update after the contact exists (see syncCustomFields), so a field the
  // location rejects can never take the whole contact down with it — the lead
  // is the thing that must not be lost.
  // Do not send tags here either: the upsert endpoint replaces all existing tags.
  return payload;
}

/* ── custom fields ──────────────────────────────────────────────────────── */

/**
 * Getting the rest of the form into GoHighLevel as real, filterable fields.
 *
 * The contact upsert only carries GHL's STANDARD fields — name, email, phone,
 * companyName, website, source. Everything else a visitor tells us (budget,
 * which services they want, their message) has nowhere standard to go, so it
 * was written into a note and nothing else. A note is not searchable, not
 * filterable and not usable as a workflow condition, which is why the leads
 * arrived but "the other details" appeared to vanish.
 *
 * Custom fields are the answer, but their ids differ per sub-account, so the
 * original code required GHL_CUSTOM_FIELD_* env vars that were never filled in
 * — the mapping silently resolved to nothing and `message` had no slot at all.
 * This removes the setup step: the fields are looked up on the location by
 * name, the missing ones are created, and the result is cached.
 *
 * NB this lives in this file rather than its own module on purpose: the offline
 * checks run under Node's type-stripping, which cannot resolve the `@/` alias,
 * and `lib/` is type-checked so a `./x.ts` specifier is not allowed either.
 */

type FieldSlot = "budget" | "services" | "message";

type FieldSpec = {
  slot: FieldSlot;
  /** Field name created in GoHighLevel, and what an existing one is matched against. */
  name: string;
  dataType: "TEXT" | "LARGE_TEXT";
  /** Env var that pins an explicit id, overriding discovery. */
  envVar: string;
  value: (lead: GhlLead) => string | undefined;
};

const FIELD_SPECS: FieldSpec[] = [
  { slot: "budget", name: "Budget", dataType: "TEXT", envVar: "GHL_CUSTOM_FIELD_BUDGET", value: (l) => l.budget },
  { slot: "services", name: "Services Interested In", dataType: "LARGE_TEXT", envVar: "GHL_CUSTOM_FIELD_SERVICES", value: (l) => l.service },
  { slot: "message", name: "Message", dataType: "LARGE_TEXT", envVar: "GHL_CUSTOM_FIELD_MESSAGE", value: (l) => l.message },
];

type LocationField = { id?: string; name?: string; fieldKey?: string; dataType?: string };
type FieldMap = Partial<Record<FieldSlot, string>>;

/** "Services Interested In" and "contact.services_interested_in" must match. */
function normalizeFieldName(value: string): string {
  return value.replace(/^contact\./i, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchField(spec: FieldSpec, fields: LocationField[]): LocationField | undefined {
  const target = normalizeFieldName(spec.name);
  return fields.find(
    (field) =>
      (field.name && normalizeFieldName(field.name) === target) ||
      (field.fieldKey && normalizeFieldName(field.fieldKey) === target),
  );
}

const FIELD_CACHE_TTL_MS = 10 * 60_000;
/**
 * A failed lookup is cached only briefly. Not caching it at all meant a token
 * without the customFields scope paid an extra API call and logged a warning on
 * every single lead; caching it for the full TTL would mean waiting ten minutes
 * after fixing the scope. A minute is short enough to feel immediate.
 */
const FIELD_FAILURE_TTL_MS = 60_000;
let cachedFields: { map: FieldMap; at: number; ttl: number } | null = null;
/** Collapses concurrent resolution so a burst of leads triggers one lookup. */
let fieldsInFlight: Promise<FieldMap> | null = null;

/** Exposed for the offline checks and the admin diagnostic. */
export function clearFieldMapCache(): void {
  cachedFields = null;
  fieldsInFlight = null;
}

/** Auto-creation is on by default; set GHL_AUTO_CREATE_FIELDS=false to opt out. */
function autoCreateEnabled(): boolean {
  return (process.env.GHL_AUTO_CREATE_FIELDS || "true").trim().toLowerCase() !== "false";
}


/**
 * The location's field ids for budget / services / message, looked up once and
 * cached. An explicit GHL_CUSTOM_FIELD_* env var wins; otherwise a field of the
 * same name is reused, and only a genuinely missing one is created.
 *
 * Returns an empty map on any failure — the caller then simply skips fields.
 */
export async function resolveFieldMap(): Promise<FieldMap> {
  if (cachedFields && Date.now() - cachedFields.at < cachedFields.ttl) return cachedFields.map;
  if (fieldsInFlight) return fieldsInFlight;

  fieldsInFlight = (async () => {
    const map: FieldMap = {};
    for (const spec of FIELD_SPECS) {
      const pinned = process.env[spec.envVar]?.trim();
      if (pinned) map[spec.slot] = pinned;
    }

    const needed = FIELD_SPECS.filter((spec) => !map[spec.slot]);
    if (!needed.length) {
      cachedFields = { map, at: Date.now(), ttl: FIELD_CACHE_TTL_MS };
      return map;
    }

    const locationId = process.env.GHL_LOCATION_ID?.trim();
    if (!locationId) return map;

    const listed = await request("/locations/" + encodeURIComponent(locationId) + "/customFields?model=contact", "GET", undefined, true);
    if (!listed.ok) {
      // Most often a token without locations/customFields.readonly.
      warn("custom field lookup", listed.status);
      cachedFields = { map, at: Date.now(), ttl: FIELD_FAILURE_TTL_MS };
      return map;
    }
    const existing = ((listed.data as { customFields?: LocationField[] } | null)?.customFields ?? []) as LocationField[];

    for (const spec of needed) {
      const found = matchField(spec, existing);
      if (found?.id) {
        map[spec.slot] = found.id;
        continue;
      }
      if (!autoCreateEnabled()) continue;
      const created = await request("/locations/" + encodeURIComponent(locationId) + "/customFields", "POST", {
        name: spec.name,
        dataType: spec.dataType,
        model: "contact",
      });
      const id = (created.data as { customField?: LocationField; id?: string } | null)?.customField?.id;
      if (created.ok && id) map[spec.slot] = id;
      else warn("custom field create (" + spec.name + ")", created.status);
    }

    // Anything still unmapped means a create was refused; retry that soon.
    const complete = FIELD_SPECS.every((spec) => map[spec.slot]);
    cachedFields = { map, at: Date.now(), ttl: complete ? FIELD_CACHE_TTL_MS : FIELD_FAILURE_TTL_MS };
    return map;
  })().finally(() => {
    fieldsInFlight = null;
  });
  return fieldsInFlight;
}

/**
 * Writes the form's remaining answers onto the contact.
 *
 * The two contact endpoints in this API disagree about the value key —
 * `field_value` is what the v2 contact schema documents, `fieldValue` appears
 * elsewhere — and this integration's field path had never actually run, so
 * neither spelling was proven against a real location. Rather than guess, it
 * sends the documented one and retries once with the other on a validation
 * rejection. The right spelling then costs one call forever after.
 */
async function syncCustomFields(contactId: string, lead: GhlLead): Promise<boolean> {
  let map: FieldMap;
  try {
    map = await resolveFieldMap();
  } catch {
    return false;
  }

  const values = FIELD_SPECS.map((spec) => ({ id: map[spec.slot], value: spec.value(lead)?.trim() }))
    .filter((entry): entry is { id: string; value: string } => Boolean(entry.id && entry.value));
  if (!values.length) return false;

  const path = "/contacts/" + encodeURIComponent(contactId);
  for (const key of ["field_value", "fieldValue"] as const) {
    const result = await request(path, "PUT", {
      customFields: values.map((entry) => ({ id: entry.id, [key]: entry.value })),
    }, true);
    if (result.ok) return true;
    // Only a schema complaint is worth re-trying with the other spelling.
    if (result.status !== 400 && result.status !== 422) {
      warn("custom field update", result.status);
      return false;
    }
  }
  warn("custom field update", 422);
  return false;
}

function markerFor(lead: GhlLead): string | undefined {
  return lead.submissionId ? "[PPCGuru submission:" + encodeURIComponent(lead.submissionId) + "]" : undefined;
}

function noteBodyFor(lead: GhlLead): string {
  return [
    markerFor(lead),
    "PPC Guru website form submission",
    lead.createdAt ? "Submitted: " + lead.createdAt : undefined,
    lead.source ? "Form: " + lead.source : undefined,
    lead.name ? "Name: " + lead.name : undefined,
    lead.email ? "Email: " + lead.email : undefined,
    lead.phone ? "Phone: " + lead.phone : undefined,
    lead.company ? "Business: " + lead.company : undefined,
    lead.website ? "Website: " + lead.website : undefined,
    lead.service ? "Interested in: " + lead.service : undefined,
    lead.budget ? "Budget: " + lead.budget : undefined,
    lead.message ? "Message:\n" + lead.message : undefined,
  ].filter(Boolean).join("\n");
}

async function findNote(contactId: string, marker: string): Promise<{ readable: boolean; note?: Note }> {
  const result = await request("/contacts/" + encodeURIComponent(contactId) + "/notes", "GET", undefined, true);
  const notes = (result.data as { notes?: Note[] } | null)?.notes;
  if (!result.ok || !Array.isArray(notes)) {
    warn("note lookup", result.status);
    return { readable: false };
  }
  return { readable: true, note: notes.find((note) => note.body?.split("\n")[0] === marker) };
}

async function syncNote(contactId: string, lead: GhlLead): Promise<{ ok: boolean; noteId?: string }> {
  const marker = markerFor(lead);
  if (marker) {
    const existing = await findNote(contactId, marker);
    // If reads fail, do not risk duplicating an already-delivered note.
    if (!existing.readable) return { ok: false };
    if (existing.note) return { ok: true, noteId: existing.note.id };
  }
  const result = await request("/contacts/" + encodeURIComponent(contactId) + "/notes", "POST", { body: noteBodyFor(lead) });
  const noteId = (result.data as { note?: Note } | null)?.note?.id;
  if (result.ok && noteId) return { ok: true, noteId };
  // A timed-out POST may have succeeded. Reconcile by marker, never blindly retry it.
  if (marker && (result.status === 0 || result.status >= 500 || result.ok)) {
    const existing = await findNote(contactId, marker);
    if (existing.note) return { ok: true, noteId: existing.note.id };
  }
  warn("note delivery", result.status);
  return { ok: false };
}

/** Full delivery result; never throws or logs submitted values. */
export async function syncLeadToGhl(lead: GhlLead, options: { backfill?: boolean } = {}): Promise<GhlSyncResult> {
  const result: GhlSyncResult = {
    ok: false, configured: ghlConfigured(), contactSynced: false, tagsSynced: false, noteSynced: false, fieldsSynced: false,
  };
  if (!result.configured || (!lead.email?.trim() && !lead.phone?.trim())) return result;
  try {
    const upsert = await request("/contacts/upsert", "POST", contactPayload(lead), true);
    const contactId = (upsert.data as { contact?: { id?: string } } | null)?.contact?.id;
    if (!upsert.ok || !contactId) {
      warn("contact upsert", upsert.status);
      return result;
    }
    result.contactSynced = true;
    result.contactId = contactId;
    // Budget / services / message onto the contact itself. Best-effort and
    // deliberately after the upsert: the lead is already safe at this point.
    result.fieldsSynced = await syncCustomFields(contactId, lead);
    const note = await syncNote(contactId, lead);
    result.noteSynced = note.ok;
    result.noteId = note.noteId;
    // Add workflow tags only after the submission context is present.
    if (note.ok) {
      const tags = await request("/contacts/" + encodeURIComponent(contactId) + "/tags", "POST", { tags: tagsFor(lead, Boolean(options.backfill)) }, true);
      result.tagsSynced = tags.ok;
      if (!tags.ok) warn("tag delivery", tags.status);
    }
    // `fieldsSynced` is intentionally excluded: the note still carries every
    // answer, so a location that won't take custom fields is not a failed lead.
    result.ok = result.contactSynced && result.noteSynced && result.tagsSynced;
    return result;
  } catch {
    warn("delivery", 0);
    return result;
  }
}

/** Compatibility wrapper used by the website form handlers. */
export async function sendLeadToGhl(lead: GhlLead): Promise<boolean> {
  return (await syncLeadToGhl(lead)).ok;
}

