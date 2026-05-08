-- ============================================================
--  Smart QR Profile Hub — Supabase SQL Schema  (FULL RESET)
--  Paste into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── Drop existing tables (clean slate) ──────────────────────
drop table if exists public.scan_events  cascade;
drop table if exists public.qr_codes     cascade;
drop table if exists public.social_links cascade;
drop table if exists public.companies    cascade;
drop table if exists public.profiles     cascade;

drop function if exists public.handle_updated_at()  cascade;
drop function if exists public.increment_scan_count(text) cascade;

-- ── 1. PROFILES ─────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  slug          text unique not null,
  full_name     text not null,
  tagline       text,
  bio           text,
  profile_image text,
  theme         jsonb not null default '{
    "primaryColor":   "#6366f1",
    "secondaryColor": "#8b5cf6",
    "backgroundColor":"#0f0f1a",
    "buttonColor":    "#6366f1",
    "textColor":      "#ffffff",
    "cardStyle":      "rounded",
    "fontStyle":      "modern",
    "darkMode":       true
  }'::jsonb,
  is_public     boolean not null default true,
  scan_count    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── 2. COMPANIES ─────────────────────────────────────────────
create table public.companies (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  name        text not null,
  tagline     text,
  logo        text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── 3. SOCIAL LINKS ──────────────────────────────────────────
create table public.social_links (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references public.companies(id) on delete cascade not null,
  platform    text not null,
  label       text,
  url         text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── 4. QR CODES ──────────────────────────────────────────────
create table public.qr_codes (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid references public.profiles(id) on delete cascade not null,
  url              text not null,
  foreground_color text not null default '#ffffff',
  background_color text not null default '#0f0f1a',
  style            text not null default 'classic',
  created_at       timestamptz not null default now()
);

-- ── 5. SCAN EVENTS ───────────────────────────────────────────
create table public.scan_events (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  scanned_at  timestamptz not null default now(),
  user_agent  text,
  ip_hash     text
);

-- ── INDEXES ──────────────────────────────────────────────────
create index idx_profiles_user_id    on public.profiles(user_id);
create index idx_profiles_slug       on public.profiles(slug);
create index idx_companies_profile   on public.companies(profile_id);
create index idx_social_links_company on public.social_links(company_id);
create index idx_qr_codes_profile    on public.qr_codes(profile_id);
create index idx_scan_events_profile on public.scan_events(profile_id);

-- ── AUTO updated_at ──────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ── ATOMIC SCAN INCREMENT ────────────────────────────────────
create or replace function public.increment_scan_count(p_slug text)
returns void language plpgsql security definer as $$
begin
  update public.profiles set scan_count = scan_count + 1 where slug = p_slug;
end;
$$;

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.companies    enable row level security;
alter table public.social_links enable row level security;
alter table public.qr_codes     enable row level security;
alter table public.scan_events  enable row level security;

-- profiles
create policy "Public profiles viewable by anyone"
  on public.profiles for select using (is_public = true);

create policy "Owners can read own profiles"
  on public.profiles for select using (auth.uid() = user_id);

create policy "Owners can insert profiles"
  on public.profiles for insert with check (auth.uid() = user_id);

create policy "Owners can update profiles"
  on public.profiles for update using (auth.uid() = user_id);

create policy "Owners can delete profiles"
  on public.profiles for delete using (auth.uid() = user_id);

-- companies  ← FIXED: use profile_id to join to profiles.user_id
create policy "Companies readable if profile public or owner"
  on public.companies for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id
        and (p.is_public = true or p.user_id = auth.uid())
    )
  );

create policy "Owners can insert companies"
  on public.companies for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

create policy "Owners can update companies"
  on public.companies for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

create policy "Owners can delete companies"
  on public.companies for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

-- social_links
create policy "Social links readable if profile public or owner"
  on public.social_links for select
  using (
    exists (
      select 1 from public.companies c
      join public.profiles p on p.id = c.profile_id
      where c.id = company_id
        and (p.is_public = true or p.user_id = auth.uid())
    )
  );

create policy "Owners can insert social links"
  on public.social_links for insert
  with check (
    exists (
      select 1 from public.companies c
      join public.profiles p on p.id = c.profile_id
      where c.id = company_id and p.user_id = auth.uid()
    )
  );

create policy "Owners can update social links"
  on public.social_links for update
  using (
    exists (
      select 1 from public.companies c
      join public.profiles p on p.id = c.profile_id
      where c.id = company_id and p.user_id = auth.uid()
    )
  );

create policy "Owners can delete social links"
  on public.social_links for delete
  using (
    exists (
      select 1 from public.companies c
      join public.profiles p on p.id = c.profile_id
      where c.id = company_id and p.user_id = auth.uid()
    )
  );

-- qr_codes
create policy "QR codes readable if profile public or owner"
  on public.qr_codes for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id
        and (p.is_public = true or p.user_id = auth.uid())
    )
  );

create policy "Owners can manage QR codes"
  on public.qr_codes for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

-- scan_events
create policy "Anyone can record a scan"
  on public.scan_events for insert with check (true);

create policy "Owners can read own scan events"
  on public.scan_events for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );
