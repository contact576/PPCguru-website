/** Read-only by default. --test-lead explicitly creates an isolated .invalid test contact. */
import { ghlConfigured, ghlCustomFieldReference, syncLeadToGhl } from "../lib/gohighlevel.ts";

const API_BASE = (process.env.GHL_API_BASE || "https://services.leadconnectorhq.com").replace(/\/+$/, "");
const API_VERSION = process.env.GHL_API_VERSION || "2021-07-28";
const LOCATION_ID = process.env.GHL_LOCATION_ID?.trim();
const testLead = process.argv.includes("--test-lead");
let failures = 0;
const pass = (message: string) => console.log("  PASS " + message);
const warn = (message: string) => console.log("  NOTE " + message);
const bad = (message: string) => { console.log("  FAIL " + message); failures++; };

async function read(path: string): Promise<{ ok: boolean; status: number; data: unknown }> {
  try {
    const response = await fetch(API_BASE + path, {
      headers: { Authorization: "Bearer " + process.env.GHL_API_TOKEN?.trim(), Version: API_VERSION, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    return { ok: response.ok, status: response.status, data: await response.json().catch(() => null) };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

async function main(): Promise<void> {
  console.log("\nGoHighLevel connection check\n");
  if (!ghlConfigured()) {
    bad("GHL_API_TOKEN / GHL_LOCATION_ID are missing from this process environment.");
    return;
  }

  const location = await read("/locations/" + encodeURIComponent(LOCATION_ID!));
  const locationBody = location.data as { location?: { id?: string } } | null;
  if (location.ok && locationBody?.location?.id === LOCATION_ID) {
    pass("configured location is readable");
  } else if (location.status === 401 || location.status === 403) {
    warn("location check was not authorized; check locations.readonly, token validity, and the sub-account ID. Checking contacts separately.");
  } else {
    warn("location lookup unavailable (HTTP " + location.status + "); this does not by itself prove contact writes are unavailable.");
  }

  const contacts = await read("/contacts/?locationId=" + encodeURIComponent(LOCATION_ID!) + "&limit=1");
  const contactsBody = contacts.data as { contacts?: unknown[] } | null;
  if (contacts.ok && Array.isArray(contactsBody?.contacts)) {
    pass("contacts.readonly is available for the configured location");
  } else {
    bad("contact reads failed (HTTP " + contacts.status + "); verify the token, location ID, and contacts.readonly scope.");
  }

  const wantedFields = [
    ["GHL_CUSTOM_FIELD_BUDGET", process.env.GHL_CUSTOM_FIELD_BUDGET],
    ["GHL_CUSTOM_FIELD_SERVICES", process.env.GHL_CUSTOM_FIELD_SERVICES],
    ["GHL_CUSTOM_FIELD_SOURCE", process.env.GHL_CUSTOM_FIELD_SOURCE],
  ].filter(([, value]) => value?.trim()) as Array<[string, string]>;
  if (wantedFields.length) {
    const fieldsResult = await read("/locations/" + encodeURIComponent(LOCATION_ID!) + "/customFields");
    const fields = (fieldsResult.data as { customFields?: Array<{ id?: string; fieldKey?: string }> } | null)?.customFields;
    if (!fieldsResult.ok || !Array.isArray(fields)) {
      bad("configured custom fields could not be verified; add locations/customFields.readonly and retry.");
    } else {
      for (const [envName, value] of wantedFields) {
        const ref = ghlCustomFieldReference(value);
        const found = fields.some((field) => "id" in ref ? field.id === ref.id : field.fieldKey === ref.key);
        if (found) pass(envName + " refers to an existing field");
        else bad(envName + " does not match a field in this location");
      }
    }
  }

  if (testLead && failures === 0) {
    // No phone; .invalid cannot receive mail. Backfill tags avoid the normal website-lead trigger.
    const submissionId = "ghl-verify-" + crypto.randomUUID();
    const email = submissionId + "@example.invalid";
    const result = await syncLeadToGhl({
      name: "PPC Guru Integration Test", email, source: "ghl-verify",
      budget: "Integration test", service: "Integration test",
      message: "Connection verification. This test contact can be deleted.",
      submissionId, createdAt: new Date().toISOString(),
    }, { backfill: true });
    if (!result.ok || !result.contactId) {
      bad("test delivery incomplete: contact=" + result.contactSynced + ", note=" + result.noteSynced + ", tags=" + result.tagsSynced);
    } else {
      const encodedId = encodeURIComponent(result.contactId);
      const contactRead = await read("/contacts/" + encodedId);
      const contact = (contactRead.data as { contact?: { email?: string; locationId?: string; tags?: string[] } } | null)?.contact;
      const noteRead = await read("/contacts/" + encodedId + "/notes");
      const notes = (noteRead.data as { notes?: Array<{ body?: string }> } | null)?.notes;
      const marker = "[PPCGuru submission:" + encodeURIComponent(submissionId) + "]";
      const hasNote = noteRead.ok && notes?.some((note) => note.body?.split("\n")[0] === marker && note.body.includes("Connection verification."));
      if (contactRead.ok && contact?.email === email && contact.locationId === LOCATION_ID && contact.tags?.includes("website-backfill") && hasNote) {
        pass("test contact, additive tags and submission note read back successfully");
        warn("Find 'PPC Guru Integration Test' in HighLevel and delete the test contact when finished.");
      } else {
        bad("test write returned success but contact, tag or note readback did not match");
      }
    }
  } else if (testLead) {
    warn("test write skipped until read checks pass");
  }

  if (failures === 0) {
    console.log(testLead ? "\nThis process successfully wrote and read back the test submission." : "\nRead checks passed. Contact, note and tag writes have not been tested.");
    console.log("This does not verify production environment variables, deployed code, or the website form routes.\n");
  }
}

await main().catch(() => bad("verification stopped unexpectedly; no upstream response data was logged"));
process.exitCode = failures ? 1 : 0;
