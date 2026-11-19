'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateClientProfile, triggerPasswordReset } from './actions';
import { NotificationToast, type NotificationMessage } from '@/components/ui/NotificationToast';

const ORG_TYPES = [
  { value: 'medical_practice', label: 'Medical Practice' },
  { value: 'hospital_health_system', label: 'Hospital / Health System' },
  { value: 'dental_practice', label: 'Dental Practice' },
  { value: 'behavioral_health', label: 'Behavioral Health' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'imaging_center', label: 'Imaging Center' },
  { value: 'home_healthcare', label: 'Home Healthcare' },
  { value: 'long_term_care', label: 'Long-Term Care' },
  { value: 'other', label: 'Other Healthcare Organization' },
];

const COUNTRIES = [
  { value: 'Canada', label: '🇨🇦 Canada (USA-Canada Based Operations)' },
  { value: 'United States', label: '🇺🇸 United States (USA-Canada Based Operations)' },
  { value: 'International', label: '🌐 International Healthcare Jurisdiction' },
];

export function ProfileForm({
  userEmail,
  memberSince,
  initialName,
  initialPhone,
  initialOrgName,
  initialOrgType,
  initialCountry,
}: {
  userEmail: string;
  memberSince: string;
  initialName: string;
  initialPhone: string;
  initialOrgName: string;
  initialOrgType: string;
  initialCountry: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [resetPending, setResetPending] = useState(false);

  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [orgName, setOrgName] = useState(initialOrgName);
  const [orgType, setOrgType] = useState(initialOrgType || 'medical_practice');
  const [country, setCountry] = useState(initialCountry || 'Canada');

  const [notification, setNotification] = useState<NotificationMessage | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateClientProfile({
          fullName,
          phone,
          organizationName: orgName,
          organizationType: orgType,
          country,
        });
        setNotification({
          type: 'success',
          message: 'Your profile and organization details were saved successfully.',
        });
        router.refresh();
      } catch (err: any) {
        setNotification({
          type: 'error',
          message: err?.message || 'Failed to update profile.',
        });
      }
    });
  }

  async function handlePasswordReset() {
    setResetPending(true);
    try {
      const res = await triggerPasswordReset();
      setNotification({
        type: 'success',
        message: res.message,
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err?.message || 'Failed to send password reset link.',
      });
    } finally {
      setResetPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      {/* Executive Account Identity Header Card */}
      <div className="bg-[#0c0c0c] border border-[#242424] p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.62rem] font-bold tracking-[0.16em] uppercase text-neutral-400">
              Verified Client Profile
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-neutral-600" />
            <span className="font-mono text-[0.62rem] font-semibold tracking-wider text-neutral-500 uppercase">
              Member since {memberSince}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-white font-bold tracking-tight">
            {fullName || 'Account Member'}
          </h2>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-neutral-400 font-mono text-xs">
            <span className="text-white font-medium">{userEmail}</span>
            {orgName && (
              <>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-300">{orgName}</span>
              </>
            )}
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400 capitalize">{country}</span>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={resetPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '42px',
              padding: '0 20px',
              backgroundColor: '#161616',
              color: '#d4d4d4',
              border: '1px solid #2e2e2e',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: resetPending ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              whiteSpace: 'nowrap',
            }}
            className="w-full md:w-auto hover:bg-[#202020] hover:border-white/50 hover:text-white disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{resetPending ? 'Sending Link…' : 'Send Password Reset Link'}</span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0e0e0e] border border-[#222222] p-6 sm:p-8 rounded-xl shadow-xl flex flex-col gap-6"
      >
        <div className="border-b border-[#202020] pb-4">
          <h3 className="font-display text-lg text-white font-bold mb-1">
            Account & Organization Details
          </h3>
          <p className="font-mono text-xs text-neutral-400">
            Keep your clinical coordination details up to date for consultations and active role deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block mb-2 font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-4 font-mono text-xs bg-[#161616] text-white border border-[#2e2e2e] rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
            />
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">
              Work Email Address (Read-Only)
            </label>
            <input
              type="email"
              disabled
              value={userEmail}
              className="w-full h-11 px-4 font-mono text-xs bg-[#121212] text-neutral-400 border border-[#252525] rounded-lg cursor-not-allowed opacity-80"
            />
          </div>

          {/* Organization Name */}
          <div>
            <label className="block mb-2 font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
              Healthcare Organization Name
            </label>
            <input
              type="text"
              placeholder="e.g. Toronto Specialty Clinic"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full h-11 px-4 font-mono text-xs bg-[#161616] text-white border border-[#2e2e2e] rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-neutral-500 transition-all"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-2 font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
              Direct Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-4 font-mono text-xs bg-[#161616] text-white border border-[#2e2e2e] rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-neutral-500 transition-all"
            />
          </div>

          {/* Organization Type */}
          <div>
            <label className="block mb-2 font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
              Organization Practice Type
            </label>
            <div className="relative">
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="w-full h-11 appearance-none pl-4 pr-9 font-mono text-xs bg-[#161616] text-white border border-[#2e2e2e] rounded-lg outline-none focus:border-white cursor-pointer [color-scheme:dark]"
              >
                {ORG_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#111111] text-white">
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Operating Jurisdiction */}
          <div>
            <label className="block mb-2 font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
              Primary Operating Jurisdiction
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-11 appearance-none pl-4 pr-9 font-mono text-xs bg-[#161616] text-white border border-[#2e2e2e] rounded-lg outline-none focus:border-white cursor-pointer [color-scheme:dark]"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#111111] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-[#202020]">
          <button
            type="submit"
            disabled={isPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              padding: '0 28px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #ffffff',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isPending ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 2px 12px rgba(255,255,255,0.18)',
            }}
            className="w-full sm:w-auto hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <span>{isPending ? 'Saving Details…' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
