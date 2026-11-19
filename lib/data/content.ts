/**
 * Centralized NOVALINK business content.
 *
 * This file is the single source of truth for placeholder/demo content
 * during Phase 1. Nothing here should be duplicated inline in components.
 * The shapes below mirror the Postgres tables in supabase/migrations, so
 * moving from this static module to live `lib/data/*.ts` repository calls
 * is a drop-in swap later — see each repository file.
 *
 * IMPORTANT: numeric claims, certifications, and statistics are
 * intentionally represented as placeholders. Do not replace them with
 * invented numbers — replace them with real NOVALINK data when available.
 */

export type ServiceCategorySlug =
  | 'virtual-healthcare-support'
  | 'revenue-cycle'
  | 'insurance-authorization'
  | 'provider-operations'
  | 'healthcare-documentation';

export interface ServiceCategory {
  slug: ServiceCategorySlug;
  name: string;
  description: string;
}

export interface Service {
  slug: string;
  name: string;
  categorySlug: ServiceCategorySlug;
  shortDescription: string;
  problemsSolved: string[];
  typicalWorkflows: string[];
  whatNovalinkHandles: string[];
  whoItIsFor: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: 'virtual-healthcare-support',
    name: 'Virtual Healthcare Support',
    description: 'Front-of-house and patient-facing coordination handled remotely.',
  },
  {
    slug: 'revenue-cycle',
    name: 'Revenue Cycle Management',
    description: 'Billing, claims, and accounts-receivable administration.',
  },
  {
    slug: 'insurance-authorization',
    name: 'Insurance & Authorization',
    description: 'Eligibility, referrals, and prior-authorization coordination.',
  },
  {
    slug: 'provider-operations',
    name: 'Provider Operations',
    description: 'Credentialing, enrollment, and scheduling administration.',
  },
  {
    slug: 'healthcare-documentation',
    name: 'Healthcare Documentation',
    description: 'Data entry, chart preparation, and records administration.',
  },
];

