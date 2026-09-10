import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { ghlConfigured, clearFieldMapCache, resolveFieldMap } from "@/lib/gohighlevel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/crm/check — is GoHighLevel storing the whole form?
 *
 * Leads arriving while budget/services/message were missing looked like a
 * delivery problem, but it was a mapping problem: those three answers have no
 * standard GHL field, so without custom fields they only ever existed inside a
 * note. This reports which of the three currently resolve to a real field.
 *
 * Read-only by default. `?provision=1` performs the real resolution, which
 * creates any field that is missing — the same thing the next live lead would
 * do, but on demand and with the result shown.
 */

const SLOTS = [
  { slot: "budget", label: "Budget", env: "GHL_CUSTOM_FIELD_BUDGET" },
  { slot: "services", label: "Services Interested In", env: "GHL_CUSTOM_FIELD_SERVICES" },
  { slot: "message", label: "Message", env: "GHL_CUSTOM_FIELD_MESSAGE" },
] as const;

const norm = (v: string) => v.replace(/^contact\./i, "").toLowerCase().replace(/[^a-z0-9]/g, "");

export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const provision = new URL(req.url).searchParams.get("provision") === "1";
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  const steps: { step: string; ok: boolean; detail: string }[] = [];
  const finish = (fix: string) => NextResponse.json({ locationId, provisioned: provision, steps, fix });

  if (!ghlConfigured()) {
    steps.push({
      step: "GoHighLevel configured",
      ok: false,
      detail: `GHL_API_TOKEN is ${process.env.GHL_API_TOKEN?.trim() ? "set" : "MISSING"}; GHL_LOCATION_ID is ${locationId ? "set" : "MISSING"}.`,
    });
    return finish("Set both GHL_API_TOKEN (a sub-account Private Integration token) and GHL_LOCATION_ID on the server, then restart.");
  }
  steps.push({ step: "GoHighLevel configured", ok: true, detail: `Location ${locationId}.` });

  // Standard contact fields are carried by the upsert and need no mapping.
  steps.push({
    step: "Standard fields",
    ok: true,
    detail: "Name, email, phone, business name, website and source ride on the contact itself — these were always saved.",
  });

  const base = (process.env.GHL_API_BASE || "https://services.leadconnectorhq.com").replace(/\/+$/, "");
  let listed: Response;
  try {
    listed = await fetch(`${base}/locations/${encodeURIComponent(locationId!)}/customFields?model=contact`, {
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_TOKEN?.trim()}`,
        Version: process.env.GHL_API_VERSION || "2021-07-28",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
  } catch {
    steps.push({ step: "Read custom fields", ok: false, detail: "Could not reach the GoHighLevel API from the server." });
    return finish("Check outbound HTTPS to services.leadconnectorhq.com.");
  }

  if (listed.status === 401) {
    steps.push({ step: "Read custom fields", ok: false, detail: "401 — the token was rejected." });
    return finish("The GHL_API_TOKEN value is wrong or expired. Re-issue the Private Integration token for this sub-account.");
  }
  if (!listed.ok) {
    steps.push({ step: "Read custom fields", ok: false, detail: `HTTP ${listed.status} — most often a missing scope.` });
    return finish(
      "Give the Private Integration these scopes: contacts.write, contacts.readonly, notes.write, " +
        "locations/customFields.readonly and locations/customFields.write (the last one is what lets the missing fields be created).",
    );
  }

  const fields = ((await listed.json().catch(() => null)) as { customFields?: { id?: string; name?: string; fieldKey?: string }[] } | null)?.customFields ?? [];
  steps.push({ step: "Read custom fields", ok: true, detail: `${fields.length} custom field(s) on this location.` });

  const mapped = provision ? await (clearFieldMapCache(), resolveFieldMap()) : undefined;

  let missing = 0;
  for (const s of SLOTS) {
    const pinned = process.env[s.env]?.trim();
    const found = fields.find((f) => (f.name && norm(f.name) === norm(s.label)) || (f.fieldKey && norm(f.fieldKey) === norm(s.label)));
    const resolvedId = mapped?.[s.slot];
    const ok = Boolean(pinned || found || resolvedId);
    if (!ok) missing++;
    steps.push({
      step: `Form answer: ${s.label}`,
      ok,
      detail: pinned
        ? `Pinned by ${s.env}.`
        : found?.id
          ? `Matched the existing field "${found.name ?? found.fieldKey}".`
          : resolvedId
            ? "Created on this location just now."
            : "No matching field yet — it will be created on the next lead (or run this with ?provision=1).",
    });
  }

  return finish(
    missing === 0
      ? "Every form answer maps to a real GoHighLevel field. New leads will store budget, services and message on the contact, not only in the note."
      : `${missing} answer(s) have no field yet. They are still captured in the contact's note, and the field will be created automatically on the next submission — or call this endpoint with ?provision=1 to create them now.`,
  );
}
