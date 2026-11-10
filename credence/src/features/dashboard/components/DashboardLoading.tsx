function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-[#e8edf2] ${className}`} />
}

export function DashboardLoading() {
  return (
    <div aria-label="Loading overview dashboard" className="mx-auto w-full max-w-[1600px] space-y-5" role="status">
      <span className="sr-only">Loading overview dashboard…</span>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 xl:gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-[18px]" key={index}>
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="mt-5 h-7 w-4/5" />
            <Skeleton className="mt-3 h-3 w-1/2" />
          </div>
        ))}
      </section>
      <div className="rounded-2xl bg-[#193452] p-5 sm:p-6">
        <Skeleton className="h-5 w-56 bg-white/15" />
        <Skeleton className="mt-3 h-4 w-4/5 bg-white/15" />
        <Skeleton className="mt-5 h-2 w-3/5 bg-white/15" />
      </div>
      <div className="grid gap-5 xl:grid-cols-12">
        <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 xl:col-span-7">
          <Skeleton className="mb-5 h-5 w-40" />
          {Array.from({ length: 4 }, (_, index) => <Skeleton className="mb-3 h-11 w-full" key={index} />)}
        </section>
        <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 xl:col-span-5">
          <Skeleton className="mb-5 h-5 w-36" />
          {Array.from({ length: 3 }, (_, index) => <Skeleton className="mb-3 h-32 w-full" key={index} />)}
        </section>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4" key={index}>
            <Skeleton className="mb-5 h-5 w-44" />
            <Skeleton className="h-40 w-full" />
          </section>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4" key={index}>
            <Skeleton className="mb-5 h-5 w-40" />
            <Skeleton className="h-36 w-full" />
          </section>
        ))}
      </div>
    </div>
  )
}