export const services: Service[] = [
  {
    slug: 'appointment-scheduling',
    name: 'Appointment Setting & Scheduling',
    categorySlug: 'virtual-healthcare-support',
    shortDescription: 'Inbound caller triage, multi-provider calendar synchronization, and automated reminder cadences.',
    problemsSolved: [
      'Front-desk teams stretched across calls, walk-in patients, and checkout lines simultaneously.',
      'High no-show rates and missed revenue from manual scheduling and lack of confirmation cadences.',
      'Double-booked providers, scheduling gaps, and room allocation conflicts during peak hours.',
    ],
    typicalWorkflows: [
      'Inbound patient call handling, caller triage, and urgent appointment escalation',
      'Provider EHR/PMS calendar synchronization across multiple exam rooms and facility locations',
      'Multi-channel patient reminder cadences (SMS, phone, email) to reduce no-show rates below 4%',
      'Cancellation handling, active waitlist backfilling, and provider booking preference enforcement',
    ],
    whatNovalinkHandles: [
      'Full administrative ownership of phone and online scheduling queues',
      'Direct integration with practice management systems (Epic, Cerner, AthenaHealth, Kareo, etc.)',
      'Standardized operating procedures (SOPs) for provider-specific visit lengths and buffer times',
      'Daily capacity reporting and schedule fill-rate optimization',
    ],
    whoItIsFor: ['Independent Medical Practices', 'Dental Practices & DSOs', 'Specialty Outpatient Clinics'],
  },
  {
    slug: 'virtual-healthcare-assistance',
    name: 'Virtual Healthcare Assistance',
    categorySlug: 'virtual-healthcare-support',
    shortDescription: 'Dedicated remote administrative staff supporting daily practice workflows, provider inboxes, and patient communication.',
    problemsSolved: [
      'Administrative task overload pulling clinical staff and nurses away from patient care.',
      'Difficulty recruiting, vetting, and retaining reliable in-house healthcare administrative staff.',
      'Delayed patient response times leading to care dissatisfaction and phone backlog.',
    ],
    typicalWorkflows: [
      'Provider EHR inbox clearance, task routing, and prescription refill request assembly',
      'Dedicated patient outreach for pre-visit requirements, fasting instructions, and lab prep',
      'Electronic medical record (EMR) scanning, document indexing, and external record retrieval',
      'Specialist referral coordination, insurance authorization handoff, and care closure tracking',
    ],
    whatNovalinkHandles: [
      'Day-to-day administrative task execution with strict adherence to HIPAA protocols',
      'Daily encounter logging and operational shift handover summaries',
      'Continuous quality monitoring and dedicated supervisor oversight',
    ],
    whoItIsFor: ['Medical Practices', 'Home Healthcare Agencies', 'Long-Term Care Facilities'],
  },
  {
    slug: 'patient-intake-registration',
    name: 'Patient Intake & Registration',
    categorySlug: 'virtual-healthcare-support',
    shortDescription: 'Structured collection, verification, and digital entry of new and returning patient administrative data.',
    problemsSolved: [
      'Incomplete or illegible paper intake clipboards causing front-desk bottlenecks and entry errors.',
      'Delayed appointment starts caused by extensive paperwork completion in the waiting room.',
      'Missing emergency contacts, incorrect demographic records, and uncollected consent documents.',
    ],
    typicalWorkflows: [
      'Secure digital pre-registration link dispatch and real-time completion tracking',
      'Demographic data verification, government photo ID validation, and emergency contact capture',
      'Medical history questionnaire entry, allergy flags, and primary care provider documentation',
      'HIPAA privacy acknowledgment, financial responsibility signatures, and consent capture',
    ],
    whatNovalinkHandles: [
      'Non-clinical intake verification and clean data entry into PMS/EHR prior to visit',
      'Real-time verification of completed documentation ahead of provider appointment start',
      'Patient assistance via phone or chat for navigating digital intake portals',
    ],
    whoItIsFor: ['Outpatient Medical Practices', 'Behavioral Health Centers', 'Multi-Specialty Clinics'],
  },
  {
    slug: 'insurance-eligibility-verification',
    name: 'Insurance & Eligibility Verification',
    categorySlug: 'insurance-authorization',
    shortDescription: 'Pre-visit eligibility, copay, coinsurance, and deductible verification to prevent claim denials.',
    problemsSolved: [
      'Surprise billing and high claim denial rates caused by lapsed or unverified insurance coverage.',
      'Front-desk staff spending hours on hold with commercial and government payer representatives.',
      'Uncollected copays and deductibles at time of service impacting practice cash flow.',
    ],
    typicalWorkflows: [
      'Automated 48-72 hour pre-appointment clearinghouse and payer portal eligibility checks',
      'Copay, coinsurance, remaining annual deductible, and out-of-pocket maximum calculation',
      'Procedure-specific benefit coverage confirmation and pre-authorization requirement flagging',
      'Coverage lapse notification to patient with self-pay estimate and payment plan coordination',
    ],
    whatNovalinkHandles: [
      'Pre-visit eligibility verification and benefit summary logging in the billing system',
      'Patient financial liability estimation ahead of scheduled appointments',
      'Resolution of coverage discrepancies with payer provider-relations desks',
    ],
    whoItIsFor: ['Ambulatory Surgical Centers', 'Diagnostic Imaging Centers', 'Independent Physician Practices'],
  },
  {
    slug: 'prior-authorization',
    name: 'Prior Authorization',
    categorySlug: 'insurance-authorization',
    shortDescription: 'End-to-end prior authorization coordination for medications, imaging, surgeries, and specialized procedures.',
    problemsSolved: [
      'Critical patient treatment delays and procedure cancellations due to pending authorizations.',
      'Extensive clinical staff time diverted to payer questionnaires, clinical proofs, and fax queues.',
      'Costly retroactive authorization denials that cannot be appealed.',
    ],
    typicalWorkflows: [
      'Clinical chart extraction: compiling physician notes, diagnostic lab results, and imaging reports',
      'Multi-payer PA submission through CoverMyMeds, Availity, and specialized health plan portals',
      'Direct payer follow-up, authorization reference tracking, and turnaround time escalation',
      'Denial triage, appeal letter preparation with medical necessity guidelines, and peer-to-peer scheduling',
    ],
    whatNovalinkHandles: [
      'Comprehensive administrative tracking of the entire prior authorization lifecycle',
      'Documentation assembly aligned with payer-specific medical necessity criteria',
      'Proactive escalation when payer statutory turnaround windows are exceeded',
    ],
    whoItIsFor: ['Specialty Practices (Oncology, Orthopedics, Cardiology)', 'Imaging Facilities', 'Hospitals'],
  },
  {
    slug: 'medical-billing',
    name: 'Medical Billing',
    categorySlug: 'revenue-cycle',
    shortDescription: 'Clean claim creation, electronic clearinghouse submission, payment posting, and denial management.',
    problemsSolved: [
      'High days in accounts receivable (A/R) and delayed practice reimbursements.',
      'Clearinghouse rejections and billing backlogs caused by inconsistent formatting and unworked edits.',
      'Unrecovered revenue from timely-filing expirations and unworked secondary/tertiary claims.',
    ],
    typicalWorkflows: [
      'Clean claim generation, ANSI 837 electronic submission, and clearinghouse edit resolution',
      'Daily Electronic Remittance Advice (ERA/835) and manual EOB payment & contractual allowance posting',
      'Denial root-cause analysis, claim resubmission, and secondary/tertiary payer coordination',
      'Aging accounts receivable (A/R) workdown (>30, >60, >90 days) and patient balance statement processing',
    ],
    whatNovalinkHandles: [
      'Daily claim submission and payment posting reconciliation',
      'Denial tracking, appeal packet submission, and payer follow-up',
      'Monthly revenue cycle performance intelligence reporting',
    ],
    whoItIsFor: ['Medical Group Practices', 'Dental Practices', 'Physician Networks'],
  },
  {
    slug: 'medical-coding',
    name: 'Medical Coding',
    categorySlug: 'revenue-cycle',
    shortDescription: 'Certified diagnosis and procedural coding aligned to ICD-10-CM, CPT, and HCPCS guidelines.',
    problemsSolved: [
      'Coding backlogs delaying claim submission and cash collection.',
      'Downcoding and unbundling compliance risks that trigger payer audits and clawbacks.',
      'Physician frustration with complex, continuously shifting annual coding updates.',
    ],
    typicalWorkflows: [
      'Diagnosis coding support aligned to ICD-10 clinical documentation and medical necessity',
      'CPT and HCPCS procedural code assignment for outpatient encounters, surgeries, and telehealth',
      'Correct Coding Initiative (CCI) edit verification and precise modifier assignment (-25, -59, -79)',
      'Physician documentation query generation to resolve unspecific charts and prevent code denials',
    ],
    whatNovalinkHandles: [
      'Precise diagnosis and procedure code assignment by credentialed healthcare coders',
      'Regular documentation audits and clinical specificity feedback loops',
      'Compliance verification against payer-specific local and national coverage determinations (LCD/NCD)',
    ],
    whoItIsFor: ['Surgical Centers', 'Specialty Clinics', 'Independent Medical Practices'],
  },
  {
    slug: 'provider-credentialing-enrollment',
    name: 'Provider Credentialing & Enrollment',
    categorySlug: 'provider-operations',
    shortDescription: 'Primary source verification, CAQH profile management, and government/commercial payer network enrollment.',
    problemsSolved: [
      'Newly hired physicians waiting 4-6 months before seeing patients due to delayed credentialing.',
      'Revenue write-offs caused by providers treating patients before payer enrollment effective dates.',
      'Missed re-credentialing deadlines resulting in sudden provider contract termination.',
    ],
    typicalWorkflows: [
      'Primary source verification for medical licenses, DEA certificates, board certifications, and education',
      'CAQH ProView portfolio management, quarterly profile re-attestation, and document updates',
      'Medicare (PECOS / CMS-855), state Medicaid, and commercial payer in-network enrollment filings',
      'Payer contract tracking, provider effective date confirmation, and automated re-credentialing alerts',
    ],
    whatNovalinkHandles: [
      'Complete end-to-end management of initial provider credentialing packets',
      'Weekly payer follow-up to accelerate application approval and contract execution',
      'Maintenance of centralized provider credentialing repository with automated expiration alerts',
    ],
    whoItIsFor: ['Hospitals & Health Systems', 'Expanding Medical Practices', 'Urgent Care Networks'],
  },
  {
    slug: 'clinical-documentation',
    name: 'Clinical Documentation',
    categorySlug: 'healthcare-documentation',
    shortDescription: 'Virtual scribing, scheduling, and pre-billing documentation from patient encounters to reduce provider burnout.',
    problemsSolved: [
      'Physicians spending 2+ hours per night finishing EHR charts ("pajama time").',
      'Documentation lag delaying billing cycles and compromising clinical communication continuity.',
      'Provider burnout, fatigue, and reduced face-to-face patient engagement during visits.',
    ],
    typicalWorkflows: [
      'Virtual scribing, scheduling, and pre-billing documentation from synchronous or recorded encounters',
      'Comprehensive chart preparation: reviewing previous visit summaries, lab orders, and vital trends',
      'EHR template population (Chief Complaint, HPI, ROS, Physical Exam, Assessment & Plan)',
      'Quality measure compliance tracking (MIPS/HEDIS) and pre-billing coding consistency validation',
    ],
    whatNovalinkHandles: [
      'Turnaround of complete, formatted clinical encounter notes ready for physician sign-off',
      'Strict adherence to provider documentation styles and EHR preference lists',
      'Pre-billing chart completeness audits ensuring compliance with evaluation & management (E/M) guidelines',
    ],
    whoItIsFor: ['Primary Care Clinics', 'Specialty Outpatient Practices', 'Telehealth Organizations'],
  },
];

