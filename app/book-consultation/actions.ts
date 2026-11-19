'use server';

import { bookingSchema } from '@/lib/validation/schemas';
import { createBooking } from '@/lib/data/submissions';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface BookingFormState {
  status: 'idle' | 'success' | 'error';
  fieldErrors?: Record<string, string>;
  message?: string;
}

export async function submitBooking(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: 'You must be logged in to book a consultation. Please sign in to continue.',
    };
  }

  const raw = {
    serviceType: String(formData.get('serviceType') || ''),
    bookingDate: String(formData.get('bookingDate') || ''),
    bookingTime: String(formData.get('bookingTime') || ''),
    contactName: String(formData.get('contactName') || ''),
    contactEmail: String(formData.get('contactEmail') || ''),
    contactPhone: String(formData.get('contactPhone') || ''),
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: 'error', fieldErrors, message: 'Please correct the highlighted fields.' };
  }

  try {
    await createBooking(parsed.data);
  } catch (err: any) {
    console.error('submitBooking error', err);
    return {
      status: 'error',
      message: err?.message || 'Something went wrong submitting your booking. Please try again.',
    };
  }

  return {
    status: 'success',
    message: 'Your booking request has been received. NOVALINK will confirm within 1 business day.',
  };
}
