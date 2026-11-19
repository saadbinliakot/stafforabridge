-- ============================================================================
-- NOVALINK — Seed data (Phase 1 placeholders)
-- Run via: psql "$DATABASE_URL" -f supabase/seed/seed.sql
-- All case studies and testimonials are explicitly marked is_placeholder = true.
-- ============================================================================

insert into service_categories (slug, name, description, sort_order) values
  ('virtual-healthcare-support', 'Virtual Healthcare Support', 'Front-of-house and patient-facing coordination handled remotely.', 1),
  ('revenue-cycle', 'Revenue Cycle Management', 'Billing, claims, and accounts-receivable administration.', 2),
  ('insurance-authorization', 'Insurance & Authorization', 'Eligibility, referrals, and prior-authorization coordination.', 3),
  ('provider-operations', 'Provider Operations', 'Credentialing, enrollment, and scheduling administration.', 4),
  ('healthcare-documentation', 'Healthcare Documentation', 'Data entry, chart preparation, and records administration.', 5),
  ('technology-automation', 'Technology & Automation', 'Workflow tooling and process automation for back-office work.', 6)
on conflict (slug) do nothing;

insert into services (slug, name, category_slug, short_description, problems_solved, typical_workflows, what_novalink_handles, who_it_is_for) values
  ('appointment-scheduling', 'Appointment Setting & Scheduling', 'virtual-healthcare-support',
    'Inbound caller triage, multi-provider calendar synchronization, and automated reminder cadences.',
    array['Front-desk teams stretched across calls, walk-in patients, and checkout lines simultaneously.','High no-show rates and missed revenue from manual scheduling and lack of confirmation cadences.'],
    array['Inbound patient call handling, caller triage, and urgent appointment escalation','Provider EHR/PMS calendar synchronization across multiple exam rooms and facility locations','Multi-channel patient reminder cadences (SMS, phone, email) to reduce no-show rates below 4%'],
    array['Full administrative ownership of phone and online scheduling queues','Direct integration with practice management systems','Standard operating procedures for booking rules'],
    array['Medical practices','Dental practices','Specialty clinics']),
  ('virtual-healthcare-assistance', 'Virtual Healthcare Assistance', 'virtual-healthcare-support',
    'Dedicated remote administrative staff supporting daily practice workflows, provider inboxes, and patient communication.',
    array['Administrative task overload pulling clinical staff away from patient care.','Difficulty hiring and retaining local administrative staff.'],
    array['Provider EHR inbox clearance, task routing, and prescription refill request assembly','Dedicated patient outreach for pre-visit requirements','EMR scanning, document indexing, and external record retrieval'],
    array['Day-to-day administrative execution','Reporting on completed work'],
    array['Medical practices','Home healthcare','Long-term care']),
  ('patient-intake-registration', 'Patient Intake & Registration', 'virtual-healthcare-support',
    'Structured collection, verification, and digital entry of new and returning patient administrative data.',
    array['Incomplete or illegible paper intake clipboards causing front-desk bottlenecks.','Delayed appointment starts caused by extensive paperwork completion in the waiting room.'],
    array['Secure digital pre-registration link dispatch and real-time completion tracking','Demographic data verification, photo ID validation, and emergency contact capture','Medical history questionnaire entry, allergy flags, and consent capture'],
    array['Non-clinical intake administration'],
    array['Medical practices','Behavioral health','Clinics']),
  ('insurance-eligibility-verification', 'Insurance & Eligibility Verification', 'insurance-authorization',
    'Pre-visit eligibility, copay, coinsurance, and deductible verification to prevent claim denials.',
    array['Surprise billing and high claim denial rates caused by lapsed coverage.','Front-desk time lost to phone holds with payers.'],
    array['Automated 48-72h pre-appointment clearinghouse checks','Copay, coinsurance, deductible, and out-of-pocket maximum calculation','Coverage documentation and patient pre-visit communication'],
    array['Eligibility checks ahead of scheduled visits'],
    array['Medical practices','Imaging centers','Laboratories']),
  ('prior-authorization', 'Prior Authorization', 'insurance-authorization',
    'End-to-end prior authorization coordination for medications, imaging, surgeries, and specialized procedures.',
    array['Critical patient treatment delays due to pending authorizations.','Extensive clinical staff time diverted to payer questionnaires.'],
    array['Clinical chart extraction: compiling physician notes and lab results','Multi-payer PA submission through CoverMyMeds, Availity, and direct portals','Payer follow-up, reference tracking, and appeal letter preparation'],
    array['Administrative coordination of the authorization process'],
    array['Specialty practices','Imaging centers','Hospitals']),
  ('medical-billing', 'Medical Billing', 'revenue-cycle',
    'Clean claim creation, electronic clearinghouse submission, payment posting, and denial management.',
    array['High days in accounts receivable (A/R) and delayed practice reimbursements.','Clearinghouse rejections and billing backlogs.'],
    array['Clean claim generation, ANSI 837 electronic submission','ERA/835 and manual EOB payment & adjustment posting','Denial root-cause analysis, claim resubmission, and A/R workdown'],
    array['Day-to-day billing administration'],
    array['Medical practices','Dental practices']),
  ('medical-coding', 'Medical Coding', 'revenue-cycle',
    'Certified diagnosis and procedural coding aligned to ICD-10-CM, CPT, and HCPCS guidelines.',
    array['Coding backlogs delaying claim submission and cash collection.','Downcoding and unbundling compliance risks.'],
    array['Diagnosis coding support aligned to ICD-10 clinical documentation','CPT and HCPCS procedural code assignment','CCI edit verification and modifier assignment (-25, -59, -79)'],
    array['diagnosis coding support aligned to ICD-10'],
    array['Medical practices','Specialty clinics']),
  ('provider-credentialing-enrollment', 'Provider Credentialing & Enrollment', 'provider-operations',
    'Primary source verification, CAQH profile management, and government/commercial payer network enrollment.',
    array['Newly hired physicians waiting 4-6 months before seeing patients.','Missed re-credentialing deadlines.'],
    array['Primary source verification for medical licenses and certifications','CAQH ProView portfolio management and quarterly attestation','Medicare, Medicaid, and commercial payer enrollment filings'],
    array['Administrative credentialing coordination'],
    array['Hospitals & health systems','Medical practices']),
  ('clinical-documentation', 'Clinical Documentation', 'healthcare-documentation',
    'Virtual scribing, scheduling, and pre-billing documentation from patient encounters to reduce provider burnout.',
    array['Physicians spending 2+ hours per night finishing EHR charts.','Documentation lag delaying billing cycles.'],
    array['Virtual scribing, scheduling, and pre-billing documentation','Chart preparation, previous visit summary review, and lab indexing','EHR template population ready for provider sign-off'],
    array['scribing, scheduling, and pre-billing documentation'],
    array['Clinics','Long-term care','Medical practices'])
