-- PPC Guru Google + Meta Ads landing form.
-- Safe to rerun in the Supabase SQL editor. The live PPC Guru project already
-- has these tables/columns; use this for a fresh or repaired environment.
-- The website writes with SUPABASE_SERVICE_ROLE_KEY on the server only.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  phone      text,
  company    text,
  website    text,
  source     text,
  budget     text,
  service    text,
  message    text,
  created_at timestamptz not null default now()
);

alter table public.leads add column if not exists website text;
alter table public.leads add column if not exists source text;
alter table public.leads add column if not exists budget text;
alter table public.leads add column if not exists service text;
alter table public.leads add column if not exists message text;

create table if not exists public.landing_page_leads (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references public.leads(id) on delete set null,
  landing       text not null default 'google-meta-ads',
  name          text,
  email         text,
  phone         text,
  company       text,
  location      text,
  business_type text,
  budget        text,
  website       text,
  answers       jsonb,
  utm           jsonb,
  status        text not null default 'new',
  created_at    timestamptz not null default now()
);

alter table public.landing_page_leads add column if not exists website text;
alter table public.landing_page_leads add column if not exists answers jsonb;

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists landing_page_leads_created_idx on public.landing_page_leads (created_at desc);
create index if not exists landing_page_leads_status_idx on public.landing_page_leads (status);

alter table public.leads enable row level security;
alter table public.landing_page_leads enable row level security;

grant usage on schema public to service_role;
grant select, insert, update on public.leads, public.landing_page_leads to service_role;
