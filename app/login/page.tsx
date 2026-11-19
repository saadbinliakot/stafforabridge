import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildMetadata } from '@/lib/utils/seo';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = buildMetadata({
  title: 'Login',
  description: 'Log in to your NOVALINK account.',
  path: '/login',
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const redirectTo = params?.redirectTo || '';

  if (user) {
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

    if (isAdmin) {
      redirect('/admin/dashboard');
    }

    if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
      redirect(redirectTo);
    }

    redirect('/client/dashboard');
  }

  return (
    <section className="bg-[var(--obsidian)] min-h-[85vh] flex items-center justify-center py-16 md:py-24">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-10 rounded-[3px] shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[0.62rem] tracking-wider uppercase text-[var(--silver-muted)]">
              Portal Access
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-2">
            Login
          </h1>
          <p className="font-mono text-xs text-[var(--silver-dim)] mb-8 leading-relaxed">
            Sign in to access your consultations, bookings, and clinical operations.
          </p>
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </section>
  );
}
