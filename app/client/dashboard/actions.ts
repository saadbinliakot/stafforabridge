'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function updateClientLocationAction(country: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const adminClient = createAdminSupabaseClient();

  // Find membership
  const { data: member } = await adminClient
    .from('organization_members')
    .select('organization_id')
    .eq('profile_id', user.id)
    .maybeSingle();

  if (member?.organization_id) {
    // Update existing organization
    await adminClient
      .from('organizations')
      .update({ country, updated_at: new Date().toISOString() })
      .eq('id', member.organization_id);
  } else {
    // Create organization and link user
    const { data: newOrg } = await adminClient
      .from('organizations')
      .insert([
        {
          name: `${user.email?.split('@')[0] || 'Client'} Organization`,
          country,
          organization_type: 'medical_practice',
        },
      ])
      .select('id')
      .single();

    if (newOrg?.id) {
      await adminClient.from('organization_members').insert([
        {
          organization_id: newOrg.id,
          profile_id: user.id,
          role: 'admin',
        },
      ]);
    }
  }

  revalidatePath('/client/dashboard');
  return { success: true };
}

