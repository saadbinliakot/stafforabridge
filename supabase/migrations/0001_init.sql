-- ============================================================================
-- NOVALINK — Initial schema migration
-- Run via: supabase db push  (or psql against your Postgres instance)
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
create type user_role as enum ('admin', 'content_editor', 'recruiter', 'client', 'client_member', 'staff');
create type content_status as enum ('draft', 'published', 'archived');
create type consultation_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type booking_status as enum ('requested', 'confirmed', 'cancelled', 'completed');
create type application_status as enum ('submitted', 'under_review', 'interviewing', 'rejected', 'hired');
create type organization_member_role as enum ('admin', 'operations_manager', 'billing_manager', 'staff_member');
create type preferred_contact_method as enum ('email', 'phone');

-- ----------------------------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role user_role not null default 'client',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ORGANIZATIONS (B2B account model)
-- ----------------------------------------------------------------------------
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  country text,
  organization_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  role organization_member_role not null default 'staff_member',
  created_at timestamptz not null default now(),
  unique (organization_id, profile_id)
);

-- ----------------------------------------------------------------------------
-- SERVICES
-- ----------------------------------------------------------------------------
create table service_categories (
  slug text primary key,
  name text not null,
  description text,
  sort_order int not null default 0,
  status content_status not null default 'published'
);

