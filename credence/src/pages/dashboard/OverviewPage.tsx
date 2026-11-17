import { useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import type { DashboardOutletContext } from '../../layouts/DashboardLayout.tsx'
import { useDashboardOverview } from '../../features/dashboard/hooks/useDashboardOverview.ts'
import { DashboardLoading } from '../../features/dashboard/components/DashboardLoading.tsx'
import { OverviewDashboard } from '../../features/dashboard/components/OverviewDashboard.tsx'
import { ApiRequestError } from '../../services/api/interceptors.ts'

export function OverviewPage() {
  const { search } = useOutletContext<DashboardOutletContext>()
  const { state } = useLocation()
  const setupCompleted = Boolean(
    (state as { setupCompleted?: boolean } | null)?.setupCompleted,
  )
  const [showSuccess, setShowSuccess] = useState(setupCompleted)
  const overview = useDashboardOverview(!setupCompleted)

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      {showSuccess && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-[#bfe6cd] bg-[#edfaf1] px-4 py-3 text-xs text-[#237444]" role="status">
          <p>Your business setup is complete. Welcome to Credence.</p>
          <button aria-label="Dismiss setup confirmation" className="font-bold" onClick={() => setShowSuccess(false)} type="button">×</button>
        </div>
      )}

      {setupCompleted && (
        <section className="mx-auto flex min-h-80 max-w-3xl flex-col items-center justify-center rounded-2xl border border-[#e5eaf0] bg-white px-6 py-12 text-center shadow-[0_2px_8px_rgba(28,53,79,0.025)]">
          <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-[#e8f6ed] text-2xl text-[#21864b]">
            <svg className="size-7" fill="none" viewBox="0 0 24 24">
              <path d="M4 7.5h16v12H4zM4 10.5h16M8 15h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
              <path d="m8 4 2 2 5-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
            </svg>
          </span>
          <h2 className="mt-5 text-lg font-semibold text-[#20354d]">No transactions yet</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#74869a]">
            Your credit transactions will appear here once you start creating them.
          </p>
        </section>
      )}

      {!setupCompleted && overview.isPending && <DashboardLoading />}

      {!setupCompleted && overview.isError && overview.error instanceof ApiRequestError && overview.error.status === 404 && (
        <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#e5eaf0] bg-white px-6 text-center">
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#fff3d9] text-xl text-[#b97812]">i</span>
          <h2 className="mt-4 text-base font-semibold text-[#20354d]">Dashboard overview isn’t available yet</h2>
          <p className="mt-2 text-sm leading-6 text-[#74869a]">
            The deployed API does not currently provide overview data, so transaction activity cannot be confirmed here.
          </p>
          <button
            className="mt-5 h-10 rounded-lg border border-[#dce3df] px-5 text-xs font-semibold text-[#416d54] hover:bg-[#eff3f0] disabled:opacity-60"
            disabled={overview.isFetching}
            onClick={() => void overview.refetch()}
            type="button"
          >
            {overview.isFetching ? 'Checking…' : 'Check again'}
          </button>
        </section>
      )}

      {!setupCompleted && overview.isError && !(overview.error instanceof ApiRequestError && overview.error.status === 404) && (
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

      {!setupCompleted && overview.isSuccess && (
        <OverviewDashboard data={overview.data} search={search} />
      )}
    </div>
  )
}
