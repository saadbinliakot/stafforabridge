# NOVALINK — Phase 1

Canada-based healthcare outsourcing website and business-intake platform, built with
Next.js 14 (App Router, TypeScript), Tailwind, and self-hosted Supabase (Postgres + Auth +
Storage). Visual system: Neo-Brutalism + typography (Clash Display / IBM Plex Mono),
palette limited to marine blue / bright red / butter yellow.

## What was built

- **Full site routing and page architecture** for every route in the spec: home, services
  (+ dynamic service detail), industries (+ dynamic industry detail), how-it-works, about,
  team, contact, book-consultation, careers (+ dynamic job detail with application form),
  resources hub (case studies, success stories, insights, FAQs), login/signup, and the four
  legal pages (privacy, terms, accessibility, security).
- **Design system**: CSS custom properties for the three brand colors (approximated from
  the given Pantone references — see note in `app/globals.css`), Clash Display for
  headings, IBM Plex Mono for everything else, and a reusable Neo-Brutalist component
  kit (`BrutalistCard`, `SplitSection`, `SectionLabel`, buttons, form fields, etc.).
- **Data-access layer** (`lib/data/*.ts`): every page reads through repository functions,
  never queries Supabase directly from a component. Each read function falls back to the
  static placeholder content in `lib/data/content.ts` when Supabase env vars aren't set,
  so the UI runs before infrastructure is provisioned.
- **Forms wired to Postgres**: contact, book-consultation, and job application forms use
  Server Actions → Zod validation → Supabase insert, matching the flow in the spec. The
  contact form displays the required PHI warning banner.
- **Mock consultation availability UI** (`components/booking/BookingPanel.tsx`) — no
  calendar provider is wired in; slots are generated client-side so the UX and the
  `consultation_requests` / `bookings` write path can be exercised now.
- **Supabase Auth foundation**: signup/login/password-reset Server Actions, a
  `profiles` table linked 1:1 to `auth.users`, and a trigger that creates a profile +
  organization row on signup.
- **B2B organization model**: `organizations` / `organization_members` tables, so a future
  client portal can operate at the organization level with multiple named roles.
- **Row Level Security** on every table (see migration), enforced in Postgres — not just
  in route code. Public forms are INSERT-only for anonymous users; only admins/recruiters
  can read submissions.
- **Private file storage**: `resumes` and `private_documents` buckets, both non-public,
  with storage policies restricting reads to admin/recruiter roles.
- **Architectural placeholders** for `/client/dashboard` and `/admin/dashboard` — both
  authenticate the session and check role, but intentionally render a "not yet built"
  notice rather than a full dashboard.
- **SEO foundation**: a shared `buildMetadata()` helper used on every page, plus
  `app/sitemap.ts` and `app/robots.ts`.

## Database schema

See `supabase/migrations/0001_init.sql` for the full DDL. Tables:

```
profiles, organizations, organization_members,
service_categories, services, industries,
leads, contact_messages,
consultation_requests, booking_slots, bookings,
jobs, job_applications,
documents,
case_studies, testimonials, faqs,
article_categories, articles,
site_settings, consent_records, audit_logs
```

All tables use UUID primary keys (except a few natural-key lookup tables), `created_at`/
`updated_at` timestamps with an `updated_at` trigger, foreign keys where relationships
exist, and Postgres enums for status-like fields (`content_status`, `consultation_status`,
`booking_status`, `application_status`, `user_role`, `organization_member_role`,
`preferred_contact_method`).

RLS is enabled on every table. In short:
- Published marketing content (services, industries, case studies, testimonials, FAQs,
  articles, jobs) is publicly readable, admin-writable.
- `leads`, `contact_messages`, `consultation_requests`, `bookings`, `job_applications`,
  `consent_records` are insert-only for anonymous users and readable only by
  admin (or admin/recruiter for applications).
- `organizations` / `organization_members` / `documents` are scoped to the requesting
  user's own organization membership.
