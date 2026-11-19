import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { AdminContentManager } from './AdminContentManager';
import { AdminAnalytics } from './AdminAnalytics';
import {
  getAllJobsForAdmin,
  getAllFaqsForAdmin,
  getAllCaseStudiesForAdmin,
  getAllTestimonialsForAdmin,
} from '@/lib/data/content-repo';

export const metadata: Metadata = {
  title: 'Admin Dashboard — NOVALINK',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // Auth check — must be a logged-in admin
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirectTo=/admin/dashboard');

  const adminClient = createAdminSupabaseClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin =
    profile?.role === 'admin' ||
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin';

  if (!isAdmin) redirect('/client/dashboard');

  // Read status filter from query string
  const params = await searchParams;
  const activeStatus = params.status ?? 'all';

  // 1. Fetch bookings, CMS content, & direct contact messages in parallel
  const [
    { data: allBookings, error: analyticsError },
    jobs,
    faqs,
    caseStudies,
    testimonials,
    { data: contactMessages, error: contactError },
  ] = await Promise.all([
    adminClient
      .from('bookings')
      .select('id, user_id, service_type, booking_date, contact_name, contact_email, contact_phone, status, created_at')
      .order('created_at', { ascending: false }),
    getAllJobsForAdmin(),
    getAllFaqsForAdmin(),
    getAllCaseStudiesForAdmin(),
    getAllTestimonialsForAdmin(),
    adminClient
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false }),
  ]);

  const error = analyticsError || contactError;

  return (
    <div style={{ backgroundColor: 'var(--obsidian)', minHeight: '100vh' }}>
      {/* Header */}
      <section
        style={{
          backgroundColor: 'var(--obsidian)',
          borderBottom: '1px solid var(--obsidian-border)',
        }}
      >
        <div className="container-nova py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--silver-dim)',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                Global Operations · Master Control
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                  color: 'var(--accent-white)',
                  marginBottom: '0.4rem',
                }}
              >
                Executive Admin
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--silver-dim)',
                }}
              >
                Logged in as <span className="text-white font-medium">{profile?.full_name || user.email}</span> ({user.email}) · Full Read/Write Authorization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Charts Section — Subtle Obsidian Glass Card Surface */}
      <section className="border-b border-[#202020] bg-gradient-to-b from-[#0c0c0c] to-[#040404] relative">
        <div className="container-nova py-12 md:py-16">
          <div className="mb-8">
            <span className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-neutral-400 font-bold block mb-1.5">
              Performance Intelligence
            </span>
            <h2 className="font-display text-2xl text-white font-bold tracking-tight">
              Operational Metrics & Capacity
            </h2>
          </div>
          <AdminAnalytics bookings={allBookings ?? []} />
        </div>
      </section>

      {/* Operations & CMS Management Center — Technical Mesh Background */}
      <section className="bg-gradient-to-b from-[#050505] via-[#080808] to-[#020202] relative">
        <div className="container-nova py-12 md:py-20">
          <div className="mb-8">
            <span className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-neutral-400 font-bold block mb-1.5">
              Live Database & Site Content CMS
            </span>
            <h2 className="font-display text-2xl text-white font-bold tracking-tight">
              Operations & Content Management
            </h2>
          </div>

          {error ? (
            <ErrorState message={error.message} />
          ) : (
            <AdminContentManager
              bookings={allBookings ?? []}
              activeStatus={activeStatus}
              jobs={jobs ?? []}
              faqs={faqs ?? []}
              caseStudies={caseStudies ?? []}
              testimonials={testimonials ?? []}
              contactMessages={contactMessages ?? []}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-8 bg-[#0e0e0e] border border-red-900/60 rounded-lg">
      <p className="font-mono text-sm text-red-300">
        ⚠ Failed to load operations data: {message}
      </p>
    </div>
  );
}
