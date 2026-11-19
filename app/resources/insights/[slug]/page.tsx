import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/utils/seo';
import { getPublishedArticles } from '@/lib/data/content-repo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export async function generateStaticParams() {
  const articles = (await getPublishedArticles()) as any[];
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata({ title: 'Insight', path: `/resources/insights/${slug}` });
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = (await getPublishedArticles()) as any[];
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Decorative vertical ambient side lines */}
      <div className="ambient-side-accent left-8 hidden lg:block" />
      <div className="ambient-side-accent right-8 hidden lg:block" />

      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Resources', href: '/resources' },
              { label: 'Insights', href: '/resources/insights' },
              { label: article.title },
            ]}
          />
          <div className="mt-8">
            <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver-muted)] inline-block mb-6">
              Clinical Briefing
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-[var(--accent-white)] tracking-tight mb-6">
              {article.title}
            </h1>
            <p className="font-mono text-xs text-[var(--silver-dim)]">
              Published by NOVALINK Operations Directorate
            </p>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-20 max-w-4xl">
          <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-8 md:p-14">
            <div className="font-mono text-xs md:text-sm text-[var(--silver)] leading-relaxed whitespace-pre-line space-y-6">
              {article.body}
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="bg-[var(--obsidian-card)]">
        <div className="container-nova py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-xl md:text-2xl text-[var(--accent-white)] mb-2">
              Transform Your Clinical Workflows
            </h3>
            <p className="font-mono text-xs text-[var(--silver-dim)] max-w-lg">
              Explore how dedicated staffing can streamline your administrative back-office.
            </p>
          </div>
          <div className="flex gap-4">
            <PrimaryButton href="/book-consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/resources/insights">Back to Insights</SecondaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