export interface Industry {
  slug: string;
  name: string;
  description: string;
}

export const industries: Industry[] = [
  { slug: 'medical-practices', name: 'Medical Practices', description: 'Administrative support for independent and group practices.' },
  { slug: 'hospitals-health-systems', name: 'Hospitals & Health Systems', description: 'Operational support across multi-department organizations.' },
  { slug: 'dental-practices', name: 'Dental Practices', description: 'Scheduling and billing administration for dental teams.' },
  { slug: 'behavioral-health', name: 'Behavioral Health', description: 'Administrative coordination for behavioral health providers.' },
  { slug: 'mental-health', name: 'Mental Health', description: 'Intake and scheduling support for mental health practices.' },
  { slug: 'pharmacy', name: 'Pharmacies', description: 'Administrative and coordination support for pharmacy operations.' },
  { slug: 'laboratory', name: 'Laboratories', description: 'Order and results-administration support.' },
  { slug: 'imaging', name: 'Imaging Centers', description: 'Scheduling and authorization coordination for imaging visits.' },
  { slug: 'home-healthcare', name: 'Home Healthcare', description: 'Coordination support for distributed care teams.' },
  { slug: 'long-term-care', name: 'Long-Term Care', description: 'Administrative support for long-term care facilities.' },
  { slug: 'specialty-clinics', name: 'Specialty Clinics', description: 'Tailored administrative workflows for specialty practices.' },
  { slug: 'healthcare-networks', name: 'Healthcare Networks', description: 'Standardized operational support across multiple locations.' },
];

