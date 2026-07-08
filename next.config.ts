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
  // Defense-in-depth against framing for browsers honouring CSP frame-ancestors.
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
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
