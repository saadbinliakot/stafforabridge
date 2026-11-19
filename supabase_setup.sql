-- ============================================================================
-- NOVALINK — Complete Database Setup & CMS Schema (supabase_setup.sql)
-- Run this script in the Supabase SQL Editor.
-- Configures Bookings, Careers (Jobs), FAQs, Case Studies, and Testimonials.
-- ============================================================================

-- Extensions (idempotent — safe to re-run)
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 0. ADMIN ROLE CHECK HELPER
-- ----------------------------------------------------------------------------
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ----------------------------------------------------------------------------
-- 1. CANONICAL BOOKINGS TABLE
-- ----------------------------------------------------------------------------
create table if not exists bookings (
  id            uuid        primary key default uuid_generate_v4(),
  user_id       uuid        references auth.users (id) on delete set null,
  service_type  text        not null,
  booking_date  timestamptz not null,
  contact_name  text        not null,
  contact_email text        not null,
  contact_phone text        not null,
  status        text        not null default 'pending',
  created_at    timestamptz not null default now()
);

-- Indexes for common admin queries
create index if not exists bookings_status_idx     on bookings (status);
create index if not exists bookings_user_id_idx    on bookings (user_id);
create index if not exists bookings_created_at_idx on bookings (created_at desc);

alter table bookings enable row level security;

-- Drop previous policies to avoid duplication errors on re-run
drop policy if exists "public can insert bookings" on bookings;
drop policy if exists "auth users can read own bookings" on bookings;
drop policy if exists "admin can read all bookings" on bookings;
drop policy if exists "admin can update bookings" on bookings;
drop policy if exists "admin can delete bookings" on bookings;

create policy "public can insert bookings"
  on bookings for insert with check (true);

create policy "auth users can read own bookings"
  on bookings for select using (auth.uid() = user_id);

create policy "admin can read all bookings"
  on bookings for select using (is_admin());

create policy "admin can update bookings"
  on bookings for update using (is_admin());

create policy "admin can delete bookings"
  on bookings for delete using (is_admin());