export const processSteps = [
  { number: '01', label: 'DISCOVER', title: 'Understand the workflow.', description: 'We review how your organization currently operates before recommending anything.' },
  { number: '02', label: 'PLAN', title: 'Identify what to outsource.', description: 'We map which processes are the best fit for outsourced support.' },
  { number: '03', label: 'MATCH', title: 'Determine the support model.', description: 'We define the right NOVALINK team structure for your workflow.' },
  { number: '04', label: 'ONBOARD', title: 'Set up access and documentation.', description: 'Communication channels, workflows, and access are configured together.' },
  { number: '05', label: 'OPERATE', title: 'NOVALINK begins handling the work.', description: 'Your assigned team takes on the agreed operational workload.' },
  { number: '06', label: 'OPTIMIZE', title: 'Review and improve.', description: 'We review outcomes with you and refine the workflow over time.' },
];

export interface FAQ {
  question: string;
  answer: string;
  category: 'Services' | 'Pricing' | 'Security' | 'Outsourcing' | 'Onboarding' | 'Careers' | 'International Clients' | 'General';
}

export const faqs: FAQ[] = [
  { question: 'What does NOVALINK actually do?', answer: 'NOVALINK provides outsourced operational and administrative support for healthcare organizations, including scheduling, documentation, billing administration, and coordination work.', category: 'Services' },
  { question: 'Is NOVALINK a call center?', answer: 'No. NOVALINK provides dedicated operational support teams that integrate into your existing workflows, rather than a shared call-center model.', category: 'Services' },
  { question: 'Where is NOVALINK based?', answer: 'NOVALINK has USA-Canada based operations and works with healthcare organizations internationally.', category: 'General' },
  { question: 'Does NOVALINK handle patient medical records or clinical decisions?', answer: 'No. NOVALINK supports operational and administrative workflows. Clinical decisions remain with your organization\u2019s licensed staff.', category: 'Services' },
  { question: 'How does pricing work?', answer: 'Pricing depends on the scope, volume, and structure of the support your organization needs. Details are discussed during a consultation.', category: 'Pricing' },
  { question: 'What does NOVALINK do to protect data?', answer: 'Security and privacy are fundamental to how NOVALINK designs its operations. Detailed compliance information will be published as applicable.', category: 'Security' },
  { question: 'Is NOVALINK HIPAA compliant?', answer: 'NOVALINK is building its operations around strong security and privacy practices. Specific compliance certifications will be published here once formally confirmed.', category: 'Security' },
  { question: 'How is a NOVALINK engagement structured?', answer: 'Engagements typically move through discovery, planning, matching, onboarding, and ongoing operation, described in more detail on the How It Works page.', category: 'Outsourcing' },
  { question: 'How long does onboarding take?', answer: 'Onboarding timelines depend on the complexity of the workflows being outsourced and are confirmed during planning.', category: 'Onboarding' },
  { question: 'Can NOVALINK support multi-location organizations?', answer: 'Yes. NOVALINK\u2019s operating model is designed to support standardized workflows across multiple locations.', category: 'Outsourcing' },
  { question: 'Does NOVALINK work with organizations outside Canada?', answer: 'Yes. NOVALINK has USA-Canada based operations and serves healthcare organizations internationally.', category: 'International Clients' },
  { question: 'How do I apply for a role at NOVALINK?', answer: 'Open roles are listed on the Careers page, where you can submit an application directly.', category: 'Careers' },
  { question: 'Can I submit patient information through the contact form?', answer: 'No. Public forms on this site are not for patient health information. Please do not submit patient names, medical record numbers, or clinical details here.', category: 'General' },
  { question: 'How do I get started?', answer: 'Book a consultation, and a member of the NOVALINK team will follow up to discuss your organization\u2019s needs.', category: 'Outsourcing' },
];

export interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  workflow: string;
  approach: string;
  operationalImpact: string;
  metrics: string[];
  quote: string;
  isPlaceholder: true;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'demo-medical-practice-scheduling',
    title: 'Streamlining scheduling for a growing practice',
    industry: 'Medical Practices',
    challenge: 'A demo organization needed additional scheduling capacity without adding local headcount.',
    workflow: 'Appointment scheduling, reminders, and waitlist coordination.',
    approach: 'A dedicated virtual scheduling team was onboarded alongside the practice\u2019s existing tools.',
    operationalImpact: '[OUTCOME] — to be replaced with real NOVALINK data.',
    metrics: ['[CLIENT METRIC]', '[TIME SAVED]'],
    quote: '[Placeholder demo quote — not a real client statement.]',
    isPlaceholder: true,
  },
  {
    slug: 'demo-billing-administration',
    title: 'Reducing billing backlog for a specialty clinic',
    industry: 'Specialty Clinics',
    challenge: 'A demo organization\u2019s billing queue had grown faster than internal staffing.',
    workflow: 'Claims preparation, submission support, and AR follow-up.',
    approach: 'NOVALINK\u2019s revenue-cycle team took on the backlog and ongoing volume.',
    operationalImpact: '[OUTCOME] — to be replaced with real NOVALINK data.',
    metrics: ['[CLIENT METRIC]', '[OUTCOME]'],
    quote: '[Placeholder demo quote — not a real client statement.]',
    isPlaceholder: true,
  },
  {
    slug: 'demo-credentialing-coordination',
    title: 'Coordinating multi-provider credentialing',
    industry: 'Hospitals & Health Systems',
    challenge: 'A demo health system needed centralized tracking across many provider credentialing files.',
    workflow: 'Application preparation, payer follow-up, and deadline tracking.',
    approach: 'A dedicated credentialing coordinator managed the queue on a shared tracker.',
    operationalImpact: '[OUTCOME] — to be replaced with real NOVALINK data.',
    metrics: ['[CLIENT METRIC]', '[TIME SAVED]'],
    quote: '[Placeholder demo quote — not a real client statement.]',
    isPlaceholder: true,
  },
];

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  industry: string;
  isPlaceholder: true;
}

