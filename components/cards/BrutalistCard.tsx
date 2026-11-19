import clsx from 'clsx';

interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  /** background variant — all map to obsidian dark palette */
  background?: 'paper' | 'marine' | 'butter' | 'brred';
  shadow?: 'sm' | 'md' | 'lg';
}

/** All variants now resolve to obsidian-card for the dark premium aesthetic. */
export function BrutalistCard({ children, className }: BrutalistCardProps) {
  return (
    <div
      className={clsx('card-interactive', className)}
      style={{
        padding: '2.25rem 2.5rem',
        backgroundColor: 'var(--obsidian-card)',
        border: '1px solid var(--obsidian-border)',
        borderRadius: '3px',
        color: 'var(--silver)',
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}
