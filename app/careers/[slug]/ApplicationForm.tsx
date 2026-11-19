'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitJobApplication, type ApplicationFormState } from './actions';
import { FormField, FormTextarea, FormCheckbox } from '@/components/forms/FormField';
import { PrimaryButton } from '@/components/ui/CTAButton';

const initialState: ApplicationFormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Submitting Application…' : 'Submit Candidate Application'}
    </PrimaryButton>
  );
}

export function ApplicationForm({ jobSlug }: { jobSlug: string }) {
  const [state, formAction] = useActionState(submitJobApplication, initialState);

  if (state.status === 'success') {
    return (
      <div role="status" className="border border-emerald-900/50 bg-emerald-950/20 text-emerald-300 p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <h4 className="font-display text-lg text-emerald-200">Application Submitted</h4>
        </div>
        <p className="font-mono text-xs leading-relaxed text-emerald-400/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="jobSlug" value={jobSlug} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name" name="fullName" required error={state.fieldErrors?.fullName} />
        <FormField label="Email" name="email" type="email" required error={state.fieldErrors?.email} />
        <FormField label="Phone" name="phone" type="tel" required error={state.fieldErrors?.phone} />
        <FormField label="Current Location" name="location" required error={state.fieldErrors?.location} />
      </div>

      <FormTextarea
        label="Relevant Healthcare Experience"
        name="relevantExperience"
        placeholder="Detail your clinical, billing, or EHR/PMS software background..."
        required
        error={state.fieldErrors?.relevantExperience}
      />
      <FormTextarea 
        label="Cover Note / Background" 
        name="coverLetter" 
        placeholder="Additional context or certifications you hold..."
        error={state.fieldErrors?.coverLetter} 
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="resume" className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--silver-muted)]">
          Resume (PDF or DOCX, max 5MB) <span className="text-[var(--silver-dim)]">*</span>
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          className="font-mono text-xs text-[var(--silver)] border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] p-3 file:mr-4 file:py-1 file:px-3 file:border-0 file:text-[0.7rem] file:font-mono file:bg-[var(--accent-white)] file:text-[var(--obsidian)] file:uppercase file:cursor-pointer hover:border-[var(--silver-dim)] transition-colors"
        />
        <p className="text-[0.65rem] font-mono text-[var(--silver-dim)]">
          Resumes are encrypted at rest and accessed strictly by NOVALINK clinical directors.
        </p>
        {state.fieldErrors?.resume && (
          <p role="alert" className="text-xs font-mono text-red-400">
            {state.fieldErrors.resume}
          </p>
        )}
      </div>

      <FormCheckbox
        label="I consent to NOVALINK evaluating this application and storing my submission for recruitment and compliance records."
        name="consent"
        required
        error={state.fieldErrors?.consent}
      />

      {state.status === 'error' && state.message && (
        <div role="alert" className="p-4 border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-xs">
          {state.message}
        </div>
      )}

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
