'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { submitBooking, type BookingFormState } from './actions';
import { BookingPanel } from '@/components/booking/BookingPanel';
import { FormField, FormSelect } from '@/components/forms/FormField';

const SERVICES = [
  'Appointment Setting & Scheduling',
  'Virtual Healthcare Assistance',
  'Patient Intake & Registration',
  'Insurance & Eligibility Verification',
  'Prior Authorization',
  'Medical Billing',
  'Medical Coding',
  'Provider Credentialing & Enrollment',
  'Clinical Documentation',
];

const serviceOptions = SERVICES.map((s) => ({ value: s, label: s }));

const initialState: BookingFormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div className="pt-6 pb-2">
      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className={`w-full py-4 px-8 font-mono text-xs uppercase tracking-widest font-extrabold rounded-md transition-all duration-200 cursor-pointer shadow-xl ${
          pending
            ? 'bg-[#181818] text-neutral-500 border border-[#282828] cursor-not-allowed'
            : 'bg-white text-black border border-white hover:bg-neutral-100 hover:ring-2 hover:ring-white/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.01]'
        }`}
      >
        {pending ? 'Submitting Request…' : 'Request Consultation Slot'}
      </button>
    </div>
  );
}

export function BookingForm({
  defaultName = '',
  defaultEmail = '',
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [state, formAction] = useActionState(submitBooking, initialState);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="p-8 sm:p-12 border-2 border-emerald-500/80 bg-[#07130e] text-white rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col items-center text-center animate-fade-in"
      >
        {/* Luminous Celebration Badge */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.5)]">
            <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </span>
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-1">
          ✓ Booking Confirmed & Locked
        </span>

        <h3 className="font-display text-2xl sm:text-3xl text-white font-bold mb-3 tracking-tight">
          Consultation Slot Registered
        </h3>

        <p className="font-mono text-xs sm:text-sm text-neutral-200 max-w-lg mx-auto mb-6 leading-relaxed">
          {state.message}
        </p>

        {/* Highlighted Confirmation Details */}
        <div className="w-full max-w-md bg-[#0e1c15] border border-emerald-700/50 rounded-lg p-4 mb-8 text-left font-mono text-xs space-y-2">
          {selectedDate && (
            <div className="flex justify-between items-center py-1 border-b border-emerald-900/40">
              <span className="text-neutral-400">Scheduled Date:</span>
              <span className="text-white font-bold">{selectedDate}</span>
            </div>
          )}
          {selectedTime && (
            <div className="flex justify-between items-center py-1 border-b border-emerald-900/40">
              <span className="text-neutral-400">Scheduled Time Slot:</span>
              <span className="text-white font-bold">{selectedTime} EST</span>
            </div>
          )}
          <div className="flex justify-between items-center py-1">
            <span className="text-neutral-400">SLA Response:</span>
            <span className="text-emerald-300 font-bold">&lt; 24h Confirmation</span>
          </div>
        </div>

        {/* High-Contrast Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link
            href="/client/dashboard"
            className="flex-1 py-3 px-6 bg-white text-black font-extrabold font-mono text-xs uppercase tracking-wider rounded-md hover:bg-neutral-200 transition-all text-center shadow-lg cursor-pointer"
          >
            View in Dashboard →
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 py-3 px-6 bg-[#16221b] text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider border border-emerald-700/50 rounded-md hover:bg-[#1d2d24] transition-all cursor-pointer"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-14 sm:gap-18 w-full min-w-0" noValidate>
      {/* Section 1 — Date & Time */}
      <div className="flex flex-col gap-8 w-full min-w-0">
        <SectionHeading number="01" label="Select Date & Time" />
        <BookingPanel
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectDate={setSelectedDate}
          onSelectTime={setSelectedTime}
        />
        {(state.fieldErrors?.bookingDate || state.fieldErrors?.bookingTime) && (
          <p role="alert" className="font-mono text-xs font-semibold text-red-400">
            ⚠ Please select both an available date and a time slot.
          </p>
        )}
      </div>

      {/* Section 2 — Service Type */}
      <div className="flex flex-col gap-8 w-full min-w-0">
        <SectionHeading number="02" label="Service Type" />
        <FormSelect
          label="Outsourcing Role / Service"
          name="serviceType"
          required
          options={serviceOptions}
          error={state.fieldErrors?.serviceType}
        />
      </div>

      {/* Section 3 — Contact Details */}
      <div className="flex flex-col gap-8 w-full min-w-0">
        <SectionHeading number="03" label="Contact Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full min-w-0">
          <div className="md:col-span-2 w-full min-w-0">
            <FormField
              label="Full Name"
              name="contactName"
              required
              defaultValue={defaultName}
              autoComplete="name"
              error={state.fieldErrors?.contactName}
            />
          </div>
          <div className="w-full min-w-0">
            <FormField
              label="Work Email Address"
              name="contactEmail"
              type="email"
              required
              defaultValue={defaultEmail}
              autoComplete="email"
              error={state.fieldErrors?.contactEmail}
            />
          </div>
          <div className="w-full min-w-0">
            <FormField
              label="Direct Phone Number"
              name="contactPhone"
              type="tel"
              required
              autoComplete="tel"
              error={state.fieldErrors?.contactPhone}
            />
          </div>
        </div>
      </div>

      {/* Global error */}
      {state.status === 'error' && state.message && !state.fieldErrors && (
        <p role="alert" className="font-mono text-xs font-semibold text-red-400 p-4 border border-red-700 bg-red-950/40 rounded-md">
          ⚠ {state.message}
        </p>
      )}

      <SubmitButton />

      <p className="font-mono text-xs text-neutral-400 leading-relaxed text-center">
        This is an intake request — our Canadian operations desk will review and confirm calendar placement within 1 business day.
      </p>
    </form>
  );
}

function SectionHeading({ number, label }: { number: string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        paddingBottom: '18px',
        marginBottom: '10px',
        borderBottom: '1px solid #282828',
        width: '100%',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '6px 14px',
          backgroundColor: '#161616',
          border: '1px solid #383838',
          color: '#ffffff',
          borderRadius: '8px',
          flexShrink: 0,
          marginRight: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        }}
      >
        {number}
      </span>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          margin: 0,
          paddingLeft: '4px',
        }}
      >
        {label}
      </h3>
    </div>
  );
}
