-- Author commerce scaffold for Curls & Contemplation.
create extension if not exists pgcrypto;

create table if not exists profiles (id uuid primary key references auth.users(id) on delete cascade, email text unique, full_name text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists products (id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, status text default 'draft', metadata jsonb default '{}', created_at timestamptz default now());
create table if not exists prices (id uuid primary key default gen_random_uuid(), product_id uuid references products(id), stripe_price_id text unique, nickname text, amount_cents integer not null, currency text default 'usd', active boolean default false, created_at timestamptz default now());
create table if not exists orders (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), email text, stripe_checkout_session_id text unique, stripe_payment_intent_id text, status text default 'pending', amount_cents integer, currency text default 'usd', metadata jsonb default '{}', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists purchases (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), order_id uuid references orders(id), book_slug text not null, entitlement_status text default 'active', download_count integer default 0, refunded_at timestamptz, revoked_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists download_tokens (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), purchase_id uuid references purchases(id), deliverable_slug text not null, token_hash text not null, expires_at timestamptz not null, used_at timestamptz, created_at timestamptz default now());
create table if not exists download_events (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), purchase_id uuid references purchases(id), deliverable_slug text, event_type text not null, metadata jsonb default '{}', created_at timestamptz default now());
create table if not exists bonus_claims (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), email text not null, status text default 'started', note text, metadata jsonb default '{}', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists subscribers (id uuid primary key default gen_random_uuid(), email text unique not null, status text default 'active', source text, consent_state jsonb default '{}', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists subscriber_events (id uuid primary key default gen_random_uuid(), subscriber_id uuid references subscribers(id), email text, event_type text not null, provider text, metadata jsonb default '{}', created_at timestamptz default now());
create table if not exists consent_log (id uuid primary key default gen_random_uuid(), email text, user_id uuid references auth.users(id), consent_state jsonb default '{}', ip_hash text, created_at timestamptz default now());
create table if not exists webhook_events (id uuid primary key default gen_random_uuid(), provider text not null, provider_event_id text unique not null, event_type text not null, payload jsonb default '{}', processed_at timestamptz, created_at timestamptz default now());
create table if not exists analytics_events (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), anonymous_id text, event_name text not null, route text, source text, metadata jsonb default '{}', created_at timestamptz default now());
create table if not exists gate_ledger (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), gate_name text not null, decision text not null, reason text, metadata jsonb default '{}', created_at timestamptz default now());
create table if not exists admin_users (id uuid primary key default gen_random_uuid(), user_id uuid unique references auth.users(id), email text unique not null, role text default 'admin', created_at timestamptz default now());
create table if not exists memberships (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), status text default 'placeholder', stripe_subscription_id text, metadata jsonb default '{}', created_at timestamptz default now());
create table if not exists membership_events (id uuid primary key default gen_random_uuid(), membership_id uuid references memberships(id), event_type text not null, metadata jsonb default '{}', created_at timestamptz default now());

alter table profiles enable row level security;
alter table products enable row level security;
alter table prices enable row level security;
alter table orders enable row level security;
alter table purchases enable row level security;
alter table download_tokens enable row level security;
alter table download_events enable row level security;
alter table bonus_claims enable row level security;
alter table subscribers enable row level security;
alter table subscriber_events enable row level security;
alter table consent_log enable row level security;
alter table webhook_events enable row level security;
alter table analytics_events enable row level security;
alter table gate_ledger enable row level security;
alter table admin_users enable row level security;
alter table memberships enable row level security;
alter table membership_events enable row level security;

create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "purchases_select_own" on purchases for select using (auth.uid() = user_id);
create policy "download_tokens_select_own_metadata" on download_tokens for select using (auth.uid() = user_id);
create policy "download_events_select_own" on download_events for select using (auth.uid() = user_id);
create policy "bonus_claims_select_own" on bonus_claims for select using (auth.uid() = user_id);
create policy "memberships_select_own_placeholder" on memberships for select using (auth.uid() = user_id);

-- Service-role writes bypass RLS for Stripe webhooks, order creation, entitlement revocation, download signing, and analytics inserts.
-- Admin intent: app routes must check ADMIN_EMAILS and/or rows in admin_users before exposing orders, subscribers, claims, content, or analytics.
-- Customers must not receive direct table policies that expose other customer records.
