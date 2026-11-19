'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function updateClientProfile(payload: {
  fullName: string;
  phone?: string;
  organizationName?: string;
  organizationType?: string;
  country?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized: Please log in to update your profile.');
  }

  const adminClient = createAdminSupabaseClient();

  // 1. Update profiles table
  const { error: profileError } = await adminClient
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: payload.fullName,
      role: 'client',
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.error('Profile update error:', profileError);
    throw new Error(profileError.message);
  }

  // 2. Update user metadata
  await supabase.auth.updateUser({
    data: {
      full_name: payload.fullName,
      phone: payload.phone || null,
      organization_name: payload.organizationName || null,
    },
  });

  // 3. Update or create organization if organizationName is provided
  if (payload.organizationName) {
    const { data: member } = await adminClient
      .from('organization_members')
      .select('organization_id')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (member?.organization_id) {
      await adminClient
        .from('organizations')
        .update({
          name: payload.organizationName,
          organization_type: payload.organizationType || null,
          country: payload.country || 'Canada',
          updated_at: new Date().toISOString(),
        })
        .eq('id', member.organization_id);
    } else {
      const { data: newOrg } = await adminClient
        .from('organizations')
        .insert({
          name: payload.organizationName,
          organization_type: payload.organizationType || null,
          country: payload.country || 'Canada',
        })
        .select('id')
        .single();

      if (newOrg) {
        await adminClient.from('organization_members').insert({
          organization_id: newOrg.id,
          profile_id: user.id,
          role: 'admin',
        });
      }
    }
  }

  revalidatePath('/client/dashboard');
  revalidatePath('/client/profile');
  return { success: true };
}

export async function triggerPasswordReset() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error('No user email associated with this session.');
  }

  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/login/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: `Password reset instructions sent to ${user.email}` };
}
