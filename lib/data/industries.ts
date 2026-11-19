import { createPublicSupabaseClient } from '@/lib/supabase/public';
import { industries as staticIndustries, type Industry } from '@/lib/data/content';

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getIndustries(): Promise<Industry[]> {
  if (!hasSupabaseEnv()) return staticIndustries;

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from('industries')
    .select('slug, name, description')
    .eq('status', 'published')
    .order('name');

  if (error || !data || data.length === 0) return staticIndustries;
  return data;
}

export async function getIndustryBySlug(slug: string): Promise<Industry | undefined> {
  const all = await getIndustries();
  return all.find((i) => i.slug === slug);
}