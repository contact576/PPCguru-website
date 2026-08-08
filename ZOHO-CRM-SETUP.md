# Zoho CRM lead sync — setup

Every form submission on the site is mirrored into the **Leads** module of the
PPC Guru Zoho org (`crm.zohocloud.ca`, org `110002019776`), alongside the
existing Supabase row and team email.

Nothing works until the three secrets below are set. Until then the sync
silently no-ops — forms keep working exactly as they do today.

> ⚠️ **This org is on the Canada data centre.** Every Zoho tutorial you'll find
> uses the `.com` hosts. Those return `invalid_client` / `401` here. Use the
> `.ca` / `zohocloud.ca` hosts below throughout.

---

## 1. Create a Self Client

1. Go to **<https://api-console.zohocloud.ca>** — note the `.ca`, *not*
   `api-console.zoho.com`. Sign in with a Zoho user that has permission to
   create leads.
2. **Add Client → Self Client → Create**.
3. Copy the **Client ID** and **Client Secret**.

## 2. Generate a refresh token

Still in the Self Client, open the **Generate Code** tab:

- **Scope:** `ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.READ,ZohoCRM.settings.fields.READ`
- **Time Duration:** 10 minutes
- **Scope Description:** anything, e.g. `website lead sync`

The first two scopes are what the sync needs. The third is read-only and
optional — it just lets `npm run crm:verify` check your Lead Source picklist and
mandatory fields for you. The currently-installed token was issued **without**
it, which is fine; regenerate with it if you want the fuller check.

Click **Create** and copy the `code`. It expires in 10 minutes and works exactly
once, so do the next step immediately.

Put `ZOHO_CLIENT_ID` and `ZOHO_CLIENT_SECRET` in `.env.local` first, then:

```powershell
npm run crm:token -- "PASTE_THE_CODE_HERE"
```

That exchanges the code and writes `ZOHO_REFRESH_TOKEN` straight into
`.env.local` without printing it, so the secret never hits your terminal
scrollback. Re-run it any time the token is revoked.

`"error": "invalid_code"` means the code expired or was already used — generate a
fresh one and be quicker. Perfectly normal on a first attempt.

## 3. Set the environment variables

Add to `.env.local` for local dev, **and** to Vercel → project `ppcguru-website`
→ Settings → Environment Variables for production:

```
ZOHO_CLIENT_ID=1000.xxxxxxxx
ZOHO_CLIENT_SECRET=xxxxxxxx
ZOHO_REFRESH_TOKEN=1000.xxxxxxxx.xxxxxxxx
ZOHO_LEAD_SOURCE=Web Download
```

Optional:

| Variable               | Default                | Purpose                                                     |
| ---------------------- | ---------------------- | ----------------------------------------------------------- |
| `ZOHO_ACCOUNTS_DOMAIN` | `accounts.zohocloud.ca`| OAuth host. Only change if the org migrates DC.             |
| `ZOHO_API_DOMAIN`      | `www.zohoapis.ca`      | API host fallback (Zoho reports the real one per token).     |
| `ZOHO_LEAD_SOURCE`     | `Web Download`         | Must already exist in the Lead Source picklist — see below.  |
| `ZOHO_LEAD_OWNER_ID`   | —                      | Numeric Zoho user ID to own all website leads.              |

Then confirm the connection:

```powershell
npm run crm:verify              # read-only: auth, module access, picklist
npm run crm:verify -- --test-lead   # also writes one obvious test record
```

`--test-lead` goes through the exact same code the website uses, so a pass means
the forms will work. It creates **ZZ Integration Test** in Leads — delete it
afterwards. Note it may trip any Zoho workflow or assignment rule you have on new
leads, so a rep might get a notification.

You can also check **/admin → settings**: the "Zoho CRM" tile flips to
configured.

### Status: local ✅ verified 2026-08-03

Local `.env.local` is set up and a test lead was created successfully
(`Web Download` was accepted by the picklist, and the lead was owned by the API
user — Abhishek Tewari — since `ZOHO_LEAD_OWNER_ID` is unset).

**Still to do: add the three `ZOHO_*` vars to Vercel** so production syncs too.
Until then only local dev writes to Zoho.

## 4. Recommended: add a "Website" lead source

`Lead_Source` is a **picklist**, so it only accepts values that already exist in
the module. `Web Download` is a stock option, which is why it's the default — but
it reads oddly on a lead report.

To use something cleaner: Zoho → **Setup → Customization → Modules and Fields →
Leads → Lead Source → Edit** → add `Website`, save, then set
`ZOHO_LEAD_SOURCE=Website`.

If the value isn't in the picklist, the lead is **still created** — the code
detects the rejection, retries without the field, and logs a warning. You never
lose a lead to a picklist mismatch.

---

## Backfilling existing leads

The leads already in Supabase (visible at `/admin/leads`) can be pushed in one
go. Dry run first:

```powershell
npm run crm:backfill
```

That prints exactly what would be sent and writes nothing. When it looks right,
smoke-test a handful, then do the rest:

```powershell
npm run crm:backfill -- --commit --limit=5
npm run crm:backfill -- --commit
```

It's **idempotent** — records upsert on email, so re-running updates rather than
duplicates. Backfilled leads get a `backfill:` prefix in their Description so
they're distinguishable from live ones. Repeat submissions from the same address
collapse into the newest. Rows with no email are skipped and listed at the end
(no dedupe key means they'd duplicate on every run).

---

## How it works / troubleshooting

| Thing            | Where                                                     |
| ---------------- | --------------------------------------------------------- |
| Zoho client      | `lib/zoho.ts`                                             |
| Popup + tool forms | `app/actions/lead.ts`                                   |
| Contact form     | `app/contact/actions.ts`                                  |
| Backfill         | `scripts/zoho-backfill.mts`                               |
| Token exchange   | `scripts/zoho-token.mts`                                  |
| Connection check | `scripts/zoho-verify.mts`                                 |
| Status tile      | `lib/system-status.ts`                                    |

**Field mapping.** `name` splits into `First_Name` / `Last_Name` (Zoho requires a
last name). `Company` is also mandatory in Zoho but most of our forms don't ask
for it, so it falls back to the lead's website domain, then to
`Unknown (website lead)`. Budget, service, the originating form and the message
all go into `Description`, since they have no standard Zoho field — promote them
to custom fields if sales wants to filter on them.

**Failures are silent to the visitor, loud in the logs.** The sync never throws;
a CRM problem can't break a form or lose a lead. Look for `[zoho]` warnings in
the Vercel runtime logs:

| Log                                       | Meaning                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `token refresh failed … invalid_client`   | Wrong client ID/secret, or the Self Client was made on the `.com` console |
| `token refresh failed … invalid_grant`    | Refresh token revoked or wrong DC — regenerate from step 2               |
| `Lead_Source "…" is not in the … picklist` | Harmless; lead created without a source. See step 4                     |
| `lead upsert failed … MANDATORY_NOT_FOUND` | A required field was added to the Leads layout in Zoho — map it in `lib/zoho.ts` |

A lead is only reported as failed to the visitor if **all three** sinks (email,
Supabase, Zoho) fail.
