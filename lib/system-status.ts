import { hasSupabase } from "@/lib/supabase";
import { adminConfigured } from "@/lib/admin-auth";

/**
 * Read-only health of the optional integrations, derived purely from which env
 * vars are present. NEVER returns the secret values themselves — only booleans
 * and a short label — so it is safe to hand to a client component.
 */

export type IntegrationStatus = {
  key: string;
  label: string;
  configured: boolean;
  detail: string;
};

export function getIntegrationStatus(): IntegrationStatus[] {
  const turnstile =
    Boolean(process.env.TURNSTILE_SECRET_KEY) && Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  return [
    {
      key: "supabase",
      label: "Supabase",
      configured: hasSupabase(),
      detail: "Blog CMS + lead storage. Needs URL + service-role key.",
    },
    {
      key: "resend",
      label: "Resend",
      configured: Boolean(process.env.RESEND_API_KEY),
      detail: "Transactional email for form submissions.",
    },
    {
      key: "anthropic",
      label: "Anthropic",
      configured: Boolean(process.env.ANTHROPIC_API_KEY),
      detail: "Powers the AI audit + ad-copy tools (falls back to deterministic output).",
    },
    {
      key: "turnstile",
      label: "Turnstile",
      configured: turnstile,
      detail: "Cloudflare spam protection. Needs BOTH the site key and secret key.",
    },
    {
      key: "admin",
      label: "Admin auth",
      configured: adminConfigured(),
      detail: "ADMIN_PASSWORD gate for this CMS.",
    },
  ];
}
