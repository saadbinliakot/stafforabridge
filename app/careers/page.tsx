import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { getOpenJobs } from '@/lib/data/content-repo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { JobCard } from '@/components/cards';
import { SecondaryButton } from '@/components/ui/CTAButton';

export const metadata: Metadata = buildMetadata({
  title: 'Careers',
  description: 'Open roles at NOVALINK in clinical operations, medical billing, and practice administration.',
  path: '/careers',
});

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Careers' }]} />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Talent Acquisition
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Global Healthcare Careers
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              NOVALINK is building an elite distributed workforce supporting healthcare systems internationally.
              We provide competitive compensation, continuous clinical skills development, and permanent dedicated placements.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Available Openings" />
          
          {(jobs as any[]).length === 0 ? (
            <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-12 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--silver-dim)] block mb-3">Notice</span>
              <h3 className="font-display text-xl text-[var(--accent-white)] mb-3">No Open Roles Currently</h3>
              <p className="font-mono text-xs text-[var(--silver-muted)] leading-relaxed mb-6">
                Our active staffing cohorts are fully placed. We open new positions on a rolling bi-weekly basis.
                Feel free to submit a general inquiry to our recruitment coordinator.
              </p>
              <SecondaryButton href="/contact">General Talent Inquiry</SecondaryButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {(jobs as any[]).map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recruitment Process Banner */}
      <section className="bg-[var(--obsidian-card)]">
        <div className="container-nova py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          <div className="card-interactive border border-[var(--obsidian-border)] bg-[var(--obsidian)] p-8 sm:p-9 rounded-[3px]">
            <span className="font-mono text-[0.65rem] text-[var(--silver-dim)] uppercase tracking-widest block mb-3">Step 01</span>
            <h4 className="font-display text-xl text-[var(--accent-white)] mb-3">Clinical Screening</h4>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
              Domain-specific terminology assessments, HIPAA compliance evaluations, and English proficiency testing.
            </p>
          </div>
          <div className="card-interactive border border-[var(--obsidian-border)] bg-[var(--obsidian)] p-8 sm:p-9 rounded-[3px]">
            <span className="font-mono text-[0.65rem] text-[var(--silver-dim)] uppercase tracking-widest block mb-3">Step 02</span>
            <h4 className="font-display text-xl text-[var(--accent-white)] mb-3">Workflow Simulation</h4>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
              Practical chart audit, prior-authorization verification, and EHR navigation exercises.
            </p>
          </div>
          <div className="card-interactive border border-[var(--obsidian-border)] bg-[var(--obsidian)] p-8 sm:p-9 rounded-[3px]">
            <span className="font-mono text-[0.65rem] text-[var(--silver-dim)] uppercase tracking-widest block mb-3">Step 03</span>
            <h4 className="font-display text-xl text-[var(--accent-white)] mb-3">Dedicated Placement</h4>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
              Assigned directly to an international practice with scheduled shift alignment and Canadian leadership support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
