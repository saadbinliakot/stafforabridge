import { createPublicSupabaseClient } from '@/lib/supabase/public';
import { services as staticServices, serviceCategories, type Service } from '@/lib/data/content';

/**
 * Data-access layer for services. Presentational components never
 * query Supabase directly — they call these functions.
 *
 * Falls back to the static seed content in lib/data/content.ts when
 * Supabase env vars are not configured yet (e.g. first local run before
 * `supabase start` / migrations), so the UI is never blocked on infra.
 */

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getServiceCategories() {
  return serviceCategories;
}

export async function getServices(): Promise<Service[]> {
  if (!hasSupabaseEnv()) return staticServices;

  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .select('slug, name, category_slug, short_description, problems_solved, typical_workflows, what_novalink_handles, who_it_is_for')
      .eq('status', 'published')
      .order('name');

    if (error || !data || data.length === 0) return staticServices;

    const dbSlugs = new Set(data.map((r) => r.slug));
    const merged = data.map((row) => ({
      slug: row.slug,
      name: row.name,
      categorySlug: row.category_slug,
      shortDescription: row.short_description,
      problemsSolved: row.problems_solved ?? [],
      typicalWorkflows: row.typical_workflows ?? [],
      whatNovalinkHandles: row.what_novalink_handles ?? [],
      whoItIsFor: row.who_it_is_for ?? [],
    }));

    for (const s of staticServices) {
      if (!dbSlugs.has(s.slug)) {
        merged.push(s);
      }
    }

    return merged;
  } catch {
    return staticServices;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const all = await getServices();
  const match = all.find((s) => s.slug === slug);
  if (match) return match;
  return staticServices.find((s) => s.slug === slug);
}

export async function getServicesByCategory(categorySlug: string): Promise<Service[]> {
  const all = await getServices();
  return all.filter((s) => s.categorySlug === categorySlug);
}