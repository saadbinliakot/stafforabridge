import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { getIndustries } from '@/lib/data/industries';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { IndustryCard } from '@/components/cards';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PrimaryButton } from '@/components/ui/CTAButton';

export const metadata: Metadata = buildMetadata({
  title: 'Industries',
  description:
    'Healthcare sectors NOVALINK supports with outsourced operational and administrative workflows.',
  path: '/industries',
});

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Industries' }]} />
          <h1 className="mt-6 mb-6 font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight">
            Healthcare Sectors
          </h1>
          <p className="max-w-prose text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
            NOVALINK configures dedicated operational pods to the precise regulatory and clinical
            standards of each healthcare vertical.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-20">
          <SectionLabel number="01" label="Who We Serve" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {industries.map((industry) => (
              <IndustryCard key={industry.slug} industry={industry} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[var(--obsidian-card)] border-t border-[var(--obsidian-border)]">
        <div className="container-nova py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-2">
              Don&rsquo;t see your specialty listed?
            </h3>
            <p className="font-mono text-xs text-[var(--silver-dim)] max-w-lg">
              We design custom operational workflows for specialized surgery centers, diagnostic labs, and international health networks.
            </p>
          </div>
          <PrimaryButton href="/contact">Contact Our Team</PrimaryButton>
        </div>
      </section>
    </div>
  );
}
