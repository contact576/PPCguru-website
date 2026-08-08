/**
 * Server-only. Cloudflare Turnstile — the "I'm not a robot" check in front of
 * every form.
 *
 * Single source of truth for verification so `captureLead` (pop-up / hero offer /
 * lead band / tool gate / homepage audit form) and `submitContact` all enforce it
 * the same way.
 *
 * Enforcement is **fail-closed once configured**: when both keys are present a
 * missing/invalid/replayed token is rejected. When the keys are absent the widget
 * never renders (no token could ever exist), so requiring one would block every
 * legitimate visitor — in that state we fall back to `lib/spam-filter.ts`.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export type TurnstileResult = { ok: boolean; reason?: string };

/**
 * Verify a Turnstile token with Cloudflare.
 *
 * @param token  the `turnstileToken` field posted by the widget
 * @param ip     client IP, when known — Cloudflare cross-checks it against the
 *               address that solved the challenge, which kills token resale/replay
 */
export async function verifyTurnstile(token?: string, ip?: string): Promise<TurnstileResult> {
  if (!turnstileConfigured()) return { ok: true, reason: "not-configured" };
  if (!token) return { ok: false, reason: "missing-token" };

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY!,
    response: token,
  });
  // "unknown" is what clientIp() returns when no proxy header is present — never
  // send that to Cloudflare, it would fail the IP cross-check outright.
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      // Cloudflare is fast; don't let a hung request stall a form submission.
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return { ok: true };
    const codes = data["error-codes"] ?? [];
    console.warn("[turnstile] verification failed:", codes.join(", ") || "unknown");
    return { ok: false, reason: codes[0] ?? "failed" };
  } catch (err) {
    // Cloudflare unreachable. Fail OPEN here on purpose: an outage at their end
    // must not silently swallow real leads. The spam-filter heuristics still run.
    console.error("[turnstile] verify request errored:", err instanceof Error ? err.message : err);
    return { ok: true, reason: "verify-unreachable" };
  }
}
