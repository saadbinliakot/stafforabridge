import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/utils/seo';
import { getServiceBySlug, getServices } from '@/lib/data/services';
import { getPublishedFAQs } from '@/lib/data/content-repo';
import { complianceStatement } from '@/lib/data/content';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { FAQItem } from '@/components/ui/FAQItem';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return buildMetadata({ title: 'Service', path: `/services/${slug}` });
  return buildMetadata({
    title: service.name,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const faqs = await getPublishedFAQs('Services');

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Decorative vertical ambient side lines */}
      <div className="ambient-side-accent left-8 hidden lg:block" />
      <div className="ambient-side-accent right-8 hidden lg:block" />

      {/* Hero */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: service.name }]}
          />
          <div className="mt-8 max-w-4xl">
            <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver-muted)] inline-block mb-6">
              Clinical Operations Module
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              {service.name}
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed mb-8">
              {service.shortDescription}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <PrimaryButton href="/book-consultation">Book This Service</PrimaryButton>
              <SecondaryButton href="/contact">Inquire with Operations</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Typical Workflows */}
      <section className="border-b border-[#242424] bg-[var(--obsidian)]">
        <div className="container-nova py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionLabel number="01" label="Operational Inefficiencies Solved" />
            <h3 className="font-display text-2xl sm:text-3xl text-[var(--accent-white)] tracking-tight">
              Problems It Eliminates
            </h3>
            <div className="flex flex-col gap-5 mt-2">
              {service.problemsSolved.map((p, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#111111',
                    border: '1px solid #282828',
                    borderRadius: '10px',
                    padding: '24px 28px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                  }}
                  className="transition-colors hover:border-neutral-500"
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#888888',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    CHALLENGE 0{i + 1}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: '#e2e2e2',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <SectionLabel number="02" label="Execution Protocol" />
            <h3 className="font-display text-2xl sm:text-3xl text-[var(--accent-white)] tracking-tight">
              Standard Daily Operating Workflows
            </h3>
            <div className="flex flex-col gap-5 mt-2">
              {service.typicalWorkflows.map((p, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#111111',
                    border: '1px solid #282828',
                    borderRadius: '10px',
                    padding: '24px 28px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                  }}
                  className="transition-colors hover:border-neutral-500"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#1c1c1c',
                        border: '1px solid #383838',
                        color: '#60a5fa',
                      }}
                    >
                      Stage 0{i + 1}
                    </span>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#666666' }}>
                      Standard SOP
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: '#ffffff',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scope Matrix */}
      <section className="border-b border-[#242424] bg-[#0c0c0c]">
        <div className="container-nova py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionLabel number="03" label="Accountability" />
            <h3 className="font-display text-2xl sm:text-3xl text-[var(--accent-white)] tracking-tight">
              What NOVALINK Handles
            </h3>
            <div className="flex flex-col gap-5 mt-2">
              {service.whatNovalinkHandles.map((p, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#121212',
                    border: '1px solid #282828',
                    borderRadius: '10px',
                    padding: '22px 26px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#34d399',
                        marginTop: '6px',
                        flexShrink: 0,
                        boxShadow: '0 0 10px rgba(52, 211, 153, 0.4)',
                      }}
                    />
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: '#e2e2e2',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {p}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <SectionLabel number="04" label="Ideal Fit" />
            <h3 className="font-display text-2xl sm:text-3xl text-[var(--accent-white)] tracking-tight">
              Who This Workflow Is Built For
            </h3>
            <div className="flex flex-col gap-5 mt-2">
              {service.whoItIsFor.map((p, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#121212',
                    border: '1px solid #282828',
                    borderRadius: '10px',
                    padding: '22px 26px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#60a5fa',
                        marginTop: '6px',
                        flexShrink: 0,
                        boxShadow: '0 0 10px rgba(96, 165, 250, 0.4)',
                      }}
                    />
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: '#e2e2e2',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {p}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance statement banner */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)]">
        <div className="container-nova py-16">
          <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-8 max-w-4xl">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] block mb-2">
              Clinical Safety & Governance
            </span>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
              {complianceStatement}
            </p>
          </div>
        </div>
      </section>

      {/* Relevant FAQs */}
      {(faqs as any[]).length > 0 && (
        <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)]">
          <div className="container-nova py-16 md:py-20">
            <SectionLabel number="05" label="Service Questions" />
            <h3 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-8">
              Frequently Asked Questions About {service.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
              {(faqs as any[]).slice(0, 4).map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Action */}
      <section className="bg-[var(--obsidian-card)]">
        <div className="container-nova py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-2">
              Ready to staff {service.name.toLowerCase()}?
            </h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-dim)] max-w-lg">
              Reserve your slot with a Canadian clinical director and finalize your dedicated team roster.
            </p>
          </div>
          <PrimaryButton href="/book-consultation">Book Consultation</PrimaryButton>
        </div>
      </section>
    </div>
  );
}
