import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'Terms governing use of the NOVALINK website.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Decorative vertical ambient side lines */}
      <div className="ambient-side-accent left-8 hidden lg:block" />
      <div className="ambient-side-accent right-8 hidden lg:block" />

      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} />
          <div className="mt-8">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] block mb-4">
              Legal Framework
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Terms of Service
            </h1>
            <p className="font-mono text-xs text-[var(--silver-dim)]">
              Effective Date: October 2026 · Master Services Standard
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-20 max-w-4xl">
          <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-8 md:p-12 space-y-8 font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
            <div>
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">1. Website Purpose and Limitations</h2>
              <p>
                This digital platform serves as a corporate informational portal and consultation intake engine for NOVALINK
                Healthcare Operations. It is not an electronic medical record system and does not render medical diagnoses or clinical care.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">2. Service Level Agreements</h2>
              <p>
                Any actual staffing, virtual healthcare support, revenue cycle management, or medical scribe placement is
                governed by a formalized Master Services Agreement (MSA) and Business Associate Agreement (BAA) executed
                between NOVALINK and the client organization.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">3. Account Integrity & Security</h2>
              <p>
                Clients granted access to the NOVALINK Client Portal or administrative workspaces are responsible for
                maintaining the confidentiality of their credentials and multifactor authentication tokens.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">4. Governing Law</h2>
              <p>
                These terms shall be construed and governed in accordance with the laws of the Province of Ontario and the
                federal laws of Canada applicable therein.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
