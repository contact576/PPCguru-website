import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkPassword,
  createSessionToken,
  adminConfigured,
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Admin login is not configured. Set ADMIN_PASSWORD." }, { status: 503 });
  }
  // Throttle password attempts — the session secret is derived from ADMIN_PASSWORD,
  // so an unthrottled endpoint is an offline-free brute-force oracle.
  const limited = rateLimit(`admin-login:${clientIp(req)}`, 8, 5 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (!checkPassword(body.password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return NextResponse.json({ ok: true });
}
