import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { complianceStatement } from '@/lib/data/content';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: 'NOVALINK is a USA-Canada based healthcare outsourcing company serving organizations internationally.',
  path: '/about',
});

const pillars = [
  {
    number: '01',
    title: 'USA-Canada Based Operations',
    body: 'With operations anchored across the United States and Canada, NOVALINK provides centralized governance, compliance oversight, and accountable executive management for international healthcare clients.',
  },
  {
    number: '02',
    title: 'Pure Operational Focus',
    body: 'We exclusively execute administrative, technical, billing, and back-office workflows. Clinical judgment remains 100% under the supervision of your licensed providers.',
  },
  {
    number: '03',
    title: 'Embedded Staffing Model',
    body: 'We reject anonymous shared queues. Each client receives named, dedicated personnel who log into your systems, attend your huddles, and operate as your team.',
  },
  {
    number: '04',
    title: 'Technology & Automation First',
    body: 'Our specialists leverage modern robotic process workflows, automated EHR entry scripts, and secure integration layers to double operational throughput.',
  },
  {
    number: '05',
    title: 'Rigorous Security Posture',
    body: complianceStatement,
  },
  {
    number: '06',
    title: 'Cross-Border Flexibility',
    body: 'Architected to service clinical groups, dental networks, hospital systems, and digital health operators across North America, the UK, and Australia.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Hero */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                About NOVALINK Healthcare Operations
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Healthcare operations, without the overhead.
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              NOVALINK is a specialized healthcare outsourcing firm with USA-Canada based operations. We engineer and manage
              dedicated back-office operations for healthcare networks worldwide, allowing clinical teams to devote 100%
              of their focus to patient care.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Operating Architecture" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-9 md:p-10 rounded-[3px] flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] text-[var(--silver-dim)] inline-block mb-6">
                    {pillar.number}
                  </span>
                  <h3 className="font-display text-lg md:text-xl text-[var(--accent-white)] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[var(--obsidian-border)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="bg-[var(--obsidian-card)] border-t border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-2">
              Meet the people behind NOVALINK.
            </h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-dim)] max-w-lg">
              Explore our clinical governance structure, leadership guidelines, and talent acquisition criteria.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <PrimaryButton href="/team">View Governance & Team</PrimaryButton>
            <SecondaryButton href="/book-consultation">Schedule Intake</SecondaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
