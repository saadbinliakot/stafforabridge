import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SideAnimations } from '@/components/layout/SideAnimations';
import { buildMetadata } from '@/lib/utils/seo';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata({
  title: 'NOVALINK',
  description:
    'NOVALINK provides USA-Canada based healthcare outsourcing — operational, administrative, and back-office support for healthcare organizations worldwide.',
  path: '/',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialUser: { email?: string; role?: string } | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const adminClient = createAdminSupabaseClient();
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const role =
        profile?.role ||
        (user.app_metadata?.role as string) ||
        (user.user_metadata?.role as string) ||
        'client';

      initialUser = { email: user.email, role };
    }
  } catch {
    // Graceful fallback for build-time or public routes
  }

  return (
    <html lang="en" className={plexMono.variable} data-theme="dark">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-butter focus:px-4 focus:py-2 focus:brut-border"
        >
          Skip to main content
        </a>
        <SiteHeader initialUser={initialUser} />
        <SideAnimations />
        <main id="main-content">{children}</main>
        <SiteFooter initialUser={initialUser} />
      </body>
    </html>
  );
}
