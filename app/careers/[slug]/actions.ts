'use server';

import { jobApplicationSchema } from '@/lib/validation/schemas';
import { createJobApplication, uploadResume } from '@/lib/data/submissions';

export interface ApplicationFormState {
  status: 'idle' | 'success' | 'error';
  fieldErrors?: Record<string, string>;
  message?: string;
}

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export async function submitJobApplication(
  _prevState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const raw = {
    jobSlug: String(formData.get('jobSlug') || ''),
    fullName: String(formData.get('fullName') || ''),
    email: String(formData.get('email') || ''),
    phone: String(formData.get('phone') || ''),
    location: String(formData.get('location') || ''),
    relevantExperience: String(formData.get('relevantExperience') || ''),
    coverLetter: String(formData.get('coverLetter') || ''),
    consent: formData.get('consent') === 'on',
  };

  const parsed = jobApplicationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: 'error', fieldErrors, message: 'Please correct the highlighted fields.' };
  }

  const resumeFile = formData.get('resume') as File | null;
  let resumeStoragePath: string | null = null;

  if (resumeFile && resumeFile.size > 0) {
    if (resumeFile.size > MAX_RESUME_BYTES) {
      return {
        status: 'error',
        fieldErrors: { resume: 'Resume must be under 5MB.' },
        message: 'Please correct the highlighted fields.',
      };
    }
    if (!ALLOWED_RESUME_TYPES.includes(resumeFile.type)) {
      return {
        status: 'error',
        fieldErrors: { resume: 'Resume must be a PDF or Word document.' },
        message: 'Please correct the highlighted fields.',
      };
    }
    try {
      resumeStoragePath = await uploadResume(resumeFile, parsed.data.email);
    } catch (err) {
      console.error('resume upload error', err);
      return { status: 'error', message: 'Resume upload failed. Please try again.' };
    }
  }

  try {
    await createJobApplication({ ...parsed.data, resumeStoragePath });
  } catch (err) {
    console.error('submitJobApplication error', err);
    return { status: 'error', message: 'Something went wrong submitting your application. Please try again.' };
  }

  return { status: 'success', message: 'Your application has been received. NOVALINK will follow up if there is a fit.' };
}
