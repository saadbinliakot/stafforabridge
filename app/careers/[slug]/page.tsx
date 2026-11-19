import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/utils/seo';
import { getJobBySlug, getOpenJobs } from '@/lib/data/content-repo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { ApplicationForm } from './ApplicationForm';

export async function generateStaticParams() {
  const jobs = await getOpenJobs();
  return (jobs as any[]).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return buildMetadata({ title: 'Careers', path: `/careers/${slug}` });
  return buildMetadata({ title: job.title, description: job.summary, path: `/careers/${job.slug}` });
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Decorative vertical ambient side lines */}
      <div className="ambient-side-accent left-8 hidden lg:block" />
      <div className="ambient-side-accent right-8 hidden lg:block" />

      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Careers', href: '/careers' }, { label: job.title }]}
          />
          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver-muted)]">
                {job.category}
              </span>
              <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver-muted)]">
                {job.location}
              </span>
              <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver-muted)]">
                {job.employmentType}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl text-[var(--accent-white)] tracking-tight mb-6">
              {job.title}
            </h1>

            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              {job.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-24 max-w-3xl">
          <SectionLabel number="01" label="Submit Candidate Application" />
          <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-8 md:p-12 shadow-2xl">
            <ApplicationForm jobSlug={job.slug} />
          </div>
        </div>
      </section>
    </div>
  );
}