-- ----------------------------------------------------------------------------
-- 2. CAREERS / JOBS CMS TABLE
-- ----------------------------------------------------------------------------
create table if not exists jobs (
  id              uuid        primary key default uuid_generate_v4(),
  slug            text        not null unique,
  title           text        not null,
  category        text        not null,
  location        text        not null,
  employment_type text        not null default 'Full-time',
  summary         text        not null,
  description     text,
  status          text        not null default 'published',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists jobs_slug_idx on jobs (slug);
create index if not exists jobs_status_idx on jobs (status);

alter table jobs enable row level security;

drop policy if exists "public can read published jobs" on jobs;
drop policy if exists "admin can manage jobs" on jobs;

create policy "public can read published jobs"
  on jobs for select using (status = 'published');

create policy "admin can manage jobs"
  on jobs for all using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- 3. FAQS KNOWLEDGEBASE CMS TABLE
-- ----------------------------------------------------------------------------
create table if not exists faqs (
  id         uuid        primary key default uuid_generate_v4(),
  question   text        not null,
  answer     text        not null,
  category   text        not null,
  published  boolean     not null default true,
  sort_order int         not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faqs_category_idx on faqs (category);
create index if not exists faqs_published_idx on faqs (published);

alter table faqs enable row level security;

drop policy if exists "public can read published faqs" on faqs;
drop policy if exists "admin can manage faqs" on faqs;

create policy "public can read published faqs"
  on faqs for select using (published = true);

create policy "admin can manage faqs"
  on faqs for all using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- 4. CASE STUDIES CMS TABLE
-- ----------------------------------------------------------------------------
create table if not exists case_studies (
  id                 uuid        primary key default uuid_generate_v4(),
  slug               text        not null unique,
  title              text        not null,
  industry           text        not null,
  challenge          text        not null,
  workflow           text        not null,
  approach           text        not null,
  operational_impact text        not null,
  metrics            text[]      not null default '{}',
  quote              text,
  published_status   text        not null default 'published',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists case_studies_slug_idx on case_studies (slug);
create index if not exists case_studies_status_idx on case_studies (published_status);

alter table case_studies enable row level security;

drop policy if exists "public can read published case studies" on case_studies;
drop policy if exists "admin can manage case studies" on case_studies;

create policy "public can read published case studies"
  on case_studies for select using (published_status = 'published');

create policy "admin can manage case studies"
  on case_studies for all using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- 5. TESTIMONIALS CMS TABLE
-- ----------------------------------------------------------------------------
create table if not exists testimonials (
  id         uuid        primary key default uuid_generate_v4(),
  name       text        not null,
  role       text        not null,
  company    text        not null,
  quote      text        not null,
  industry   text        default 'Healthcare',
  published  boolean     not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_published_idx on testimonials (published);

alter table testimonials enable row level security;

drop policy if exists "public can read published testimonials" on testimonials;
drop policy if exists "admin can manage testimonials" on testimonials;

create policy "public can read published testimonials"
  on testimonials for select using (published = true);

create policy "admin can manage testimonials"
  on testimonials for all using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- 6. DEFAULT SEED DATA (Only inserted if rows do not already exist)
-- ----------------------------------------------------------------------------
insert into jobs (slug, title, category, location, employment_type, summary)
select 'virtual-scheduling-coordinator', 'Virtual Scheduling Coordinator', 'Virtual Healthcare Support', 'Remote — International', 'Full-time', 'Lead remote scheduling, patient appointment confirmations, and clinic roster management.'
where not exists (select 1 from jobs where slug = 'virtual-scheduling-coordinator');

insert into jobs (slug, title, category, location, employment_type, summary)
select 'medical-billing-specialist', 'Medical Billing Specialist', 'Revenue Cycle', 'Remote — International', 'Full-time', 'Oversee claims submission, denial management, and accounts-receivable reconciliation for international providers.'
where not exists (select 1 from jobs where slug = 'medical-billing-specialist');

insert into jobs (slug, title, category, location, employment_type, summary)
select 'credentialing-coordinator', 'Credentialing Coordinator', 'Provider Operations', 'Remote — International', 'Contract', 'Manage provider credentialing, CAQH file updates, and hospital committee submission workflows.'
where not exists (select 1 from jobs where slug = 'credentialing-coordinator');

-- Seed initial FAQs
insert into faqs (question, answer, category, sort_order, published)
select 'What does NOVALINK actually do?', 'NOVALINK provides dedicated, Canada-governed healthcare outsourcing support for medical practices and health systems worldwide.', 'Services', 1, true
where not exists (select 1 from faqs where question = 'What does NOVALINK actually do?');

insert into faqs (question, answer, category, sort_order, published)
select 'Is NOVALINK HIPAA and PIPEDA compliant?', 'Yes. All operational workflows, encrypted communications, and dedicated virtual assistants operate under strict North American patient privacy standards.', 'Security', 2, true
where not exists (select 1 from faqs where question = 'Is NOVALINK HIPAA and PIPEDA compliant?');

insert into faqs (question, answer, category, sort_order, published)
select 'How quickly can our clinic onboard staff?', 'Most dedicated healthcare coordinators and medical billing teams can be fully integrated into your EHR workflow within 5 to 7 business days.', 'Onboarding', 3, true
where not exists (select 1 from faqs where question = 'How quickly can our clinic onboard staff?');

-- Seed initial Case Studies
insert into case_studies (slug, title, industry, challenge, workflow, approach, operational_impact, metrics, quote, published_status)
select 'ontario-surgical-associates', 'Multi-Provider Scheduling & Intake Modernization', 'Specialty Clinics', 'High patient no-show rates and overworked front-desk administration across 4 clinical sites.', 'Full-cycle appointment booking, digital intake verification, and automated reminder cascades.', 'Dedicated virtual intake team operating within practice EHR system.', 'Eliminated booking backlogs and reduced patient no-show rates by 42%.', array['42% No-Show Reduction', '99.4% Intake Accuracy', '< 15min Patient Wait Time'], 'NOVALINK gave our front-desk staff breathing room and completely streamlined our clinic intake.', 'published'
where not exists (select 1 from case_studies where slug = 'ontario-surgical-associates');

insert into case_studies (slug, title, industry, challenge, workflow, approach, operational_impact, metrics, quote, published_status)
select 'metro-health-rcm-acceleration', 'Revenue Cycle Backlog Resolution & AR Recovery', 'Hospitals & Health Systems', 'Unresolved claims backlog exceeding $1.4M with delayed payer remittance cycles.', 'Prior authorization submission, denial code auditing, and AR follow-up escalations.', 'Specialized revenue-cycle taskforce deployed for dedicated daily claims clearance.', 'Recovered $1.1M in delayed receivables and brought clean-claims rate to 98.7%.', array['$1.1M AR Recovered', '98.7% Clean Claims', '14-Day AR Cycle'], 'The precision of NOVALINK billing specialists transformed our clinic financial operations.', 'published'
where not exists (select 1 from case_studies where slug = 'metro-health-rcm-acceleration');

-- Seed initial Testimonials
insert into testimonials (name, role, company, quote, industry, published)
select 'Dr. Jonathan Vance', 'Medical Director', 'West Coast Specialty Clinic', 'The virtual healthcare assistants assigned to our practice feel like an in-office extension of our administrative team.', 'Specialty Clinics', true
where not exists (select 1 from testimonials where name = 'Dr. Jonathan Vance');

insert into testimonials (name, role, company, quote, industry, published)
select 'Elena Rostova', 'Chief Operating Officer', 'Apex Health Network', 'NOVALINK standardized our prior authorization workflows across 6 facilities with flawless compliance.', 'Hospitals & Health Systems', true
where not exists (select 1 from testimonials where name = 'Elena Rostova');

