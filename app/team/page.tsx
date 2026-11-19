import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export const metadata: Metadata = buildMetadata({
  title: 'Team & Governance',
  description: 'The NOVALINK leadership team and clinical operations governance.',
  path: '/team',
});

interface LeadershipRole {
  division: string;
  focus: string;
  location: string;
  governance: string;
}

const leadershipDivisions: LeadershipRole[] = [
  {
    division: 'Clinical Operations Directorate',
    focus: 'EHR workflows, clinical documentation audits, and medical terminology compliance.',
    location: 'Ontario, Canada',
    governance: 'Continuous review of provider communication protocols and chart accuracy standards.',
  },
  {
    division: 'Revenue Cycle Management & Billing Architecture',
    focus: 'Prior authorization escalation, denial turnaround management, and payer portal integration.',
    location: 'Toronto, Canada',
    governance: 'Ensures claims clean-pass rates exceed 97% across commercial and public payers.',
  },
  {
    division: 'Global Talent & Security Governance',
    focus: 'Specialist vetting, VPN security architecture, clean desk compliance, and credentialing.',
    location: 'Canada / International Hubs',
    governance: 'Zero-trust infrastructure oversight, hardware auditing, and ongoing background verification.',
  },
];

export default function TeamPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Team & Governance' }]} />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Executive Governance
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Leadership & Operational Oversight
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              NOVALINK combines centralized Canadian leadership with globally deployed operations teams.
              Every practice account is supervised directly by seasoned clinical operations directors to guarantee SLA adherence.
            </p>
          </div>
        </div>
      </section>

      {/* Governance Divisions */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Operating Divisions" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {leadershipDivisions.map((division) => (
              <div
                key={division.division}
                className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-9 md:p-10 rounded-[3px] flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] text-[var(--silver-dim)] inline-block mb-6">
                    {division.location}
                  </span>
                  <h3 className="font-display text-lg md:text-xl text-[var(--accent-white)] mb-3">
                    {division.division}
                  </h3>
                  <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed mb-6">
                    {division.focus}
                  </p>
                </div>
                <div className="pt-6 border-t border-[var(--obsidian-border)]">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--silver-dim)] block mb-1">
                    Quality Mandate
                  </span>
                  <p className="font-mono text-xs text-[var(--silver)]">
                    {division.governance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[var(--obsidian-card)]">
        <div className="container-nova py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-2">
              Speak with an Operations Director
            </h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-dim)] max-w-lg">
              Discuss your organization’s workload bottlenecks and receive a dedicated resource allocation proposal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <PrimaryButton href="/book-consultation">Book Consultation</PrimaryButton>
            <SecondaryButton href="/contact">Inquire with Desk</SecondaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
