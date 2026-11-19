'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { logIn, requestPasswordReset, type LoginFormState } from './actions';
import { FormField } from '@/components/forms/FormField';
import { PrimaryButton, SecondaryButton } from '@/components/ui/CTAButton';

const initialState: LoginFormState = { status: 'idle' };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? pendingLabel : label}
    </PrimaryButton>
  );
}

export function LoginForm({ redirectTo = '' }: { redirectTo?: string }) {
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [loginState, loginAction] = useActionState(logIn, initialState);
  const [resetState, resetAction] = useActionState(requestPasswordReset, initialState);

  if (mode === 'reset') {
    return (
      <form action={resetAction} className="flex flex-col gap-6" noValidate>
        <FormField label="Work Email" name="email" type="email" required />
        {resetState.message && (
          <p className="font-mono text-sm font-semibold">{resetState.message}</p>
        )}
        <SubmitButton label="Send Reset Link" pendingLabel="Sending…" />
        <SecondaryButton type="button" onClick={() => setMode('login')}>
          Back to Login
        </SecondaryButton>
      </form>
    );
  }

  const signupHref = redirectTo
    ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}`
    : '/signup';

  return (
    <form action={loginAction} className="flex flex-col gap-6" noValidate>
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
      <FormField label="Email" name="email" type="email" required error={loginState.fieldErrors?.email} />
      <FormField label="Password" name="password" type="password" required error={loginState.fieldErrors?.password} />
      {loginState.status === 'error' && loginState.message && (
        <p role="alert" className="font-mono text-xs font-semibold text-red-400 p-3 border border-red-900/40 bg-red-950/20 rounded-[2px]">
          ⚠ {loginState.message}
        </p>
      )}
      <SubmitButton label="Log In" pendingLabel="Logging in…" />
      <div className="flex justify-between font-mono text-xs text-[var(--silver-muted)] pt-2">
        <button type="button" onClick={() => setMode('reset')} className="hover:text-white underline underline-offset-4 cursor-pointer">
          Forgot password?
        </button>
        <Link href={signupHref} className="hover:text-white underline underline-offset-4">
          Create an account
        </Link>
      </div>
    </form>
  );
}
