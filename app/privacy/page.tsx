import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How NOVALINK handles information submitted through this website.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Decorative vertical ambient side lines */}
      <div className="ambient-side-accent left-8 hidden lg:block" />
      <div className="ambient-side-accent right-8 hidden lg:block" />

      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
          <div className="mt-8">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] block mb-4">
              Governance & Compliance
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Privacy Policy
            </h1>
            <p className="font-mono text-xs text-[var(--silver-dim)]">
              Last Updated: October 2026 · Operations Version 2.4
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-20 max-w-4xl">
          <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-8 md:p-12 space-y-8 font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
            <div>
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">1. Scope and Applicability</h2>
              <p>
                This privacy policy describes how NOVALINK Healthcare Operations collects, manages, and safeguards
                information submitted through this website and digital booking intake forms. Public forms on this website
                are designed strictly for administrative business communications and operational consultations.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">2. Protected Health Information (PHI) Notice</h2>
              <div className="border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] p-5 mb-4 text-[var(--silver)]">
                <span className="font-mono text-[0.65rem] text-yellow-400 uppercase tracking-widest block mb-1">
                  Important Disclaimer
                </span>
                <p className="text-xs">
                  Public forms on this website are NOT intended for the submission of patient health information or medical records.
                  Please do not submit PHI through unauthenticated public inquiry endpoints.
                </p>
              </div>
              <p>
                All actual clinical workflows, medical chart access, and patient records processing occur exclusively within
                our clients&rsquo; secured, encrypted EHR/PMS environments over dedicated virtual desktop infrastructures.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">3. Database Security and Access Controls</h2>
              <p>
                Information submitted via consultation scheduling and account sign-ups is persisted with Postgres Row Level
                Security (RLS). Access is restricted at the database engine level so that only authenticated account holders
                and authorized NOVALINK operations leads can view relevant booking rows.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">4. International Transfers & Retention</h2>
              <p>
                NOVALINK adheres to Canadian federal PIPEDA standards and applicable provincial legislation (PHIPA).
                Contact submissions are maintained only as long as necessary to facilitate ongoing business relationships
                or fulfill regulatory reporting obligations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
