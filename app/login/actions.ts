'use server';

import { redirect } from 'next/navigation';
import { loginSchema } from '@/lib/validation/schemas';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export interface LoginFormState {
  status: 'idle' | 'error';
  fieldErrors?: Record<string, string>;
  message?: string;
}

export async function logIn(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const raw = {
    email: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: 'error', fieldErrors, message: 'Please correct the highlighted fields.' };
  }

  const supabase = await createServerSupabaseClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !authData?.user) {
    return { status: 'error', message: error?.message || 'Incorrect email or password.' };
  }

  const user = authData.user;
  const adminClient = createAdminSupabaseClient();

  // Query profiles using admin client (bypasses RLS so role is always retrieved reliably)
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin =
    profile?.role === 'admin' ||
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin';

  if (isAdmin) {
    // Sync profile role if needed
    if (profile?.role !== 'admin') {
      await adminClient.from('profiles').upsert({
        id: user.id,
        role: 'admin',
        full_name: user.user_metadata?.full_name || 'Admin',
      });
    }
    redirect('/admin/dashboard');
  }

  // Ensure regular profile exists
  if (!profile) {
    await adminClient.from('profiles').insert({
      id: user.id,
      role: 'client',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
    });
  }

  const redirectTo = String(formData.get('redirectTo') || '');
  if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
    redirect(redirectTo);
  }

  redirect('/client/dashboard');
}

export async function requestPasswordReset(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const email = String(formData.get('email') || '');
  const parsed = loginSchema.pick({ email: true }).safeParse({ email });
  if (!parsed.success) {
    return { status: 'error', message: 'Enter a valid email address.' };
  }

  const supabase = await createServerSupabaseClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/login/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });

  if (error) {
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }

  return { status: 'error', message: 'If an account exists for that email, a reset link has been sent.' };
}

export async function logOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/login');
}