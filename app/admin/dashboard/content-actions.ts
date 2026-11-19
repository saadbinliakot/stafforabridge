'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized: No active session. Please log in.');

  const adminClient = createAdminSupabaseClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin =
    profile?.role === 'admin' ||
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin';

  if (!isAdmin) throw new Error('Forbidden: Your account does not have admin permissions.');
  return user;
}

// ----------------------------------------------------------------------------
// JOBS / CAREERS ACTIONS
// ----------------------------------------------------------------------------
export async function createJobAction(formData: {
  title: string;
  slug: string;
  category: string;
  location: string;
  employmentType: string;
  summary: string;
  status?: string;
}) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('jobs').insert([
    {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: formData.category,
      location: formData.location,
      employment_type: formData.employmentType,
      summary: formData.summary,
      status: formData.status || 'published',
    },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath('/careers');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function updateJobAction(
  id: string,
  formData: {
    title: string;
    slug: string;
    category: string;
    location: string;
    employmentType: string;
    summary: string;
    status: string;
  }
) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient
    .from('jobs')
    .update({
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      location: formData.location,
      employment_type: formData.employmentType,
      summary: formData.summary,
      status: formData.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/careers');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteJobAction(id: string) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('jobs').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/careers');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

// ----------------------------------------------------------------------------
// FAQS ACTIONS
// ----------------------------------------------------------------------------
export async function createFaqAction(formData: {
  question: string;
  answer: string;
  category: string;
  sortOrder?: number;
  published?: boolean;
}) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('faqs').insert([
    {
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      sort_order: formData.sortOrder ?? 0,
      published: formData.published ?? true,
    },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/faqs');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function updateFaqAction(
  id: string,
  formData: {
    question: string;
    answer: string;
    category: string;
    sortOrder?: number;
    published?: boolean;
  }
) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient
    .from('faqs')
    .update({
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      sort_order: formData.sortOrder ?? 0,
      published: formData.published ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/faqs');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteFaqAction(id: string) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('faqs').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/faqs');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

// ----------------------------------------------------------------------------
// CASE STUDIES ACTIONS
// ----------------------------------------------------------------------------
export async function createCaseStudyAction(formData: {
  title: string;
  slug: string;
  industry: string;
  challenge: string;
  workflow: string;
  approach: string;
  operationalImpact: string;
  metrics: string[];
  quote?: string;
  publishedStatus?: string;
}) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('case_studies').insert([
    {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      industry: formData.industry,
      challenge: formData.challenge,
      workflow: formData.workflow,
      approach: formData.approach,
      operational_impact: formData.operationalImpact,
      metrics: formData.metrics,
      quote: formData.quote || '',
      published_status: formData.publishedStatus || 'published',
    },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/case-studies');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function updateCaseStudyAction(
  id: string,
  formData: {
    title: string;
    slug: string;
    industry: string;
    challenge: string;
    workflow: string;
    approach: string;
    operationalImpact: string;
    metrics: string[];
    quote?: string;
    publishedStatus: string;
  }
) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient
    .from('case_studies')
    .update({
      title: formData.title,
      slug: formData.slug,
      industry: formData.industry,
      challenge: formData.challenge,
      workflow: formData.workflow,
      approach: formData.approach,
      operational_impact: formData.operationalImpact,
      metrics: formData.metrics,
      quote: formData.quote || '',
      published_status: formData.publishedStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/case-studies');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteCaseStudyAction(id: string) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('case_studies').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/case-studies');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

// ----------------------------------------------------------------------------
// TESTIMONIALS ACTIONS
// ----------------------------------------------------------------------------
export async function createTestimonialAction(formData: {
  name: string;
  role: string;
  company: string;
  quote: string;
  industry?: string;
  published?: boolean;
}) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('testimonials').insert([
    {
      name: formData.name,
      role: formData.role,
      company: formData.company,
      quote: formData.quote,
      industry: formData.industry || 'Healthcare',
      published: formData.published ?? true,
    },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/success-stories');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function updateTestimonialAction(
  id: string,
  formData: {
    name: string;
    role: string;
    company: string;
    quote: string;
    industry?: string;
    published?: boolean;
  }
) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient
    .from('testimonials')
    .update({
      name: formData.name,
      role: formData.role,
      company: formData.company,
      quote: formData.quote,
      industry: formData.industry || 'Healthcare',
      published: formData.published ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/success-stories');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteTestimonialAction(id: string) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('testimonials').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/resources/success-stories');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

// ----------------------------------------------------------------------------
// INQUIRIES & CONTACT MESSAGES ACTIONS
// ----------------------------------------------------------------------------
export async function deleteContactMessageAction(id: string) {
  await verifyAdmin();
  const adminClient = createAdminSupabaseClient();

  const { error } = await adminClient.from('contact_messages').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/dashboard');
  return { success: true };
}



