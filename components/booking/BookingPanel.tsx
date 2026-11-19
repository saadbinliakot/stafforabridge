'use client';

import { useMemo } from 'react';

/**
 * Available time slots for bookings.
 */
const AVAILABLE_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
];

function getTomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function getMaxDateISO() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().slice(0, 10);
}

export function BookingPanel({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: {
  selectedDate: string;
  selectedTime: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}) {
  const minDate = useMemo(() => getTomorrowISO(), []);
  const maxDate = useMemo(() => getMaxDateISO(), []);

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      {/* Date picker */}
      <div className="flex flex-col gap-2 w-full min-w-0">
        <label
          htmlFor="bookingDate"
          className="font-mono text-xs tracking-wider uppercase text-[var(--silver-muted)] font-medium"
        >
          1. Select Calendar Date <span className="text-[var(--silver)]">*</span>
        </label>
        <input
          id="bookingDate"
          type="date"
          name="bookingDate"
          required
          min={minDate}
          max={maxDate}
          value={selectedDate}
          onChange={(e) => {
            onSelectDate(e.target.value);
            onSelectTime('');
          }}
          style={{
            paddingLeft: '1.4rem',
            paddingRight: '1.4rem',
            height: '52px',
            backgroundColor: '#121212',
            border: '1px solid #333333',
            borderRadius: '8px',
          }}
          className="input-dark w-full max-w-full box-border [color-scheme:dark] cursor-pointer"
        />
        <p className="font-mono text-[0.7rem] text-[var(--silver-dim)]">
          Available Monday – Friday, 09:00 to 17:00 EST. Bookings open 90 days in advance.
        </p>
      </div>

      {/* Time slot grid — shown once a date is selected */}
      {selectedDate && (
        <div className="flex flex-col gap-2.5 animate-fade-in">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-[var(--silver-muted)] font-semibold">
              2. Select Available Slot <span className="text-[var(--silver)]">*</span>
            </label>
            <span className="font-mono text-[0.62rem] text-[var(--silver-dim)]">
              {AVAILABLE_TIMES.length} standard windows
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {AVAILABLE_TIMES.map((slot) => {
              const active = slot === selectedTime;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  aria-pressed={active}
                  style={{
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: active ? 700 : 500,
                    letterSpacing: '0.05em',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.16s ease',
                    backgroundColor: active ? '#ffffff' : '#141414',
                    color: active ? '#000000' : '#d0d0d0',
                    border: '1px solid ' + (active ? '#ffffff' : '#2e2e2e'),
                    boxShadow: active ? '0 0 16px rgba(255,255,255,0.25)' : 'none',
                  }}
                  className="hover:border-white/60 hover:text-white"
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="bookingTime" value={selectedTime} />
        </div>
      )}
    </div>
  );
}
