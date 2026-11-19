import { z } from 'zod';

/**
 * Zod v4 changed the literal second-arg API:
 *   - `errorMap` → `error` (string message directly)
 * All consent fields use `z.literal(true, 'message')` which works across v3/v4.
 */

export const contactMessageSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name.').max(120),
  workEmail: z.string().email('Enter a valid work email.'),
  company: z.string().min(2, 'Enter your company name.').max(160),
  jobTitle: z.string().max(160).optional().or(z.literal('')),
  country: z.string().min(2, 'Select your country.'),
  phone: z.string().max(40).optional().or(z.literal('')),
  organizationType: z.enum([
    'medical_practice',
    'hospital_health_system',
    'dental_practice',
    'behavioral_health',
    'pharmacy',
    'laboratory',
    'imaging_center',
    'home_healthcare',
    'long_term_care',
    'other',
  ]),
  interestedServices: z.array(z.string()).min(1, 'Select at least one service.'),
  message: z.string().min(10, 'Tell us a bit more.').max(4000),
  preferredContactMethod: z.enum(['email', 'phone']),
  consent: z.literal(true, 'Consent is required to submit this form.'),
});
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const consultationRequestSchema = z.object({
  preferredDate: z.string().min(1, 'Choose a date.'),
  preferredTime: z.string().min(1, 'Choose a time.'),
  timezone: z.string().min(1, 'Choose a time zone.'),
  fullName: z.string().min(2).max(120),
  workEmail: z.string().email(),
  phone: z.string().min(5, 'Enter a valid phone number.').max(40),
  company: z.string().min(2).max(160),
  country: z.string().min(2),
  organizationType: z.string().min(1),
  interestedServices: z.array(z.string()).min(1, 'Select at least one service.'),
  message: z.string().max(4000).optional().or(z.literal('')),
  consent: z.literal(true, 'Consent is required to submit this form.'),
});
export type ConsultationRequestInput = z.infer<typeof consultationRequestSchema>;

/** Direct booking submission schema (used by the booking engine). */
export const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Select a service.'),
  bookingDate: z.string().min(1, 'Choose a date.'),
  bookingTime: z.string().min(1, 'Choose a time.'),
  contactName: z.string().min(2, 'Enter your full name.').max(120),
  contactEmail: z.string().email('Enter a valid email address.'),
  contactPhone: z.string().min(5, 'Enter a valid phone number.').max(40),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const jobApplicationSchema = z.object({
  jobSlug: z.string().min(1),
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  location: z.string().min(2).max(160),
  relevantExperience: z.string().min(10).max(4000),
  coverLetter: z.string().max(4000).optional().or(z.literal('')),
  consent: z.literal(true, 'Consent is required to submit an application.'),
  // Resume file is validated separately at the route/action boundary
  // (size/type) since File objects don't serialize well through Zod alone.
});
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;

export const signupSchema = z
  .object({
    fullName: z.string().min(2).max(120),
    organizationName: z.string().min(2).max(160),
    workEmail: z.string().email(),
    password: z.string().min(10, 'Use at least 10 characters.'),
    confirmPassword: z.string().min(10),
    consent: z.literal(true, 'You must accept the Terms and Privacy Policy.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Enter your password.'),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Public-form PHI guard: block obvious identifiers before they ever hit the DB. */
export const PHI_WARNING =
  'Do not submit patient medical information or other sensitive health information through this public form.';
