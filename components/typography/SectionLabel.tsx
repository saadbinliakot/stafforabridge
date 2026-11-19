export function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--silver-dim)',
        marginBottom: '1.5rem',
      }}
    >
      <span
        style={{
          border: '1px solid var(--obsidian-border-strong)',
          padding: '0.2rem 0.5rem',
          color: 'var(--silver-dim)',
          borderRadius: '2px',
        }}
      >
        {number}
      </span>
      <span>{label}</span>
    </div>
  );
}
