/**
 * Single source of truth for the service + budget choices offered on EVERY lead
 * capture point (pop-up funnel, contact form, homepage audit wizard, tool gates).
 *
 * Deliberately separate from `lib/data/services.ts`: that file drives the 13
 * marketing service PAGES, while this is the shorter commercial menu a prospect
 * actually picks from. Keeping them apart means we can add a service page
 * without silently changing what every form asks.
 *
 * These strings are stored verbatim in Supabase (`leads.service`, `leads.budget`)
 * and pushed into the Zoho Lead Description, so treat them as data: changing a
 * label changes what historical rows can be grouped by.
 */

export const SERVICE_OPTIONS = [
  "Google Ads",
  "Meta Ads",
  "Google Guaranteed Ads",
  "SEO",
  "Google Business Profile Management",
  "Social Media Management",
  "Website / Landing Page",
  "CRM",
] as const;

export const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 – $2,000",
  "$2,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
export type BudgetOption = (typeof BUDGET_OPTIONS)[number];

/** Max chars we accept for the joined services string (bounds the zod schema). */
export const SERVICES_MAX_LEN = 400;
