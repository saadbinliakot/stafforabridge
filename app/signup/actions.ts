'use server';

import { redirect } from 'next/navigation';
import { signupSchema } from '@/lib/validation/schemas';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export interface SignupFormState {
  status: 'idle' | 'success' | 'error';
  fieldErrors?: Record<string, string>;
  message?: string;
}

export async function signUp(_prevState: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const raw = {
    fullName: String(formData.get('fullName') || ''),
    organizationName: String(formData.get('organizationName') || ''),
    workEmail: String(formData.get('workEmail') || ''),
    password: String(formData.get('password') || ''),
    confirmPassword: String(formData.get('confirmPassword') || ''),
    consent: formData.get('consent') === 'on',
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: 'error', fieldErrors, message: 'Please correct the highlighted fields.' };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.workEmail,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        organization_name: parsed.data.organizationName,
      },
    },
  });

  if (error) {
    return { status: 'error', message: error.message };
  }

  // Fail-safe: ensure a profile record exists in profiles table
  if (data.user) {
    try {
      const adminClient = createAdminSupabaseClient();
      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!existingProfile) {
        await adminClient.from('profiles').insert([
          {
            id: data.user.id,
            full_name: parsed.data.fullName,
            role: 'client',
          },
        ]);
      }
    } catch (e) {
      console.warn('Profile fail-safe insert warning:', e);
    }
  }

  const redirectTo = String(formData.get('redirectTo') || '');

  // If session was immediately established (email auto-confirmed)
  if (data.session) {
    if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
      redirect(redirectTo);
    }
    redirect('/client/dashboard');
  }

  if (data.user && !data.session) {
    return {
      status: 'success',
      message: 'Account created! Please check your email to verify your account before signing in.',
    };
  }

  return { status: 'success', message: 'Account created successfully. You can now log in.' };
}