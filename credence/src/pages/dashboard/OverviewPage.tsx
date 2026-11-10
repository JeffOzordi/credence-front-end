import { useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import type { DashboardOutletContext } from '../../layouts/DashboardLayout.tsx'
import { useDashboardOverview } from '../../features/dashboard/hooks/useDashboardOverview.ts'
import { DashboardLoading } from '../../features/dashboard/components/DashboardLoading.tsx'
import { OverviewDashboard } from '../../features/dashboard/components/OverviewDashboard.tsx'

export function OverviewPage() {
  const { search } = useOutletContext<DashboardOutletContext>()
  const { state } = useLocation()
  const [showSuccess, setShowSuccess] = useState(
    Boolean((state as { setupCompleted?: boolean } | null)?.setupCompleted),
  )
  const overview = useDashboardOverview()

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      {showSuccess && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-[#bfe6cd] bg-[#edfaf1] px-4 py-3 text-xs text-[#237444]" role="status">
          <p>Your business setup is complete. Welcome to Credence.</p>
          <button aria-label="Dismiss setup confirmation" className="font-bold" onClick={() => setShowSuccess(false)} type="button">×</button>
        </div>
      )}

      {overview.isPending && <DashboardLoading />}

      {overview.isError && (
        <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#f0d1cf] bg-white px-6 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-[#fff0ef] text-xl text-[#bd4147]" aria-hidden="true">!</span>
          <h2 className="mt-4 text-base font-semibold text-[#20354d]">We couldn’t load your overview</h2>
          <p className="mt-2 text-sm leading-6 text-[#74869a]">{overview.error.message}</p>
          <button
            className="mt-5 h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white hover:bg-[#122943] disabled:opacity-60"
            disabled={overview.isFetching}
            onClick={() => void overview.refetch()}
            type="button"
          >
            {overview.isFetching ? 'Retrying…' : 'Try again'}
          </button>
        </section>
      )}

      {overview.isSuccess && (
        <OverviewDashboard data={overview.data} search={search} />
      )}
    </div>
  )
}
