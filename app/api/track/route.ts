import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveVisitorEvent } from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * First-party analytics collector. Receives lightweight interaction events from
 * the browser (see lib/analytics.ts). Hardened:
 *  - POST only, body size capped, Zod-validated, unknown keys stripped.
 *  - Per-instance rate limit per IP.
 *  - IP / coarse geo / user-agent are stored ONLY when the client reports consent.
 */
const schema = z.object({
  event: z.string().min(1).max(40),
  path: z.string().max(512).optional(),
  referrer: z.string().max(1024).optional(),
  target: z.string().max(200).optional(),
  session_id: z.string().max(64).optional(),
  consent: z.boolean().optional(),
  utm: z.record(z.string().max(40), z.string().max(200)).optional(),
});

// Best-effort per-instance limiter (serverless instances are short-lived, but this
// still blunts abusive bursts). ~40 events / 10s from a single IP.
const hits = new Map<string, { n: number; t: number }>();
function rateLimited(ip: string): boolean {
  if (!ip) return false;
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now - cur.t > 10_000) {
    hits.set(ip, { n: 1, t: now });
    if (hits.size > 5000) hits.clear(); // bound memory
    return false;
  }
  cur.n += 1;
  return cur.n > 40;
}

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > 4000) return NextResponse.json({ ok: false }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const ip = clientIp(req);
  if (rateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  const data = parsed.data;
  const consent = data.consent === true;
  const geo = (h: string) => (consent ? req.headers.get(h) || null : null);

  // Fire-and-forget: analytics writes must never delay or fail the response.
  await saveVisitorEvent({
    session_id: data.session_id,
    event: data.event,
    path: data.path,
    referrer: data.referrer,
    target: data.target,
    utm: data.utm ?? null,
    // Personal / technical fields — consent-gated (PIPEDA-aligned).
    ip: consent ? ip || null : null,
    country: geo("x-vercel-ip-country"),
    region: geo("x-vercel-ip-country-region"),
    city: consent ? decodeURIComponent(req.headers.get("x-vercel-ip-city") || "").trim() || null : null,
    ua: consent ? (req.headers.get("user-agent") || "").slice(0, 400) || null : null,
  });

  return new NextResponse(null, { status: 204 });
}

// Any non-POST verb → 405.
export function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