on conflict (slug) do update set
  name = excluded.name,
  category_slug = excluded.category_slug,
  short_description = excluded.short_description,
  problems_solved = excluded.problems_solved,
  typical_workflows = excluded.typical_workflows,
  what_novalink_handles = excluded.what_novalink_handles,
  who_it_is_for = excluded.who_it_is_for;
    array['Administrative workflow design and support tooling'],
    array['Healthcare networks','Multi-location practices'])
on conflict (slug) do nothing;

insert into industries (slug, name, description) values
  ('medical-practices', 'Medical Practices', 'Administrative support for independent and group practices.'),
  ('hospitals-health-systems', 'Hospitals & Health Systems', 'Operational support across multi-department organizations.'),
  ('dental-practices', 'Dental Practices', 'Scheduling and billing administration for dental teams.'),
  ('behavioral-health', 'Behavioral Health', 'Administrative coordination for behavioral health providers.'),
  ('mental-health', 'Mental Health', 'Intake and scheduling support for mental health practices.'),
  ('pharmacy', 'Pharmacies', 'Administrative and coordination support for pharmacy operations.'),
  ('laboratory', 'Laboratories', 'Order and results-administration support.'),
  ('imaging', 'Imaging Centers', 'Scheduling and authorization coordination for imaging visits.'),
  ('home-healthcare', 'Home Healthcare', 'Coordination support for distributed care teams.'),
  ('long-term-care', 'Long-Term Care', 'Administrative support for long-term care facilities.'),
  ('specialty-clinics', 'Specialty Clinics', 'Tailored administrative workflows for specialty practices.'),
  ('healthcare-networks', 'Healthcare Networks', 'Standardized operational support across multiple locations.')
on conflict (slug) do nothing;

