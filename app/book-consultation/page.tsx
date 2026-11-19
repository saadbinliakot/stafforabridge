import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildMetadata } from '@/lib/utils/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BookingForm } from './BookingForm';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export const metadata: Metadata = buildMetadata({
  title: 'Book a Consultation',
  description: 'Request a consultation with the NOVALINK team.',
  path: '/book-consultation',
});

export default async function BookConsultationPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/book-consultation');
  }

  const adminClient = createAdminSupabaseClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle();

  const defaultName = profile?.full_name || user.user_metadata?.full_name || '';
  const defaultEmail = user.email || '';

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Page Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern relative">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Book a Consultation' }]}
          />

          <div className="mt-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Outsourcing Engagement · Secure Live Slot
              </span>
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-[var(--accent-white)] mb-6 max-w-3xl">
            Book a Consultation
          </h1>

          <p className="font-mono text-sm md:text-base text-[var(--silver-muted)] max-w-2xl leading-relaxed">
            Select your preferred consultation window and the outsourcing role you require.
            A NOVALINK clinical engagement partner will confirm calendar placement within 1 business day.
          </p>
        </div>
      </section>

      {/* Booking Funnel Container — Clean Surface (No Bulky Enclosing Box) */}
      <section className="relative">
        <div className="container-nova py-14 md:py-20">
          <div className="max-w-3xl mx-auto">
            <BookingForm defaultName={defaultName} defaultEmail={defaultEmail} />
          </div>
        </div>
      </section>

      {/* Trust & SLA Signals */}
      <section className="border-t border-[var(--obsidian-border)] bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                number: '01',
                label: 'Guaranteed 24H Response',
                desc: 'Every scheduling submission is reviewed personally by a Canadian operations director with calendar confirmation.',
              },
              {
                number: '02',
                label: 'Exploratory & Zero Obligation',
                desc: 'Preliminary consultations are completely advisory with no minimum term commitments or contracts attached.',
              },
              {
                number: '03',
                label: 'HIPAA & PIPEDA Governed',
                desc: 'All communications, data infrastructure, and patient privacy frameworks meet North American regulatory standards.',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="card-interactive p-8 sm:p-9 md:p-10 bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] rounded-[3px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <span className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-neutral-400 font-bold">
                      Standard Practice
                    </span>
                    <span className="font-mono text-xs px-2.5 py-0.5 bg-[#141414] border border-[#2e2e2e] text-white font-bold rounded">
                      {item.number}
                    </span>
                  </div>
                  <h4 className="font-display text-lg text-white font-bold mb-3">
                    {item.label}
                  </h4>
                  <p className="font-mono text-xs text-neutral-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

