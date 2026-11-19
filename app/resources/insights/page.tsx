import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { getPublishedArticles } from '@/lib/data/content-repo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { ArticleCard } from '@/components/cards';

export const metadata: Metadata = buildMetadata({
  title: 'Insights',
  description: 'Articles, operational briefings, and analyses on healthcare operations from NOVALINK.',
  path: '/resources/insights',
});

export default async function InsightsPage() {
  const articles = (await getPublishedArticles()) as any[];

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: 'Insights' }]}
          />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Field Intelligence & Analysis
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Clinical Insights
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              In-depth commentary, operational best practices, regulatory breakdowns, and workflow analyses
              compiled by NOVALINK healthcare administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Published Analyses" />
          {articles.length === 0 ? (
            <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-12 max-w-xl">
              <p className="font-mono text-xs text-[var(--silver-muted)]">
                Insights are being prepared by our clinical advisory team. Check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {articles.map((a) => (
                <ArticleCard key={a.slug} title={a.title} excerpt={a.excerpt} slug={a.slug} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
