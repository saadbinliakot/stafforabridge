'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { signUp, type SignupFormState } from './actions';
import { FormField, FormCheckbox } from '@/components/forms/FormField';
import { PrimaryButton } from '@/components/ui/CTAButton';

const initialState: SignupFormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Creating account…' : 'Create Account'}
    </PrimaryButton>
  );
}

export function SignupForm({ redirectTo = '' }: { redirectTo?: string }) {
  const [state, formAction] = useActionState(signUp, initialState);

  const loginHref = redirectTo
    ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
    : '/login';

  if (state.status === 'success') {
    return (
      <div role="status" className="border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] text-[var(--silver)] p-6 rounded-[2px]">
        <p className="font-mono font-semibold mb-2">✓ {state.message}</p>
        <Link href={loginHref} className="font-mono text-sm underline underline-offset-4 text-[var(--accent-white)]">
          Go to login →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
      <FormField label="Full Name" name="fullName" required error={state.fieldErrors?.fullName} />
      <FormField label="Organization Name" name="organizationName" required error={state.fieldErrors?.organizationName} />
      <FormField label="Work Email" name="workEmail" type="email" required error={state.fieldErrors?.workEmail} />
      <FormField label="Password" name="password" type="password" required error={state.fieldErrors?.password} hint="At least 10 characters." />
      <FormField label="Confirm Password" name="confirmPassword" type="password" required error={state.fieldErrors?.confirmPassword} />
      <FormCheckbox
        label="I agree to the Terms of Service and Privacy Policy."
        name="consent"
        required
        error={state.fieldErrors?.consent}
      />
      {state.status === 'error' && state.message && (
        <p role="alert" className="font-mono text-xs font-semibold text-red-400 p-3 border border-red-900/40 bg-red-950/20 rounded-[2px]">
          ⚠ {state.message}
        </p>
      )}
      <SubmitButton />
      <p className="font-mono text-xs text-[var(--silver-muted)] pt-2">
        Already have an account?{' '}
        <Link href={loginHref} className="hover:text-white underline underline-offset-4">
          Log in →
        </Link>
      </p>
    </form>
  );
}
