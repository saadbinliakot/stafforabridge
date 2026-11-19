import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import Link from 'next/link';

export const metadata: Metadata = buildMetadata({
  title: 'Resources',
  description: 'Case studies, success stories, insights, and FAQs from NOVALINK Healthcare Operations.',
  path: '/resources',
});

const sections = [
  {
    href: '/resources/case-studies',
    title: 'Case Studies',
    label: 'Operational Deployments',
    body: 'Detailed breakdowns of clinical staffing models, workload handoffs, and throughput metrics across specialties.',
  },
  {
    href: '/resources/success-stories',
    title: 'Success Stories',
    label: 'Verified Outcomes',
    body: 'Real clinical operational outcomes, denial rate reductions, and practice director feedback.',
  },
  {
    href: '/resources/insights',
    title: 'Insights',
    label: 'Technical Briefings',
    body: 'Articles and whitepapers on modern healthcare operations, EHR automation, and remote staffing governance.',
  },
  {
    href: '/resources/faqs',
    title: 'FAQs',
    label: 'Operational Knowledgebase',
    body: 'Direct answers to questions regarding onboarding times, pricing tiers, compliance frameworks, and team matching.',
  },
];

export default function ResourcesPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Knowledge Base & Field Reports
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Resources & Insights
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              Explore comprehensive case studies, operational frameworks, and actionable analyses designed
              for practice administrators, clinical executives, and healthcare entrepreneurs.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Sections Grid */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Browse Library" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {sections.map((s, idx) => (
              <Link key={s.href} href={s.href} className="group block no-underline">
                <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-10 md:p-12 rounded-[3px] h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--silver-dim)] group-hover:text-[var(--silver)] transition-colors">
                        {s.label}
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 border border-[var(--obsidian-border-strong)] text-[var(--silver-dim)]">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl text-[var(--accent-white)] group-hover:text-white transition-colors mb-3">
                      {s.title}
                    </h3>
                    <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
                      {s.body}
                    </p>
                  </div>

                  <div className="pt-6 mt-8 border-t border-[var(--obsidian-border)] flex items-center justify-between">
                    <span className="font-mono text-[0.7rem] uppercase tracking-widest text-[var(--silver-dim)] group-hover:text-[var(--silver)] transition-colors">
                      Explore Section
                    </span>
                    <span className="font-mono text-xs text-[var(--silver-dim)] group-hover:text-[var(--accent-white)] group-hover:translate-x-1 transition-all">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
