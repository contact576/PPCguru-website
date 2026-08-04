-- ============================================================================
-- PPC Guru — visitor identity stitching + behavioural journeys
-- Run ONCE in the Supabase SQL editor (Dashboard → SQL → New query),
-- AFTER supabase/visitor-tracking.sql (this builds on `visitor_events`).
--
-- WHAT THIS ENABLES
--   Anonymous browsing is recorded against a first-party device id (`ppcg_sid`).
--   The moment that person hands over an email on ANY form, every past and
--   future event from that device is stitched onto their lead record — and,
--   because people switch phone → laptop, every OTHER device that has ever
--   submitted the same email is merged in too.
--   Return visits by a known lead then fire journey emails (lib/journeys.ts).
--
--   No third-party identity graph is involved. We only ever know who someone is
--   because THEY told us, by submitting a form. See /privacy.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── 1. Device → person mapping ──────────────────────────────────────────────
-- One row per browser/device (session_id). `email` is the merge key across
-- devices; `lead_id` points at the most recent lead row for that person.
create table if not exists public.visitor_identities (
  session_id   text primary key,
  lead_id      uuid references public.leads(id) on delete set null,
  email        text not null,
  name         text,
  first_seen   timestamptz not null default now(),
  identified_at timestamptz not null default now(),
  last_seen    timestamptz not null default now(),
  -- Set by the one-click unsubscribe link carried on every journey email.
  -- Non-null = we never send this person an automated email again (CASL).
  -- Applied across ALL their devices, not just the one they clicked from.
  unsubscribed_at timestamptz
);

-- Existing installs: add the opt-out column without touching data.
alter table public.visitor_identities
  add column if not exists unsubscribed_at timestamptz;

-- The cross-device merge lookup: "which other devices belong to this email?"
create index if not exists visitor_identities_email_idx
  on public.visitor_identities (lower(email));
create index if not exists visitor_identities_lead_idx
  on public.visitor_identities (lead_id);
create index if not exists visitor_identities_last_seen_idx
  on public.visitor_identities (last_seen desc);

-- ── 2. Journey send log ─────────────────────────────────────────────────────
-- Every automated email we fire is logged here. This is the frequency cap:
-- lib/journeys.ts refuses to send a journey to a person whose last send of the
-- same journey is inside its cooldown, so a refresh-happy visitor can never be
-- mailed twice. Also the audit trail for CASL ("what did we send, and why").
create table if not exists public.journey_sends (
  id         uuid primary key default gen_random_uuid(),
  journey    text not null,             -- 'return_visit' | 'high_intent' | 'sales_alert:*'
  lead_id    uuid references public.leads(id) on delete cascade,
  email      text not null,
  path       text,                      -- the page that triggered it
  meta       jsonb,                     -- rule detail (hit counts, days away, …)
  created_at timestamptz not null default now()
);

-- Cooldown lookup: newest send of journey X for person Y.
create index if not exists journey_sends_lookup_idx
  on public.journey_sends (lower(email), journey, created_at desc);
create index if not exists journey_sends_created_idx
  on public.journey_sends (created_at desc);

-- ── 3. visitor_events: make the identified reads fast ───────────────────────
-- `lead_id` already exists (visitor-tracking.sql) but was never written to and
-- never indexed. The People view and every journey rule filter on it.
create index if not exists visitor_events_lead_idx
  on public.visitor_events (lead_id, created_at desc);

-- Back-fill helper for the stitch: "all rows for this device with no owner yet".
create index if not exists visitor_events_session_unowned_idx
  on public.visitor_events (session_id)
  where lead_id is null;

-- ── 4. Lock down ────────────────────────────────────────────────────────────
-- Service role only, matching visitor_events. No anon policies on purpose:
-- nothing here should ever be reachable from the browser.
alter table public.visitor_identities enable row level security;
alter table public.journey_sends      enable row level security;
