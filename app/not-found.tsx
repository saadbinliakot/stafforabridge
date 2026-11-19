import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found · NOVALINK',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="bg-[var(--obsidian)] min-h-[75vh] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Decorative ambient subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-xl w-full mx-auto text-center relative z-10">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--silver-dim)] border border-[var(--obsidian-border)] bg-[var(--obsidian-card)] px-3.5 py-1.5 rounded-full inline-block mb-6">
          HTTP 404 · Resource Not Found
        </span>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[var(--accent-white)] tracking-tight mb-4">
          Route Not Located
        </h1>

        <p className="font-mono text-xs sm:text-sm text-[var(--silver-muted)] leading-relaxed max-w-md mx-auto mb-10">
          The requested page or operational workflow module could not be identified on our servers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
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
              textDecoration: 'none',
              transition: 'all 0.18s ease',
              boxShadow: '0 2px 12px rgba(255,255,255,0.18)',
            }}
            className="w-full sm:w-auto hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/services"
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
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