export const testimonials: Testimonial[] = [
  { name: 'Demo Contact', role: 'Practice Manager', company: 'Demo Medical Group', quote: '[Placeholder demo testimonial — clearly not a real client statement.]', industry: 'Medical Practices', isPlaceholder: true },
  { name: 'Demo Contact', role: 'Operations Director', company: 'Demo Specialty Clinic', quote: '[Placeholder demo testimonial — clearly not a real client statement.]', industry: 'Specialty Clinics', isPlaceholder: true },
  { name: 'Demo Contact', role: 'Administrator', company: 'Demo Health Network', quote: '[Placeholder demo testimonial — clearly not a real client statement.]', industry: 'Healthcare Networks', isPlaceholder: true },
];

export interface Job {
  slug: string;
  title: string;
  category: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  summary: string;
  isPlaceholder: true;
}

export const jobs: Job[] = [
  { slug: 'virtual-scheduling-coordinator', title: 'Virtual Scheduling Coordinator', category: 'Virtual Healthcare Support', location: 'Remote — International', employmentType: 'Full-time', summary: 'Placeholder role for demonstration of the careers workflow.', isPlaceholder: true },
  { slug: 'medical-billing-specialist', title: 'Medical Billing Specialist', category: 'Revenue Cycle Management', location: 'Remote — International', employmentType: 'Full-time', summary: 'Placeholder role for demonstration of the careers workflow.', isPlaceholder: true },
  { slug: 'credentialing-coordinator', title: 'Credentialing Coordinator', category: 'Provider Operations', location: 'Remote — International', employmentType: 'Contract', summary: 'Placeholder role for demonstration of the careers workflow.', isPlaceholder: true },
];

export const complianceStatement =
  'Security and privacy are fundamental to how NOVALINK designs its operations. Detailed compliance information will be published as applicable.';

export const organizationTypes = [
  { value: 'medical_practice', label: 'Medical Practice' },
  { value: 'hospital_health_system', label: 'Hospital / Health System' },
  { value: 'dental_practice', label: 'Dental Practice' },
  { value: 'behavioral_health', label: 'Behavioral Health' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'imaging_center', label: 'Imaging Center' },
  { value: 'home_healthcare', label: 'Home Healthcare' },
  { value: 'long_term_care', label: 'Long-Term Care' },
  { value: 'other', label: 'Other Healthcare Organization' },
];
