'use server';

import { contactMessageSchema } from '@/lib/validation/schemas';
import { createContactMessage, createLead } from '@/lib/data/submissions';

export interface ContactFormState {
  status: 'idle' | 'success' | 'error';
  fieldErrors?: Record<string, string>;
  message?: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    fullName: String(formData.get('fullName') || ''),
    workEmail: String(formData.get('workEmail') || ''),
    company: String(formData.get('company') || ''),
    jobTitle: String(formData.get('jobTitle') || ''),
    country: String(formData.get('country') || ''),
    phone: String(formData.get('phone') || ''),
    organizationType: String(formData.get('organizationType') || ''),
    interestedServices: formData.getAll('interestedServices').map(String),
    message: String(formData.get('message') || ''),
    preferredContactMethod: String(formData.get('preferredContactMethod') || 'email'),
    consent: formData.get('consent') === 'on',
  };

  const parsed = contactMessageSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: 'error', fieldErrors, message: 'Please correct the highlighted fields.' };
  }

  try {
    await createContactMessage(parsed.data);
    await createLead({
      source: 'contact_form',
      fullName: parsed.data.fullName,
      workEmail: parsed.data.workEmail,
      company: parsed.data.company,
      country: parsed.data.country,
      organizationType: parsed.data.organizationType,
    });
  } catch (err) {
    console.error('submitContactForm error', err);
    return { status: 'error', message: 'Something went wrong submitting your message. Please try again.' };
  }

  return { status: 'success', message: 'Thank you — a member of the NOVALINK team will follow up shortly.' };
}
