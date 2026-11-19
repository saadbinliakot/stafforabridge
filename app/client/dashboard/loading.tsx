export default function ClientDashboardLoading() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen py-10">
      <div className="container-nova flex flex-col gap-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--obsidian-border)] pb-8">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-36 bg-neutral-800 rounded" />
            <div className="h-8 w-64 bg-neutral-700 rounded" />
            <div className="h-3 w-48 bg-neutral-800 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-36 bg-neutral-800 rounded" />
            <div className="h-10 w-36 bg-neutral-800 rounded" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="h-80 bg-[#0f0f0f] border border-[#222222] rounded-xl p-6" />
      </div>
    </div>
  );
}
