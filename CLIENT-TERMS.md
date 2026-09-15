# Client Service Terms — publication runbook

The versioned terms document referenced by every signed PPC Guru service summary.

| | |
|---|---|
| Live URL | <https://ppcguru.ca/client-service-terms/v2026-09-15> |
| Current version | `v2026-09-15` — effective September 15, 2026 |
| Page title | PPC Guru Client Service Terms |
| Owner | PPC Guru Inc. · contact@ppcguru.ca |
| Indexing | `index, follow`, canonical to the exact versioned URL, listed in `/sitemap.xml` |
| Payment | No card fields anywhere on the page. Payment stays in the HighLevel / Stripe hosted checkout. |

## How it is built

| Path | What it is |
|---|---|
| `lib/legal/client-service-terms.ts` | The **only** source of truth: clause text, version registry, and the renderer that produces the complete HTML document. |
| `app/client-service-terms/[version]/route.ts` | Serves that HTML at the versioned URL. Static, `dynamicParams = false`, so only published versions exist and anything else 404s. |
| `app/client-service-terms/page.tsx` | Forwards `/client-service-terms` to the current version (temporary redirect — agreements must link to the versioned URL). |
| `scripts/archive-terms.mts` | `npm run terms:archive` — writes the served bytes to `legal-archive/` and records SHA-256, byte length and publication timestamp. |
| `legal-archive/client-service-terms/` | The archive: one `.html` per version plus `manifest.json`. Commit it; it is the evidence trail. |

The page is a **self-contained document** — its own CSS, no site chrome, no external font, no
analytics, no advertising pixel, no session-replay tool, no third-party request of any kind.
That is deliberate:

1. **Immutability.** A contract points at one URL; what it serves must not shift when the
   marketing site's layout or scripts change.
2. **Evidence.** The bytes served are the bytes archived and hashed, so the SHA-256 recorded at
   publication still matches what a signer sees today.
3. **The handoff requires no tracking on this page** unless the privacy policy and consent
   controls cover it. Rendering a document the root layout never touches guarantees it.

## Publishing a revision

Never edit a published version — agreements already reference those words.

1. Add a new entry to `CLIENT_TERMS_VERSIONS` in `lib/legal/client-service-terms.ts` with a new id
   (`vYYYY-MM-DD`), its own effective date and the revised clauses.
2. Point `CURRENT_CLIENT_TERMS_VERSION` at it.
3. `npm run terms:archive` — the new version is hashed and stamped; existing versions are verified
   byte-for-byte and the script **fails** if a published one changed.
4. `npm run build`, commit, push. The old URL keeps serving the old words forever.

## Wording for the HighLevel agreement

Paste as the required acknowledgement, with the document name as a link that opens in a new tab:

```html
I have reviewed and agree to the
<a href="https://ppcguru.ca/client-service-terms/v2026-09-15" target="_blank" rel="noopener">PPC Guru Client Service Terms</a>,
version v2026-09-15, effective September 15, 2026, available at
https://ppcguru.ca/client-service-terms/v2026-09-15.
```

Plain text (if the field does not accept HTML):

> I have reviewed and agree to the PPC Guru Client Service Terms, version v2026-09-15, effective
> September 15, 2026, available at https://ppcguru.ca/client-service-terms/v2026-09-15.

Keep the checkbox **required**, and store with the completed document: the terms version, the URL,
the timestamp, the signer identity, the signature audit trail and the final signed PDF.

## Acceptance checks

Verified in a real browser against this build (1280px and 390px):

- [x] The public URL loads without authentication, `200 text/html`.
- [x] Effective date and version are visible above the first clause, and repeated in the footer.
- [x] All 21 sections plus "Questions and accessible formats" are present — 22 sections, 42
      clauses — as real, selectable, searchable HTML text.
- [x] Print or save as PDF button invokes the browser print dialog; print CSS hides the buttons
      and contents list and prints the version + URL.
- [x] Zero scripts, iframes and form fields on the page; **no card fields**.
- [x] Zero external or tracking requests (GTM, Clarity and the first-party beacon never load here).
- [x] `index, follow` + canonical to the exact URL; the version is in `/sitemap.xml`.
- [x] Keyboard accessible with visible focus states; semantic `h1`/`h2`; skip link.
- [x] Footer links to the Privacy Policy and the contact email.
- [x] Unknown versions 404; `/client-service-terms` redirects to the current version.

Still owned by the signing/checkout side (HighLevel), not the website:

- [ ] The duplicate test agreement's link opens the correct page in a new tab.
- [ ] The agreement cannot be completed until the terms checkbox, signature and date are supplied.
- [ ] Checkout collects payment only through HighLevel/Stripe, in CAD, and issues the configured
      receipt or invoice.
- [ ] The signed PDF and audit trail record the same terms version used at signing.
