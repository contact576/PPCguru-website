/**
 * One-off backfill: push the leads already stored in Supabase into Zoho CRM.
 *
 *   npm run crm:backfill              # dry run — prints what WOULD be sent
 *   npm run crm:backfill -- --commit  # actually writes to Zoho
 *   npm run crm:backfill -- --commit --limit=5   # smoke-test with 5 leads first
 *
 * Deliberately separate from the live site path: it reads Supabase over REST and
 * reuses `lib/zoho.ts` for the write, so it cannot affect form handling.
 *
 * Idempotent. `sendLeadToZoho` upserts on Email, so re-running updates the same
 * Zoho records instead of duplicating them. Rows with NO email address are
 * skipped and listed at the end — they have no dedupe key, so importing them
 * would create fresh duplicates on every run. Add those by hand if they matter.
 */
import { sendLeadToZoho, zohoConfigured } from "../lib/zoho.ts";

type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  website: string | null;
  source: string | null;
  budget: string | null;
  service: string | null;
  message: string | null;
  created_at: string;
};

const args = process.argv.slice(2);
const commit = args.includes("--commit");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

/** Pause between writes — keeps us well clear of Zoho's per-minute API credits. */
const DELAY_MS = 300;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

async function fetchLeads(): Promise<LeadRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) fail("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing from .env.local");

  const res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/leads?select=*&order=created_at.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) fail(`Supabase read failed (HTTP ${res.status}): ${await res.text()}`);
  return (await res.json()) as LeadRow[];
}

async function main() {
  if (!zohoConfigured()) {
    fail("Zoho is not configured — set ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET / ZOHO_REFRESH_TOKEN in .env.local");
  }

  const all = await fetchLeads();
  console.log(`Read ${all.length} lead(s) from Supabase.`);

  const noEmail = all.filter((l) => !l.email?.trim());

  // Collapse to one record per email, keeping the NEWEST submission — the rows
  // arrive oldest-first, so a later assignment wins. Zoho would otherwise
  // receive several upserts for the same key and land on the same result anyway,
  // just with extra API calls.
  const byEmail = new Map<string, LeadRow>();
  for (const lead of all) {
    const email = lead.email?.trim().toLowerCase();
    if (email) byEmail.set(email, lead);
  }

  const queue = [...byEmail.values()].slice(0, limit);
  const collapsed = byEmail.size === 0 ? 0 : all.length - noEmail.length - byEmail.size;

  console.log(
    `→ ${queue.length} to send` +
      (collapsed > 0 ? ` (${collapsed} repeat submission(s) collapsed into their newest)` : "") +
      (noEmail.length > 0 ? `, ${noEmail.length} skipped for having no email` : "") +
      (queue.length < byEmail.size ? ` — capped by --limit=${limit}` : ""),
  );

  if (!commit) {
    console.log("\nDRY RUN — nothing was written. Re-run with --commit to send these:\n");
    for (const l of queue) {
      console.log(`  • ${l.name || "(no name)"} <${l.email}>  [${l.source || "—"}]  ${l.created_at.slice(0, 10)}`);
    }
    console.log(`\n${queue.length} lead(s) would be upserted into Zoho CRM.\n`);
    return;
  }

  let sent = 0;
  const failed: LeadRow[] = [];

  for (const [i, lead] of queue.entries()) {
    const ok = await sendLeadToZoho({
      name: lead.name ?? undefined,
      email: lead.email ?? undefined,
      phone: lead.phone ?? undefined,
      company: lead.company ?? undefined,
      website: lead.website ?? undefined,
      // Mark the origin so the sales team can tell a backfilled record from a
      // live one, and keep the original form name.
      source: `backfill${lead.source ? `:${lead.source}` : ""}`,
      budget: lead.budget ?? undefined,
      service: lead.service ?? undefined,
      message: lead.message ?? undefined,
    });

    if (ok) sent++;
    else failed.push(lead);

    console.log(`  [${i + 1}/${queue.length}] ${ok ? "✓" : "✗"} ${lead.email}`);
    if (i < queue.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\nDone — ${sent} upserted, ${failed.length} failed.`);
  if (failed.length) {
    console.log("Failed (see the [zoho] warnings above for the reason):");
    for (const l of failed) console.log(`  • ${l.email}`);
  }
  if (noEmail.length) {
    console.log(`\n${noEmail.length} row(s) had no email and were skipped:`);
    for (const l of noEmail) console.log(`  • ${l.name || "(no name)"} — ${l.created_at.slice(0, 10)} (id ${l.id})`);
  }
  // A partial failure is still a failed job for CI/exit-code purposes.
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
