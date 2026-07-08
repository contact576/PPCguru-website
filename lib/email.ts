/**
 * Server-only email helpers. `leadRecipients()` is the single source of truth
 * for where contact / lead notifications are delivered.
 *
 * Default: the team distribution list (contact + sales + marketing). Override
 * with CONTACT_TO_EMAIL — a comma-separated list, e.g.
 *   CONTACT_TO_EMAIL="contact@ppcguru.ca,sales@ppcguru.ca"
 */

const DEFAULT_RECIPIENTS = [
  "contact@ppcguru.ca",
  "sales@ppcguru.ca",
  "marketing@ppcguru.ca",
];

/** Recipients for form-submission notification emails (always ≥1 address). */
export function leadRecipients(): string[] {
  const parsed = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length ? parsed : DEFAULT_RECIPIENTS;
}
