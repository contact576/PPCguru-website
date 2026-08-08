/**
 * Verify the Zoho CRM connection, read-only by default.
 *
 *   npm run crm:verify                # auth + module access + picklist check
 *   npm run crm:verify -- --test-lead # ALSO creates one obvious test lead
 *
 * Checks, in order:
 *   1. the refresh token still mints an access token
 *   2. the Leads module is reachable with our scopes
 *   3. Lead_Source accepts the configured ZOHO_LEAD_SOURCE value, and which
 *      fields the org marks mandatory (needs ZohoCRM.settings.fields.READ —
 *      skipped with a note if that scope wasn't granted)
 *
 * `--test-lead` exercises the real production path (`lib/zoho.ts`), so a pass
 * means the website forms will work. It writes a record clearly labelled as a
 * test — delete it in Zoho afterwards.
 */
import { sendLeadToZoho, zohoConfigured } from "../lib/zoho.ts";

const ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN || "accounts.zohocloud.ca";
const LEAD_SOURCE = process.env.ZOHO_LEAD_SOURCE || "Web Download";
const testLead = process.argv.includes("--test-lead");

let failures = 0;
const pass = (m: string) => console.log(`  ✓ ${m}`);
const warn = (m: string) => console.log(`  ! ${m}`);
const bad = (m: string) => {
  console.log(`  ✗ ${m}`);
  failures++;
};

if (!zohoConfigured()) {
  console.error("\n✗ ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET / ZOHO_REFRESH_TOKEN missing from .env.local\n");
  process.exit(1);
}

console.log("\nZoho CRM connection check\n");

// ── 1. Token ───────────────────────────────────────────────────────────────
const tokenRes = await fetch(
  `https://${ACCOUNTS_DOMAIN}/oauth/v2/token?` +
    new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      grant_type: "refresh_token",
    }),
  { method: "POST" },
);
const token = (await tokenRes.json().catch(() => null)) as {
  access_token?: string;
  api_domain?: string;
  scope?: string;
  error?: string;
} | null;

if (!token?.access_token) {
  console.log(`  ✗ token refresh failed: ${token?.error ?? `HTTP ${tokenRes.status}`}`);
  console.error("\nStopping — nothing else can be checked without a token.\n");
  process.exit(1);
}
pass("refresh token works");
const api = (token.api_domain || "https://www.zohoapis.ca").replace(/\/+$/, "");
pass(`API domain: ${api}`);
if (token.scope) console.log(`    scopes: ${token.scope}`);

const auth = { Authorization: `Zoho-oauthtoken ${token.access_token}` };

// ── 2. Leads module reachable ──────────────────────────────────────────────
// v8 requires an explicit `fields` list on record reads — omitting it is a 400.
// 204 (no content) is a pass: it means the module is reachable but still empty.
const leadsRes = await fetch(`${api}/crm/v8/Leads?fields=Last_Name,Email&per_page=1`, { headers: auth });
if (leadsRes.status === 200 || leadsRes.status === 204) {
  pass(`Leads module reachable (HTTP ${leadsRes.status})`);
} else {
  const body = await leadsRes.text();
  bad(`Leads module returned HTTP ${leadsRes.status}: ${body.slice(0, 300)}`);
}

// ── 3. Lead_Source picklist + mandatory fields ─────────────────────────────
const fieldsRes = await fetch(`${api}/crm/v8/settings/fields?module=Leads`, { headers: auth });
if (fieldsRes.status === 401 || fieldsRes.status === 403) {
  warn(
    "can't read field metadata (scope ZohoCRM.settings.fields.READ not granted) — " +
      "skipping the picklist check. Harmless: lib/zoho.ts retries without Lead_Source if it's rejected.",
  );
} else if (!fieldsRes.ok) {
  warn(`field metadata returned HTTP ${fieldsRes.status} — skipping picklist check`);
} else {
  const json = (await fieldsRes.json().catch(() => null)) as {
    fields?: Array<{
      api_name?: string;
      field_label?: string;
      system_mandatory?: boolean;
      pick_list_values?: Array<{ display_value?: string; actual_value?: string }>;
    }>;
  } | null;
  const fields = json?.fields ?? [];

  const source = fields.find((f) => f.api_name === "Lead_Source");
  const options = (source?.pick_list_values ?? [])
    .map((v) => v.actual_value || v.display_value)
    .filter(Boolean) as string[];

  if (!options.length) {
    warn("Lead_Source has no picklist values returned — skipping");
  } else if (options.includes(LEAD_SOURCE)) {
    pass(`ZOHO_LEAD_SOURCE "${LEAD_SOURCE}" exists in the Lead Source picklist`);
  } else {
    bad(
      `ZOHO_LEAD_SOURCE "${LEAD_SOURCE}" is NOT in the picklist. ` +
        `Leads will still be created, but without a source.\n` +
        `    Valid options: ${options.join(", ")}`,
    );
  }

  // Anything mandatory beyond what we already send needs mapping in lib/zoho.ts.
  const sending = new Set(["Last_Name", "First_Name", "Company", "Email", "Phone", "Website", "Lead_Source", "Description"]);
  const unmapped = fields
    .filter((f) => f.system_mandatory && f.api_name && !sending.has(f.api_name))
    .map((f) => `${f.field_label} (${f.api_name})`);
  if (unmapped.length) {
    bad(`mandatory field(s) we don't send — add them to lib/zoho.ts: ${unmapped.join(", ")}`);
  } else {
    pass("every mandatory Leads field is covered by our mapping");
  }
}

// ── 4. Optional live write ─────────────────────────────────────────────────
if (testLead) {
  console.log("\n  Creating a test lead via the real production path...");
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const ok = await sendLeadToZoho({
    name: "ZZ Integration Test",
    email: "integration-test@ppcguru.ca",
    phone: "000-000-0000",
    company: "PPC Guru (test record — safe to delete)",
    website: "https://ppcguru.ca",
    source: "verify-script",
    service: "Google Ads",
    budget: "$1,000–$5,000",
    message: `Automated connection test written at ${stamp} UTC. Safe to delete.`,
  });
  if (ok) {
    pass('test lead upserted — look for "ZZ Integration Test" in Zoho → Leads, then delete it');
  } else {
    bad("test lead failed — see the [zoho] warning above for the reason");
  }
} else {
  console.log("\n  (read-only run — add --test-lead to also write a real test record)");
}

console.log(failures ? `\n✗ ${failures} problem(s) found.\n` : "\n✓ All checks passed.\n");
process.exitCode = failures ? 1 : 0;
