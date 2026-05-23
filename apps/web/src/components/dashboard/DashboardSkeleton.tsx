export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

      <div className="h-16 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid grid-cols-4 gap-6">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-3xl bg-slate-200"
          />
        ))}
      </div>

      <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr] gap-6">
        <div className="h-105 animate-pulse rounded-3xl bg-slate-200" />

        <div className="h-105 animate-pulse rounded-3xl bg-slate-200" />

        <div className="h-105 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    </div>
  );
}
