import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/utils/seo';
import { getIndustryBySlug, getIndustries } from '@/lib/data/industries';
import { getServices } from '@/lib/data/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { ServiceCard } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export async function generateStaticParams() {
  const industries = await getIndustries();
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return buildMetadata({ title: 'Industry', path: `/industries/${slug}` });
  return buildMetadata({ title: industry.name, description: industry.description, path: `/industries/${industry.slug}` });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();
  const services = await getServices();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Decorative vertical ambient side lines */}
      <div className="ambient-side-accent left-8 hidden lg:block" />
      <div className="ambient-side-accent right-8 hidden lg:block" />

      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: industry.name }]}
          />
          <div className="mt-8 max-w-4xl">
            <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver-muted)] inline-block mb-6">
              Industry Vertical
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              {industry.name}
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed mb-8">
              {industry.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <PrimaryButton href="/book-consultation">Book a Consultation</PrimaryButton>
              <SecondaryButton href="/industries">All Industries</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Relevant Services */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Recommended Staffing Modules" />
          <h2 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-8">
            Operational roles configured for {industry.name.toLowerCase()}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