create table services (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  category_slug text not null references service_categories (slug),
  short_description text not null,
  problems_solved text[] not null default '{}',
  typical_workflows text[] not null default '{}',
  what_novalink_handles text[] not null default '{}',
  who_it_is_for text[] not null default '{}',
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- INDUSTRIES
-- ----------------------------------------------------------------------------
create table industries (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text not null,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- LEADS (lightweight, generated from any conversion point)
-- ----------------------------------------------------------------------------
create table leads (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  full_name text not null,
  work_email text not null,
  company text,
  country text,
  organization_type text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- CONTACT MESSAGES
-- ----------------------------------------------------------------------------
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  work_email text not null,
  company text not null,
  job_title text,
  country text not null,
  phone text,
  organization_type text not null,
  interested_services text[] not null default '{}',
  message text not null,
  preferred_contact_method preferred_contact_method not null default 'email',
  consent boolean not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- CONSULTATION REQUESTS + BOOKING SLOTS / BOOKINGS
-- ----------------------------------------------------------------------------
create table consultation_requests (
  id uuid primary key default uuid_generate_v4(),
  preferred_date date not null,
  preferred_time text not null,
  timezone text not null,
  full_name text not null,
  work_email text not null,
  company text not null,
  country text not null,
  organization_type text not null,
  interested_services text[] not null default '{}',
  message text,
  consent boolean not null,
  status consultation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reserved for a future real calendar integration. Left empty/unused in
-- Phase 1, where BookingPanel renders mock slots client-side.
create table booking_slots (
  id uuid primary key default uuid_generate_v4(),
  slot_date date not null,
  slot_time text not null,
  timezone text not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (slot_date, slot_time, timezone)
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  consultation_request_id uuid references consultation_requests (id) on delete cascade,
  booking_slot_id uuid references booking_slots (id),
  requested_date date not null,
  requested_time text not null,
  timezone text not null,
  status booking_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- JOBS + APPLICATIONS
-- ----------------------------------------------------------------------------
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  category text not null,
  location text not null,
  employment_type text not null,
  summary text not null,
  description text,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table job_applications (
  id uuid primary key default uuid_generate_v4(),
  job_slug text not null references jobs (slug),
  full_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  relevant_experience text not null,
  cover_letter text,
  resume_storage_path text,
  consent boolean not null,
  status application_status not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- GENERIC PRIVATE DOCUMENTS (future client-shared files, etc.)
-- ----------------------------------------------------------------------------
create table documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations (id) on delete cascade,
  uploaded_by uuid references profiles (id),
  storage_path text not null,
  label text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- CASE STUDIES / TESTIMONIALS / FAQS / ARTICLES
-- ----------------------------------------------------------------------------
create table case_studies (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  industry text not null,
  challenge text not null,
  workflow text not null,
  approach text not null,
  operational_impact text not null,
  metrics text[] not null default '{}',
  quote text,
  is_placeholder boolean not null default true,
  published_status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  company text not null,
  quote text not null,
  industry text,
  is_placeholder boolean not null default true,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  category text not null,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table article_categories (
  slug text primary key,
  name text not null
);

create table articles (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  category_slug text references article_categories (slug),
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- SITE SETTINGS (editable compliance statements, contact info, etc.)
-- ----------------------------------------------------------------------------
create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- CONSENT RECORDS + AUDIT LOGS
-- ----------------------------------------------------------------------------
create table consent_records (
  id uuid primary key default uuid_generate_v4(),
  subject_email text not null,
  consent_type text not null,
  source text not null,
  consented_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles (id),
  action text not null,
  target_table text,
  target_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','organizations','services','industries','consultation_requests',
    'bookings','jobs','job_applications','case_studies','testimonials','faqs','articles'
  ]
  loop
    execute format('create trigger set_updated_at before update on %I for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- New-user trigger: create profile + organization on signup
-- ----------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
begin
  insert into profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'client');

  insert into organizations (name)
  values (coalesce(new.raw_user_meta_data ->> 'organization_name', 'New Organization'))
  returning id into new_org_id;

  insert into organization_members (organization_id, profile_id, role)
  values (new_org_id, new.id, 'admin');

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table profiles enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table industries enable row level security;
alter table leads enable row level security;
alter table contact_messages enable row level security;
alter table consultation_requests enable row level security;
alter table booking_slots enable row level security;
alter table bookings enable row level security;
alter table jobs enable row level security;
alter table job_applications enable row level security;
alter table documents enable row level security;
alter table case_studies enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table article_categories enable row level security;
alter table articles enable row level security;
alter table site_settings enable row level security;
alter table consent_records enable row level security;
alter table audit_logs enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ---- Public read access to published marketing content ----
create policy "public read published service_categories" on service_categories for select using (status = 'published');
create policy "public read published services" on services for select using (status = 'published');
create policy "public read published industries" on industries for select using (status = 'published');
create policy "public read published case_studies" on case_studies for select using (published_status = 'published');
create policy "public read published testimonials" on testimonials for select using (published = true);
create policy "public read published faqs" on faqs for select using (published = true);
create policy "public read article_categories" on article_categories for select using (true);
create policy "public read published articles" on articles for select using (status = 'published');
create policy "public read jobs" on jobs for select using (status = 'published');
create policy "public read site_settings" on site_settings for select using (true);

-- Admin-only write access to content tables
create policy "admin write service_categories" on service_categories for all using (is_admin()) with check (is_admin());
create policy "admin write services" on services for all using (is_admin()) with check (is_admin());
create policy "admin write industries" on industries for all using (is_admin()) with check (is_admin());
create policy "admin write case_studies" on case_studies for all using (is_admin()) with check (is_admin());
create policy "admin write testimonials" on testimonials for all using (is_admin()) with check (is_admin());
create policy "admin write faqs" on faqs for all using (is_admin()) with check (is_admin());
create policy "admin write articles" on articles for all using (is_admin()) with check (is_admin());
create policy "admin write article_categories" on article_categories for all using (is_admin()) with check (is_admin());
create policy "admin write jobs" on jobs for all using (is_admin()) with check (is_admin());
create policy "admin write site_settings" on site_settings for all using (is_admin()) with check (is_admin());

-- ---- Public INSERT-only forms: anyone can submit, nobody but admin can read ----
create policy "anyone can submit leads" on leads for insert with check (true);
create policy "admin can read leads" on leads for select using (is_admin());

create policy "anyone can submit contact_messages" on contact_messages for insert with check (true);
create policy "admin can read contact_messages" on contact_messages for select using (is_admin());

create policy "anyone can submit consultation_requests" on consultation_requests for insert with check (true);
create policy "admin can read consultation_requests" on consultation_requests for select using (is_admin());
create policy "admin can update consultation_requests" on consultation_requests for update using (is_admin());

create policy "public read available booking_slots" on booking_slots for select using (is_available = true);
create policy "admin manage booking_slots" on booking_slots for all using (is_admin()) with check (is_admin());

create policy "anyone can create bookings" on bookings for insert with check (true);
create policy "admin can read bookings" on bookings for select using (is_admin());
create policy "admin can update bookings" on bookings for update using (is_admin());

create policy "anyone can submit job_applications" on job_applications for insert with check (true);
create policy "admin/recruiter can read job_applications" on job_applications for select using (
  is_admin() or exists (select 1 from profiles where id = auth.uid() and role = 'recruiter')
);
create policy "admin/recruiter can update job_applications" on job_applications for update using (
  is_admin() or exists (select 1 from profiles where id = auth.uid() and role = 'recruiter')
);

create policy "anyone can record consent" on consent_records for insert with check (true);
create policy "admin can read consent_records" on consent_records for select using (is_admin());

-- ---- Profiles ----
create policy "users can read own profile" on profiles for select using (auth.uid() = id);
create policy "users can update own profile" on profiles for update using (auth.uid() = id);
create policy "admin can read all profiles" on profiles for select using (is_admin());

-- ---- Organizations: members can access only their own organization ----
create policy "members can read own organization" on organizations for select using (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = organizations.id
      and organization_members.profile_id = auth.uid()
  )
);
create policy "admin can read all organizations" on organizations for select using (is_admin());
create policy "admin can manage organizations" on organizations for all using (is_admin()) with check (is_admin());

create policy "members can read own membership rows" on organization_members for select using (
  profile_id = auth.uid()
  or exists (
    select 1 from organization_members om2
    where om2.organization_id = organization_members.organization_id
      and om2.profile_id = auth.uid()
  )
);
create policy "admin can manage organization_members" on organization_members for all using (is_admin()) with check (is_admin());

-- ---- Documents: private by default, scoped to organization membership ----
create policy "members can read own org documents" on documents for select using (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = documents.organization_id
      and organization_members.profile_id = auth.uid()
  )
);
create policy "admin can manage documents" on documents for all using (is_admin()) with check (is_admin());

-- ---- Audit logs: admin only ----
create policy "admin can read audit_logs" on audit_logs for select using (is_admin());
create policy "admin can write audit_logs" on audit_logs for insert with check (is_admin());

-- ============================================================================
-- STORAGE BUCKETS (private)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('private_documents', 'private_documents', false)
on conflict (id) do nothing;

-- Anyone (including anonymous applicants) can upload a resume, but nobody
-- can read/list the bucket publicly — only admins/recruiters via the
-- service-role client or an authenticated admin/recruiter session.
create policy "anyone can upload resumes" on storage.objects for insert
  with check (bucket_id = 'resumes');

create policy "admin/recruiter can read resumes" on storage.objects for select using (
  bucket_id = 'resumes' and (is_admin() or exists (select 1 from profiles where id = auth.uid() and role = 'recruiter'))
);

create policy "admin can manage private_documents" on storage.objects for all using (
  bucket_id = 'private_documents' and is_admin()
) with check (
  bucket_id = 'private_documents' and is_admin()
);
