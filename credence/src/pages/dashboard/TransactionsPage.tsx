import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import type { DashboardOutletContext } from '../../layouts/DashboardLayout.tsx'
import { useTransactions } from '../../features/transactions/hooks/useTransactions.ts'
import { formatNaira, formatTransactionDate } from '../../features/transactions/formatters.ts'
import { TransactionStatusBadge } from '../../features/transactions/components/TransactionStatusBadge.tsx'
import type { TransactionStatus } from '../../features/transactions/types.ts'

const pageSize = 5

const statusOptions: TransactionStatus[] = [
  'Partially paid',
  'Overdue',
  'Settled',
  'Active',
  'Disputed',
  'Pending',
]

export function TransactionsPage() {
  const { search } = useOutletContext<DashboardOutletContext>()
  const transactions = useTransactions()
  const [status, setStatus] = useState('All statuses')
  const [overdueOnly, setOverdueOnly] = useState(false)
  const [month, setMonth] = useState('All dates')
  const [page, setPage] = useState(1)

  const filteredTransactions = useMemo(() => {
    if (!transactions.data) {
      return []
    }

    return transactions.data
      .filter((transaction) => {
        const searchText =
          `${transaction.debtor.name} ${transaction.reference} ${transaction.invoiceReference}`.toLowerCase()

        return (
          searchText.includes(search.trim().toLowerCase()) &&
          (status === 'All statuses' || transaction.status === status) &&
          (!overdueOnly || transaction.status === 'Overdue') &&
          (month === 'All dates' ||
            transaction.transactionDate.slice(0, 7) === month)
        )
      })
      .sort((left, right) =>
        right.transactionDate.localeCompare(left.transactionDate),
      )
  }, [transactions.data, search, status, overdueOnly, month])

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  function exportTransactions() {
    const header = [
      'Debtor',
      'Reference',
      'Invoice',
      'Transaction date',
      'Amount',
      'Paid',
      'Balance',
      'Due date',
      'Status',
    ]
    const rows = filteredTransactions.map((transaction) => [
      transaction.debtor.name,
      transaction.reference,
      transaction.invoiceReference,
      transaction.transactionDate,
      transaction.amount,
      transaction.paid,
      transaction.amount - transaction.paid,
      transaction.dueDate,
      transaction.status,
    ])
    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\r\n')
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    )
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = 'credence-transactions.csv'
    downloadLink.click()
    URL.revokeObjectURL(url)
  }

  if (transactions.isPending) {
    return (
      <div aria-label="Loading transactions" className="space-y-4" role="status">
        <span className="sr-only">Loading transactions…</span>
        <div className="h-12 animate-pulse rounded-xl bg-white" />
        <div className="h-80 animate-pulse rounded-xl bg-white" />
      </div>
    )
  }

  if (transactions.isError) {
    return (
      <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#f0d1cf] bg-white px-6 text-center">
        <h2 className="text-base font-semibold text-[#20354d]">
          We couldn’t load transactions
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          {transactions.error.message}
        </p>
        <button
          className="mt-5 h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white disabled:opacity-60"
          disabled={transactions.isFetching}
          onClick={() => void transactions.refetch()}
          type="button"
        >
          {transactions.isFetching ? 'Retrying…' : 'Try again'}
        </button>
      </section>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#e5eaf0] bg-white p-3">
        <label className="sr-only" htmlFor="transaction-status-filter">
          Filter by status
        </label>
        <select
          className="h-9 min-w-[145px] rounded-lg border border-[#e3e8ee] bg-white px-3 text-xs text-[#52657a] outline-none focus:border-[#65b883]"
          id="transaction-status-filter"
          onChange={(event) => setStatus(event.target.value)}
          value={status}
        >
          <option>All statuses</option>
          {statusOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label className="flex h-9 items-center gap-2 rounded-lg border border-[#e3e8ee] px-3 text-xs text-[#52657a]">
          <input
            checked={overdueOnly}
            className="size-3.5 accent-[#193452]"
            onChange={(event) => setOverdueOnly(event.target.checked)}
            type="checkbox"
          />
          Overdue only
        </label>

        <label className="sr-only" htmlFor="transaction-month-filter">
          Filter by month
        </label>
        <select
          className="h-9 min-w-[135px] rounded-lg border border-[#e3e8ee] bg-white px-3 text-xs text-[#52657a] outline-none focus:border-[#65b883]"
          id="transaction-month-filter"
          onChange={(event) => setMonth(event.target.value)}
          value={month}
        >
          <option>All dates</option>
          {[...new Set((transactions.data ?? []).map((transaction) => transaction.transactionDate.slice(0, 7)))]
            .sort((left, right) => right.localeCompare(left))
            .map((monthValue) => {
              const date = new Date(`${monthValue}-01T00:00:00`)
              const monthLabel = new Intl.DateTimeFormat('en', {
                month: 'long',
                year: 'numeric',
              }).format(date)

              return (
                <option key={monthValue} value={monthValue}>
                  {monthLabel}
                </option>
              )
            })}
        </select>

        <button
          className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg border border-[#e3e8ee] px-3 text-xs font-medium text-[#52657a] transition hover:bg-[#f8fafc]"
          onClick={exportTransactions}
          type="button"
        >
          <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 15v5h14v-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          </svg>
          Export
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-[#e5eaf0] bg-white px-6 text-center">
          <h2 className="text-base font-semibold text-[#20354d]">
            {transactions.data.length === 0
              ? 'No transactions yet'
              : 'No transactions match these filters'}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#74869a]">
            {transactions.data.length === 0
              ? 'Create a credit transaction to start tracking repayments.'
              : 'Try changing your search or filters.'}
          </p>
          {transactions.data.length === 0 && (
            <Link
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white hover:bg-[#122943]"
              to="/transactions/new"
            >
              New transaction
            </Link>
          )}
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#f8fafc] text-[10px] font-semibold uppercase tracking-wide text-[#8594a4]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Debtor</th>
                  <th className="px-3 py-3 font-semibold">Reference</th>
                  <th className="px-3 py-3 font-semibold">Invoice</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                  <th className="px-3 py-3 font-semibold">Paid</th>
                  <th className="px-3 py-3 font-semibold">Balance</th>
                  <th className="px-3 py-3 font-semibold">Due date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f3]">
                {visibleTransactions.map((transaction) => (
                  <tr className="text-[11px] text-[#52657a]" key={transaction.id}>
                    <td className="px-4 py-3.5 font-semibold text-[#20354d]">
                      <Link
                        className="hover:text-[#218a50] hover:underline"
                        to={`/transactions/${transaction.id}`}
                      >
                        {transaction.debtor.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5">
                      <Link
                        className="font-medium text-[#38668f] hover:underline"
                        to={`/transactions/${transaction.id}`}
                      >
                        {transaction.reference}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5">{transaction.invoiceReference}</td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      {formatTransactionDate(transaction.transactionDate)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#263e58]">
                      {formatNaira(transaction.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      {formatNaira(transaction.paid)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#263e58]">
                      {formatNaira(transaction.amount - transaction.paid)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      {formatTransactionDate(transaction.dueDate)}
                    </td>
                    <td className="px-3 py-3.5">
                      <TransactionStatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[#edf0f3] xl:hidden">
            {visibleTransactions.map((transaction) => (
              <article className="p-4" key={transaction.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      className="block truncate text-xs font-semibold text-[#20354d] hover:underline"
                      to={`/transactions/${transaction.id}`}
                    >
                      {transaction.debtor.name}
                    </Link>
                    <p className="mt-1 text-[10px] text-[#8594a4]">
                      {transaction.reference} · {transaction.invoiceReference}
                    </p>
                  </div>
                  <TransactionStatusBadge status={transaction.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-[10px] sm:grid-cols-4">
                  <span>
                    <span className="block text-[#8594a4]">Amount</span>
                    <strong className="mt-1 block text-[#34485f]">
                      {formatNaira(transaction.amount)}
                    </strong>
                  </span>
                  <span>
                    <span className="block text-[#8594a4]">Paid</span>
                    <strong className="mt-1 block text-[#34485f]">
                      {formatNaira(transaction.paid)}
                    </strong>
                  </span>
                  <span>
                    <span className="block text-[#8594a4]">Transaction date</span>
                    <strong className="mt-1 block text-[#34485f]">
                      {formatTransactionDate(transaction.transactionDate)}
                    </strong>
                  </span>
                  <span>
                    <span className="block text-[#8594a4]">Due date</span>
                    <strong className="mt-1 block text-[#34485f]">
                      {formatTransactionDate(transaction.dueDate)}
                    </strong>
                  </span>
                </div>
              </article>
            ))}
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0f3] px-4 py-3">
            <p className="text-[10px] text-[#8594a4]">
              Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} transactions
            </p>
            {pageCount > 1 && (
              <div aria-label="Transaction pages" className="flex items-center gap-1">
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
        </section>
      )}
    </div>
  )
}
