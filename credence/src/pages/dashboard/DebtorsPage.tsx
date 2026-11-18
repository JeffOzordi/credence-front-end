import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { DebtorStatusBadge } from '../../features/debtors/components/DebtorStatusBadge.tsx'
import { useDebtors } from '../../features/debtors/hooks/useDebtors.ts'
import { getDebtorSummary } from '../../features/debtors/services/debtorService.ts'
import type { DebtorStatus } from '../../features/debtors/types.ts'
import { formatNaira } from '../../features/transactions/formatters.ts'
import type { DashboardOutletContext } from '../../layouts/DashboardLayout.tsx'
import { CreateDebtorDialog } from './CreateDebtorDialog.tsx'

const pageSize = 5

const statusOptions: DebtorStatus[] = [
  'Good standing',
  'Watch',
  'At risk',
  'New',
]

function SummaryCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string
  value: string
  accent: string
  icon: string
}) {
  return (
    <article className="rounded-xl border border-[#e5eaf0] bg-white p-4 shadow-[0_2px_8px_rgba(28,53,79,0.025)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#8291a2]">{label}</p>
          <p className="mt-2 text-xl font-bold tracking-tight text-[#20354d] sm:text-2xl">
            {value}
          </p>
        </div>
        <span className={`grid size-9 place-items-center rounded-lg ${accent}`}>
          <svg aria-hidden="true" className="size-[18px]" fill="none" viewBox="0 0 24 24">
            <path d={icon} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          </svg>
        </span>
      </div>
    </article>
  )
}

