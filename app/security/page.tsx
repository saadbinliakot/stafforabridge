import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { complianceStatement } from '@/lib/data/content';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export const metadata: Metadata = buildMetadata({
  title: 'Security & Compliance',
  description: 'How NOVALINK approaches security, data isolation, and clinical confidentiality.',
  path: '/security',
});

export default function SecurityPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Security & Compliance' }]} />
          <div className="mt-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-emerald-900/50 bg-emerald-950/20 text-emerald-400 rounded-full max-w-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase font-medium leading-normal">
                Data Isolation Standard
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Security Architecture
            </h1>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] max-w-2xl leading-relaxed">
              NOVALINK is built from the ground up on zero-trust principles. We do not ingest, re-host, or aggregate
              patient records. Our remote teams work within secure customer enclaves with hardware and session controls.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-20 max-w-4xl">
          {/* Main Statement Box */}
          <div className="border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-card)] p-8 mb-8">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] block mb-3">
              Official Compliance Statement
            </span>
            <p className="font-mono text-sm md:text-base text-[var(--silver)] leading-relaxed">
              {complianceStatement}
            </p>
          </div>

          <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-8 md:p-12 space-y-8 font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
            <div>
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">Postgres Row Level Security (RLS)</h2>
              <p>
                All internal data storage is enforced by strict database-layer policies in Postgres. Unauthenticated
                queries cannot read platform data, and client accounts are cryptographically partitioned using Supabase Auth
                UUID scoping.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">Virtual Desktop Infrastructure (VDI)</h2>
              <p>
                NOVALINK operational staff utilize enterprise VDI instances or zero-trust client tunnels configured to prohibit
                local clipboard sharing, external file downloading, or unauthorized network egress.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">Clean Desk Policy & Screen Auditing</h2>
              <p>
                Every specialist undergoes physical environment verification and clean desk training. Session recordings,
                multi-factor authentication (MFA), and automated inactivity locks are standard across all dedicated client shifts.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">BAA & MSA Governance</h2>
              <p>
                Prior to commencement of any healthcare workflow, NOVALINK enters into a comprehensive Business Associate
                Agreement (BAA) and Data Processing Agreement conforming to United States HIPAA and Canadian provincial health
                privacy statutes.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 p-8 border border-[var(--obsidian-border)] bg-[var(--obsidian-elevated)]">
            <div>
              <h3 className="font-display text-xl text-[var(--accent-white)] mb-1">Request Security Whitepaper</h3>
              <p className="font-mono text-xs text-[var(--silver-dim)]">
                Receive our comprehensive 24-page network architecture and clinical protocol package.
              </p>
            </div>
            <div className="flex gap-4">
              <PrimaryButton href="/contact">Request Documentation</PrimaryButton>
              <SecondaryButton href="/book-consultation">Schedule Intake</SecondaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