insert into faqs (question, answer, category, sort_order) values
  ('What does NOVALINK actually do?', 'NOVALINK provides outsourced operational and administrative support for healthcare organizations, including scheduling, documentation, billing administration, and coordination work.', 'Services', 1),
  ('Is NOVALINK a call center?', 'No. NOVALINK provides dedicated operational support teams that integrate into your existing workflows, rather than a shared call-center model.', 'Services', 2),
  ('Where is NOVALINK based?', 'NOVALINK is based in Canada and works with healthcare organizations internationally.', 'General', 3),
  ('Does NOVALINK handle patient medical records or clinical decisions?', 'No. NOVALINK supports operational and administrative workflows. Clinical decisions remain with your organization''s licensed staff.', 'Services', 4),
  ('How does pricing work?', 'Pricing depends on the scope, volume, and structure of the support your organization needs. Details are discussed during a consultation.', 'Pricing', 5),
  ('What does NOVALINK do to protect data?', 'Security and privacy are fundamental to how NOVALINK designs its operations. Detailed compliance information will be published as applicable.', 'Security', 6),
  ('Is NOVALINK HIPAA compliant?', 'NOVALINK is building its operations around strong security and privacy practices. Specific compliance certifications will be published here once formally confirmed.', 'Security', 7),
  ('How is a NOVALINK engagement structured?', 'Engagements typically move through discovery, planning, matching, onboarding, and ongoing operation, described in more detail on the How It Works page.', 'Outsourcing', 8),
  ('How long does onboarding take?', 'Onboarding timelines depend on the complexity of the workflows being outsourced and are confirmed during planning.', 'Onboarding', 9),
  ('Can NOVALINK support multi-location organizations?', 'Yes. NOVALINK''s operating model is designed to support standardized workflows across multiple locations.', 'Outsourcing', 10),
  ('Does NOVALINK work with organizations outside Canada?', 'Yes. NOVALINK is Canada-based and serves healthcare organizations internationally.', 'International Clients', 11),
  ('How do I apply for a role at NOVALINK?', 'Open roles are listed on the Careers page, where you can submit an application directly.', 'Careers', 12),
  ('Can I submit patient information through the contact form?', 'No. Public forms on this site are not for patient health information. Please do not submit patient names, medical record numbers, or clinical details here.', 'General', 13),
  ('How do I get started?', 'Book a consultation, and a member of the NOVALINK team will follow up to discuss your organization''s needs.', 'Outsourcing', 14)
on conflict do nothing;

insert into case_studies (slug, title, industry, challenge, workflow, approach, operational_impact, metrics, quote, is_placeholder, published_status) values
  ('demo-medical-practice-scheduling', 'Streamlining scheduling for a growing practice', 'Medical Practices',
    'A demo organization needed additional scheduling capacity without adding local headcount.',
    'Appointment scheduling, reminders, and waitlist coordination.',
    'A dedicated virtual scheduling team was onboarded alongside the practice''s existing tools.',
    '[OUTCOME] — to be replaced with real NOVALINK data.',
    array['[CLIENT METRIC]', '[TIME SAVED]'],
    '[Placeholder demo quote — not a real client statement.]', true, 'published'),
  ('demo-billing-administration', 'Reducing billing backlog for a specialty clinic', 'Specialty Clinics',
    'A demo organization''s billing queue had grown faster than internal staffing.',
    'Claims preparation, submission support, and AR follow-up.',
    'NOVALINK''s revenue-cycle team took on the backlog and ongoing volume.',
    '[OUTCOME] — to be replaced with real NOVALINK data.',
    array['[CLIENT METRIC]', '[OUTCOME]'],
    '[Placeholder demo quote — not a real client statement.]', true, 'published'),
  ('demo-credentialing-coordination', 'Coordinating multi-provider credentialing', 'Hospitals & Health Systems',
    'A demo health system needed centralized tracking across many provider credentialing files.',
    'Application preparation, payer follow-up, and deadline tracking.',
    'A dedicated credentialing coordinator managed the queue on a shared tracker.',
    '[OUTCOME] — to be replaced with real NOVALINK data.',
    array['[CLIENT METRIC]', '[TIME SAVED]'],
    '[Placeholder demo quote — not a real client statement.]', true, 'published')
on conflict (slug) do nothing;

insert into testimonials (name, role, company, quote, industry, is_placeholder, published) values
  ('Demo Contact', 'Practice Manager', 'Demo Medical Group', '[Placeholder demo testimonial — clearly not a real client statement.]', 'Medical Practices', true, true),
  ('Demo Contact', 'Operations Director', 'Demo Specialty Clinic', '[Placeholder demo testimonial — clearly not a real client statement.]', 'Specialty Clinics', true, true),
  ('Demo Contact', 'Administrator', 'Demo Health Network', '[Placeholder demo testimonial — clearly not a real client statement.]', 'Healthcare Networks', true, true)
on conflict do nothing;

insert into jobs (slug, title, category, location, employment_type, summary, status) values
  ('virtual-scheduling-coordinator', 'Virtual Scheduling Coordinator', 'Virtual Healthcare Support', 'Remote — International', 'Full-time', 'Placeholder role for demonstration of the careers workflow.', 'published'),
  ('medical-billing-specialist', 'Medical Billing Specialist', 'Revenue Cycle Management', 'Remote — International', 'Full-time', 'Placeholder role for demonstration of the careers workflow.', 'published'),
  ('credentialing-coordinator', 'Credentialing Coordinator', 'Provider Operations', 'Remote — International', 'Contract', 'Placeholder role for demonstration of the careers workflow.', 'published')
on conflict (slug) do nothing;

insert into site_settings (key, value) values
  ('compliance_statement', '"Security and privacy are fundamental to how NOVALINK designs its operations. Detailed compliance information will be published as applicable."'),
  ('contact_email', '"hello@novalink.example"'),
  ('contact_phone', '"+1 (000) 000-0000"')
on conflict (key) do nothing;
