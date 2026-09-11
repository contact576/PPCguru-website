-- ── Landing-page leads (/100-leads "100 Qualified Leads" funnel) ──────────────
-- Run once in the Supabase SQL editor (idempotent).
--
-- Every submission is ALSO mirrored into public.leads (so /admin/leads, the CRM
-- sync, identity stitching and the team email all keep working unchanged). This
-- table stores the landing-specific answers as real columns — service area,
-- business type, budget tier, campaign attribution and a follow-up status —
-- so the /admin/landing-leads panel can filter and work the queue.
--
-- The app degrades if this table is missing: the lead still lands in
-- public.leads and the panel falls back to `leads.source like 'landing:%'`.

create table if not exists public.landing_page_leads (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references public.leads(id) on delete set null,
  landing       text not null default '100-leads',   -- which landing page (room for more)
  name          text,
  email         text,
  phone         text,
  company       text,
  location      text,                                 -- "Primary city or service area"
  business_type text,                                 -- BUSINESS_TYPES id (lib/data/landing-100-leads.ts)
  budget        text,                                 -- LANDING_BUDGETS id
  utm           jsonb,                                -- utm_* / gclid / fbclid / referrer / landing path
  status        text not null default 'new',          -- new · contacted · qualified · booked · lost
  created_at    timestamptz not null default now()
);

-- Added 2026-09-12 for the /seo-visibility landing page (website + free-form
-- answers such as the target search and goal). Safe to re-run.
alter table public.landing_page_leads add column if not exists website text;
alter table public.landing_page_leads add column if not exists answers jsonb;

create index if not exists landing_page_leads_created_idx on public.landing_page_leads (created_at desc);
create index if not exists landing_page_leads_status_idx  on public.landing_page_leads (status);

-- Service role only (the site uses SUPABASE_SERVICE_ROLE_KEY server-side).
alter table public.landing_page_leads enable row level security;
