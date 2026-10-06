import { createHash } from "node:crypto";
import { cleanEventId } from "@/lib/conversion-context";
import type { LeadInput } from "@/lib/supabase";

/** Server-owned progress: never trust submitted success flags or row ids. */
export type GoogleMetaAttempt = {
  submissionId: string;
  leadId?: string;
  landingSaved?: boolean;
  identified?: boolean;
  emailed: boolean;
  acceptedRecipients: string[];
  crmed: boolean;
  accepted: boolean;
};

type Entry = { expiresAt: number; attempt: GoogleMetaAttempt; pending?: Promise<unknown> };
const attempts = new Map<string, Entry>();
const TTL_MS = 30 * 60_000;
const MAX_ATTEMPTS = 1000;

/**
 * Reuse a saved row and acknowledged channels on identical retries. Only hashes,
 * row ids and delivery flags are retained, never the submitted contact details.
 * This bounded process cache is best-effort across workers/restarts. Stored
 * leads keep their canonical row marker for GHL/backfill compatibility; the
 * stable fallback marker also protects GHL notes when no database is configured.
 */
export async function withGoogleMetaAttempt<T>(record: LeadInput, eventId: unknown, submit: (attempt: GoogleMetaAttempt) => Promise<T>): Promise<T> {
  const now = Date.now();
  const key = createHash("sha256").update(JSON.stringify([cleanEventId(eventId) ?? "", record])).digest("hex");
  for (const [id, entry] of attempts) {
    if (entry.expiresAt <= now && !entry.pending) attempts.delete(id);
  }
  let entry = attempts.get(key);
  if (!entry) {
    entry = {
      expiresAt: now + TTL_MS,
      attempt: { submissionId: `google-meta-${key}`, emailed: false, acceptedRecipients: [], crmed: false, accepted: false },
    };
    // Do not evict active submissions or grow without a bound under load.
    if (attempts.size < MAX_ATTEMPTS) attempts.set(key, entry);
  }
  // Concurrent duplicate requests share one delivery; retries after a failure
  // run again with the successful channels preserved.
  if (entry.pending) return entry.pending as Promise<T>;
  const current = entry;
  const pending = Promise.resolve().then(() => submit(current.attempt));
  current.pending = pending;
  try {
    return await pending;
  } finally {
    if (current.pending === pending) current.pending = undefined;
  }
}
