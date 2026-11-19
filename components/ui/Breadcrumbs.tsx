import Link from 'next/link';

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--silver-dim)] list-none p-0 m-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="text-[var(--silver-dim)] hover:text-[var(--silver)] transition-colors duration-150 no-underline"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[var(--silver-muted)]">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && (
              <span aria-hidden="true" className="text-[var(--obsidian-border-glow)]">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
