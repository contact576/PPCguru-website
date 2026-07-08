-- ============================================================================
-- PPC Guru — visitor / event tracking table
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- Powers /api/track (first-party, consent-aware analytics). No third parties.
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.visitor_events (
  id          uuid primary key default gen_random_uuid(),
  session_id  text,          -- first-party anonymous id (localStorage), NOT a person
  event       text not null, -- 'pageview' | 'click' | 'cta_click' | 'popup_submit' | ...
  path        text,
  referrer    text,
  target      text,          -- label of the clicked button/link
  utm         jsonb,         -- {utm_source, utm_medium, gclid, fbclid, ...}
  ip          text,          -- stored ONLY when the visitor accepted cookies
  country     text,
  region      text,
  city        text,
  ua          text,          -- user-agent, consent-gated
  lead_id     uuid references public.leads(id) on delete set null, -- linked once they submit a form
  created_at  timestamptz not null default now()
);

create index if not exists visitor_events_session_idx on public.visitor_events (session_id, created_at desc);
create index if not exists visitor_events_created_idx on public.visitor_events (created_at desc);

-- Only the service role (server) may read/write. No anon policies on purpose.
alter table public.visitor_events enable row level security;
