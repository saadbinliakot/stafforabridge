'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized: No active session found. Please log in.');

  const adminClient = createAdminSupabaseClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin =
    profile?.role === 'admin' ||
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin';

  if (!isAdmin) {
    throw new Error('Forbidden: Your account does not have admin permissions.');
  }
  return user;
}

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId);

  if (error) {
    console.error('updateBookingStatus error:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/client/dashboard');
  return { success: true };
}

export async function updateBookingDetails(
  bookingId: string,
  payload: {
    serviceType: string;
    bookingDate: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    status: string;
  }
) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const rawDate = payload.bookingDate ? new Date(payload.bookingDate) : new Date();
  const validDate = isNaN(rawDate.getTime()) ? new Date().toISOString() : rawDate.toISOString();

  const { error } = await adminClient
    .from('bookings')
    .update({
      service_type: payload.serviceType,
      booking_date: validDate,
      contact_name: payload.contactName,
      contact_email: payload.contactEmail,
      contact_phone: payload.contactPhone,
      status: payload.status,
    })
    .eq('id', bookingId);

  if (error) {
    console.error('updateBookingDetails error:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/client/dashboard');
  return { success: true };
}

export async function deleteBooking(bookingId: string) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    console.error('deleteBooking error:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/client/dashboard');
  return { success: true };
}

export async function createManualBooking(payload: {
  serviceType: string;
  bookingDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
}) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const rawDate = payload.bookingDate ? new Date(payload.bookingDate) : new Date();
  const validDate = isNaN(rawDate.getTime()) ? new Date().toISOString() : rawDate.toISOString();

  const { error } = await adminClient
    .from('bookings')
    .insert({
      service_type: payload.serviceType,
      booking_date: validDate,
      contact_name: payload.contactName,
      contact_email: payload.contactEmail,
      contact_phone: payload.contactPhone,
      status: payload.status || 'pending',
    });

  if (error) {
    console.error('createManualBooking error:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/client/dashboard');
  return { success: true };
}
