export default function AdminDashboardLoading() {
  return (
    <div className="bg-[var(--obsidian)] min-h-screen py-10">
      <div className="container-nova flex flex-col gap-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--obsidian-border)] pb-8">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-40 bg-neutral-800 rounded" />
            <div className="h-8 w-72 bg-neutral-700 rounded" />
          </div>
          <div className="h-10 w-32 bg-neutral-800 rounded" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#111111] border border-[#222222] rounded-xl p-5 flex flex-col justify-between">
              <div className="h-3 w-20 bg-neutral-800 rounded" />
              <div className="h-7 w-14 bg-neutral-700 rounded" />
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 border-b border-[#222222] pb-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 w-28 bg-[#161616] rounded-md" />
          ))}
        </div>

        {/* Table Content Skeleton */}
        <div className="h-96 bg-[#0f0f0f] border border-[#222222] rounded-xl p-6" />
      </div>
    </div>
  );
}
