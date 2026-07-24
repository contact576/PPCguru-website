-- ============================================================================
-- PPC Guru — per-page SEO meta overrides (edited at /admin/meta)
-- Run this once in the Supabase SQL editor. Idempotent — safe to re-run.
-- Depends on public.touch_updated_at() (created in schema.sql).
-- ============================================================================

create table if not exists public.page_meta (
  path        text primary key,   -- normalized route, e.g. "/", "/services/google-ads"
  title       text,               -- <title> override (null/empty = use the page default)
  description text,               -- meta description override
  keywords    text,               -- comma-separated keywords override
  noindex     boolean not null default false,
  updated_at  timestamptz not null default now()
);

-- Only ever read/written with the service role (server side) — no anon policy.
alter table public.page_meta enable row level security;

drop trigger if exists page_meta_touch on public.page_meta;
create trigger page_meta_touch before update on public.page_meta
for each row execute function public.touch_updated_at();
