-- ClosingLine — initial schema
-- Run in Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────────────
create type specialty as enum ('residential', 'commercial', 'luxury', 'rental');
create type template_category as enum (
  'buyer_followup', 'listing', 'negotiation', 'open_house',
  'price_reduction', 'closing', 'cold_outreach'
);
create type plan_type as enum ('trial', 'pro');
create type sub_status as enum ('active', 'canceled', 'past_due');

-- ── updated_at helper ─────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ──────────────────────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  brokerage_name text,
  specialty specialty default 'residential',
  signature_block text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  insert into public.subscriptions (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── templates (system-seeded, public read) ────────────────────────────────────
create table templates (
  id uuid primary key default gen_random_uuid(),
  category template_category not null,
  title text not null,
  prompt_structure text not null,
  placeholder_fields jsonb not null default '[]'::jsonb,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── custom_templates ──────────────────────────────────────────────────────────
create table custom_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  based_on_template_id uuid references templates(id) on delete set null,
  title text not null,
  category template_category not null,
  prompt_structure text not null,
  placeholder_fields jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index custom_templates_user_idx on custom_templates(user_id);
create trigger custom_templates_updated_at
  before update on custom_templates
  for each row execute function set_updated_at();

-- ── generated_emails ──────────────────────────────────────────────────────────
create table generated_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  template_id uuid references templates(id) on delete set null,
  custom_template_id uuid references custom_templates(id) on delete set null,
  category template_category not null,
  input_values jsonb not null default '{}'::jsonb,
  generated_text text not null,
  created_at timestamptz not null default now()
);
create index generated_emails_user_idx on generated_emails(user_id, created_at desc);

-- ── subscriptions ─────────────────────────────────────────────────────────────
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan plan_type not null default 'trial',
  status sub_status not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table templates enable row level security;
alter table custom_templates enable row level security;
alter table generated_emails enable row level security;
alter table subscriptions enable row level security;

-- profiles: owner-only
create policy profiles_select_own on profiles
  for select using (auth.uid() = id);
create policy profiles_insert_own on profiles
  for insert with check (auth.uid() = id);
create policy profiles_update_own on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- templates: readable by any authenticated user
create policy templates_read_all on templates
  for select to authenticated using (true);

-- custom_templates: owner-only (full CRUD)
create policy custom_templates_all_own on custom_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- generated_emails: owner reads + inserts (writes also done by Edge Function)
create policy generated_emails_select_own on generated_emails
  for select using (auth.uid() = user_id);
create policy generated_emails_insert_own on generated_emails
  for insert with check (auth.uid() = user_id);

-- subscriptions: owner reads only; writes happen via service role (Stripe webhook)
create policy subscriptions_select_own on subscriptions
  for select using (auth.uid() = user_id);
