# Visitor identity + behavioural email journeys

This is the PPC Guru equivalent of what The Sleep Company runs (they use
WebEngage). It turns anonymous traffic into named people, recovers what they
read *before* they ever gave us their name, and emails them when they come back.

---

## What it actually does (and what it deliberately doesn't)

**It does not de-anonymise anybody.** There is no IP→identity vendor, no data
broker, no purchased identity graph. Nobody's email is ever revealed to us by
their visit. Vendors that claim to do this (RB2B, Retention.com, Opensend) are
US-consumer graphs and using them from Canada is PIPEDA/CASL exposure — and it
would contradict our own `/privacy`.

A visitor becomes known in exactly one way: **they type their email into one of
our forms.** What this system adds is everything that happens around that
moment:

```
Anonymous visitor, device id ppcg_sid=8f2a…
  → /services/google-ads, /pricing, /pricing        3 events, no owner

Submits the free-audit form as jay@acme.ca
  → leads row created
  → all 3 earlier events back-filled with lead_id   ← the retro-stitch
  → any OTHER device that ever used jay@acme.ca is merged in too
  → signed httpOnly cookie ppcg_vid set (180 days)

Returns 4 days later, hits /pricing twice
  → recognised instantly, even in a fresh tab
  → journey fires: email to Jay + 🔥 alert to sales
```

The payoff is that `/admin/people` shows Jay's **entire** research history,
including the part that happened while he was a stranger.

---

## Setup

### 1. Run the SQL (required — nothing persists without it)

In Supabase → SQL Editor, in this order:

1. `supabase/visitor-tracking.sql` — if you haven't already (creates
   `visitor_events`)
2. `supabase/visitor-identity.sql` — **new**: `visitor_identities`,
   `journey_sends`, indexes, and the `unsubscribed_at` opt-out column

Both are idempotent — safe to re-run.

### 2. Environment

| Variable | Required | What it does |
|---|---|---|
| `IDENTITY_SECRET` | recommended | Signs the recognition cookie + unsubscribe tokens. Falls back to `ADMIN_PASSWORD` if blank. Set a dedicated random value (`openssl rand -hex 32`) so rotating the admin password doesn't sign out every known visitor and break live unsubscribe links. |
| `JOURNEYS_ENABLED` | no | `false` silences all automated email (visitor + internal). Stitching and `/admin/people` keep working. |
| `RESEND_API_KEY` **or** `SMTP_*` | for email only | Already set for the existing forms. Journeys reuse `lib/email.ts` — no new provider. |

Everything degrades gracefully: no DB → no stitching, no keys → no email, and
form submission is never affected either way.

---

## The journeys

Both fire only for people who submitted a form, and only on `pageview` events.

| Journey | Trigger | Cooldown |
|---|---|---|
| `return_visit` | Known lead returns after **≥3 days** of no activity | 21 days |
| `high_intent` | **≥3** money-page views in a 7-day window (`/pricing`, `/free-audit`, `/contact`, `/services/*`, `/compare`, `/benchmarks`) | 10 days |

`high_intent` outranks `return_visit` — a hot lead beats a re-engagement nudge.
At most one email per pageview. Each send goes to the visitor **and** fires a
`🔥 <name> is back on the site` alert to `leadRecipients()`.

Tuning lives at the top of `lib/journeys.ts`: `RETURN_GAP_DAYS`,
`HIGH_INTENT_HITS`, `HIGH_INTENT_WINDOW_DAYS`, `MONEY_PAGES`, and the per-rule
`cooldownDays`.

---

## Consent, and why it's built this way

- **Cookie decline is honoured.** `<SessionField />` sends no device id if the
  visitor declined the banner, so their submission is never stitched to their
  browsing. Declining has to mean something.
- **CASL implied consent expires.** A business enquiry gives 6 months. After
  `IMPLIED_CONSENT_DAYS` (180) we stop mailing that person automatically.
- **One-click unsubscribe is real.** Every journey email carries a signed
  opt-out link plus `List-Unsubscribe` / `List-Unsubscribe-Post` headers, so
  Gmail and Outlook's own unsubscribe button works. Opting out applies to the
  **address**, silencing every merged device — and it's permanent.
- **Consent-gated PII is unchanged.** IP, city and user-agent are still only
  stored when the visitor accepted cookies (existing `/api/track` behaviour).
- The `/privacy` page already discloses first-party tracking. **It should be
  updated to mention that a form submission links prior browsing to you** —
  that's the one disclosure this feature adds.

---

## Where it lives

| File | Role |
|---|---|
| `supabase/visitor-identity.sql` | Tables, indexes, opt-out column |
| `lib/identity.ts` | Cookie signing, `identifyVisitor()` retro-stitch + cross-device merge, `resolveVisitor()` |
| `lib/journeys.ts` | Rules, email templates, frequency caps, unsubscribe tokens |
| `lib/people.ts` | `/admin/people` read model (groups devices → one human) |
| `app/api/track/route.ts` | Resolves identity, stamps `lead_id`, runs journeys in `after()` |
| `app/api/journeys/unsubscribe/route.ts` | GET (link) + POST (RFC 8058 one-click) |
| `components/shared/session-field.tsx` | Carries `ppcg_sid` into form posts |
| `app/actions/lead.ts`, `app/contact/actions.ts` | Call `identifyVisitor()` on submit |
| `components/admin/people-view.tsx` | Per-person timeline, `pre-signup` badges |

Performance: identity resolution and journey evaluation run inside `after()`,
so `/api/track` still returns its 204 immediately. An identified pageview costs
three indexed queries; anonymous traffic costs one.

---

## Verifying it works

1. Run both SQL files.
2. Browse the site anonymously — hit `/pricing` and a couple of `/services/*`
   pages. Confirm rows land in `/admin/visitors` with no lead.
3. Submit any form. Check `/admin/people`: you should appear with your earlier
   pageviews tagged **`pre-signup`**, and `Pre-signup events recovered` > 0.
4. To test `high_intent` without waiting: reload `/pricing` three times, then
   hit any page. To test `return_visit`, backdate your `visitor_events.created_at`
   in Supabase by 4+ days and load a page.
5. Check `journey_sends` for the log row, and your inbox for the mail.

---

## Current status

- ✅ Built, `npm run build` passes (163/163 routes), runtime smoke-tested
- ⏳ **`supabase/visitor-identity.sql` has NOT been run yet** — until it is,
  stitching silently no-ops (verified: no errors, forms unaffected)
- ⏳ `IDENTITY_SECRET` not set — currently falling back to `ADMIN_PASSWORD`
- ⏳ `/privacy` not yet updated with the "form submission links prior browsing"
  disclosure
