'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm, type ContactFormState } from './actions';
import { FormField, FormSelect, FormTextarea, FormCheckbox } from '@/components/forms/FormField';
import { organizationTypes, services } from '@/lib/data/content';
import { PHI_WARNING } from '@/lib/validation/schemas';
import { PrimaryButton } from '@/components/ui/CTAButton';

const initialState: ContactFormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div className="pt-4">
      <PrimaryButton type="submit" disabled={pending} aria-disabled={pending} className="!py-3.5 !px-8">
        {pending ? 'Sending…' : 'Send Message'}
      </PrimaryButton>
    </div>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  if (state.status === 'success') {
    return (
      <div role="status" className="border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver)] p-6 rounded-[2px]">
        <p className="font-mono font-semibold">✓ {state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <div className="border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver-muted)] p-4 font-mono text-xs">
        ℹ {PHI_WARNING}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name" name="fullName" required error={state.fieldErrors?.fullName} />
        <FormField label="Work Email" name="workEmail" type="email" required error={state.fieldErrors?.workEmail} />
        <FormField label="Company" name="company" required error={state.fieldErrors?.company} />
        <FormField label="Job Title" name="jobTitle" error={state.fieldErrors?.jobTitle} />
        <FormField label="Country" name="country" required error={state.fieldErrors?.country} />
        <FormField label="Phone" name="phone" type="tel" error={state.fieldErrors?.phone} />
        <FormSelect
          label="Organization Type"
          name="organizationType"
          required
          options={organizationTypes}
          error={state.fieldErrors?.organizationType}
        />
        <FormSelect
          label="Preferred Contact Method"
          name="preferredContactMethod"
          required
          options={[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
          ]}
          error={state.fieldErrors?.preferredContactMethod}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-mono text-xs uppercase tracking-wide font-medium text-[var(--silver-muted)] mb-1">
          Interested Services <span className="text-red-400">*</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.slice(0, 8).map((s) => (
            <label key={s.slug} className="flex items-center gap-3 font-mono text-xs text-[var(--silver-muted)] hover:text-white transition-colors cursor-pointer select-none">
              <input type="checkbox" name="interestedServices" value={s.slug} className="h-4 w-4 rounded-[2px] border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] accent-white cursor-pointer" />
              {s.name}
            </label>
          ))}
        </div>
        {state.fieldErrors?.interestedServices && (
          <p role="alert" className="text-xs font-mono font-semibold text-red-400">
            {state.fieldErrors.interestedServices}
          </p>
        )}
      </fieldset>

      <FormTextarea label="Message" name="message" required error={state.fieldErrors?.message} />

      <FormCheckbox
        label="I consent to NOVALINK contacting me about this inquiry."
        name="consent"
        required
        error={state.fieldErrors?.consent}
      />

      {state.status === 'error' && state.message && !Object.keys(state.fieldErrors || {}).length && (
        <p role="alert" className="font-mono text-sm font-semibold text-red-400">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
