'use client';

import { useMemo } from 'react';

type Booking = {
  id: string;
  user_id: string | null;
  service_type: string;
  booking_date: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  created_at: string;
};

export function AdminAnalytics({ bookings }: { bookings: Booking[] }) {
  // Aggregate stats
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;

  const conversionRate = total > 0 ? Math.round(((confirmed + completed) / total) * 100) : 0;
  // Estimated monthly value per outsourcing role (~$4,200 avg)
  const estimatedPipeline = (confirmed + completed) * 4200;

  // Aggregate by service type
  const serviceStats = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of bookings) {
      const s = b.service_type || 'Unspecified';
      map[s] = (map[s] || 0) + 1;
    }
    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [bookings, total]);

  // Daily / Weekly volume trajectory (last 7 recorded dates or chronological bins)
  const trajectory = useMemo(() => {
    if (bookings.length === 0) return [];
    const dateMap: Record<string, number> = {};
    for (const b of bookings) {
      const day = b.created_at ? b.created_at.slice(0, 10) : 'Recent';
      dateMap[day] = (dateMap[day] || 0) + 1;
    }
    return Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7);
  }, [bookings]);

  const maxDaily = Math.max(...trajectory.map(([, c]) => c), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Volume', value: total, sub: 'All recorded bookings' },
          { label: 'Pending Review', value: pending, sub: 'Requires immediate action', highlight: pending > 0 },
          { label: 'Confirmed Active', value: confirmed, sub: 'In operational onboarding' },
          { label: 'Completed', value: completed, sub: 'Successfully deployed' },
          {
            label: 'Pipeline Value',
            value: `$${estimatedPipeline.toLocaleString()}/mo`,
            sub: `${conversionRate}% conversion rate`,
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'var(--obsidian-card)',
              border: `1px solid ${card.highlight ? 'var(--silver-muted)' : 'var(--obsidian-border)'}`,
              borderRadius: '2px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--silver-dim)',
                marginBottom: '0.4rem',
              }}
            >
              {card.label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: card.highlight ? 'var(--accent-white)' : 'var(--silver)',
                lineHeight: 1.1,
                marginBottom: '0.35rem',
              }}
            >
              {card.value}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--silver-dim)',
              }}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Trajectory & Volume Timeline */}
        <div
          className="lg:col-span-7 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--obsidian-card)',
            border: '1px solid var(--obsidian-border)',
            borderRadius: '2px',
            padding: '1.5rem',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--silver-dim)',
                }}
              >
                Analytics · Velocity
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  color: 'var(--accent-white)',
                  marginTop: '0.2rem',
                }}
              >
                Booking Inflow Trajectory
              </h3>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--silver-dim)',
                border: '1px solid var(--obsidian-border-strong)',
                padding: '0.2rem 0.6rem',
                borderRadius: '2px',
              }}
            >
              Live Sync
            </span>
          </div>

          {trajectory.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-center">
              <p className="font-mono text-xs text-[var(--silver-dim)]">
                No historical records yet. New customer bookings will plot here automatically.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[var(--obsidian-border)]">
                {trajectory.map(([day, count]) => {
                  const heightPct = Math.max(Math.round((count / maxDaily) * 100), 12);
                  return (
                    <div
                      key={day}
                      className="flex-1 flex flex-col items-center gap-2 group relative"
                    >
                      {/* Tooltip on hover */}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-[var(--obsidian-elevated)] border border-[var(--obsidian-border-strong)] text-[var(--accent-white)] text-[0.65rem] font-mono px-2 py-0.5 rounded-[2px] pointer-events-none whitespace-nowrap z-10">
                        {count} booking{count !== 1 ? 's' : ''}
                      </span>
                      {/* Bar with gradient */}
                      <div
                        className="w-full rounded-t-[2px] transition-all duration-300 group-hover:bg-[var(--accent-white)]"
                        style={{
                          height: `${heightPct}%`,
                          background:
                            'linear-gradient(180deg, var(--silver-muted) 0%, rgba(255,255,255,0.08) 100%)',
                          borderTop: '1px solid var(--silver)',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between font-mono text-[0.6rem] text-[var(--silver-dim)]">
                {trajectory.map(([day]) => (
                  <span key={day}>{day.slice(5)}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chart 2: Service Distribution & Status Breakdown */}
        <div
          className="lg:col-span-5 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--obsidian-card)',
            border: '1px solid var(--obsidian-border)',
            borderRadius: '2px',
            padding: '1.5rem',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--silver-dim)',
              }}
            >
              Segmentation · Demand
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                color: 'var(--accent-white)',
                marginTop: '0.2rem',
                marginBottom: '1rem',
              }}
            >
              Service Allocation
            </h3>

            {serviceStats.length === 0 ? (
              <p className="font-mono text-xs text-[var(--silver-dim)] py-8 text-center">
                Awaiting initial service demand.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {serviceStats.slice(0, 5).map((stat) => (
                  <div key={stat.name} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center font-mono text-[0.72rem]">
                      <span className="text-[var(--silver)] truncate pr-2">{stat.name}</span>
                      <span className="text-[var(--silver-dim)] font-semibold shrink-0">
                        {stat.count} ({stat.pct}%)
                      </span>
                    </div>
                    {/* Bar track */}
                    <div className="w-full h-1.5 bg-[var(--obsidian)] border border-[var(--obsidian-border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--silver)] transition-all duration-500 rounded-full"
                        style={{ width: `${stat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Breakdown Segment */}
          <div className="border-t border-[var(--obsidian-border)] pt-4 mt-4">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--silver-dim)',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Status Health
            </span>
            <div className="flex items-center gap-2 h-2.5 w-full bg-[var(--obsidian)] border border-[var(--obsidian-border)] rounded-full overflow-hidden p-0.5">
              {pending > 0 && (
                <div
                  style={{ width: `${(pending / total) * 100}%` }}
                  className="h-full bg-yellow-500 rounded-full"
                  title={`Pending: ${pending}`}
                />
              )}
              {confirmed > 0 && (
                <div
                  style={{ width: `${(confirmed / total) * 100}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                  title={`Confirmed: ${confirmed}`}
                />
              )}
              {completed > 0 && (
                <div
                  style={{ width: `${(completed / total) * 100}%` }}
                  className="h-full bg-blue-500 rounded-full"
                  title={`Completed: ${completed}`}
                />
              )}
              {cancelled > 0 && (
                <div
                  style={{ width: `${(cancelled / total) * 100}%` }}
                  className="h-full bg-red-500 rounded-full"
                  title={`Cancelled: ${cancelled}`}
                />
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 font-mono text-[0.62rem] text-[var(--silver-dim)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500" /> Pending ({pending})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmed ({confirmed})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Completed ({completed})
              </span>
              {cancelled > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Cancelled ({cancelled})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

