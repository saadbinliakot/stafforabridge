import { createClient } from '@supabase/supabase-js';

/**
 * Public, cookie-free Supabase client for read-only marketing content
 * (services, industries, jobs, case studies, testimonials, FAQs, articles).
 *
 * This is intentionally NOT built with @supabase/ssr's cookie-aware server
 * client, because these read functions are called from
 * `generateStaticParams`, which runs at build time outside any HTTP
 * request — there is no cookie store to read there. Since this content is
 * public (RLS policies allow anon SELECT on published rows), a session is
 * never required for these reads anyway.
 *
 * Use `lib/supabase/server.ts` instead for anything that must respect the
 * signed-in user's session (Server Actions handling form writes, auth
 * flows, per-organization data).
 */
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}