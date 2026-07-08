import type { NextRequest } from "next/server";

/**
 * Best-effort per-instance, per-IP rate limiter. Serverless instances are
 * short-lived so this is not a hard global cap, but it blunts abusive bursts:
 * unauthenticated AI endpoints (Anthropic cost abuse) and admin-login
 * brute-forcing. For a hard cross-instance cap, back this with Upstash/Redis.
 */

type Bucket = { n: number; reset: number };
const buckets = new Map<string, Bucket>();

export type RateResult = { ok: boolean; retryAfter: number };

/**
 * @param key    logical bucket, e.g. `ad-copy:1.2.3.4`
 * @param limit  max requests allowed within the window
 * @param windowMs  window length in ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || now > cur.reset) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    if (buckets.size > 10_000) {
      // Bound memory: drop expired entries (and, worst case, everything).
      for (const [k, b] of buckets) if (now > b.reset) buckets.delete(k);
      if (buckets.size > 10_000) buckets.clear();
    }
    return { ok: true, retryAfter: 0 };
  }
  cur.n += 1;
  if (cur.n > limit) return { ok: false, retryAfter: Math.ceil((cur.reset - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}

/** Extract the client IP from proxy headers (Vercel / reverse proxies). */
export function clientIp(req: Request | NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
