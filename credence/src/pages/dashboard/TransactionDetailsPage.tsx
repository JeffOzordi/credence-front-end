import { Link, useLocation, useParams } from 'react-router-dom'
import { TransactionStatusBadge } from '../../features/transactions/components/TransactionStatusBadge.tsx'
import { formatNaira, formatTransactionDate } from '../../features/transactions/formatters.ts'
import { useTransaction } from '../../features/transactions/hooks/useTransaction.ts'

export function TransactionDetailsPage() {
  const { transactionId } = useParams()
  const location = useLocation()
  const transaction = useTransaction(transactionId)
  const createdInMock =
    (location.state as { createdInMock?: boolean } | null)?.createdInMock === true

  if (transaction.isPending) {
    return (
      <div aria-label="Loading transaction" className="space-y-4" role="status">
        <span className="sr-only">Loading transaction…</span>
        <div className="h-16 animate-pulse rounded-xl bg-white" />
        <div className="h-80 animate-pulse rounded-xl bg-white" />
      </div>
    )
  }

  if (transaction.isError) {
    return (
      <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#f0d1cf] bg-white px-6 text-center">
        <h2 className="text-base font-semibold text-[#20354d]">
          We couldn’t load this transaction
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          {transaction.error.message}
        </p>
        <Link
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white"
          to="/transactions"
        >
          Back to transactions
        </Link>
      </section>
    )
  }

  if (!transaction.data) {
    return (
      <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#e5eaf0] bg-white px-6 text-center">
        <h2 className="text-base font-semibold text-[#20354d]">
          Transaction not found
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          This transaction ID does not match an available mock transaction.
        </p>
        <Link
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white"
          to="/transactions"
        >
          Back to transactions
        </Link>
      </section>
    )
  }

  const record = transaction.data
  const balance = record.amount - record.paid

  return (
    <div className="mx-auto w-full max-w-[1300px] space-y-4">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-[#718398] hover:text-[#193452]"
        to="/transactions"
      >
        <span aria-hidden="true">←</span> All transactions
      </Link>

      {createdInMock && (
        <p
          className="rounded-lg border border-[#cdebd7] bg-[#effaf2] px-4 py-3 text-xs text-[#267347]"
          role="status"
        >
          Transaction created in mock mode. No data was sent to the backend.
        </p>
      )}

      <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf3f7] text-[#345b7a]">
              <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                <path d="M5 4h14v16H5zM8 8h8M8 12h8m-8 4h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8594a4]">
                Transaction reference
              </p>
              <h2 className="mt-1 break-all text-lg font-bold tracking-tight text-[#193452] sm:text-xl">
                {record.reference}
              </h2>
              <p className="mt-1 text-xs text-[#718398]">
                Invoice {record.invoiceReference}
              </p>
            </div>
          </div>
          <TransactionStatusBadge status={record.status} />
        </div>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
        <div className="space-y-4">
          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#20354d]">Transaction details</h3>
            <dl className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] text-[#8594a4]">Transaction amount</dt>
                <dd className="mt-1 text-base font-semibold text-[#20354d]">{formatNaira(record.amount)}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#8594a4]">Outstanding balance</dt>
                <dd className="mt-1 text-base font-semibold text-[#20354d]">{formatNaira(balance)}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#8594a4]">Amount paid</dt>
                <dd className="mt-1 text-xs font-medium text-[#34485f]">{formatNaira(record.paid)}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#8594a4]">Transaction date</dt>
                <dd className="mt-1 text-xs font-medium text-[#34485f]">{formatTransactionDate(record.transactionDate)}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#8594a4]">Due date</dt>
                <dd className="mt-1 text-xs font-medium text-[#34485f]">{formatTransactionDate(record.dueDate)}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#8594a4]">Repayment schedule</dt>
                <dd className="mt-1 text-xs font-medium text-[#34485f]">{record.repaymentFrequency}</dd>
              </div>
            </dl>
            {record.terms && (
              <div className="mt-5 border-t border-[#edf0f3] pt-4">
                <h4 className="text-[10px] font-semibold uppercase tracking-wide text-[#8594a4]">
                  Transaction terms
                </h4>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#52657a]">
                  {record.terms}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#20354d]">Activity timeline</h3>
            {record.timeline.length > 0 ? (
              <ol className="mt-5 space-y-5">
                {[...record.timeline]
                  .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
                  .map((event, index) => (
                    <li className="relative flex gap-3" key={event.id}>
                      {index < record.timeline.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[7px] top-5 h-[calc(100%+1rem)] w-px bg-[#e5eaf0]"
                        />
                      )}
                      <span className="z-10 mt-1 size-4 shrink-0 rounded-full border-[4px] border-[#d9efe1] bg-[#31a663]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                          <h4 className="text-xs font-semibold text-[#34485f]">{event.title}</h4>
                          <time className="text-[10px] text-[#8594a4]" dateTime={event.occurredAt}>
                            {new Intl.DateTimeFormat('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }).format(new Date(event.occurredAt))}
                          </time>
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-[#718398]">{event.description}</p>
                        {event.channel && (
                          <span className="mt-1 inline-block text-[9px] font-medium text-[#8594a4]">
                            {event.channel}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="mt-4 text-xs text-[#8594a4]">No activity recorded.</p>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#20354d]">Debtor details</h3>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e9eff4] text-xs font-semibold text-[#345b7a]">
                {record.debtor.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join('')
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#263e58]">{record.debtor.name}</p>
                <p className="mt-1 truncate text-[10px] text-[#8594a4]">{record.debtor.contactName}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-3 border-t border-[#edf0f3] pt-4">
              <div>
                <dt className="text-[10px] text-[#8594a4]">Phone number</dt>
                <dd className="mt-1 break-all text-xs text-[#52657a]">{record.debtor.phone}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-[#8594a4]">Email address</dt>
                <dd className="mt-1 break-all text-xs text-[#52657a]">{record.debtor.email}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#20354d]">Reminders</h3>
            {record.reminderSchedule.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {record.reminderSchedule.map((reminder) => (
                  <li className="flex items-center gap-2 text-[11px] text-[#52657a]" key={reminder}>
                    <span className="size-1.5 rounded-full bg-[#35a66b]" />
                    {reminder}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-[#8594a4]">No reminder schedule selected.</p>
            )}
            <p className="mt-3 border-t border-[#edf0f3] pt-3 text-[10px] leading-4 text-[#8594a4]">
              Mock schedule only. No reminders are sent.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
