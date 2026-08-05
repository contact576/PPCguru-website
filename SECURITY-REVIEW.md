# Security review — 2026-08-06

Full pass over the request surface: API routes, server actions, admin auth,
middleware, headers, Supabase service-role usage, blog rendering, dependencies.

## Fixed in this pass

### 1. Next.js 16.2.9 → 16.3.0 (HIGH — the significant one)

The installed release carried **9 published advisories**, several of which land
directly on how this site works (every form is a Server Action):

| Advisory | Relevance |
|---|---|
| `GHSA-955p-x3mx-jcvp` — unauthenticated disclosure of internal Server Function endpoints | High: all lead capture is Server Actions |
| `GHSA-m99w-x7hq-7vfj` — DoS in App Router via Server Actions | High |
| `GHSA-4c39-4ccg-62r3` — unbounded Server Action payload | High |
| `GHSA-68g3-v927-f742`, `GHSA-4633-3j49-mh5q` — cache confusion of response bodies | Cross-visitor response mixing |
| `GHSA-89xv-2m56-2m9x`, `GHSA-p9j2-gv94-2wf4` — SSRF in Server Actions / rewrites | Medium |
| `GHSA-6gpp-xcg3-4w24` — middleware/proxy bypass | We rely on `proxy.ts` for the www→apex 308 and the casino-spam 410s |
| `GHSA-q8wf-6r8g-63ch` — DoS in Image Optimization via SVG | Medium |

The upgrade also pulled fixed `sharp` (libvips CVE-2026-33327/33328/35590/35591)
and `postcss`. A follow-up `npm audit fix` cleared the remaining transitive
`postcss` (arbitrary `.map` file disclosure via `sourceMappingURL`) and `js-yaml`
(quadratic-complexity DoS, reached via `gray-matter` frontmatter parsing).

**`npm audit` now reports 0 vulnerabilities.** Build verified: 165/165 routes.

### 2. Forgeable unsubscribe tokens when no secret is set (`lib/journeys.ts`)

`unsubSecret()` fell back to the bare constant `ppcguru-unsub::` when neither
`IDENTITY_SECRET` nor `ADMIN_PASSWORD` was set. That constant is in this
repository, so in that state **anyone could mint a valid opt-out token for any
address** and mass-unsubscribe the list — no login, no rate limit, the endpoint
honours tokens by design (RFC 8058 one-click).

`lib/identity.ts` already guarded its equivalent path via `identityConfigured()`;
the journeys module did not. Fixed by adding `unsubConfigured()` and:

- `verifyUnsubscribeToken()` refuses to verify anything without real key material;
- `journeysEnabled()` now *also* requires it — otherwise we would mail people an
  unsubscribe link that gets rejected on click, which is a CASL breach. Silence
  is the safe failure mode.

### 3. CSP widened beyond `frame-ancestors` (`next.config.ts`)

Added three directives that close real injection paths at zero breakage risk:

- `base-uri 'self'` — an injected `<base href>` can no longer repoint every
  relative script/link URL at an attacker host.
- `object-src 'none'` — no plugin content.
- `form-action 'self'` — injected markup can't post a visitor's lead details to
  a third-party endpoint.

## Reviewed and found sound (no change needed)

- **Admin auth** — HMAC-signed httpOnly cookie, `timingSafeEqual` compare,
  14-day expiry, login throttled to 8 attempts / 5 min per IP. All 8 admin pages
  and all 7 admin API routes call `isAuthed()`; all are `noindex`.
  `sameSite: "lax"` blocks cross-site POST, so CSRF is covered.
- **SSRF** — `lib/safe-fetch.ts` is properly hardened: protocol allowlist,
  DNS resolution checked against loopback / RFC1918 / link-local (169.254 metadata)
  / CGNAT / IPv4-mapped IPv6, and **every redirect hop re-validated** manually.
- **Lead forms** — four anti-spam layers (honeypot → per-IP rate limit →
  Turnstile → heuristics) with silent-drop so bots get no oracle, and bot
  submissions never reach the autoresponder.
- **AI endpoints** — `/api/instant-audit` and `/api/ad-copy` are unauthenticated
  but rate-limited per IP against token-cost abuse.
- **`/api/track`** — POST-only, 4 KB cap, Zod-validated, rate-limited; IP/geo/UA
  stored only on explicit consent (PIPEDA-aligned).
- **Secrets** — nothing sensitive is tracked in git; `.gitignore` covers
  `.env*.local` and `*.pem`. Service-role key is server-only.
- **Upload** — admin-only, 8 MB cap, raster allowlist with SVG deliberately
  excluded (SVG can carry inline-script XSS).

## Open recommendations (not changed — need your call)

1. **`script-src` CSP.** The policy still has no `script-src`, so it does not
   stop injected inline script. A real policy needs per-request nonces because
   GTM, Clarity and Turnstile all inject inline. Non-trivial and easy to break
   analytics with — worth doing as its own task.
2. **Raw HTML in blog posts.** `app/blog/[slug]/page.tsx` and the editor preview
   use `rehype-raw` with no sanitizer, so post content renders arbitrary HTML.
   This is a deliberate, documented tradeoff (posts are admin-authored) and
   adding `rehype-sanitize` would break existing posts that embed HTML. It does
   mean a stolen admin password escalates to stored XSS. Acceptable if
   `ADMIN_PASSWORD` is strong and unique.
3. **Rotate `ADMIN_PASSWORD` if it is still the dev default** (`ppcguru-dev-local`).
   It is the root secret: the admin session cookie, the identity cookie and the
   unsubscribe tokens are all derived from it. Prefer setting a dedicated
   `IDENTITY_SECRET` so rotating the admin password doesn't invalidate every
   visitor's identity cookie.
4. **Rate limiting is per-instance**, not global. Fine as burst protection; back
   it with Upstash/Redis if you want a hard cap.
