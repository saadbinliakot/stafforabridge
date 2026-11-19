'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to an error monitoring service
  }, [error]);

  return (
    <div className="bg-[var(--obsidian)] min-h-[75vh] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="max-w-xl w-full mx-auto text-center relative z-10">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-red-400 border border-red-900/40 bg-red-950/20 px-3.5 py-1.5 rounded-full inline-block mb-6">
          System Notice · Unexpected Exception
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--accent-white)] tracking-tight mb-4">
          Something went wrong
        </h1>

        <p className="font-mono text-xs sm:text-sm text-[var(--silver-muted)] leading-relaxed max-w-md mx-auto mb-10">
          An error occurred while rendering this view. Your session and data remain secure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '46px',
              padding: '0 26px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #ffffff',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 2px 12px rgba(255,255,255,0.18)',
            }}
            className="w-full sm:w-auto hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '46px',
              padding: '0 24px',
              backgroundColor: '#121212',
              color: '#e2e2e2',
              border: '1px solid #2e2e2e',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.18s ease',
            }}
            className="w-full sm:w-auto hover:bg-[#1a1a1a] hover:border-white/50 hover:text-white"
          >
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
