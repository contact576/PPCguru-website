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
  const fields: Array<[string | undefined, string | undefined]> = [
    [process.env.GHL_CUSTOM_FIELD_BUDGET, lead.budget],
    [process.env.GHL_CUSTOM_FIELD_SERVICES, lead.service],
    [process.env.GHL_CUSTOM_FIELD_SOURCE, lead.source],
  ];
  const customFields = fields.filter(([field, value]) => field?.trim() && value?.trim())
    .map(([field, value]) => ({ ...ghlCustomFieldReference(field!), fieldValue: value! }));
  if (customFields.length) payload.customFields = customFields;
  // Do not send tags here: the upsert endpoint replaces all existing tags.
  return payload;
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
    ok: false, configured: ghlConfigured(), contactSynced: false, tagsSynced: false, noteSynced: false,
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
    const note = await syncNote(contactId, lead);
    result.noteSynced = note.ok;
    result.noteId = note.noteId;
    // Add workflow tags only after the submission context is present.
    if (note.ok) {
      const tags = await request("/contacts/" + encodeURIComponent(contactId) + "/tags", "POST", { tags: tagsFor(lead, Boolean(options.backfill)) }, true);
      result.tagsSynced = tags.ok;
      if (!tags.ok) warn("tag delivery", tags.status);
    }
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

