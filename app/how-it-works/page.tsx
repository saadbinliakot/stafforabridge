import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { processSteps } from '@/lib/data/content';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

export const metadata: Metadata = buildMetadata({
  title: 'How It Works',
  description: 'The NOVALINK process: discover, plan, match, onboard, operate, and optimize.',
  path: '/how-it-works',
});

export default function HowItWorksPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern relative">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'How It Works' }]} />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Standardized Delivery Framework
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Engineered Clinical Operations
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed">
              Every NOVALINK engagement follows an exact six-stage operating methodology. We audit your workflows,
              provision dedicated specialists, integrate directly into your EHR/PMS tools, and continuously optimize output.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps Grid */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] relative">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label="Delivery Phases" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {processSteps.map((step, i) => (
              <div
                key={step.number}
                className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-9 md:p-10 rounded-[3px] relative flex flex-col justify-between group overflow-hidden"
              >
                {/* Top ambient highlight line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--silver-dim)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs px-2.5 py-1 border border-[var(--obsidian-border-strong)] text-[var(--silver-dim)] group-hover:border-[var(--silver-muted)] group-hover:text-[var(--silver)] transition-colors">
                      {step.number}
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider uppercase text-[var(--silver-dim)]">
                      {step.label}
                    </span>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl text-[var(--accent-white)] mb-4">
                    {step.title}
                  </h3>

                  <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--obsidian-border)] flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] group-hover:text-[var(--silver-muted)] transition-colors">
                    Phase {i + 1} of 6
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--obsidian-border-strong)] group-hover:bg-[var(--accent-white)] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Assurance Panel */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian-card)]">
        <div className="container-nova py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div className="card-interactive border border-[var(--obsidian-border)] bg-[var(--obsidian)] p-8 sm:p-9 rounded-[3px]">
              <span className="font-mono text-[0.65rem] text-[var(--silver-dim)] uppercase tracking-widest block mb-3">Security SLA</span>
              <h4 className="font-display text-xl text-[var(--accent-white)] mb-3">Zero-Data-Retention Option</h4>
              <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
                Staff connect through your managed VPN and virtual desktops. No PHI ever leaves your domestic infrastructure.
              </p>
            </div>
            <div className="card-interactive border border-[var(--obsidian-border)] bg-[var(--obsidian)] p-8 sm:p-9 rounded-[3px]">
              <span className="font-mono text-[0.65rem] text-[var(--silver-dim)] uppercase tracking-widest block mb-3">Management</span>
              <h4 className="font-display text-xl text-[var(--accent-white)] mb-3">Canadian Account Director</h4>
              <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
                Direct oversight from an Ontario-based operations lead responsible for staffing, scheduling, and SLA audits.
              </p>
            </div>
            <div className="card-interactive border border-[var(--obsidian-border)] bg-[var(--obsidian)] p-8 sm:p-9 rounded-[3px]">
              <span className="font-mono text-[0.65rem] text-[var(--silver-dim)] uppercase tracking-widest block mb-3">Integration</span>
              <h4 className="font-display text-xl text-[var(--accent-white)] mb-3">14-Day Ramp Guarantee</h4>
              <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
                Dedicated staffing cohorts are fully onboarded and processing live work within two weeks of intake signing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to start CTA */}
      <section className="bg-[var(--obsidian)]">
        <div className="container-nova py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--accent-white)] mb-2">
              Ready to start with Discovery?
            </h3>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] max-w-xl">
              Schedule a 30-minute operational intake session. We will evaluate your current volume and deliver a custom staffing model.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <PrimaryButton href="/book-consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/contact">Contact Operations</SecondaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
