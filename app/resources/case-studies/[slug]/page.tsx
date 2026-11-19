import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/utils/seo';
import { getCaseStudyBySlug, getPublishedCaseStudies } from '@/lib/data/content-repo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export async function generateStaticParams() {
  const caseStudies = await getPublishedCaseStudies();
  return (caseStudies as any[]).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return buildMetadata({ title: 'Case Study', path: `/resources/case-studies/${slug}` });
  return buildMetadata({ title: cs.title, description: cs.challenge, path: `/resources/case-studies/${cs.slug}` });
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Decorative vertical ambient side lines */}
      <div className="ambient-side-accent left-8 hidden lg:block" />
      <div className="ambient-side-accent right-8 hidden lg:block" />

      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Resources', href: '/resources' },
              { label: 'Case Studies', href: '/resources/case-studies' },
              { label: cs.title },
            ]}
          />
          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver-muted)]">
                {cs.industry}
              </span>
              {cs.isPlaceholder && (
                <span className="font-mono text-xs px-2.5 py-1 border border-amber-900/40 bg-amber-950/20 text-amber-300">
                  Model Engagement Simulation
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl text-[var(--accent-white)] tracking-tight mb-6">
              {cs.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Structured Operational Breakdown */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8">
            <SectionLabel number="01" label="Operational Challenge" />
            <h3 className="font-display text-xl text-[var(--accent-white)] mb-4">Initial Bottlenecks</h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
              {cs.challenge}
            </p>
          </div>

          <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8">
            <SectionLabel number="02" label="Target Workflow" />
            <h3 className="font-display text-xl text-[var(--accent-white)] mb-4">Process Re-Engineering</h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
              {cs.workflow}
            </p>
          </div>

          <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8">
            <SectionLabel number="03" label="NOVALINK Approach" />
            <h3 className="font-display text-xl text-[var(--accent-white)] mb-4">Dedicated Team Deployment</h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
              {cs.approach}
            </p>
          </div>

          <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8">
            <SectionLabel number="04" label="Measurable Impact" />
            <h3 className="font-display text-xl text-[var(--accent-white)] mb-4">Long-Term Outcomes</h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
              {cs.operationalImpact}
            </p>
          </div>
        </div>
      </section>

      {/* Metrics & Testimonial Section */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian-elevated)]">
        <div className="container-nova py-16 md:py-20">
          <SectionLabel number="05" label="Quantified Output" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {cs.metrics.map((m: string, i: number) => (
              <div key={i} className="border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-card)] p-6">
                <span className="font-mono text-[0.65rem] text-[var(--silver-dim)] uppercase tracking-widest block mb-2">Metric 0{i + 1}</span>
                <p className="font-mono text-sm md:text-base text-[var(--accent-white)] font-semibold">{m}</p>
              </div>
            ))}
          </div>

          <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian)] p-8 md:p-12 max-w-4xl">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] block mb-4">
              Client Executive Endorsement
            </span>
            <blockquote className="font-display text-xl md:text-2xl text-[var(--silver)] leading-relaxed">
              &ldquo;{cs.quote}&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[var(--obsidian)]">
        <div className="container-nova py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-2">
              Interested in a similar deployment?
            </h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] max-w-xl">
              Schedule an intake review with a Canadian operations director. We will benchmark your current staffing costs and workflow timelines.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <PrimaryButton href="/book-consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/contact">Inquire</SecondaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
