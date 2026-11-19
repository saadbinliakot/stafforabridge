'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export interface CurrentAuthUser {
  id: string;
  email: string;
  role: 'admin' | 'client';
}

/**
 * Authoritative server action to retrieve the authenticated user and resolved role.
 * Uses service role for profile lookup to bypass RLS and guarantee 100% accurate role.
 */
export async function getSessionUser(): Promise<CurrentAuthUser | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) return null;

    const adminClient = createAdminSupabaseClient();
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role =
      profile?.role === 'admin' ||
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin'
        ? 'admin'
        : 'client';

    return {
      id: user.id,
      email: user.email,
      role,
    };
  } catch (err) {
    console.error('getSessionUser failed:', err);
    return null;
  }
}
