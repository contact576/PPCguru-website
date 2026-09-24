# Email delivery recovery

Hostinger/MailChannels must resolve the sender restriction before outbound SMTP
can be considered recovered. DNS authentication and these safeguards do not
clear a provider suspension. Do not recreate the mailbox or send repeated test
messages to work around a restriction.

## Rollout order

1. While the provider restriction is unresolved, set `SMTP_ENABLED=false` in
   Hostinger. Preserve SMTP credentials, recipient lists, CRM and database
   settings. This flag only takes effect once this code is deployed. Supabase
   still stores leads; CRM and the configured Resend fallback remain available.
   Resend still needs its own verified sender/domain for external delivery.
2. Apply `supabase/email-autoresponder.sql` to the website's existing Supabase
   project. It adds an RLS-protected table and a service-role-only function; no
   lead rows or existing policies are modified. The atomic claim limits optional
   acknowledgement attempts to one per recipient in 24 hours, including failed
   attempts, across concurrent requests and process restarts.
3. Deploy this branch through the normal reviewed `master`/Hostinger workflow.
   If the migration is unavailable, optional visitor receipts are suppressed
   and logged. Lead storage, CRM and internal notifications remain unchanged.
4. Leave `JOURNEYS_ENABLED` unset or `false` unless automated visitor follow-up
   is explicitly desired and its sender and consent are ready. Only `true`
   enables it. This does not change identity storage or normal lead notifications.
5. After Hostinger confirms recovery, enable SMTP and use the authenticated
   admin **Send test email** action once with existing business-controlled
   recipients. Verify actual inbox receipt and hPanel delivery. SMTP login alone
   is not proof of delivery. Do not test production using invented recipients.

## Safeguards and limits

- All outbound helpers reject malformed recipients and reserved example/test
  domains, including subdomains. This does not reject or delete captured leads.
- Autoresponder names are escaped before insertion into HTML.
- A provider sender/account block pauses automatic SMTP retries for that
  process until an explicit admin test. Set `SMTP_ENABLED=false` to keep the
  pause across restarts/deployments. The admin test respects that flag too.
- A blocked sender remains visible in the email-health panel without new SMTP
  authentication attempts. Other SMTP 5xx failures retain the ten-minute pause.
- The recipient cooldown is an attempt cap, not a delivery receipt or durable
  email queue. SMTP/Resend acceptance still does not prove inbox delivery.
- The existing per-IP form limiter is per process. These changes reduce abuse
  exposure; they cannot establish why MailChannels restricted this sender or
  guarantee future provider decisions.
- Production currently has no Turnstile keys. Its existing optional CAPTCHA,
  spam heuristics and form rate-limiting behavior are unchanged by this patch.

## Offline validation

`npm run check:email-safety`, `npm run check:lead-routing`,
`npm run check:landing-lead`, `npm run typecheck`, and `npm run build`.
The email-safety check mocks every provider/database boundary and refuses live
network calls. The SQL migration should also be verified against PostgreSQL
before rollout. No production submissions are needed for these checks.
