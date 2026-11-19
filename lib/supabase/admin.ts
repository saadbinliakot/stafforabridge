import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. SERVER-ONLY.
 *
 * The `server-only` import above makes Next.js fail the build if this
 * module is ever imported from a Client Component or a browser bundle.
 *
 * Use this ONLY for privileged operations that must bypass Row Level
 * Security (e.g. a future /admin dashboard, background jobs). Do NOT
 * use it for anything a public form submits directly — public writes
 * (contact form, consultation requests, job applications) should go
 * through the anon-key server client in lib/supabase/server.ts so RLS
 * policies remain the actual source of truth for who can read what.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL — admin client unavailable.'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
