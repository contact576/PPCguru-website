import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal, dependency-free admin auth for the blog CMS.
 *
 * A successful login (password === ADMIN_PASSWORD) sets a signed cookie:
 *   `<issuedAtMs>.<hmacSHA256(issuedAtMs, secret)>`
 * where `secret` is derived from ADMIN_PASSWORD. The cookie is httpOnly so it
 * can't be read by client JS, and is verified server-side (Node runtime) on
 * every admin page + API route. No DB, no third-party dependency.
 */

export const ADMIN_COOKIE = "ppcg_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function secret() {
  const pw = process.env.ADMIN_PASSWORD || "";
  // Salt with a fixed app string so the signing key isn't the bare password.
  return `ppcguru::${pw}`;
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

/** Build the cookie value for a fresh session. */
export function createSessionToken() {
  const issued = String(Date.now());
  return `${issued}.${sign(issued)}`;
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [issued, mac] = token.split(".");
  if (!issued || !mac) return false;
  const expected = sign(issued);
  if (!safeEqual(mac, expected)) return false;
  const ts = Number(issued);
  if (!isFinite(ts)) return false;
  return Date.now() - ts < MAX_AGE_MS;
}

export function checkPassword(input: string | undefined): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !input) return false;
  return safeEqual(input, pw);
}

/** Server-side guard used by admin pages + API routes. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export const SESSION_MAX_AGE_SECONDS = Math.floor(MAX_AGE_MS / 1000);
