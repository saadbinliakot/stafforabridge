import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { getPublishedTestimonials } from '@/lib/data/content-repo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { TestimonialCard } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export const metadata: Metadata = buildMetadata({
  title: 'Success Stories',
  description: 'Client outcomes, partner quotes, and clinical operational success with NOVALINK.',
  path: '/resources/success-stories',
});

export default async function SuccessStoriesPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: 'Success Stories' }]}
          />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Verified Practice Outcomes
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Client Success Stories
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              Discover how healthcare organizations leverage NOVALINK to scale operational throughput,
              reduce clinical burnout, and accelerate collections.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Partner Testimonials" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {(testimonials as any[]).map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[var(--obsidian-card)]">
        <div className="container-nova py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-xl md:text-2xl text-[var(--accent-white)] mb-2">
              Ready to create your own success story?
            </h3>
            <p className="font-mono text-xs text-[var(--silver-dim)] max-w-lg">
              Book a live consultation with our Canadian operations team and receive a custom staffing plan.
            </p>
          </div>
          <div className="flex gap-4">
            <PrimaryButton href="/book-consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/services">Explore Services</SecondaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
