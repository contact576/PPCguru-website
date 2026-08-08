-- ============================================================================
-- PPC Guru — Supabase schema (blog CMS + lead capture)
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ── Blog posts ──────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  description  text default '',
  category     text default 'Marketing',
  author       text default 'PPC Guru',
  content      text not null default '',
  cover_image  text,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_idx on public.posts (published, published_at desc);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
for each row execute function public.touch_updated_at();

-- ── Leads (every form submission is mirrored here) ───────────────────────────
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  phone      text,
  company    text,
  website    text,
  source     text,          -- e.g. "popup:audit", "contact", "tool:roas-calculator"
  budget     text,
  service    text,
  message    text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

-- ── Visitor / interaction events (first-party analytics; see /api/track) ─────
create table if not exists public.visitor_events (
  id          uuid primary key default gen_random_uuid(),
  session_id  text,
  event       text not null,
  path        text,
  referrer    text,
  target      text,
  utm         jsonb,
  ip          text,          -- stored only when the visitor accepted cookies
  country     text,
  region      text,
  city        text,
  ua          text,
  lead_id     uuid references public.leads(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists visitor_events_session_idx on public.visitor_events (session_id, created_at desc);
create index if not exists visitor_events_created_idx on public.visitor_events (created_at desc);

-- ── CMS settings (single-row JSON blob, edited at /admin/settings) ───────────
create table if not exists public.app_settings (
  id         int primary key default 1,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint app_settings_singleton check (id = 1)
);

-- ── Per-page SEO meta overrides (edited at /admin/meta) ──────────────────────
create table if not exists public.page_meta (
  path        text primary key,   -- normalized route, e.g. "/", "/services/google-ads"
  title       text,
  description text,
  keywords    text,               -- comma-separated
  noindex     boolean not null default false,
  updated_at  timestamptz not null default now()
);

drop trigger if exists page_meta_touch on public.page_meta;
create trigger page_meta_touch before update on public.page_meta
for each row execute function public.touch_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
-- The app only ever talks to these tables with the SERVICE ROLE key (server
-- side), which bypasses RLS. We still enable RLS and add a public read policy
-- for published posts in case you later read from the browser with the anon key.
alter table public.posts enable row level security;
alter table public.leads enable row level security;
-- No anon policies on app_settings / visitor_events → only the service role reads/writes.
alter table public.app_settings enable row level security;
alter table public.visitor_events enable row level security;
-- No anon policies on page_meta → only the service role reads/writes overrides.
alter table public.page_meta enable row level security;

drop policy if exists "public can read published posts" on public.posts;
create policy "public can read published posts"
  on public.posts for select
  using (published = true);

-- No anon policies on leads → only the service role can read/write them.

-- ── Storage bucket for blog images ───────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Allow public read of blog images (writes happen via the service role).
drop policy if exists "public read blog images" on storage.objects;
create policy "public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');
