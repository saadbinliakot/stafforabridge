import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ContactMessageInput, ConsultationRequestInput, BookingInput } from '@/lib/validation/schemas';

/**
 * All public-form writes go through this module, using the anon-key
 * server client — so Postgres RLS INSERT policies (see
 * supabase/migrations) are the real enforcement point, not this code.
 */

export async function createContactMessage(input: ContactMessageInput) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('contact_messages').insert({
    full_name: input.fullName,
    work_email: input.workEmail,
    company: input.company,
    job_title: input.jobTitle || null,
    country: input.country,
    phone: input.phone || null,
    organization_type: input.organizationType,
    interested_services: input.interestedServices,
    message: input.message,
    preferred_contact_method: input.preferredContactMethod,
    consent: input.consent,
  });
  if (error) throw error;
}

export async function createLead(params: {
  source: string;
  fullName: string;
  workEmail: string;
  company?: string | null;
  country?: string | null;
  organizationType?: string | null;
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('leads').insert({
    source: params.source,
    full_name: params.fullName,
    work_email: params.workEmail,
    company: params.company ?? null,
    country: params.country ?? null,
    organization_type: params.organizationType ?? null,
  });
  if (error) throw error;
}

export async function createConsultationRequest(input: ConsultationRequestInput) {
  const supabase = await createServerSupabaseClient();

  // Generate the row's id ourselves rather than reading it back via
  // `.select().single()`. Chaining `.select()` onto an insert makes
  // PostgREST return the row through the table's SELECT policy — and
  // consultation_requests only allows admins to SELECT. An anonymous
  // visitor can INSERT (its policy is `with check (true)`) but can't be
  // shown the row back, which Postgres reports as an RLS violation on
  // the whole statement. Supplying the id up front avoids ever needing
  // the RETURNING/select step.
  const consultationRequestId = crypto.randomUUID();

  const { error } = await supabase.from('consultation_requests').insert({
    id: consultationRequestId,
    preferred_date: input.preferredDate,
    preferred_time: input.preferredTime,
    timezone: input.timezone,
    full_name: input.fullName,
    work_email: input.workEmail,
    company: input.company,
    country: input.country,
    organization_type: input.organizationType,
    interested_services: input.interestedServices,
    message: input.message || null,
    consent: input.consent,
    status: 'pending',
  });
  if (error) throw error;

  // Mirror into `bookings` as the canonical scheduling record, structurally
  // ready for a future calendar-provider integration.
  await supabase.from('bookings').insert({
    consultation_request_id: consultationRequestId,
    requested_date: input.preferredDate,
    requested_time: input.preferredTime,
    timezone: input.timezone,
    status: 'requested',
  });

  return consultationRequestId;
}

/**
 * Direct booking write — used by the booking engine.
 * Requires an authenticated user session.
 */
export async function createBooking(input: BookingInput) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required: You must be logged in to book a consultation.');
  }

  // Combine date + time into a proper timestamptz value.
  const bookingDate = new Date(`${input.bookingDate}T${input.bookingTime}:00`);

  const { error } = await supabase.from('bookings').insert({
    user_id: user.id,
    service_type: input.serviceType,
    booking_date: bookingDate.toISOString(),
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone,
    status: 'pending',
  });
  if (error) throw error;
}

export async function createJobApplication(params: {
  jobSlug: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  relevantExperience: string;
  coverLetter?: string | null;
  resumeStoragePath: string | null;
  consent: boolean | true;
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('job_applications').insert({
    job_slug: params.jobSlug,
    full_name: params.fullName,
    email: params.email,
    phone: params.phone,
    location: params.location,
    relevant_experience: params.relevantExperience,
    cover_letter: params.coverLetter ?? null,
    resume_storage_path: params.resumeStoragePath,
    consent: params.consent,
    status: 'submitted',
  });
  if (error) throw error;
}

/**
 * Uploads a resume file to the private `resumes` bucket and returns the
 * storage path (not a public URL — the bucket is private, see
 * supabase/migrations/0001_init.sql storage policies).
 */
export async function uploadResume(file: File, applicantEmail: string) {
  const supabase = await createServerSupabaseClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const path = `applications/${Date.now()}-${applicantEmail.replace(/[^a-zA-Z0-9]/g, '_')}-${safeName}`;

  const { error } = await supabase.storage.from('resumes').upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}