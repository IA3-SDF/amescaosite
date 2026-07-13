-- ==========================================
-- SUPABASE MIGRATION: USER CONSENTS (RGPD)
-- ==========================================

-- 0) Extension UUID (si nécessaire)
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1) TABLE
-- ==========================================

create table if not exists public.user_consents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  analytics boolean default false,
  marketing boolean default false,
  preferences boolean default true,

  consent_version text not null default '1.0',
  ip_address inet,
  user_agent text,
  accepted_at timestamp default now(),
  created_at timestamp default now(),

  constraint one_consent_per_user unique(user_id)
);

-- ==========================================
-- 2) INDEXES
-- ==========================================

-- ==========================================
-- 2) INDEXES
-- ==========================================

create index if not exists idx_user_consents_user_id
  on public.user_consents(user_id);

create index if not exists idx_user_consents_accepted_at
  on public.user_consents(accepted_at);

create index if not exists idx_user_consents_created_at
  on public.user_consents(created_at);
-- ==========================================
-- 3) ENABLE RLS
-- ==========================================

alter table public.user_consents enable row level security;

-- (optionnel) éviter toute politique implicite
alter table public.user_consents force row level security;

-- ==========================================
-- 4) RLS POLICIES
-- ==========================================

drop policy if exists "Users can insert their own consent" on public.user_consents;
create policy "Users can insert their own consent"
  on public.user_consents
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own consent" on public.user_consents;
create policy "Users can read their own consent"
  on public.user_consents
  for select
  using (auth.uid() = user_id);

drop policy if exists "Admins can read all consents" on public.user_consents;
create policy "Admins can read all consents"
  on public.user_consents
  for select
  using (
    exists (
      select 1
      from public.profiles
      where public.profiles.id = auth.uid()
        and public.profiles.role = 'admin'
    )
  );

-- Empêcher UPDATE
drop policy if exists "No updates allowed" on public.user_consents;
create policy "No updates allowed"
  on public.user_consents
  for update
  using (false)
  with check (false);

-- Empêcher DELETE
drop policy if exists "No deletes allowed" on public.user_consents;
create policy "No deletes allowed"
  on public.user_consents
  for delete
  using (false);

-- ==========================================
-- 5) TRIGGER AUTO-REPLACE
-- ==========================================
-- But: si un user insère à nouveau, on remplace son consentement précédent
-- (sinon contrainte UNIQUE(user_id) ferait échouer)

drop trigger if exists trigger_replace_user_consent on public.user_consents;
drop function if exists public.replace_user_consent();

create or replace function public.replace_user_consent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Important : le trigger est défini avec SECURITY DEFINER
  -- pour permettre le DELETE interne malgré les RLS.
  delete from public.user_consents
  where user_id = new.user_id
    and id != new.id;

  return new;
end;
$$;

create trigger trigger_replace_user_consent
after insert on public.user_consents
for each row
execute function public.replace_user_consent();

-- ==========================================
-- 6) ANALYTICS VIEWS
-- ==========================================

drop view if exists public.consent_analytics cascade;
create view public.consent_analytics as
select
  count(*) as total_consents,
  round(100.0 * sum(case when analytics then 1 else 0 end) / nullif(count(*), 0), 2) as analytics_consent_rate,
  round(100.0 * sum(case when marketing then 1 else 0 end) / nullif(count(*), 0), 2) as marketing_consent_rate,
  round(100.0 * sum(case when preferences then 1 else 0 end) / nullif(count(*), 0), 2) as preferences_consent_rate,
  date(accepted_at) as date
from public.user_consents
group by date(accepted_at)
order by date desc;

drop view if exists public.consent_daily_breakdown cascade;
create view public.consent_daily_breakdown as
select
  date(accepted_at) as date,
  count(*) as total_new_consents,
  sum(case when analytics then 1 else 0 end) as analytics_count,
  sum(case when marketing then 1 else 0 end) as marketing_count,
  sum(case when preferences then 1 else 0 end) as preferences_count
from public.user_consents
group by date(accepted_at)
order by date desc;

-- ==========================================
-- 7) VERIFICATIONS
-- ==========================================

-- Table existe ?
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name = 'user_consents';

-- Index
select indexname
from pg_indexes
where schemaname = 'public'
  and tablename = 'user_consents'
order by indexname;

-- RLS
select schemaname, tablename, rowsecurity
from pg_tables
where tablename = 'user_consents';

-- Policies
select policyname
from pg_policies
where schemaname = 'public'
  and tablename = 'user_consents'
order by policyname;

-- ==========================================
-- 8) GRANTS
-- ==========================================
-- ⚠️ Avec RLS, les GRANTS ne remplacent pas les policies.
-- Ils restent utiles pour les rôles côté auth.

grant select, insert on public.user_consents to authenticated;
-- service_role n'est pas un rôle "user" en SQL standard, mais dans Supabase c'est généralement OK.
grant all on public.user_consents to service_role;