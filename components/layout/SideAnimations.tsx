'use client';

export function SideAnimations() {
  const tickerLeft =
    '◆ NOVALINK HEALTHCARE OPERATIONS ── ENCRYPTED EHR ENCLAVE ── CANADIAN CONTROL DESK ── PIPEDA & HIPAA SECURED ── ZERO DATA RESIDENCY ── CONTINUOUS SLA MONITORING ── ';
  const tickerRight =
    '◆ LIVE TELEMETRY STREAM ── LATENCY < 15MS ── HARDWARE ISOLATED VDI ── AES-256-GCM ── 14-DAY ONBOARDING RAMP ── REAL-TIME CHART AUDIT ── 100% UPTIME ── ';

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {/* ================= LEFT MOVING SIDE PANEL ================= */}
      <aside className="pointer-events-none hidden lg:flex fixed left-0 top-0 bottom-0 w-12 xl:w-16 z-40 flex-col items-center justify-between py-10 overflow-hidden border-r border-[var(--obsidian-border)] bg-black/60 backdrop-blur-[2px]">
        {/* Top pulsing beacon */}
        <div className="flex flex-col items-center gap-2 shrink-0 z-10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
          <span className="font-mono text-[0.58rem] font-bold tracking-widest text-emerald-300 uppercase">
            SYS:OK
          </span>
        </div>

        {/* Laser line slider running down with glowing light */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/[0.08]">
          <div className="absolute left-0 w-[2px] -translate-x-[0.5px] h-36 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-laser-down" />
        </div>

        {/* Continuous moving vertical ticker stream */}
        <div className="relative w-8 flex-1 overflow-hidden flex items-center justify-center my-6">
          <div
            className="flex flex-col gap-8 animate-vertical-ticker-down whitespace-nowrap font-mono text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-[var(--silver-muted)] rotate-180"
            style={{ writingMode: 'vertical-rl' }}
          >
            <span>{tickerLeft}</span>
            <span>{tickerLeft}</span>
            <span>{tickerLeft}</span>
            <span>{tickerLeft}</span>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 z-10">
          <span className="font-mono text-[0.52rem] tracking-widest text-[var(--silver-muted)] uppercase">
            01//RAIL
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-pulse" />
        </div>
      </aside>

      {/* ================= RIGHT MOVING SIDE PANEL ================= */}
      <aside className="pointer-events-none hidden lg:flex fixed right-0 top-0 bottom-0 w-12 xl:w-16 z-40 flex-col items-center justify-between py-10 overflow-hidden border-l border-[var(--obsidian-border)] bg-black/60 backdrop-blur-[2px]">
        {/* Top pulsing beacon */}
        <div className="flex flex-col items-center gap-2 shrink-0 z-10">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-ring" />
          <span className="font-mono text-[0.58rem] font-bold tracking-widest text-blue-300 uppercase">
            TELEMETRY
          </span>
        </div>

        {/* Laser line slider running up with glowing light */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/[0.08]">
          <div className="absolute left-0 w-[2px] -translate-x-[0.5px] h-36 bg-gradient-to-t from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#60a5fa] animate-laser-up" />
        </div>

        {/* Continuous moving vertical ticker stream */}
        <div className="relative w-8 flex-1 overflow-hidden flex items-center justify-center my-6">
          <div
            className="flex flex-col gap-8 animate-vertical-ticker-up whitespace-nowrap font-mono text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-[var(--silver-muted)]"
            style={{ writingMode: 'vertical-rl' }}
          >
            <span>{tickerRight}</span>
            <span>{tickerRight}</span>
            <span>{tickerRight}</span>
            <span>{tickerRight}</span>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 z-10">
          <span className="font-mono text-[0.52rem] tracking-widest text-[var(--silver-muted)] uppercase">
            SEC//100%
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
        </div>
      </aside>
    </div>
  );
}
