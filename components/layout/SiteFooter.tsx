import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Services',
    links: [
      { label: 'Virtual Healthcare Support', href: '/services#virtual-healthcare-support' },
      { label: 'Revenue Cycle Management', href: '/services#revenue-cycle' },
      { label: 'Insurance & Authorization', href: '/services#insurance-authorization' },
      { label: 'All Services', href: '/services' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Medical Practices', href: '/industries/medical-practices' },
      { label: 'Hospitals & Health Systems', href: '/industries/hospitals-health-systems' },
      { label: 'All Industries', href: '/industries' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'How It Works', href: '/how-it-works' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Case Studies', href: '/resources/case-studies' },
      { label: 'Success Stories', href: '/resources/success-stories' },
      { label: 'Insights', href: '/resources/insights' },
      { label: 'FAQs', href: '/resources/faqs' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

export function SiteFooter({
  initialUser = null,
}: {
  initialUser?: { email?: string; role?: string } | null;
}) {
  return (
    <footer className="bg-[var(--obsidian)] border-t border-[var(--obsidian-border)]">
      <div className="container-nova py-20 md:py-28">
        {/* Brand */}
        <div className="mb-16">
          <div className="font-display text-[1.75rem] font-bold tracking-[0.12em] text-[var(--accent-white)] mb-3">
            NOVALINK
          </div>
          <p className="font-mono text-[0.8rem] text-[var(--silver-dim)] max-w-[45ch] leading-[1.8]">
            USA-Canada based healthcare outsourcing for international organizations.
          </p>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12 mb-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-[var(--silver-muted)] font-bold mb-6">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-mono text-[0.8rem] text-[var(--silver-dim)] hover:text-white transition-colors duration-150 no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal bar */}
        <div className="border-t border-[var(--obsidian-border)] pt-8 flex flex-wrap justify-between items-center gap-6">
          <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver-dim)]">
            © {new Date().getFullYear()} NOVALINK. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-8">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Accessibility', href: '/accessibility' },
              { label: 'Security', href: '/security' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--silver-dim)] hover:text-[var(--silver)] transition-colors duration-150 no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