export function DebtorsPage() {
  const { search } = useOutletContext<DashboardOutletContext>()
  const debtors = useDebtors()
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const filteredDebtors = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (debtors.data ?? [])
      .filter((debtor) => {
        const searchText =
          `${debtor.name} ${debtor.contactName} ${debtor.email} ${debtor.phone} ${debtor.address} ${debtor.registrationNumber ?? ''}`.toLowerCase()

        return (
          searchText.includes(query) &&
          (status === 'All statuses' || debtor.status === status)
        )
      })
      .sort((left, right) => left.name.localeCompare(right.name))
  }, [debtors.data, search, status])

  const pageCount = Math.max(1, Math.ceil(filteredDebtors.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleDebtors = filteredDebtors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const totalOutstanding = (debtors.data ?? []).reduce(
    (total, debtor) => total + getDebtorSummary(debtor).outstandingAmount,
    0,
  )
  const owingDebtors = (debtors.data ?? []).filter(
    (debtor) => getDebtorSummary(debtor).outstandingAmount > 0,
  )
  const overdueDebtors = (debtors.data ?? []).filter(
    (debtor) => getDebtorSummary(debtor).overdueAmount > 0,
  )
  const rates = (debtors.data ?? [])
    .map((debtor) => debtor.onTimeRate)
    .filter((rate): rate is number => rate !== null)
  const averageOnTimeRate = rates.length
    ? Math.round(rates.reduce((total, rate) => total + rate, 0) / rates.length)
    : null

  if (debtors.isPending) {
    return (
      <div aria-label="Loading debtors" className="space-y-4" role="status">
        <span className="sr-only">Loading debtors…</span>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div className="h-24 animate-pulse rounded-xl bg-white" key={item} />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-white" />
      </div>
    )
  }

  if (debtors.isError) {
    return (
      <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#f0d1cf] bg-white px-6 text-center">
        <h2 className="text-base font-semibold text-[#20354d]">
          We couldn’t load debtors
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          {debtors.error.message}
        </p>
        <button
          className="mt-5 h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white disabled:opacity-60"
          disabled={debtors.isFetching}
          onClick={() => void debtors.refetch()}
          type="button"
        >
          {debtors.isFetching ? 'Retrying…' : 'Try again'}
        </button>
      </section>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#718398]">
          {debtors.data.length} debtor{debtors.data.length === 1 ? '' : 's'}{' '}
          <span aria-hidden="true">·</span> {formatNaira(totalOutstanding)} outstanding
        </p>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#193452] px-4 text-xs font-semibold text-white transition hover:bg-[#122943]"
          onClick={() => setAddDialogOpen(true)}
          type="button"
        >
          <span aria-hidden="true" className="text-lg leading-none">+</span>
          Add debtor
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          accent="bg-[#edf3f7] text-[#426582]"
          icon="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2 5a4 4 0 0 1 4 4v2m-2-15a4 4 0 0 1 0 8"
          label="Total debtors"
          value={String(debtors.data.length)}
        />
        <SummaryCard
          accent="bg-[#eaf7ee] text-[#29804b]"
          icon="M12 3v18m6-14H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
          label="Owe right now"
          value={String(owingDebtors.length)}
        />
        <SummaryCard
          accent="bg-[#fff2e8] text-[#b56725]"
          icon="M12 8v4m0 4h.01M10.3 3.8 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
          label="Overdue debtors"
          value={String(overdueDebtors.length)}
        />
        <SummaryCard
          accent="bg-[#f1eefb] text-[#7253a6]"
          icon="M12 3v18m9-9H3m16.24-6.24L4.76 18.24m0-12.48 14.48 12.48"
          label="Avg on-time rate"
          value={averageOnTimeRate === null ? '—' : `${averageOnTimeRate}%`}
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#edf0f3] p-3">
          <label className="sr-only" htmlFor="debtor-status-filter">
            Filter debtors by status
          </label>
          <select
            className="h-9 min-w-[150px] rounded-lg border border-[#e3e8ee] bg-white px-3 text-xs text-[#52657a] outline-none focus:border-[#65b883]"
            id="debtor-status-filter"
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            value={status}
          >
            <option>All statuses</option>
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <p className="ml-auto text-[10px] text-[#8594a4]">
            {filteredDebtors.length} result{filteredDebtors.length === 1 ? '' : 's'}
          </p>
        </div>

        {filteredDebtors.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <h2 className="text-sm font-semibold text-[#20354d]">
              {debtors.data.length === 0 ? 'No debtors yet' : 'No debtors found'}
            </h2>
            <p className="mt-2 max-w-sm text-xs leading-5 text-[#74869a]">
              {debtors.data.length === 0
                ? 'Add a debtor to start keeping their credit and repayment history in one place.'
                : 'Try another name, email or phone number, or change the status filter.'}
            </p>
            {debtors.data.length === 0 && (
              <button
                className="mt-4 h-9 rounded-lg bg-[#193452] px-4 text-xs font-semibold text-white"
                onClick={() => setAddDialogOpen(true)}
                type="button"
              >
                Add debtor
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1040px] text-left">
                <thead className="bg-[#f8fafc] text-[10px] font-semibold uppercase tracking-wide text-[#8594a4]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Debtor</th>
                    <th className="px-3 py-3 font-semibold">Contact</th>
                    <th className="px-3 py-3 font-semibold">Extended</th>
                    <th className="px-3 py-3 font-semibold">Outstanding</th>
                    <th className="px-3 py-3 font-semibold">Active</th>
                    <th className="px-3 py-3 font-semibold">Overdue</th>
                    <th className="px-3 py-3 font-semibold">On-time</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f3]">
                  {visibleDebtors.map((debtor) => {
                    const summary = getDebtorSummary(debtor)
                    return (
                      <tr className="text-[11px] text-[#52657a]" key={debtor.id}>
                        <td className="px-4 py-3.5">
                          <Link
                            className="font-semibold text-[#20354d] hover:text-[#218a50] hover:underline"
                            to={`/debtors/${debtor.id}`}
                          >
                            {debtor.name}
                          </Link>
                          <p className="mt-1 text-[10px] text-[#8594a4]">{debtor.email}</p>
                        </td>
                        <td className="px-3 py-3.5">
                          <p>{debtor.phone}</p>
                          <p className="mt-1 text-[10px] text-[#8594a4]">{debtor.contactName}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5">{formatNaira(summary.extendedAmount)}</td>
                        <td className="whitespace-nowrap px-3 py-3.5 font-semibold text-[#263e58]">
                          {formatNaira(summary.outstandingAmount)}
                        </td>
                        <td className="px-3 py-3.5">{summary.activeTransactions}</td>
                        <td className="whitespace-nowrap px-3 py-3.5">
                          <span className={summary.overdueAmount > 0 ? 'font-medium text-[#bd4147]' : ''}>
                            {formatNaira(summary.overdueAmount)}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          {debtor.onTimeRate === null ? '—' : `${debtor.onTimeRate}%`}
                        </td>
                        <td className="px-3 py-3.5">
                          <DebtorStatusBadge status={debtor.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#edf0f3] xl:hidden">
              {visibleDebtors.map((debtor) => {
                const summary = getDebtorSummary(debtor)
                return (
                  <article className="p-4" key={debtor.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          className="block truncate text-xs font-semibold text-[#20354d] hover:underline"
                          to={`/debtors/${debtor.id}`}
                        >
                          {debtor.name}
                        </Link>
                        <p className="mt-1 truncate text-[10px] text-[#8594a4]">
                          {debtor.contactName} · {debtor.email}
                        </p>
                        <p className="mt-1 text-[10px] text-[#8594a4]">{debtor.phone}</p>
                      </div>
                      <DebtorStatusBadge status={debtor.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-[10px] sm:grid-cols-4">
                      <span>
                        <span className="block text-[#8594a4]">Extended</span>
                        <strong className="mt-1 block text-[#34485f]">{formatNaira(summary.extendedAmount)}</strong>
                      </span>
                      <span>
                        <span className="block text-[#8594a4]">Outstanding</span>
                        <strong className="mt-1 block text-[#34485f]">{formatNaira(summary.outstandingAmount)}</strong>
                      </span>
                      <span>
                        <span className="block text-[#8594a4]">Overdue</span>
                        <strong className={`mt-1 block ${summary.overdueAmount ? 'text-[#bd4147]' : 'text-[#34485f]'}`}>
                          {formatNaira(summary.overdueAmount)}
                        </strong>
                      </span>
                      <span>
                        <span className="block text-[#8594a4]">On-time</span>
                        <strong className="mt-1 block text-[#34485f]">
                          {debtor.onTimeRate === null ? '—' : `${debtor.onTimeRate}%`}
                        </strong>
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0f3] px-4 py-3">
              <p className="text-[10px] text-[#8594a4]">
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredDebtors.length)} of{' '}
                {filteredDebtors.length} debtors
              </p>
              {pageCount > 1 && (
                <div aria-label="Debtor pages" className="flex items-center gap-1">
                  <button
                    aria-label="Previous page"
                    className="grid size-8 place-items-center rounded-md border border-[#e3e8ee] text-sm text-[#52657a] disabled:opacity-40"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    type="button"
                  >
                    ‹
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <button
                        aria-current={pageNumber === currentPage ? 'page' : undefined}
                        className={`grid size-8 place-items-center rounded-md text-[10px] ${
                          pageNumber === currentPage
                            ? 'bg-[#193452] font-semibold text-white'
                            : 'border border-[#e3e8ee] text-[#52657a]'
                        }`}
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        type="button"
                      >
                        {pageNumber}
                      </button>
                    ),
                  )}
                  <button
                    aria-label="Next page"
                    className="grid size-8 place-items-center rounded-md border border-[#e3e8ee] text-sm text-[#52657a] disabled:opacity-40"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                    type="button"
                  >
                    ›
                  </button>
                </div>
              )}
            </footer>
          </>
        )}
      </section>

      {addDialogOpen && (
        <CreateDebtorDialog onClose={() => setAddDialogOpen(false)} />
      )}
    </div>
  )
}
