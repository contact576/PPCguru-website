/** Dry-run by default. --commit sends each saved submission, retaining its Supabase ID. */
import { ghlConfigured, syncLeadToGhl } from "../lib/gohighlevel.ts";

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
const limitArg = args.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : Infinity;
const PAGE_SIZE = 200;
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function fail(message: string): never {
  throw new Error(message);
}

async function fetchLeads(): Promise<LeadRow[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !key) fail("Supabase URL / service-role key are missing from this process environment.");
  const all: LeadRow[] = [];
  // Freeze the window while paging; rows submitted after the run starts belong to the next run.
  const cutoff = new Date().toISOString();
  let offset = 0;
  for (;;) {
    const query = new URLSearchParams({
      select: "id,name,email,phone,company,website,source,budget,service,message,created_at",
      order: "created_at.asc,id.asc", created_at: "lte." + cutoff,
      limit: String(PAGE_SIZE), offset: String(offset),
    });
    let response: Response;
    try {
      response = await fetch(baseUrl.replace(/\/+$/, "") + "/rest/v1/leads?" + query, {
        headers: { apikey: key, Authorization: "Bearer " + key }, signal: AbortSignal.timeout(10000),
      });
    } catch {
      fail("Supabase page read failed due to a network error. No CRM writes have started.");
    }
    if (!response!.ok) fail("Supabase page read failed (HTTP " + response!.status + "). No CRM writes have started.");
    const page = await response!.json().catch(() => null) as LeadRow[] | null;
    if (!Array.isArray(page)) fail("Supabase returned an unexpected response. No CRM writes have started.");
    if (!page.length) break;
    all.push(...page);
    offset += page.length;
    // Continue even after a short page: the project's API row cap may be smaller than PAGE_SIZE.
  }
  return all;
}

async function main(): Promise<void> {
  if (args.some((arg) => arg !== "--commit" && !arg.startsWith("--limit="))) fail("Use only --commit and an optional --limit=<positive integer>.");
  if (limitArg && (!Number.isSafeInteger(limit) || limit < 1)) fail("--limit must be a positive integer.");
  if (commit && !ghlConfigured()) fail("GoHighLevel is not configured. Set GHL_API_TOKEN / GHL_LOCATION_ID first.");
  const all = await fetchLeads();
  const eligible = all.filter((lead) => lead.id && (lead.email?.trim() || lead.phone?.trim()));
  const queue = eligible.slice(0, limit);
  console.log("Read " + all.length + " saved submissions across all pages.");
  console.log(queue.length + " eligible submissions selected; " + (all.length - eligible.length) + " skipped without a row ID or email/phone.");
  console.log("Repeated contacts retain one note per submission ID. Names, emails and messages are not printed.");
  if (!commit) {
    console.log("DRY RUN: no GoHighLevel writes. Use --commit to deliver the selected submissions.");
    return;
  }
  let sent = 0;
  let failed = 0;
  for (const [index, lead] of queue.entries()) {
    const result = await syncLeadToGhl({
      submissionId: lead.id, createdAt: lead.created_at,
      name: lead.name ?? undefined, email: lead.email ?? undefined, phone: lead.phone ?? undefined,
      company: lead.company ?? undefined, website: lead.website ?? undefined,
      source: lead.source ?? undefined, budget: lead.budget ?? undefined,
      service: lead.service ?? undefined, message: lead.message ?? undefined,
    }, { backfill: true });
    if (result.ok) sent++; else failed++;
    console.log("[" + (index + 1) + "/" + queue.length + "] " + (result.ok ? "delivered" : "incomplete") +
      " (contact=" + result.contactSynced + ", note=" + result.noteSynced + ", tags=" + result.tagsSynced + ")");
    if (index + 1 < queue.length) await pause(300);
  }
  console.log("Finished: " + sent + " delivered, " + failed + " incomplete.");
  if (failed) {
    console.log("Saved submissions remain in Supabase. Retry this command; completed notes are detected by submission ID.");
    process.exitCode = 1;
  }
}

await main().catch((error: unknown) => {
  // Only our own controlled diagnostics are thrown; do not print arbitrary SDK/network errors.
  const safeMessages = ["Supabase ", "GoHighLevel ", "Use only ", "--limit "];
  const message = error instanceof Error && safeMessages.some((prefix) => error.message.startsWith(prefix))
    ? error.message : "Backfill stopped unexpectedly. No upstream response data was logged.";
  console.error(message);
  process.exitCode = 1;
});
