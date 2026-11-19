'use client';

import { useMemo, useState } from 'react';
import { faqs as allFaqs } from '@/lib/data/content';
import { FAQItem } from '@/components/ui/FAQItem';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import clsx from 'clsx';
import { PrimaryButton } from '@/components/ui/CTAButton';

const categories = ['All', 'Services', 'Pricing', 'Security', 'Outsourcing', 'Onboarding', 'Careers', 'International Clients', 'General'];

export default function FAQsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return allFaqs.filter((f) => {
      const matchesCategory = category === 'All' || f.category === category;
      const matchesQuery =
        query.trim() === '' ||
        f.question.toLowerCase().includes(query.toLowerCase()) ||
        f.answer.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Header */}
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: 'FAQs' }]}
          />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 mb-6 border border-[var(--obsidian-border-strong)] rounded-full bg-[var(--obsidian-card)]/90 backdrop-blur-md max-w-full shadow-lg">
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver)] font-medium leading-normal">
                Direct Answers
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[var(--silver-muted)] font-mono leading-relaxed mb-8">
              Search or filter by operational pillar to discover how NOVALINK structures contracts, security protocols,
              remote staffing workflows, and billing operations.
            </p>

            {/* Search Input */}
            <div className="relative max-w-2xl mb-8">
              <label htmlFor="faq-search" className="sr-only">
                Search FAQs
              </label>
              <input
                id="faq-search"
                type="search"
                placeholder="Search queries (e.g. HIPAA, onboarding, EHR, pricing)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-dark w-full px-5 py-4 font-mono text-sm border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-card)] focus:border-[var(--silver)] transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const isActive = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    aria-pressed={isActive}
                    className={clsx(
                      'px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider border transition-all duration-150',
                      isActive
                        ? 'bg-[var(--accent-white)] text-[var(--obsidian)] border-[var(--accent-white)] font-bold shadow-lg'
                        : 'bg-[var(--obsidian-card)] text-[var(--silver-dim)] border-[var(--obsidian-border-strong)] hover:border-[var(--silver-muted)] hover:text-[var(--silver)]'
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Items Grid */}
      <section className="bg-[var(--obsidian)] border-b border-[var(--obsidian-border)]">
        <div className="container-nova py-16 md:py-24">
          <SectionLabel number="01" label={`${filtered.length} Answered Question${filtered.length === 1 ? '' : 's'}`} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl">
            {filtered.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-12 max-w-xl">
              <p className="font-mono text-xs text-[var(--silver-muted)] mb-4">
                No questions found matching &ldquo;{query}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => { setQuery(''); setCategory('All'); }}
                className="font-mono text-xs underline text-[var(--accent-white)]"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still have questions */}
      <section className="bg-[var(--obsidian-card)]">
        <div className="container-nova py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-xl md:text-2xl text-[var(--accent-white)] mb-2">
              Have a specific clinical or technical question?
            </h3>
            <p className="font-mono text-xs text-[var(--silver-dim)] max-w-lg">
              Our Canadian operations desk responds to practice questions within 2 business hours.
            </p>
          </div>
          <PrimaryButton href="/contact">Ask a Question</PrimaryButton>
        </div>
      </section>
    </div>
  );
}
