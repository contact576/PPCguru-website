import type { NextConfig } from "next";

const securityHeaders = [
  // Stop MIME sniffing (e.g. a text response treated as active script).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking: disallow the site being framed by other origins.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Don't leak full URLs (with query strings) to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Drop access to powerful browser features we never use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Force HTTPS for two years, including subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Defense-in-depth against framing for browsers honouring CSP frame-ancestors,
  // plus three directives that cost nothing here and close real injection paths:
  //   base-uri 'self'    — an injected <base href> can't repoint every relative
  //                        script/link URL at an attacker's host.
  //   object-src 'none'  — no <object>/<embed> plugin content, ever.
  //   form-action 'self' — a form can only post back to us, so injected markup
  //                        can't exfiltrate a lead's details to a third party.
  // NB no `script-src` yet: GTM, Clarity and Turnstile all inject inline script,
  // so a meaningful policy needs per-request nonces (see SECURITY-REVIEW.md).
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // three.js / R3F transpilation safety for the App Router
  transpilePackages: ["three"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
