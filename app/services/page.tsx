import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { getServices } from '@/lib/data/services';
import { serviceCategories } from '@/lib/data/content';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { ServiceCard } from '@/components/cards';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PrimaryButton } from '@/components/ui/CTAButton';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description:
    'Outsourced healthcare operations services from NOVALINK: virtual healthcare support, revenue cycle management, insurance and authorization, provider operations, documentation, and automation.',
  path: '/services',
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
          <h1 className="mt-6 mb-6 font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight">
            Outsourced Practice Services
          </h1>
          <p className="max-w-prose text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
            NOVALINK structures healthcare outsourcing across specialized operational pillars.
            Every role is staffed by dedicated clinical operations professionals embedded directly into your tools.
          </p>
        </div>
      </section>

      {/* Category Pillars */}
      {serviceCategories.map((category, i) => {
        const categoryServices = services.filter((s) => s.categorySlug === category.slug);
        if (categoryServices.length === 0) return null;
        return (
          <section
            key={category.slug}
            id={category.slug}
            className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] scroll-mt-20"
          >
            <div className="container-nova py-16 md:py-20">
              <SectionLabel number={String(i + 1).padStart(2, '0')} label={category.name} />
              <h2 className="mb-3 max-w-3xl font-display text-2xl md:text-4xl text-[var(--accent-white)]">
                {category.name}
              </h2>
              <p className="max-w-prose mb-10 text-xs md:text-sm text-[var(--silver-muted)] font-mono leading-relaxed">
                {category.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {categoryServices.map((service, idx) => (
                  <ServiceCard key={service.slug} service={service} index={idx} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="bg-[var(--obsidian-card)] border-t border-[var(--obsidian-border)]">
        <div className="container-nova py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-2">
              Unsure which role your practice needs first?
            </h3>
            <p className="font-mono text-xs text-[var(--silver-dim)] max-w-lg">
              Our clinical directors can review your current staff allocation and propose a phased staffing rollout.
            </p>
          </div>
          <PrimaryButton href="/book-consultation">Book a Consultation</PrimaryButton>
        </div>
      </section>
    </div>
  );
}
