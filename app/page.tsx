import Link from 'next/link';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';
import { SectionLabel } from '@/components/typography/SectionLabel';
import {
  ServiceCard,
  IndustryCard,
  CaseStudyCard,
  TestimonialCard,
} from '@/components/cards';
import { getServices } from '@/lib/data/services';
import { getIndustries } from '@/lib/data/industries';
import {
  getPublishedCaseStudies,
  getPublishedTestimonials,
  getPublishedFAQs,
} from '@/lib/data/content-repo';
import { processSteps } from '@/lib/data/content';
import { FAQItem } from '@/components/ui/FAQItem';

export default async function HomePage() {
  const [services, industries, caseStudies, testimonials, faqs] = await Promise.all([
    getServices(),
    getIndustries(),
    getPublishedCaseStudies(),
    getPublishedTestimonials(),
    getPublishedFAQs(),
  ]);

  return (
    <>
      {/* ================================================================
          HERO SECTION — Obsidian Canvas with Ambient Glow & Subtle Grid
      ================================================================ */}
      <section className="relative overflow-hidden bg-[var(--obsidian)] border-b border-[var(--obsidian-border)] bg-grid-pattern">
        {/* Subtle obsidian ambient aura in background */}
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-20 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

        <div className="container-nova py-24 md:py-36 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Vision & Primary Actions */}
            <div className="lg:col-span-7 flex flex-col items-start animate-fade-in">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-8 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                  Healthcare Operations · USA-Canada Based · Worldwide
                </span>
              </div>

              <h1 className="font-display font-bold leading-[0.92] text-[var(--accent-white)] mb-8 tracking-tight">
                Healthcare operations.{' '}
                <span className="text-[var(--silver-muted)]">Connected globally.</span>
              </h1>

              <p className="font-mono text-sm md:text-base text-[var(--silver-muted)] max-w-prose leading-relaxed mb-10">
                NOVALINK connects healthcare systems, clinics, and healthtech providers with elite
                remote operational teams — appointment intake, clinical documentation, and revenue
                cycle management administration — so your providers can stay focused entirely on patient care.
              </p>

              <div className="flex flex-wrap items-center gap-5">
                <PrimaryButton href="/book-consultation">Book a Consultation</PrimaryButton>
                <SecondaryButton href="/services">Explore Service Catalog</SecondaryButton>
              </div>
            </div>

            {/* Right Column: Live Status HUD & Operational Pillars */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {/* Animated Live Network Telemetry HUD */}
              <div className="card-interactive bg-[var(--obsidian-elevated)] border border-[var(--obsidian-border-strong)] p-6 rounded-[3px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser-horizontal" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                    <span className="font-mono text-xs font-semibold text-[var(--accent-white)] uppercase tracking-wider">
                      Operational Network Active
                    </span>
                  </div>
                  <span className="font-mono text-[0.62rem] px-2.5 py-1 border border-emerald-900/50 bg-emerald-950/30 text-emerald-300 rounded-[2px] uppercase tracking-wider">
                    48 Pods Live
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--obsidian-border)]/80">
                  <div>
                    <span className="font-mono text-[0.6rem] text-[var(--silver-dim)] uppercase block mb-0.5">Latency</span>
                    <span className="font-mono text-xs font-semibold text-cyan-400">12ms</span>
                  </div>
                  <div>
                    <span className="font-mono text-[0.6rem] text-[var(--silver-dim)] uppercase block mb-0.5">SLA Pass</span>
                    <span className="font-mono text-xs font-semibold text-emerald-400">99.8%</span>
                  </div>
                  <div>
                    <span className="font-mono text-[0.6rem] text-[var(--silver-dim)] uppercase block mb-0.5">Encryption</span>
                    <span className="font-mono text-xs font-semibold text-[var(--silver)]">AES-256</span>
                  </div>
                </div>
              </div>

              {[
                {
                  number: '01',
                  label: 'Sovereign Compliance',
                  title: 'USA-Canada Based Operations',
                  body: 'Delivered from North American operations centers under strict HIPAA and PIPEDA data governance, ensuring international security alignment.',
                },
                {
                  number: '02',
                  label: 'Workflow Integration',
                  title: 'Embedded In Your Systems',
                  body: 'Dedicated full-time talent operating inside your existing EHR, billing software, and communication channels — not a detached call center.',
                },
              ].map((card) => (
                <div
                  key={card.number}
                  className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-9 rounded-[3px]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)]">
                      {card.label}
                    </span>
                    <span className="font-mono text-[0.68rem] text-[var(--silver-dim)]">
                      {card.number}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-[var(--accent-white)] mb-3">
                    {card.title}
                  </h3>
                  <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          LIVE OPERATIONAL TELEMETRY TICKER (CONTINUOUS MOVING ANIMATION)
      ================================================================ */}
      <section className="bg-[var(--obsidian-elevated)] border-b border-[var(--obsidian-border)] overflow-hidden py-3.5 relative select-none">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="flex animate-marquee-left gap-10 items-center text-xs font-mono tracking-widest uppercase">
          {[1, 2].map((k) => (
            <div key={k} className="flex items-center gap-10 shrink-0">
              <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                ACTIVE CLINICAL PODS: 48 DEPLOYED
              </span>
              <span className="text-[var(--silver-dim)] font-light">/</span>
              <span className="text-[var(--silver)] font-medium">USA-CANADA OPERATIONAL BASE: NORTH AMERICA</span>
              <span className="text-[var(--silver-dim)] font-light">/</span>
              <span className="flex items-center gap-2 text-blue-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                SLA CLEAN-CLAIM RATE: 99.8%
              </span>
              <span className="text-[var(--silver-dim)] font-light">/</span>
              <span className="text-[var(--silver)] font-medium">PIPEDA & HIPAA HARDENED INFRASTRUCTURE</span>
              <span className="text-[var(--silver-dim)] font-light">/</span>
              <span className="text-cyan-400 font-semibold">AVERAGE EHR PING: 12MS</span>
              <span className="text-[var(--silver-dim)] font-light">/</span>
              <span className="text-[var(--silver)] font-medium">ZERO DATA RESIDENCY ARCHITECTURE</span>
              <span className="text-[var(--silver-dim)] font-light">/</span>
              <span className="text-amber-400 font-semibold">14-DAY ONBOARDING RAMP GUARANTEE</span>
              <span className="text-[var(--silver-dim)] font-light">/</span>
              <span className="text-[var(--silver)] font-medium">24/7 DEDICATED INTAKE & BILLING</span>
              <span className="text-[var(--silver-dim)] font-light">/</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          01 — CORE WORKFLOW PILLARS (SERVICES)
      ================================================================ */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-20 md:py-28">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <SectionLabel number="01" label="Core Workflows" />
              <h2 className="font-display text-3xl md:text-5xl text-[var(--accent-white)] max-w-2xl leading-tight">
                Operational workloads, handled end to end.
              </h2>
            </div>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] max-w-md leading-relaxed">
              NOVALINK assumes complete administrative ownership over back-office friction points so
              practices operate with predictable precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.slice(0, 6).map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>

          <div className="mt-14 flex justify-start">
            <SecondaryButton href="/services" className="!py-3 !px-7 !rounded-lg font-bold">
              View All Practice Workflows →
            </SecondaryButton>
          </div>
        </div>
      </section>

      {/* ================================================================
          02 — HOW IT WORKS PREVIEW
      ================================================================ */}
      <section className="bg-[var(--obsidian-card)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <SectionLabel number="02" label="Deployment Methodology" />
              <h2 className="font-display text-3xl md:text-4xl text-[var(--accent-white)] mb-6 leading-tight">
                A structured path from discovery to live deployment.
              </h2>
              <p className="font-mono text-sm text-[var(--silver-muted)] leading-relaxed mb-8">
                Every NOVALINK outsourcing agreement follows an exacting 4-stage operational process
                engineered to eliminate workflow disruption during handover.
              </p>
              <SecondaryButton href="/how-it-works">Review Full Process</SecondaryButton>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {processSteps.map((step) => (
                <div
                  key={step.number}
                  className="card-interactive bg-[var(--obsidian)] border border-[var(--obsidian-border)] p-8 sm:p-9 rounded-[3px]"
                >
                  <span className="font-mono text-xs text-[var(--silver-dim)] tracking-wider block mb-3">
                    Phase {step.number}
                  </span>
                  <h4 className="font-display text-lg text-[var(--accent-white)] uppercase mb-3">
                    {step.label}
                  </h4>
                  <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          03 — INDUSTRIES / SPECIALIZATIONS
      ================================================================ */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-20 md:py-28">
          <div className="mb-12">
            <SectionLabel number="03" label="Sectors Served" />
            <h2 className="font-display text-3xl md:text-5xl text-[var(--accent-white)] max-w-xl">
              Engineered across diverse clinical environments.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {industries.slice(0, 6).map((industry) => (
              <IndustryCard key={industry.slug} industry={industry} />
            ))}
          </div>

          <div className="mt-12">
            <SecondaryButton href="/industries">View All Practice Environments</SecondaryButton>
          </div>
        </div>
      </section>

      {/* ================================================================
          04 — CASE STUDIES / OPERATIONAL IMPACT
      ================================================================ */}
      <section className="bg-[var(--obsidian-card)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-20 md:py-28">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <SectionLabel number="04" label="Proven Impact" />
              <h2 className="font-display text-3xl md:text-5xl text-[var(--accent-white)]">
                Field Outcomes & Operational Studies
              </h2>
            </div>
            <div className="flex gap-4">
              <SecondaryButton href="/resources/case-studies">All Case Studies</SecondaryButton>
              <SecondaryButton href="/resources/insights">Insights</SecondaryButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {(caseStudies as any[]).slice(0, 3).map((cs) => (
              <CaseStudyCard key={cs.slug} caseStudy={cs} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          05 — TESTIMONIALS
      ================================================================ */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-20 md:py-28">
          <SectionLabel number="05" label="Client Perspectives" />
          <h2 className="font-display text-3xl md:text-5xl text-[var(--accent-white)] mb-12 max-w-2xl">
            Trusted by healthcare leaders worldwide.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {(testimonials as any[]).slice(0, 3).map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          06 — FAQS
      ================================================================ */}
      <section className="bg-[var(--obsidian-card)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <SectionLabel number="06" label="Inquiries & Clarity" />
            <h2 className="font-display text-3xl md:text-4xl text-[var(--accent-white)] mb-10">
              Frequently Asked Questions
            </h2>

            <div className="flex flex-col gap-4">
              {(faqs as any[]).slice(0, 6).map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className="mt-10">
              <SecondaryButton href="/resources/faqs">Browse Complete Knowledgebase</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CALL TO ACTION
      ================================================================ */}
      <section className="bg-[var(--obsidian)] relative overflow-hidden bg-grid-pattern">
        <div className="container-nova py-24 md:py-32 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--silver-dim)] block mb-3">
              Launch Your Healthcare Pod
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-[var(--accent-white)] max-w-xl leading-tight">
              Ready to elevate your practice operations?
            </h2>
            <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] max-w-md mt-4">
              Schedule a preliminary discovery session. We will evaluate your workflow bottlenecks
              and construct a bespoke staffing roadmap.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <PrimaryButton href="/book-consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/contact">Direct Contact</SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );
}