- `profiles` are readable/updatable by their owner, fully readable by admins.
- Storage: `resumes` accepts anonymous uploads but only admin/recruiter can read; both
  buckets are non-public.

## Routes created

```
/
/services            /services/[slug]
/industries          /industries/[slug]
/how-it-works
/about               /team
/contact
/book-consultation
/careers             /careers/[slug]  (application form + resume upload)
/resources
/resources/case-studies        /resources/case-studies/[slug]
/resources/success-stories
/resources/insights            /resources/insights/[slug]
/resources/faqs
/login               /signup
/privacy /terms /accessibility /security
/client/dashboard    (auth-gated placeholder)
/admin/dashboard     (auth + role-gated placeholder)
/sitemap.xml  /robots.txt
```

`/admin/leads`, `/admin/bookings`, `/admin/users`, `/admin/content`, `/admin/jobs`,
`/admin/applications`, `/admin/settings` are not yet built as pages, but the data-access
functions they'll call already exist in `lib/data/*.ts`.

## Environment variables

See `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY   (server-only; never sent to the browser)
DATABASE_URL                (used by npm run db:seed)
NEXT_PUBLIC_SITE_URL
```

## Supabase setup steps

1. `npx supabase init` (if you haven't already) and point it at a self-hosted or local
   Supabase instance.
2. Copy `.env.example` to `.env.local` and fill in your project's URL/keys.
3. Apply the schema: `npx supabase db push` (or `psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql`).
4. Seed placeholder content: `npm run db:seed` (runs `supabase/seed/seed.sql` via `psql`).
5. In the Supabase dashboard, confirm the `resumes` and `private_documents` storage
   buckets were created as **private** (the migration creates them, but it's worth a
   visual check).
6. `npm install`
7. `npm run dev`

## Fonts

IBM Plex Mono is loaded via `next/font/google`. Clash Display is loaded via the Fontshare
CDN in `app/globals.css` (`@import`). If your deployment needs a stricter CSP or fully
offline builds, self-host the Clash Display font files instead (Fontshare license
permitting) and swap the `@import` for local `@font-face` rules — no component code needs
to change.

## Color note

The three brand colors are defined as CSS variables in `app/globals.css`
(`--marine-blue`, `--bright-red`, `--butter-yellow`) and are practical sRGB
approximations of the specified Pantone references (P 105-8 C / P 48-8 C / Pantone 983 C).
Pantone spot-color data is licensed — before any print or brand-critical use, verify the
exact values against a licensed Pantone Bridge/Connect library and update the three
variables; nothing else needs to change since every component reads from those variables.

## What remains intentionally unimplemented (per spec §40)

- Live calendar integration (Cal.com / Google / Microsoft) — `BookingPanel` uses
  deterministic mock slots by design.
- Email/SMS/WhatsApp automation, payments, CRM/EHR/EMR/HL7/FHIR integration.
- AI agents/voice, automated reminders.
- The real `/client` portal and full `/admin` dashboard (only auth-gated placeholders
  exist).
- Healthcare claims processing and any PHI handling — public forms explicitly warn
  against submitting patient health information.
- Fabricated statistics, certifications (HIPAA/SOC 2/ISO/PIPEDA/PHIPA/HITRUST), founder
  bios, and real testimonials — all left as clearly labeled placeholders or empty
  structures ready for real content.

## Recommended next development phase

1. Wire a real calendar provider behind `BookingPanel` (the component only needs a
   date/time/timezone string back, so the swap is isolated).
2. Build the `/admin` dashboard against the existing `lib/data/*.ts` functions
   (leads, contact messages, consultation requests, bookings, job applications).
3. Build the real `/client` portal on top of `organizations` / `organization_members`.
4. Add a CMS layer (or an internal editor UI) over `services`, `industries`, `case_studies`,
   `testimonials`, `faqs`, `articles`, `site_settings` so content editors don't need SQL.
5. Populate real team bios, case-study metrics, and testimonials once available, and only
   then consider compliance-certification claims once actually confirmed and contracted.
6. Add automated email notifications for new leads/consultation requests/applications.
