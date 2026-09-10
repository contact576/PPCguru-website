/** Offline contract checks. Fetch is fully mocked; no credentials or live services are used. */
import assert from "node:assert/strict";
import { ghlConfigured, syncLeadToGhl, clearFieldMapCache } from "../lib/gohighlevel.ts";

type Step = { path: string; method: string; status?: number; data?: unknown; inspect?: (body: Record<string, unknown>) => void; error?: boolean };
let steps: Step[] = [];
let requests = 0;
const warnings: string[] = [];
const realFetch = globalThis.fetch;
const realWarn = console.warn;
const originalEnv = { ...process.env };
const originalArgv = process.argv;
const realLog = console.log;
const pendingFailures: unknown[] = [];

globalThis.fetch = async (input, init) => {
  requests++;
  const step = steps.shift();
  try {
    assert.ok(step, "Unexpected request; live network is disabled");
    assert.equal(new URL(String(input)).pathname, step.path);
    assert.equal(init?.method, step.method);
    assert.equal((init?.headers as Record<string, string>).Version, "2021-07-28");
    if (step.inspect) step.inspect(JSON.parse(String(init?.body || "{}")));
  } catch (error) {
    pendingFailures.push(error);
    throw error;
  }
  if (step!.error) throw new Error("SECRET_TOKEN lead@example.invalid upstream exception");
  return new Response(JSON.stringify(step!.data ?? {}), { status: step!.status ?? 200 });
};
console.warn = (...values: unknown[]) => { warnings.push(values.join(" ")); };

const lead = {
  name: "Test Person", email: " LEAD@EXAMPLE.INVALID ", source: "popup:audit",
  budget: "test budget", service: "test service", message: "test message",
  submissionId: "row-123", createdAt: "2026-09-05T00:00:00.000Z",
};
const marker = "[PPCGuru submission:row-123]";
const contact = { path: "/contacts/upsert", method: "POST", data: { contact: { id: "test-contact" } } };
const emptyNotes = { path: "/contacts/test-contact/notes", method: "GET", data: { notes: [] } };
const createNote = { path: "/contacts/test-contact/notes", method: "POST", data: { note: { id: "test-note" } } };
const addTags = { path: "/contacts/test-contact/tags", method: "POST", data: { tags: ["existing-customer", "website-lead", "form-popup-audit"] } };
// Budget/services/message are written onto the contact AFTER it exists, so a
// rejected field payload can never cost us the lead.
const updateFields = { path: "/contacts/test-contact", method: "PUT", data: { contact: { id: "test-contact" } } };
const listFields = { path: "/locations/offline-location/customFields", method: "GET" };

function done(): void {
  assert.equal(steps.length, 0, "Not all expected requests occurred");
  assert.equal(pendingFailures.length, 0, String(pendingFailures[0] || ""));
}

