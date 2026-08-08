/**
 * Exchange a Zoho Self Client "code" for a permanent refresh token, and write it
 * straight into .env.local.
 *
 *   npm run crm:token -- PASTE_THE_CODE_HERE
 *
 * Reads ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET from .env.local, so the only thing
 * you paste is the short-lived single-use code. The refresh token is written to
 * disk and never printed, so it can't leak via a terminal scrollback or log.
 *
 * Run this again any time the token is revoked — it replaces the existing line.
 * Get a fresh code from https://api-console.zohocloud.ca → your Self Client →
 * Generate Code (scope: ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.READ).
 */
import { readFileSync, writeFileSync } from "node:fs";

const ENV_PATH = ".env.local";
const ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN || "accounts.zohocloud.ca";

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

const code = process.argv[2]?.trim();
if (!code) fail('No code given. Usage: npm run crm:token -- "1000.abc123..."');

const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  fail(`ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET missing from ${ENV_PATH}`);
}

const res = await fetch(`https://${ACCOUNTS_DOMAIN}/oauth/v2/token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code,
  }),
});

// Zoho answers HTTP 200 with an { error } body on failure, so check the payload.
const json = (await res.json().catch(() => null)) as {
  refresh_token?: string;
  api_domain?: string;
  error?: string;
} | null;

if (!json?.refresh_token) {
  const err = json?.error ?? `HTTP ${res.status}`;
  const hint =
    err === "invalid_code"
      ? "\n  The code expired (10 min) or was already used — codes work exactly once.\n  Generate a fresh one and re-run immediately."
      : err === "invalid_client"
        ? "\n  Wrong client ID/secret, or the Self Client was created on the .com console\n  instead of api-console.zohocloud.ca."
        : "";
  fail(`Token exchange failed: ${err}${hint}`);
}

// Replace the existing line if present, otherwise append.
const original = readFileSync(ENV_PATH, "utf8");
const line = `ZOHO_REFRESH_TOKEN=${json.refresh_token}`;
const updated = /^ZOHO_REFRESH_TOKEN=.*$/m.test(original)
  ? original.replace(/^ZOHO_REFRESH_TOKEN=.*$/m, line)
  : `${original.replace(/\s*$/, "")}\n${line}\n`;
writeFileSync(ENV_PATH, updated);

console.log(`\n✓ Refresh token written to ${ENV_PATH} (not printed here).`);
console.log(`  Zoho reports this org's API domain as: ${json.api_domain ?? "(not returned)"}`);
console.log("\n  Next: npm run crm:verify\n");
