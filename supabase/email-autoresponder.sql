-- Durable, atomic 24-hour recipient cooldown for optional form receipts.
-- Run before deploying the email hardening change. No lead rows are changed.
create table if not exists public.lead_autoresponder_claims (
  email text primary key,
  claimed_at timestamptz not null default now()
);

alter table public.lead_autoresponder_claims enable row level security;
revoke all on public.lead_autoresponder_claims from public, anon, authenticated;
grant select, insert, update on public.lead_autoresponder_claims to service_role;

create or replace function public.claim_lead_autoresponder(recipient text)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare claimed boolean;
begin
  if recipient is null or length(trim(recipient)) = 0 then
    return false;
  end if;
  insert into public.lead_autoresponder_claims (email, claimed_at)
  values (lower(trim(recipient)), now())
  on conflict (email) do update set claimed_at = excluded.claimed_at
    where public.lead_autoresponder_claims.claimed_at <= now() - interval '24 hours'
  returning true into claimed;
  return coalesce(claimed, false);
end;
$$;

revoke all on function public.claim_lead_autoresponder(text) from public, anon, authenticated;
grant execute on function public.claim_lead_autoresponder(text) to service_role;
