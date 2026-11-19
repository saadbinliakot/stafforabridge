import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { ProfileForm } from './ProfileForm';

export const metadata: Metadata = {
  title: 'Client Profile & Settings — NOVALINK',
  robots: { index: false, follow: false },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

export default async function ClientProfilePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/client/profile');
  }

  const adminClient = createAdminSupabaseClient();

  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('id', user.id)
    .maybeSingle();

  // If user is admin, route them straight to executive admin dashboard
  const isAdmin =
    profile?.role === 'admin' ||
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin';

  if (isAdmin) {
    redirect('/admin/dashboard');
  }

  // Fetch client organization info if present
  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id, role, organizations(name, country, organization_type)')
    .eq('profile_id', user.id)
    .maybeSingle();

  const org = (member as any)?.organizations;

  return (
    <div className="bg-[var(--obsidian)] min-h-screen">
      {/* Top Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] py-10 sm:py-14">
        <div className="container-nova flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[var(--silver-dim)] block mb-1">
              Account Management · Client Settings
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--accent-white)]">
              Profile & Settings
            </h1>
          </div>

          <div className="flex items-center">
            <Link
              href="/client/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                height: '42px',
                padding: '0 20px',
                backgroundColor: '#121212',
                color: '#e2e2e2',
                border: '1px solid #2e2e2e',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.18s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
              className="hover:bg-[#1a1a1a] hover:border-white/50 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-nova py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <ProfileForm
            userEmail={user.email || ''}
            memberSince={formatDate(user.created_at || profile?.created_at || '')}
            initialName={profile?.full_name || user.user_metadata?.full_name || ''}
            initialPhone={user.user_metadata?.phone || ''}
            initialOrgName={org?.name || user.user_metadata?.organization_name || ''}
            initialOrgType={org?.organization_type || ''}
            initialCountry={org?.country || 'Canada'}
          />
        </div>
      </div>
    </div>
  );
}
