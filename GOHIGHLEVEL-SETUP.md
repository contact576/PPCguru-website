# GoHighLevel lead delivery

The website saves submissions in Supabase and sends the selected CRM a copy.
When both `GHL_API_TOKEN` and `GHL_LOCATION_ID` are configured, GoHighLevel replaces
Zoho for new website submissions. Without them, the existing Zoho configuration
remains the fallback. Team notification emails continue separately.

Each GoHighLevel delivery upserts a contact, records the full submission as a
contact note, then adds the website tags. Existing contact tags are preserved.
Contact matching follows the sub-account's configured email/phone priority.

## 1. Create a sub-account Private Integration

Open the PPC Guru sub-account, then **Settings → Private Integrations → Create**.
Name it `PPC Guru Website` and select:

- `contacts.write`: upsert contacts, add tags, and create notes.
- `contacts.readonly`: check existing submission notes before creating or retrying them.
- `locations.readonly`: optional location read check in the verification script.
- `locations/customFields.readonly`: only needed to verify configured custom-field mappings.

There is no separate `notes.write` scope. Copy the token when it is shown and keep
it in server-side environment variables. Obtain the sub-account **Location ID**
from **Settings → Business Profile**. Use a sub-account token, not an agency token.

## 2. Configure the server that serves the website

```dotenv
GHL_API_TOKEN=your-private-integration-token
GHL_LOCATION_ID=your-sub-account-id
```

For local development, use the ignored `.env.local` file. The live `ppcguru.ca`
site is hosted on Hostinger and deploys the `master` branch. Add the variables to
the actual Hostinger application environment, then deploy/rebuild and restart as
required. Updating a local `.env.hostinger.local` file alone does not update the
running server. The Vercel copy has a separate environment.

Keep the existing Supabase URL/service-role key and email configuration in that
same production environment. Never put the GHL token in a `NEXT_PUBLIC_` variable
or commit a real environment file. Do not remove the old Zoho configuration until
production delivery has been verified; missing GHL configuration still uses it.

## 3. Verify the connection and each production form

```bash
npm run ghl:verify
node --experimental-strip-types scripts/ghl-check.mts
```

The first command checks reads using the current process environment. It does not
verify write scopes, production deployment, or website form routing. The second
command runs offline contract checks with mocked fetch; it uses no live services.

An explicit write test is available:

```bash
npm run ghl:verify -- --test-lead
```

This creates a `PPC Guru Integration Test` contact with a unique `example.invalid`
email and no phone, writes a note, adds backfill/test tags, then reads the result
back. The script does not send messages. Delete the test contact when finished.
Existing account workflows may still react to contact creation or backfill tags.

After deployment, submit a controlled entry through every distinct production
form and confirm its row in Supabase plus its contact, note and tags in HighLevel.
Submit again using the same email to verify the sub-account's matching settings.
Repeat submissions should have separate notes when they have different Supabase
row IDs. Replaying one saved row should reuse its existing note.

## 4. Optional mapping

| Variable | Default | Purpose |
| --- | --- | --- |
| `GHL_LEAD_TAGS` | `website-lead` | Comma-separated tags added to live submissions. |
| `GHL_DEFAULT_COUNTRY` | `CA` | Country on the contact; use international phone numbers when available. |
| `GHL_ASSIGNED_USER_ID` | unset | Assign submitted contacts to this HighLevel user. |
| `GHL_CUSTOM_FIELD_BUDGET` | unset | Budget custom-field reference. |
| `GHL_CUSTOM_FIELD_SERVICES` | unset | Services custom-field reference. |
| `GHL_CUSTOM_FIELD_SOURCE` | unset | Form-source custom-field reference. |

Prefer a custom-field ID. `id:<id>` also works. For a key, use `contact.example`
or the explicit `key:<field-key>` syntax. Payloads use `fieldValue`, with the
reference sent as `id` or `key` as appropriate. Without mappings, the note still
contains all supplied form details, source, submission ID and timestamp.

The integration pins the supported `Version: 2021-07-28` contract. Do not change
`GHL_API_VERSION` without rechecking the contact, note and tag API contracts.

## 5. Workflow tags

Live submissions add `website-lead` and a source tag such as `form-contact` or
`form-popup-audit`. Additive tags preserve any existing customer or pipeline tags.
The **Contact Tag / Tag Added** trigger can react when these tags are first added;
adding an already-present tag is not a reliable event for every repeat submission.
These API writes are not native HighLevel form submissions.

Backfill adds `website-backfill` and `form-backfill-<source>` instead of the normal
live submission tags. Check existing workflows before importing historical rows,
including workflows triggered by contact creation. The backfill script itself
does not send email or SMS.

## 6. Import history or retry incomplete delivery

```bash
npm run ghl:backfill
npm run ghl:backfill -- --commit --limit=5
npm run ghl:backfill -- --commit
```

The default is a dry run. The script pages through all saved Supabase rows and
processes each submission separately, oldest first. Phone-only submissions are
included; rows without email or phone are skipped. `--limit` limits the number of
submissions delivered, not the number of unique contacts.

Every saved row uses a unique note marker containing its Supabase ID. Existing
marked notes are reused. Before creating a note, the integration reads the
contact's notes; if that read fails, it stops that delivery rather than risk a
duplicate. An uncertain note write is checked by reading again, not blindly
repeated. Older notes written without a submission marker cannot be matched.

Run one backfill at a time. This is not an atomic exactly-once queue: concurrent
deliveries of the same row or a change in the location's deduplication settings
can defeat the read-before-create protection. Replaying history also updates
contact fields in chronological order; the newest saved submission wins.

## 7. Failure and recovery

The GHL helper reports success only when contact, note and tags have all been
delivered. It retries only safe reads, contact upserts and additive tag operations
on transient network errors, 429 or 5xx, with at most three attempts and short
bounded waits. It does not retry authorization or validation failures. Long
server-requested retry waits are deferred to a later manual run.

When GHL delivery fails after the Supabase save succeeds, the saved submission
remains available for manual `ghl:backfill` recovery. There is no scheduled retry
worker or outbox schema yet. Check Hostinger's application runtime logs for the
sanitized `[ghl]` operation/status warning. Upstream response bodies and submitted
personal data are not logged by the GHL integration or backfill.

## Official API references

- [Private Integration tokens](https://marketplace.gohighlevel.com/docs/Authorization/PrivateIntegrationsToken/index.html)
- [Scopes](https://marketplace.gohighlevel.com/docs/Authorization/Scopes/index.html)
- [Contact upsert and deduplication](https://marketplace.gohighlevel.com/docs/2021-07-28/ghl/contacts/upsert-contact/index.html)
- [Add contact tags](https://marketplace.gohighlevel.com/docs/2021-07-28/ghl/contacts/add-tags/index.html)
- [Create contact note](https://marketplace.gohighlevel.com/docs/2021-07-28/ghl/contacts/create-note/index.html)
- [Supported API versions](https://marketplace.gohighlevel.com/docs/Versioning/index.html)
