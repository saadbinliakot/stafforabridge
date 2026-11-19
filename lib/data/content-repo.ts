import { createPublicSupabaseClient } from '@/lib/supabase/public';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import {
  caseStudies as staticCaseStudies,
  testimonials as staticTestimonials,
  faqs as staticFaqs,
  jobs as staticJobs,
} from '@/lib/data/content';

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getPublishedCaseStudies() {
  if (!hasSupabaseEnv()) return staticCaseStudies;
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('published_status', 'published')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return staticCaseStudies;
    return data.map((c: any) => ({
      ...c,
      operationalImpact: c.operational_impact || c.operationalImpact,
    }));
  } catch {
    return staticCaseStudies;
  }
}

export async function getCaseStudyBySlug(slug: string) {
  const all = await getPublishedCaseStudies();
  return (all as any[]).find((c) => c.slug === slug);
}

export async function getPublishedTestimonials() {
  if (!hasSupabaseEnv()) return staticTestimonials;
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return staticTestimonials;
    return data;
  } catch {
    return staticTestimonials;
  }
}

export async function getPublishedFAQs(category?: string) {
  if (!hasSupabaseEnv()) {
    return category ? staticFaqs.filter((f) => f.category === category) : staticFaqs;
  }
  try {
    const supabase = createPublicSupabaseClient();
    let query = supabase.from('faqs').select('*').eq('published', true).order('sort_order');
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return category ? staticFaqs.filter((f) => f.category === category) : staticFaqs;
    }
    return data;
  } catch {
    return category ? staticFaqs.filter((f) => f.category === category) : staticFaqs;
  }
}

export async function getOpenJobs() {
  if (!hasSupabaseEnv()) return staticJobs;
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return staticJobs;
    return data.map((j: any) => ({
      ...j,
      employmentType: j.employment_type || j.employmentType,
    }));
  } catch {
    return staticJobs;
  }
}

export async function getJobBySlug(slug: string) {
  const all = await getOpenJobs();
  return (all as any[]).find((j) => j.slug === slug);
}

export async function getPublishedArticles() {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

// ----------------------------------------------------------------------------
// ADMIN CMS DATA FETCHERS (Includes both published and draft entries)
// ----------------------------------------------------------------------------

export async function getAllJobsForAdmin() {
  if (!hasSupabaseEnv()) {
    return staticJobs.map((j, i) => ({
      id: `static-job-${i}`,
      slug: j.slug,
      title: j.title,
      category: j.category,
      location: j.location,
      employment_type: j.employmentType,
      employmentType: j.employmentType,
      summary: j.summary,
      status: 'published',
      created_at: new Date().toISOString(),
    }));
  }
  try {
    const adminClient = createAdminSupabaseClient();
    const { data, error } = await adminClient
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return staticJobs.map((j, i) => ({
        id: `static-job-${i}`,
        slug: j.slug,
        title: j.title,
        category: j.category,
        location: j.location,
        employment_type: j.employmentType,
        employmentType: j.employmentType,
        summary: j.summary,
        status: 'published',
        created_at: new Date().toISOString(),
      }));
    }
    return data.map((j: any) => ({
      ...j,
      employmentType: j.employment_type || j.employmentType,
    }));
  } catch {
    return staticJobs.map((j, i) => ({
      id: `static-job-${i}`,
      slug: j.slug,
      title: j.title,
      category: j.category,
      location: j.location,
      employment_type: j.employmentType,
      employmentType: j.employmentType,
      summary: j.summary,
      status: 'published',
      created_at: new Date().toISOString(),
    }));
  }
}

export async function getAllFaqsForAdmin() {
  if (!hasSupabaseEnv()) {
    return staticFaqs.map((f, i) => ({
      id: `static-faq-${i}`,
      question: f.question,
      answer: f.answer,
      category: f.category,
      sort_order: i,
      published: true,
      created_at: new Date().toISOString(),
    }));
  }
  try {
    const adminClient = createAdminSupabaseClient();
    const { data, error } = await adminClient
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) {
      return staticFaqs.map((f, i) => ({
        id: `static-faq-${i}`,
        question: f.question,
        answer: f.answer,
        category: f.category,
        sort_order: i,
        published: true,
        created_at: new Date().toISOString(),
      }));
    }
    return data;
  } catch {
    return staticFaqs.map((f, i) => ({
      id: `static-faq-${i}`,
      question: f.question,
      answer: f.answer,
      category: f.category,
      sort_order: i,
      published: true,
      created_at: new Date().toISOString(),
    }));
  }
}

export async function getAllCaseStudiesForAdmin() {
  if (!hasSupabaseEnv()) {
    return staticCaseStudies.map((c, i) => ({
      id: `static-cs-${i}`,
      slug: c.slug,
      title: c.title,
      industry: c.industry,
      challenge: c.challenge,
      workflow: c.workflow,
      approach: c.approach,
      operational_impact: c.operationalImpact,
      operationalImpact: c.operationalImpact,
      metrics: c.metrics,
      quote: c.quote,
      published_status: 'published',
      created_at: new Date().toISOString(),
    }));
  }
  try {
    const adminClient = createAdminSupabaseClient();
    const { data, error } = await adminClient
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return staticCaseStudies.map((c, i) => ({
        id: `static-cs-${i}`,
        slug: c.slug,
        title: c.title,
        industry: c.industry,
        challenge: c.challenge,
        workflow: c.workflow,
        approach: c.approach,
        operational_impact: c.operationalImpact,
        operationalImpact: c.operationalImpact,
        metrics: c.metrics,
        quote: c.quote,
        published_status: 'published',
        created_at: new Date().toISOString(),
      }));
    }
    return data.map((c: any) => ({
      ...c,
      operationalImpact: c.operational_impact || c.operationalImpact,
    }));
  } catch {
    return staticCaseStudies.map((c, i) => ({
      id: `static-cs-${i}`,
      slug: c.slug,
      title: c.title,
      industry: c.industry,
      challenge: c.challenge,
      workflow: c.workflow,
      approach: c.approach,
      operational_impact: c.operationalImpact,
      operationalImpact: c.operationalImpact,
      metrics: c.metrics,
      quote: c.quote,
      published_status: 'published',
      created_at: new Date().toISOString(),
    }));
  }
}

export async function getAllTestimonialsForAdmin() {
  if (!hasSupabaseEnv()) {
    return staticTestimonials.map((t, i) => ({
      id: `static-test-${i}`,
      name: t.name,
      role: t.role,
      company: t.company,
      quote: t.quote,
      industry: t.industry,
      published: true,
      created_at: new Date().toISOString(),
    }));
  }
  try {
    const adminClient = createAdminSupabaseClient();
    const { data, error } = await adminClient
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return staticTestimonials.map((t, i) => ({
        id: `static-test-${i}`,
        name: t.name,
        role: t.role,
        company: t.company,
        quote: t.quote,
        industry: t.industry,
        published: true,
        created_at: new Date().toISOString(),
      }));
    }
    return data;
  } catch {
    return staticTestimonials.map((t, i) => ({
      id: `static-test-${i}`,
      name: t.name,
      role: t.role,
      company: t.company,
      quote: t.quote,
      industry: t.industry,
      published: true,
      created_at: new Date().toISOString(),
    }));
  }
}
