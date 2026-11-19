import clsx from 'clsx';

interface SplitSectionProps {
  left: React.ReactNode;
  right: React.ReactNode;
  reverse?: boolean;
  background?: 'paper' | 'marine' | 'butter';
  id?: string;
}

export function SplitSection({
  left,
  right,
  reverse = false,
  id,
}: SplitSectionProps) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: 'var(--obsidian-card)',
        borderTop: '1px solid var(--obsidian-border)',
        borderBottom: '1px solid var(--obsidian-border)',
      }}
    >
      <div
        className={clsx(
          'container-nova grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-0 py-16 md:py-24',
          reverse && 'md:[direction:rtl]'
        )}
      >
        <div
          className={clsx('md:col-span-2 md:pr-12', reverse && '[direction:ltr]')}
          style={{ color: 'var(--silver)' }}
        >
          {left}
        </div>
        <div
          className={clsx(
            'md:col-span-3 md:pl-12',
            reverse && '[direction:ltr]'
          )}
          style={{
            borderLeft: '1px solid var(--obsidian-border)',
            paddingLeft: '3rem',
          }}
        >
          {right}
        </div>
      </div>
    </section>
  );
}
