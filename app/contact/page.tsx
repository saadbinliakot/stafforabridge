import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionLabel } from '@/components/typography/SectionLabel';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: 'Get in touch with NOVALINK to discuss outsourced healthcare operations support.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen">
      <section className="border-b border-[var(--obsidian-border)] bg-[var(--obsidian)]">
        <div className="container-nova py-16 md:py-24 grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-0">
          <div className="md:col-span-2 md:pr-12">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
            <h1 className="mt-6 mb-6 font-display text-4xl md:text-6xl text-[var(--accent-white)]">
              Contact
            </h1>
            <p className="max-w-prose text-base text-[var(--silver-muted)] font-mono leading-relaxed mb-10">
              Tell us about your organization and the operational workflows you want to outsource.
            </p>
            <div className="flex flex-col gap-6">
              <div className="card-interactive p-8 bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] rounded-[3px]">
                <SectionLabel number="01" label="Operations Inquiry" />
                <p className="font-mono text-sm text-[var(--silver)] font-medium">hello@novalink.ca</p>
              </div>
              <div className="card-interactive p-8 bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] rounded-[3px]">
                <SectionLabel number="02" label="Toll-Free Direct" />
                <p className="font-mono text-sm text-[var(--silver)] font-medium">+1 (800) 419-NOVA</p>
              </div>
              <div className="card-interactive p-8 bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] rounded-[3px]">
                <SectionLabel number="03" label="Operating Headquarters" />
                <p className="font-mono text-sm text-[var(--silver)] font-medium">
                  USA & Canada · Supporting clinical teams internationally
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 md:pl-12 md:border-l border-[var(--obsidian-border)]">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
