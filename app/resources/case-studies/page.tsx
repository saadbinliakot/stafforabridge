import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { getPublishedCaseStudies } from '@/lib/data/content-repo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { CaseStudyCard } from '@/components/cards';

export const metadata: Metadata = buildMetadata({
  title: 'Case Studies',
  description: 'Outsourcing examples and operational outcomes from NOVALINK client engagements.',
  path: '/resources/case-studies',
});

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: 'Case Studies' }]}
          />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Clinical Workflow Deployments
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Case Studies
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              Examine real-world architectures detailing how private clinics, imaging centers, and hospital departments
              scale output and reduce administrative friction with dedicated NOVALINK teams.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Published Engagements" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {(caseStudies as any[]).map((cs) => (
              <CaseStudyCard key={cs.slug} caseStudy={cs} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
