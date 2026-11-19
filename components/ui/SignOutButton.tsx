'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logOut } from '@/app/login/actions';

export function SignOutButton({
  className = '',
  variant = 'pill',
}: {
  className?: string;
  variant?: 'pill' | 'compact';
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSignOut() {
    startTransition(async () => {
      await logOut();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('novalink:auth-change'));
      }
      router.push('/login');
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      title="Sign out of account"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        height: variant === 'compact' ? '34px' : '40px',
        padding: variant === 'compact' ? '0 14px' : '0 18px',
        backgroundColor: '#121212',
        color: '#b0b0b0',
        border: '1px solid #2a2a2a',
        borderRadius: '8px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.18s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
      }}
      className={`hover:bg-[#1a1a1a] hover:border-neutral-500 hover:text-white disabled:opacity-50 select-none ${className}`}
    >
      <span>{isPending ? 'Signing Out…' : 'Sign Out'}</span>
      <svg
        width="13"
        height="13"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ opacity: 0.7 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  );
}
