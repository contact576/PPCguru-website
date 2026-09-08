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
    // Phones first: the narrow widths are what a 390pt viewport actually asks
    // for, and without them next/image rounds up to 640 and ships ~2.5x the
    // bytes for a full-width image on mobile.
    deviceSizes: [360, 414, 640, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Blog covers written by the legacy CMS live in Supabase storage and are
    // served as raw PNGs. Allowing the host lets next/image re-encode them to
    // AVIF/WebP at the requested width — the single biggest byte saving on a
    // post page. Anything NOT matched here falls back to a plain <img> in
    // app/blog/[slug]/page.tsx rather than throwing.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  // NB no `transpilePackages: ["three"]`: the Three.js hero was retired with
  // the dark theme (components/home/hero.tsx is unimported), so nothing in the
  // build graph reaches three/@react-three any more. Re-add it if a 3D scene
  // is ever wired back in.
  //
  // content/blog is read with fs at request time (lib/blog.ts, lib/blog-fs.ts)
  // to honour `publishAt` embargoes without a redeploy. That read is dynamic,
  // so file tracing can't infer it — name it explicitly or a scheduled post can
  // vanish from a serverless build.
  outputFileTracingIncludes: {
    "/*": ["./content/blog/**/*"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
