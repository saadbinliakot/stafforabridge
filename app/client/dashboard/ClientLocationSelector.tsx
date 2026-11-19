'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateClientLocationAction } from './actions';

const LOCATIONS = [
  { value: 'Canada', label: 'Canada', flag: '🇨🇦', compliance: 'PIPEDA & Provincial Privacy' },
  { value: 'United States', label: 'United States', flag: '🇺🇸', compliance: 'HIPAA & HITECH Governed' },
  { value: 'United Kingdom', label: 'United Kingdom', flag: '🇬🇧', compliance: 'UK GDPR & DPA 2018' },
  { value: 'Australia', label: 'Australia', flag: '🇦🇺', compliance: 'Privacy Act & APPs' },
  { value: 'European Union', label: 'European Union', flag: '🇪🇺', compliance: 'EU GDPR Standards' },
  { value: 'International', label: 'International', flag: '🌐', compliance: 'Global Operations' },
];

export function ClientLocationSelector({
  currentLocation,
}: {
  currentLocation: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentLocation || 'Canada');
  const [isPending, startTransition] = useTransition();

  async function handleSelect(val: string) {
    setSelected(val);
    startTransition(async () => {
      try {
        await updateClientLocationAction(val);
        router.refresh();
      } catch {
        // Handled silently to avoid leaking debug logs to browser console
      }
    });
  }

  const currentObj = LOCATIONS.find((l) => l.value.toLowerCase() === (selected || '').toLowerCase()) || {
    value: selected || 'Canada',
    label: selected || 'Canada',
    flag: '🇨🇦',
    compliance: 'Standard Healthcare Operations',
  };

  return (
    <div className="flex flex-col gap-1.5 pt-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-neutral-400 text-xs">Operating Region:</span>
        <div className="relative">
          <select
            value={selected}
            disabled={isPending}
            onChange={(e) => handleSelect(e.target.value)}
            className="appearance-none bg-[#141414] hover:bg-[#1a1a1a] text-white font-mono text-xs font-semibold pl-2.5 pr-7 py-1.5 border border-[#333333] hover:border-neutral-400 rounded-md cursor-pointer transition-all outline-none focus:border-white disabled:opacity-50"
            title="Click to select operating jurisdiction"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value} className="bg-[#121212] text-white py-1">
                {loc.flag} {loc.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400 text-[9px]">
            ▼
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span className="text-neutral-500">Standard:</span>
        <span className="text-emerald-400 font-medium">{currentObj.compliance}</span>
      </div>
    </div>
  );
}
