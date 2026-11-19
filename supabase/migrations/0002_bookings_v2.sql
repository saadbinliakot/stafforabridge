-- ============================================================================
-- NOVALINK — Bookings v2 migration
-- Adds the canonical bookings schema required for the production booking engine.
-- Run via: supabase db push  (or psql against your Postgres instance)
--
-- This migration:
--   1. Drops the placeholder bookings table from 0001_init.sql
--   2. Creates the new bookings table with the full canonical schema
--   3. Re-applies RLS policies matching the new structure
-- ============================================================================

-- Drop the old placeholder table (it had no real data in it — it was only
-- populated by the legacy submissions.ts mirror write, which is now removed).
drop table if exists bookings cascade;

-- ----------------------------------------------------------------------------
-- BOOKINGS — canonical booking record
-- Tracks every outsourcing role/service booking submitted via the booking form.
-- user_id is nullable to support guest (unauthenticated) checkouts.
-- ----------------------------------------------------------------------------
create table bookings (
  id                uuid        primary key default uuid_generate_v4(),
  user_id           uuid        references auth.users (id) on delete set null,
  service_type      text        not null,
  booking_date      timestamptz not null,
  contact_name      text        not null,
  contact_email     text        not null,
  contact_phone     text        not null,
  status            text        not null default 'pending',
  created_at        timestamptz not null default now()
);

-- Useful index for admin dashboard queries (filter by status, sort by date)
create index bookings_status_idx  on bookings (status);
create index bookings_user_id_idx on bookings (user_id);
create index bookings_created_at_idx on bookings (created_at desc);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table bookings enable row level security;

-- 1. Anyone (anon or authenticated) can insert a booking.
--    Authenticated users have user_id set automatically; guests leave it null.
create policy "public can insert bookings"
  on bookings for insert
  with check (true);

-- 2. Authenticated users can read only their own bookings.
create policy "auth users can read own bookings"
  on bookings for select
  using (auth.uid() = user_id);

-- 3. Admins can read and manage ALL bookings.
--    is_admin() is defined in 0001_init.sql (queries profiles.role = 'admin').
create policy "admin can read all bookings"
  on bookings for select
  using (is_admin());

create policy "admin can update bookings"
  on bookings for update
  using (is_admin());

create policy "admin can delete bookings"
  on bookings for delete
  using (is_admin());


-- health insurance portability and accountability act of 1996