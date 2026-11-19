import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility',
  description: 'NOVALINK’s approach to website accessibility and digital standards.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen relative overflow-hidden">
      {/* Decorative vertical ambient side lines */}
      <div className="ambient-side-accent left-8 hidden lg:block" />
      <div className="ambient-side-accent right-8 hidden lg:block" />

      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)] bg-grid-pattern">
        <div className="container-nova py-16 md:py-24 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Accessibility' }]} />
          <div className="mt-8">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] block mb-4">
              Digital Inclusion
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-[var(--accent-white)] tracking-tight mb-6">
              Accessibility Standards
            </h1>
            <p className="font-mono text-xs text-[var(--silver-dim)]">
              WCAG 2.1 Level AA Compliance Commitment
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-20 max-w-4xl">
          <div className="border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] p-8 md:p-12 space-y-8 font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed">
            <div>
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">Commitment to Digital Accessibility</h2>
              <p>
                NOVALINK is committed to ensuring digital accessibility for people of all abilities. We continually improve
                the user experience for everyone and apply relevant accessibility standards across our public interfaces,
                booking calendar components, and client portals.
              </p>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">Architectural Measures</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Strict semantic HTML5 landmarking (<code className="text-white">header</code>, <code className="text-white">nav</code>, <code className="text-white">main</code>, <code className="text-white">footer</code>).</li>
                <li>Clear visible focus indicators meeting high-contrast visibility thresholds on dark surfaces.</li>
                <li>Complete keyboard navigability for all interactive calendar date-pickers, modals, and input controls.</li>
                <li>Full compliance with <code className="text-white">prefers-reduced-motion</code> user preferences across all CSS animations.</li>
                <li>ARIA status messaging and accessible live regions for real-time validation and database updates.</li>
              </ul>
            </div>

            <div className="border-t border-[var(--obsidian-border)] pt-6">
              <h2 className="font-display text-xl text-[var(--accent-white)] mb-3">Feedback & Assistance</h2>
              <p>
                If you encounter any barrier while interacting with this website or requiring alternate formats, please
                reach out directly to our accessibility desk at{' '}
                <a href="/contact" className="text-[var(--accent-white)] underline hover:text-white">
                  Contact Us
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
