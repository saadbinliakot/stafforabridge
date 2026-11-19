'use client';

import { useState } from 'react';

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        backgroundColor: 'var(--obsidian-card)',
        border: '1px solid var(--obsidian-border)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
          textAlign: 'left',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          fontWeight: 500,
          color: 'var(--silver)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 150ms ease',
        }}
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          style={{
            color: 'var(--silver-dim)',
            fontSize: '1rem',
            fontWeight: 300,
            flexShrink: 0,
          }}
        >
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div
          style={{
            padding: '0 1.5rem 1.25rem',
            borderTop: '1px solid var(--obsidian-border)',
            paddingTop: '1rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--silver-dim)',
              lineHeight: 1.7,
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
