import dns from "node:dns/promises";
import net from "node:net";

/**
 * SSRF-hardened fetch for user-supplied URLs (e.g. the instant-audit tool).
 *
 * A naive `fetch(userUrl)` lets an attacker point the server at internal hosts:
 * loopback (127.0.0.1 / ::1), private LANs (10/8, 172.16/12, 192.168/16),
 * link-local (169.254/16 — cloud metadata!) or via a redirect that lands on any
 * of those. We defend by:
 *   - allowing only http/https,
 *   - resolving the hostname and rejecting any private/loopback/link-local IP,
 *   - following redirects MANUALLY, re-validating every hop (default fetch would
 *     silently follow a 302 to http://169.254.169.254/…).
 */

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 10) return true;
    if (a === 127) return true; // loopback
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local / metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a >= 224) return true; // multicast / reserved
    return false;
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::1" || v === "::") return true; // loopback / unspecified
    if (v.startsWith("fc") || v.startsWith("fd")) return true; // unique-local
    if (v.startsWith("fe80")) return true; // link-local
    // IPv4-mapped (::ffff:127.0.0.1) — extract and re-check.
    const mapped = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/);
    if (mapped) return isPrivateIp(mapped[1]);
    return false;
  }
  return true; // unparseable → treat as unsafe
}

/** Throws if the hostname resolves to (or is) a private/loopback/link-local address. */
async function assertPublicHost(hostname: string): Promise<void> {
  // Literal IP in the URL → check directly.
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("Blocked: private address");
    return;
  }
  const host = hostname.replace(/^\[|\]$/g, ""); // strip IPv6 brackets
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal")) {
    throw new Error("Blocked: internal hostname");
  }
  const results = await dns.lookup(host, { all: true });
  if (!results.length) throw new Error("Blocked: unresolvable host");
  for (const { address } of results) {
    if (isPrivateIp(address)) throw new Error("Blocked: resolves to private address");
  }
}

export type SafeFetchOptions = {
  headers?: Record<string, string>;
  timeoutMs?: number;
  maxRedirects?: number;
};

/**
 * Fetch a public URL with SSRF protection. Follows up to `maxRedirects` hops,
 * validating each. Returns the final Response (with a possibly-redirected .url).
 */
export async function safeFetch(rawUrl: string, opts: SafeFetchOptions = {}): Promise<Response> {
  const { headers = {}, timeoutMs = 9000, maxRedirects = 4 } = opts;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let current = rawUrl;
    for (let hop = 0; hop <= maxRedirects; hop++) {
      const u = new URL(current);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        throw new Error("Blocked: unsupported protocol");
      }
      await assertPublicHost(u.hostname);

      const res = await fetch(current, {
        signal: controller.signal,
        headers,
        redirect: "manual",
      });

      // 3xx with a Location → validate the next hop ourselves.
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) return res;
        current = new URL(loc, current).toString();
        continue;
      }
      return res;
    }
    throw new Error("Blocked: too many redirects");
  } finally {
    clearTimeout(timeout);
  }
}
