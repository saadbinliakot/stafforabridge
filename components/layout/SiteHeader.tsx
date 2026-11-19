'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PrimaryButton } from '@/components/ui/CTAButton';
import { SignOutButton } from '@/components/ui/SignOutButton';
import { createClient } from '@/lib/supabase/client';
import { getSessionUser } from '@/app/actions/auth-session';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Resources', href: '/resources' },
  { label: 'Careers', href: '/careers' },
];

export function SiteHeader({
  initialUser = null,
}: {
  initialUser?: { email?: string; role?: string } | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userSession, setUserSession] = useState<{ email?: string; role?: string } | null>(initialUser);

  const syncSession = useCallback(async () => {
    try {
      const serverUser = await getSessionUser();
      if (serverUser) {
        setUserSession({
          email: serverUser.email,
          role: serverUser.role,
        });
        return;
      }

      // Fallback client check
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserSession({
          email: user.email,
          role: (user.app_metadata?.role as string) || (user.user_metadata?.role as string) || 'client',
        });
      } else {
        setUserSession(null);
      }
    } catch {
      // Retain existing session on transient network errors
    }
  }, []);

  // Sync session on mount and whenever the active route/pathname changes
  useEffect(() => {
    syncSession();
  }, [pathname, syncSession]);

  // Listen to browser-level auth events and window visibility
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      syncSession();
    });

    const handleCustomAuth = () => syncSession();
    const handleFocus = () => syncSession();

    window.addEventListener('novalink:auth-change', handleCustomAuth);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('novalink:auth-change', handleCustomAuth);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, [syncSession]);

  const isAdmin = userSession?.role === 'admin';
  const dashboardHref = isAdmin ? '/admin/dashboard' : '/client/dashboard';
  const dashboardLabel = isAdmin ? 'Admin Dashboard' : 'Dashboard';

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-[var(--obsidian-border)]">
      <div className="container-nova flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-xl tracking-[0.12em] text-[var(--accent-white)] no-underline hover:opacity-90 transition-opacity"
        >
          NOVALINK
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-9 font-mono text-[0.72rem] tracking-[0.12em]"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--silver-muted)] hover:text-[var(--accent-white)] uppercase transition-colors duration-150 no-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-8 ml-auto">
          {userSession ? (
            <div className="flex items-center gap-4">
              <Link
                href={dashboardHref}
                className="px-4 py-2 text-[var(--silver-muted)] hover:text-white border border-[#2b2b2b] hover:border-white/50 bg-[#121212] hover:bg-[#1a1a1a] rounded-md font-mono text-[0.68rem] tracking-[0.1em] uppercase transition-all duration-150 no-underline"
              >
                {dashboardLabel}
              </Link>

              {!isAdmin && (
                <Link
                  href="/client/profile"
                  className="px-4 py-2 text-[var(--silver-muted)] hover:text-white border border-transparent hover:border-[#2a2a2a] hover:bg-[#111111] rounded-md font-mono text-[0.68rem] tracking-[0.1em] uppercase transition-all duration-150 no-underline"
                >
                  Profile
                </Link>
              )}

              <div className="pl-1">
                <SignOutButton variant="compact" />
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--silver-dim)] hover:text-[var(--silver)] transition-colors duration-150 no-underline"
            >
              Login
            </Link>
          )}

          <div className="h-6 w-[1px] bg-[#2a2a2a] mx-1" />

          <PrimaryButton href="/book-consultation" className="!py-2.5 !px-6 !text-[0.68rem]">
            Book a Consultation
          </PrimaryButton>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="!flex lg:!hidden font-mono text-[0.7rem] tracking-[0.1em] uppercase text-[var(--silver-muted)] bg-transparent border border-[var(--obsidian-border-strong)] px-3.5 py-2 cursor-pointer rounded-[2px]"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-[var(--obsidian-border)] bg-[var(--obsidian-card)]"
        >
          <nav
            aria-label="Mobile"
            className="container-nova flex flex-col gap-5 py-8 font-mono text-[0.75rem] tracking-[0.12em] uppercase"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[var(--silver-muted)] hover:text-[var(--accent-white)] no-underline transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {userSession ? (
              <div className="flex flex-col gap-4 py-2">
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="text-[var(--silver-muted)] hover:text-[var(--accent-white)] no-underline transition-colors"
                >
                  {dashboardLabel}
                </Link>
                {!isAdmin && (
                  <Link
                    href="/client/profile"
                    onClick={() => setOpen(false)}
                    className="text-[var(--silver-muted)] hover:text-white no-underline transition-colors"
                  >
                    Profile & Settings
                  </Link>
                )}
                <div onClick={() => setOpen(false)} className="pt-4 pb-2 flex items-center">
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-[var(--silver-dim)] hover:text-[var(--silver)] no-underline transition-colors py-2"
              >
                Login
              </Link>
            )}

            <div className="pt-8 mt-6 border-t border-[#222222] flex flex-col items-start gap-4">
              <PrimaryButton
                href="/book-consultation"
                onClick={() => setOpen(false)}
                className="self-start !py-3.5 !px-8 !text-[0.72rem]"
              >
                Book a Consultation
              </PrimaryButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
