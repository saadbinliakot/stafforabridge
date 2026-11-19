import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { ClientLocationSelector } from './ClientLocationSelector';

export const metadata: Metadata = {
  title: 'Dashboard — NOVALINK',
  robots: { index: false, follow: false },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; desc: string; badge: string }> = {
    pending: {
      label: 'Pending Review',
      desc: 'Our clinical operations team is reviewing your staffing requirements.',
      badge: 'badge-pending',
    },
    confirmed: {
      label: 'Confirmed',
      desc: 'Dedicated healthcare coordinator assigned. Kickoff session scheduled.',
      badge: 'badge-confirmed',
    },
    completed: {
      label: 'Active & Deployed',
      desc: 'Outsourcing role in active operation.',
      badge: 'badge-completed',
    },
    cancelled: {
      label: 'Cancelled',
      desc: 'Booking closed or superseded.',
      badge: 'badge-cancelled',
    },
  };
  return map[status] || map.pending;
}

export default async function ClientDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/client/dashboard');
  }

  const adminClient = createAdminSupabaseClient();

  // Fetch client profile safely with admin client
  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('id', user.id)
    .maybeSingle();

  // If user is admin, route them straight to the executive admin dashboard
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

  // Fetch bookings matching this user_id OR their email
  const { data: bookings } = await adminClient
    .from('bookings')
    .select('id, service_type, booking_date, contact_name, contact_email, contact_phone, status, created_at')
    .or(`user_id.eq.${user.id},contact_email.eq.${user.email}`)
    .order('created_at', { ascending: false });

  const activeBookings = bookings ?? [];

  return (
    <div style={{ backgroundColor: 'var(--obsidian)', minHeight: '100vh' }}>
      {/* Client Header */}
      <section
        style={{
          backgroundColor: 'var(--obsidian)',
          borderBottom: '1px solid var(--obsidian-border)',
        }}
        className="relative"
      >
        <div className="container-nova py-12 md:py-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-2">
            <div className="min-w-0">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--silver-dim)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Operations Portal · Global Healthcare Operations
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  color: 'var(--accent-white)',
                  marginBottom: '0.4rem',
                }}
              >
                {org?.name ? org.name : profile?.full_name ? profile.full_name : 'Welcome Back'}
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--silver-dim)',
                }}
              >
                Account: <span className="text-white font-medium">{user.email}</span> ·{' '}
                {org?.organization_type ? `${org.organization_type.replace('_', ' ')} · ` : ''}
                Member since {formatDate(profile?.created_at || user.created_at).slice(0, 12)}
              </p>
            </div>

            {/* Action buttons: Book Another Role & Profile & Settings docked to the right */}
            <div className="flex flex-wrap items-center justify-end gap-4 w-full sm:w-auto sm:ml-auto shrink-0 pt-2 sm:pt-0 self-end sm:self-center">
              <Link
                href="/book-consultation"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '44px',
                  padding: '0 24px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: '1px solid #ffffff',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 2px 10px rgba(255,255,255,0.15)',
                  whiteSpace: 'nowrap',
                }}
                className="hover:scale-[1.02] active:scale-[0.98]"
              >
                <span style={{ fontSize: '13px', lineHeight: 1 }}>+</span>
                <span>Book Another Role</span>
              </Link>

              <Link
                href="/client/profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '44px',
                  padding: '0 22px',
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
                  whiteSpace: 'nowrap',
                }}
                className="hover:bg-[#1a1a1a] hover:border-white/50 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Profile & Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-textured-alt relative">
        <div className="container-nova py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Bookings & Engagements */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-[#202020] pb-4">
                <div>
                  <span className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-neutral-400 font-bold block mb-1">
                    Staffing Engagements
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl text-white font-bold tracking-tight">
                    Active & Requested Roles
                  </h2>
                </div>
                <span className="font-mono text-xs text-neutral-400">
                  {activeBookings.length} total request{activeBookings.length !== 1 ? 's' : ''}
                </span>
              </div>

              {activeBookings.length === 0 ? (
                <div className="surface-obsidian-glass rounded-xl p-10 sm:p-14 text-center space-y-4 shadow-2xl">
                  <p className="font-mono text-sm text-white font-medium">
                    You do not have any active outsourcing bookings yet.
                  </p>
                  <p className="font-mono text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Select an outsourcing role like Appointment Setting & Scheduling, Medical Billing, or
                    Clinical Documentation to connect your healthcare workflows.
                  </p>
                  <div className="pt-2">
                    <Link href="/book-consultation" className="btn-primary !py-2.5 !px-6 !text-xs shadow-md">
                      Schedule Your First Consultation
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {activeBookings.map((b) => {
                    const statusInfo = statusBadge(b.status);
                    return (
                      <div
                        key={b.id}
                        className="surface-obsidian-glass rounded-xl p-6 sm:p-7 flex flex-col gap-4 hover:border-white/20 transition-all shadow-xl"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <span className="font-mono text-[0.62rem] uppercase tracking-wider text-neutral-400 font-bold block">
                              Outsourcing Role
                            </span>
                            <h3 className="font-display text-lg text-white font-bold">
                              {b.service_type}
                            </h3>
                          </div>
                          <div>
                            <span
                              className={`${statusInfo.badge} font-mono text-[0.65rem] tracking-wider uppercase px-3 py-1 rounded font-bold inline-block`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>

                        <p className="font-mono text-xs text-neutral-300 leading-relaxed">
                          {statusInfo.desc}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5 border-t border-[#1e1e1e] font-mono text-[0.75rem]">
                          <div>
                            <span className="text-neutral-400 block text-[0.62rem] uppercase font-bold">
                              Scheduled Date
                            </span>
                            <span className="text-white font-medium">
                              {formatDate(b.booking_date)}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block text-[0.62rem] uppercase font-bold">
                              Registered Contact
                            </span>
                            <span className="text-neutral-200">{b.contact_name}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block text-[0.62rem] uppercase font-bold">
                              Reference ID
                            </span>
                            <span className="text-neutral-400 font-mono">
                              #{b.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 4 Cols: Operations Desk & Account Summary */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Support & Account Manager */}
              <div className="surface-obsidian-glass rounded-xl p-6 sm:p-7 flex flex-col gap-4 shadow-xl">
                <div>
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                    Operations Support
                  </span>
                  <h3 className="font-display text-base text-white font-bold">
                    Dedicated Account Team
                  </h3>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <p className="text-white font-semibold">Sarah M. Tremblay</p>
                  <p className="text-neutral-400 text-[0.72rem]">
                    Director of Client Operations · USA & Canada
                  </p>
                </div>

                <div className="space-y-2.5 font-mono text-xs pt-3.5 border-t border-[#1e1e1e]">
                  <div>
                    <span className="text-neutral-400 block text-[0.62rem] uppercase font-bold">
                      Direct Email
                    </span>
                    <a
                      href="mailto:operations@novalink.ca"
                      className="text-neutral-200 hover:text-white underline"
                    >
                      operations@novalink.ca
                    </a>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[0.62rem] uppercase font-bold">
                      Toll-Free Escalation
                    </span>
                    <a href="tel:+18004196682" className="text-neutral-200 hover:text-white underline">
                      +1 (800) 419-NOVA
                    </a>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[0.62rem] uppercase font-bold">
                      SLA Commitment
                    </span>
                    <span className="text-neutral-300">Guaranteed response &lt; 2h</span>
                  </div>
                </div>
              </div>

              {/* Organization Quick Info & Interactive Location Selector */}
              <div className="surface-obsidian-glass rounded-xl p-6 sm:p-7 flex flex-col gap-4 font-mono text-xs shadow-xl">
                <div>
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                    Compliance & Entity
                  </span>
                  <h4 className="font-display text-sm text-white font-bold">
                    Organization Profile
                  </h4>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#1e1e1e] text-[0.75rem]">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Entity:</span>
                    <span className="text-white font-medium">{org?.name || 'Personal Account'}</span>
                  </div>

                  {/* Interactive Location Selector */}
                  <ClientLocationSelector currentLocation={org?.country || 'Canada'} />

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Data Compliance:</span>
                    <span className="text-emerald-400 font-medium">HIPAA / PIPEDA Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Tier:</span>
                    <span className="text-white font-medium">Enterprise Dedicated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