try {
  for (const name of Object.keys(process.env)) if (name.startsWith("GHL_")) delete process.env[name];
  assert.equal(ghlConfigured(), false);
  assert.equal((await syncLeadToGhl(lead)).ok, false);
  assert.equal(requests, 0);
  process.env.GHL_API_TOKEN = "offline-test-token";
  process.env.GHL_LOCATION_ID = "offline-location";
  process.env.GHL_CUSTOM_FIELD_BUDGET = "field-budget-id";
  process.env.GHL_CUSTOM_FIELD_SERVICES = "field-services-id";
  process.env.GHL_CUSTOM_FIELD_MESSAGE = "field-message-id";
  clearFieldMapCache();

  steps = [
    { ...contact, inspect: (body) => {
      assert.equal(body.tags, undefined, "upsert must preserve existing tags");
      assert.equal(body.email, "lead@example.invalid");
      assert.equal(body.createNewIfDuplicateAllowed, false);
      assert.equal(body.customFields, undefined, "custom fields must not ride on the upsert");
    } },
    { ...updateFields, inspect: (body) => {
      assert.deepEqual(body.customFields, [
        { id: "field-budget-id", field_value: "test budget" },
        { id: "field-services-id", field_value: "test service" },
        { id: "field-message-id", field_value: "test message" },
      ]);
    } },
    emptyNotes,
    { ...createNote, inspect: (body) => {
      assert.ok(String(body.body).startsWith(marker + "\n"));
      assert.ok(String(body.body).includes("Submitted: " + lead.createdAt));
      assert.ok(String(body.body).includes("test message"));
    } },
    { ...addTags, inspect: (body) => assert.deepEqual(body.tags, ["website-lead", "form-popup-audit"]) },
  ];
  const initial = await syncLeadToGhl(lead);
  assert.equal(initial.ok, true);
  assert.equal(initial.noteId, "test-note");
  assert.equal(initial.fieldsSynced, true);
  done();

  steps = [contact, updateFields,
    { ...emptyNotes, data: { notes: [{ id: "test-note", body: marker + "\npreviously delivered" }] } },
    { ...addTags, inspect: (body) => assert.deepEqual(body.tags, ["website-backfill", "form-backfill-popup-audit"]) },
  ];
  assert.equal((await syncLeadToGhl(lead, { backfill: true })).ok, true);
  done(); // Rerun must not append a second note or apply the normal live trigger tag.

  steps = [contact, updateFields, emptyNotes, { ...createNote, status: 503 },
    { ...emptyNotes, data: { notes: [{ id: "reconciled-note", body: marker + "\naccepted before timeout" }] } }, addTags];
  assert.equal((await syncLeadToGhl(lead)).noteId, "reconciled-note");
  done(); // An uncertain POST is reconciled, never blindly retried.

  steps = [contact, updateFields, emptyNotes, { ...createNote, status: 400, data: { message: "SECRET_TOKEN lead@example.invalid" } }];
  const missingNote = await syncLeadToGhl(lead);
  assert.equal(missingNote.contactSynced, true);
  assert.equal(missingNote.noteSynced, false);
  assert.equal(missingNote.tagsSynced, false);
  assert.equal(missingNote.ok, false);
  done();

  steps = [{ ...contact, status: 429 }, contact, updateFields, emptyNotes, createNote, addTags];
  assert.equal((await syncLeadToGhl(lead)).ok, true);
  done(); // Safe contact upsert retries a transient rate-limit response.

  steps = [contact, updateFields, { ...emptyNotes, status: 403 }];
  assert.equal((await syncLeadToGhl(lead)).ok, false);
  done(); // Failed note reads must not cause duplicate writes.

  steps = [contact, updateFields, emptyNotes, createNote, { ...addTags, status: 400 }];
  assert.equal((await syncLeadToGhl(lead)).ok, false);
  done();

  steps = [contact, updateFields, emptyNotes, createNote, addTags];
  assert.equal((await syncLeadToGhl({ ...lead, email: undefined, phone: "+15555550123" })).ok, true);
  done();

  // A location that rejects custom fields must still produce a delivered lead —
  // the note carries every answer, so this is a degraded write, not a lost one.
  // Both value spellings are tried before giving up.
  steps = [contact,
    { ...updateFields, status: 422 },
    { ...updateFields, status: 422, inspect: (body) => {
      const first = (body.customFields as Record<string, unknown>[])[0];
      assert.equal(first.fieldValue, "test budget", "the retry uses the other value key");
      assert.equal(first.field_value, undefined);
    } },
    emptyNotes, createNote, addTags];
  const fieldsRejected = await syncLeadToGhl(lead);
  assert.equal(fieldsRejected.fieldsSynced, false);
  assert.equal(fieldsRejected.ok, true, "custom fields must never gate lead delivery");
  done();

  // With no env pins the location is inspected: an existing field is reused by
  // name, and only a genuinely missing one is created. This is what removes the
  // per-sub-account setup step that left every mapping resolving to nothing.
  for (const name of ["GHL_CUSTOM_FIELD_BUDGET", "GHL_CUSTOM_FIELD_SERVICES", "GHL_CUSTOM_FIELD_MESSAGE"]) delete process.env[name];
  clearFieldMapCache();
  steps = [contact,
    { ...listFields, data: { customFields: [
      { id: "existing-budget", name: "Budget", fieldKey: "contact.budget" },
      { id: "existing-services", name: "services interested in" },
      { id: "unrelated", name: "Preferred Contact Time" },
    ] } },
    // Only "Message" is absent, so it is the only one created.
    { path: "/locations/offline-location/customFields", method: "POST", data: { customField: { id: "created-message" } },
      inspect: (body) => {
        assert.equal(body.name, "Message");
        assert.equal(body.model, "contact");
        assert.equal(body.dataType, "LARGE_TEXT");
      } },
    { ...updateFields, inspect: (body) => {
      assert.deepEqual(body.customFields, [
        { id: "existing-budget", field_value: "test budget" },
        { id: "existing-services", field_value: "test service" },
        { id: "created-message", field_value: "test message" },
      ]);
    } },
    emptyNotes, createNote, addTags];
  assert.equal((await syncLeadToGhl(lead)).fieldsSynced, true);
  done(); // Name matching ignores case and the contact. prefix.

  // The resolved map is cached: a second lead re-uses it with no lookup.
  steps = [contact, updateFields, emptyNotes, createNote, addTags];
  assert.equal((await syncLeadToGhl(lead)).fieldsSynced, true);
  done();

  // A location that will not even list its fields degrades to today's behaviour.
  clearFieldMapCache();
  steps = [contact, { ...listFields, status: 403 }, emptyNotes, createNote, addTags];
  const noFieldAccess = await syncLeadToGhl(lead);
  assert.equal(noFieldAccess.fieldsSynced, false);
  assert.equal(noFieldAccess.ok, true);
  done();

  process.env.GHL_CUSTOM_FIELD_BUDGET = "field-budget-id";
  process.env.GHL_CUSTOM_FIELD_SERVICES = "field-services-id";
  process.env.GHL_CUSTOM_FIELD_MESSAGE = "field-message-id";
  clearFieldMapCache();

  steps = [{ ...contact, error: true }, { ...contact, error: true }, { ...contact, error: true }];
  assert.equal((await syncLeadToGhl(lead)).ok, false);
  done(); // Retries are bounded, and thrown upstream data stays out of logs.
  assert.ok(warnings.length > 0);
  assert.equal(warnings.some((warning) => warning.includes("SECRET_TOKEN") || warning.includes("lead@example.invalid")), false);
  // Exercise the actual backfill entry point in dry-run mode with a server row cap of one.
  // A short first page must not terminate pagination or collapse repeat contacts.
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.example.invalid";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "offline-supabase-key";
  delete process.env.GHL_API_TOKEN;
  process.argv = [process.argv[0], "ghl-backfill.mts"];
  const backfillLogs: string[] = [];
  console.log = (...values: unknown[]) => { backfillLogs.push(values.join(" ")); };
  let pageCalls = 0;
  let cutoff: string | null = null;
  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    assert.equal(url.hostname, "supabase.example.invalid", "dry run must not contact the CRM");
    assert.equal(url.pathname, "/rest/v1/leads");
    assert.equal(url.searchParams.get("order"), "created_at.asc,id.asc");
    assert.equal(url.searchParams.get("offset"), String(pageCalls));
    if (cutoff) assert.equal(url.searchParams.get("created_at"), cutoff);
    else cutoff = url.searchParams.get("created_at");
    const index = pageCalls++;
    const rows = index < 2 ? [{ id: "row-" + index, email: "same@example.invalid", created_at: lead.createdAt }] : [];
    return new Response(JSON.stringify(rows));
  };
  await import(new URL("./ghl-backfill.mts?offline-check", import.meta.url).href);
  assert.equal(pageCalls, 3);
  assert.ok(backfillLogs.some((line) => line.includes("2 eligible submissions selected")));
  assert.ok(backfillLogs.some((line) => line.includes("DRY RUN")));
  assert.equal(backfillLogs.some((line) => line.includes("same@example.invalid")), false);
  console.log = realLog;
  console.log("PASS: 16 offline checks (GHL delivery, custom-field discovery/creation/caching, fields never gating a lead, preserved tags, note identity, failure/retry behavior, private logs, paginated dry-run backfill).");
} finally {
  globalThis.fetch = realFetch;
  console.warn = realWarn;
  console.log = realLog;
  process.argv = originalArgv;
  for (const name of Object.keys(process.env)) if (name.startsWith("GHL_")) delete process.env[name];
  for (const [name, value] of Object.entries(originalEnv)) if (name.startsWith("GHL_") && value !== undefined) process.env[name] = value;
  for (const name of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]) {
    if (originalEnv[name] === undefined) delete process.env[name];
    else process.env[name] = originalEnv[name];
  }
}
