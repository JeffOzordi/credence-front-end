import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DebtorCreditStatusBadge } from '../../features/debtors/components/DebtorCreditStatusBadge.tsx'
import { DebtorStatusBadge } from '../../features/debtors/components/DebtorStatusBadge.tsx'
import { useAddDebtorNote } from '../../features/debtors/hooks/useAddDebtorNote.ts'
import { useDebtor } from '../../features/debtors/hooks/useDebtor.ts'
import { getDebtorSummary } from '../../features/debtors/services/debtorService.ts'
import { formatNaira, formatTransactionDate } from '../../features/transactions/formatters.ts'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function SummaryMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: string
}) {
  return (
    <article className="rounded-xl border border-[#e5eaf0] bg-white p-3.5 sm:p-4">
      <p className="text-[10px] font-medium text-[#8594a4]">{label}</p>
      <p className={`mt-2 text-base font-bold tracking-tight text-[#20354d] sm:text-lg ${tone ?? ''}`}>
        {value}
      </p>
    </article>
  )
}

function BehaviourMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#edf0f3] py-2.5 last:border-0">
      <span className="text-[11px] text-[#718398]">{label}</span>
      <span className="text-xs font-semibold text-[#34485f]">{value}</span>
    </div>
  )
}

export function DebtorDetailsPage() {
  const { debtorId } = useParams()
  const debtorQuery = useDebtor(debtorId)
  const noteMutation = useAddDebtorNote(debtorId ?? '')
  const [noteText, setNoteText] = useState('')
  const noteInput = useRef<HTMLTextAreaElement>(null)

  if (debtorQuery.isPending) {
    return (
      <div aria-label="Loading debtor profile" className="space-y-4" role="status">
        <span className="sr-only">Loading debtor profile…</span>
        <div className="h-28 animate-pulse rounded-xl bg-white" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-xl bg-white lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-xl bg-white" />
        </div>
      </div>
    )
  }

  if (debtorQuery.isError) {
    return (
      <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#f0d1cf] bg-white px-6 text-center">
        <h2 className="text-base font-semibold text-[#20354d]">
          We couldn’t load this debtor
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          {debtorQuery.error.message}
        </p>
        <Link
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white"
          to="/debtors"
        >
          Back to debtors
        </Link>
      </section>
    )
  }

  if (!debtorQuery.data) {
    return (
      <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#e5eaf0] bg-white px-6 text-center">
        <h2 className="text-base font-semibold text-[#20354d]">Debtor not found</h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          This ID does not match a debtor in the current mock directory.
        </p>
        <Link
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white"
          to="/debtors"
        >
          Back to debtors
        </Link>
      </section>
    )
  }

  const debtor = debtorQuery.data
  const summary = getDebtorSummary(debtor)
  const sortedCredits = [...debtor.credits].sort((left, right) =>
    right.issuedAt.localeCompare(left.issuedAt),
  )

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    noteMutation.mutate(noteText, {
      onSuccess: () => setNoteText(''),
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-4">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-[#718398] hover:text-[#193452]"
        to="/debtors"
      >
        <span>Debtors</span>
        <span aria-hidden="true">/</span>
        <span className="max-w-[220px] truncate text-[#34485f]">{debtor.name}</span>
      </Link>

      <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#173253] text-xs font-bold text-white sm:size-14">
              {initials(debtor.name)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-base font-bold tracking-tight text-[#193452] sm:text-lg">
                  {debtor.name}
                </h2>
                <DebtorStatusBadge status={debtor.status} />
              </div>
              <p className="mt-1 break-words text-[11px] leading-5 text-[#718398]">
                {debtor.contactName} <span aria-hidden="true">•</span> {debtor.email}{' '}
                <span aria-hidden="true">•</span> {debtor.phone} <span aria-hidden="true">•</span>{' '}
                {debtor.address}
                {debtor.registrationNumber && (
                  <>
                    {' '}
                    <span aria-hidden="true">•</span> {debtor.registrationNumber}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <button
              className="h-9 flex-1 rounded-lg border border-[#dfe5eb] px-3 text-[11px] font-semibold text-[#52657a] hover:bg-[#f8fafc] sm:flex-none"
              onClick={() => noteInput.current?.focus()}
              type="button"
            >
              Add note
            </button>
            <Link
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-[#193452] px-3 text-[11px] font-semibold text-white hover:bg-[#122943] sm:flex-none"
              to="/transactions/new"
            >
              New credit
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryMetric label="Extended" value={formatNaira(summary.extendedAmount)} />
        <SummaryMetric label="Repaid" value={formatNaira(summary.repaidAmount)} />
        <SummaryMetric label="Outstanding" value={formatNaira(summary.outstandingAmount)} />
        <SummaryMetric
          label="Overdue"
          tone={summary.overdueAmount > 0 ? 'text-[#bd4147]' : ''}
          value={formatNaira(summary.overdueAmount)}
        />
        <SummaryMetric
          label="On-time rate"
          value={debtor.onTimeRate === null ? '—' : `${debtor.onTimeRate}%`}
        />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)]">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-[#edf0f3] px-4 py-4 sm:px-5">
              <div>
                <h3 className="text-sm font-semibold text-[#20354d]">
                  Credit history ({debtor.credits.length})
                </h3>
                <p className="mt-1 text-[10px] text-[#8594a4]">
                  Credit issued and repayment progress
                </p>
              </div>
              <Link
                className="text-[10px] font-semibold text-[#37658d] hover:underline"
                to="/transactions"
              >
                View transactions
              </Link>
            </div>
            {sortedCredits.length ? (
              <>
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full min-w-[690px] text-left">
                    <thead className="bg-[#f8fafc] text-[9px] font-semibold uppercase tracking-wide text-[#8594a4]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Reference</th>
                        <th className="px-3 py-3 font-semibold">Invoice</th>
                        <th className="px-3 py-3 font-semibold">Amount</th>
                        <th className="px-3 py-3 font-semibold">Balance</th>
                        <th className="px-3 py-3 font-semibold">Due date</th>
                        <th className="px-3 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf0f3]">
                      {sortedCredits.map((credit) => (
                        <tr className="text-[10px] text-[#52657a]" key={credit.id}>
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#38668f]">
                            {credit.reference}
                          </td>
                          <td className="px-3 py-3">{credit.invoiceReference}</td>
                          <td className="whitespace-nowrap px-3 py-3">{formatNaira(credit.amount)}</td>
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-[#34485f]">
                            {formatNaira(credit.amount - credit.paid)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">{formatTransactionDate(credit.dueAt)}</td>
                          <td className="px-3 py-3">
                            <DebtorCreditStatusBadge status={credit.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="divide-y divide-[#edf0f3] sm:hidden">
                  {sortedCredits.map((credit) => (
                    <li className="space-y-2.5 p-4" key={credit.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-[#38668f]">{credit.reference}</p>
                          <p className="mt-1 text-[10px] text-[#8594a4]">{credit.invoiceReference}</p>
                        </div>
                        <DebtorCreditStatusBadge status={credit.status} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <span><span className="block text-[#8594a4]">Amount</span><strong className="mt-1 block text-[#34485f]">{formatNaira(credit.amount)}</strong></span>
                        <span><span className="block text-[#8594a4]">Balance</span><strong className="mt-1 block text-[#34485f]">{formatNaira(credit.amount - credit.paid)}</strong></span>
                        <span><span className="block text-[#8594a4]">Due date</span><strong className="mt-1 block text-[#34485f]">{formatTransactionDate(credit.dueAt)}</strong></span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="px-5 py-8 text-center text-xs text-[#8594a4]">
                No credit history has been recorded for this debtor.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#20354d]">
              Communication <span className="font-normal text-[#8594a4]">— reminder → response</span>
            </h3>
            {debtor.communications.length > 0 ? (
              <ol className="mt-4 space-y-3">
                {debtor.communications.map((communication) => (
                  <li
                    className={`rounded-lg border p-3 ${
                      communication.kind === 'Response'
                        ? 'border-[#dceee2] bg-[#f7fcf8] sm:ml-8'
                        : 'border-[#e8edf2] bg-[#f9fafb] sm:mr-8'
                    }`}
                    key={communication.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-[#8594a4]">
                        {communication.kind} <span aria-hidden="true">•</span> {communication.channel}
                      </p>
                      <time className="text-[9px] text-[#8594a4]" dateTime={communication.occurredAt}>
                        {new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: 'numeric',
                          minute: '2-digit',
                        }).format(new Date(communication.occurredAt))}
                      </time>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-[#52657a]">
                      “{communication.message}”
                    </p>
                    {communication.commitment && (
                      <p className="mt-2 text-[10px] font-medium text-[#27804b]">
                        Commitment: {communication.commitment}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-xs text-[#8594a4]">
                No communications have been recorded.
              </p>
            )}

            <form className="mt-4 border-t border-[#edf0f3] pt-4" onSubmit={saveNote}>
              <label className="sr-only" htmlFor="debtor-note">
                Record note or follow-up
              </label>
              <textarea
                className="min-h-20 w-full resize-y rounded-lg border border-[#e1e7ed] px-3 py-2.5 text-xs text-[#263e58] outline-none placeholder:text-[#9aa8b6] focus:border-[#65b883] focus:ring-4 focus:ring-[#65b883]/10"
                id="debtor-note"
                onChange={(event) => {
                  setNoteText(event.target.value)
                  noteMutation.reset()
                }}
                placeholder="Record note or follow-up…"
                ref={noteInput}
                value={noteText}
              />
              {noteMutation.isError && (
                <p className="mt-1 text-[10px] text-[#bd4147]" role="alert">
                  {noteMutation.error.message}
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <button
                  className="h-8 rounded-lg bg-[#193452] px-4 text-[10px] font-semibold text-white disabled:opacity-50"
                  disabled={!noteText.trim() || noteMutation.isPending}
                  type="submit"
                >
                  {noteMutation.isPending ? 'Saving…' : 'Save note'}
                </button>
              </div>
            </form>

            {debtor.notes.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-[#edf0f3] pt-4">
                <h4 className="text-[10px] font-semibold uppercase tracking-wide text-[#8594a4]">
                  Notes and follow-ups
                </h4>
                {debtor.notes.map((note) => (
                  <article className="rounded-lg bg-[#f8fafc] px-3 py-2.5" key={note.id}>
                    <p className="whitespace-pre-wrap text-[11px] leading-5 text-[#52657a]">
                      {note.text}
                    </p>
                    <time className="mt-1 block text-[9px] text-[#8594a4]" dateTime={note.createdAt}>
                      {new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(note.createdAt))}
                    </time>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#20354d]">Repayment behaviour</h3>
            <dl className="mt-3">
              <BehaviourMetric label="On-time payments" value={String(debtor.repaymentBehaviour.onTimePayments)} />
              <BehaviourMetric label="Late payments" value={String(debtor.repaymentBehaviour.latePayments)} />
              <BehaviourMetric label="Avg delay" value={`${debtor.repaymentBehaviour.averageDelayDays} days`} />
              <BehaviourMetric label="Missed commitments" value={String(debtor.repaymentBehaviour.missedCommitments)} />
              <BehaviourMetric label="Partial payments" value={String(debtor.repaymentBehaviour.partialPayments)} />
              <BehaviourMetric label="Disputed" value={String(debtor.repaymentBehaviour.disputed)} />
            </dl>
            <p className="mt-3 rounded-lg bg-[#f6f8fa] px-3 py-2.5 text-[9px] leading-4 text-[#8594a4]">
              Behaviour is based on the mock repayment history; no automated labels are inferred from message tone.
            </p>
          </section>

          <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#20354d]">Reminder history</h3>
            <p className="mt-3 text-xs text-[#52657a]">
              Sent: <strong>{debtor.reminderHistory.sent}</strong>
              <span aria-hidden="true"> · </span>
              Scheduled: <strong>{debtor.reminderHistory.scheduled}</strong>
            </p>
            <p className="mt-2 text-[10px] text-[#8594a4]">
              Next: {debtor.reminderHistory.nextReminder}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#edf0f3] pt-4">
              <div>
                <p className="text-[10px] text-[#8594a4]">Delivered</p>
                <p className="mt-1 text-sm font-semibold text-[#34485f]">
                  {debtor.reminderHistory.deliveredRate}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#8594a4]">Responded</p>
                <p className="mt-1 text-sm font-semibold text-[#34485f]">
                  {debtor.reminderHistory.responded}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[9px] text-[#8594a4]">
              Mock reminder information only. No reminders are sent.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
