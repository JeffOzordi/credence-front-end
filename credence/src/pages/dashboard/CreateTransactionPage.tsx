import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateTransaction } from '../../features/transactions/hooks/useCreateTransaction.ts'
import { useDebtors } from '../../features/transactions/hooks/useDebtors.ts'
import { useCreateDebtor } from '../../features/debtors/hooks/useCreateDebtor.ts'
import { formatNaira, formatTransactionDate } from '../../features/transactions/formatters.ts'
import type {
  NewCreditTransaction,
  ReminderTiming,
  RepaymentFrequency,
} from '../../features/transactions/types.ts'

const steps = [
  'Debtor details',
  'Credit details',
  'Capacity check',
  'Reminders',
  'Review',
]

const reminderOptions: ReminderTiming[] = [
  '3 days before',
  'On due date',
  '3 days after',
  '7 days after',
  'Weekly after',
]

const fieldClass =
  'mt-1.5 h-10 w-full rounded-lg border border-[#e1e7ed] bg-white px-3 text-xs text-[#263e58] outline-none placeholder:text-[#9aa8b6] focus:border-[#65b883] focus:ring-4 focus:ring-[#65b883]/10'
const labelClass = 'text-[11px] font-semibold text-[#52657a]'

function todayAsDateInput() {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

export function CreateTransactionPage() {
  const navigate = useNavigate()
  const debtors = useDebtors()
  const createTransaction = useCreateTransaction()
  const createDebtor = useCreateDebtor()
  const [step, setStep] = useState(0)
  const [debtorId, setDebtorId] = useState('')
  const [debtorName, setDebtorName] = useState('')
  const [showNewDebtor, setShowNewDebtor] = useState(false)
  const [newDebtorContact, setNewDebtorContact] = useState('')
  const [newDebtorEmail, setNewDebtorEmail] = useState('')
  const [newDebtorPhone, setNewDebtorPhone] = useState('')
  const [newDebtorBvn, setNewDebtorBvn] = useState('')
  const [invoiceReference, setInvoiceReference] = useState('')
  const [amount, setAmount] = useState('')
  const [transactionDate, setTransactionDate] = useState(todayAsDateInput)
  const [dueDate, setDueDate] = useState('')
  const [repaymentFrequency, setRepaymentFrequency] =
    useState<RepaymentFrequency>('One-time')
  const [terms, setTerms] = useState('')
  const [reminderSchedule, setReminderSchedule] =
    useState<ReminderTiming[]>(reminderOptions)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedDebtor = debtors.data?.find((debtor) => debtor.id === debtorId)
  const parsedAmount = Number(amount)

  function validateCurrentStep() {
    const nextErrors: Record<string, string> = {}

    if (step === 0) {
      if (!debtorId && !debtorName.trim()) {
        nextErrors.debtorId = 'Enter or select a debtor.'
      }
      if (!debtorId && debtorName.trim() && showNewDebtor) {
        if (!newDebtorContact.trim()) nextErrors.newDebtorContact = 'Enter a contact name.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newDebtorEmail.trim())) nextErrors.newDebtorEmail = 'Enter a valid email address.'
        if (!newDebtorPhone.trim()) nextErrors.newDebtorPhone = 'Enter a phone number.'
        if (!/^\d{11}$/.test(newDebtorBvn)) nextErrors.newDebtorBvn = 'BVN must contain exactly 11 numeric digits.'
      }
      if (!invoiceReference.trim()) {
        nextErrors.invoiceReference = 'Enter an invoice reference.'
      }
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        nextErrors.amount = 'Enter an amount greater than zero.'
      }
      if (!transactionDate) {
        nextErrors.transactionDate = 'Select the transaction date.'
      }
    }

    if (step === 1) {
      if (!dueDate) {
        nextErrors.dueDate = 'Select a repayment due date.'
      } else if (transactionDate && dueDate < transactionDate) {
        nextErrors.dueDate = 'The due date cannot be before the transaction date.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function continueToNextStep() {
    if (validateCurrentStep()) {
      setStep((current) => Math.min(current + 1, steps.length - 1))
    }
  }

  function toggleReminder(option: ReminderTiming) {
    setReminderSchedule((current) =>
      current.includes(option)
        ? current.filter((selected) => selected !== option)
        : [...current, option],
    )
  }

  function submitTransaction() {
    if (!debtorId && debtorName.trim()) {
      createDebtor.mutate({
        name: debtorName.trim(),
        type: 'Business',
        contactName: newDebtorContact.trim(),
        email: newDebtorEmail.trim(),
        phone: newDebtorPhone.trim(),
        address: 'Address to be updated',
        bvn: newDebtorBvn,
      }, {
        onSuccess: (debtor) => {
          submitForDebtor(debtor.id)
        },
      })
      return
    }
    submitForDebtor(debtorId)
  }

  function submitForDebtor(resolvedDebtorId: string) {
    const input: NewCreditTransaction = {
      debtorId: resolvedDebtorId,
      invoiceReference: invoiceReference.trim(),
      amount: parsedAmount,
      transactionDate,
      dueDate,
      repaymentFrequency,
      terms: terms.trim(),
      reminderSchedule,
    }

    createTransaction.mutate(input, {
      onSuccess: (transaction) => {
        navigate(`/transactions/${transaction.id}`, {
          state: { createdInMock: true },
        })
      },
    })
  }

  if (debtors.isPending) {
    return (
      <div aria-label="Loading debtor records" className="h-72 animate-pulse rounded-2xl bg-white" role="status">
        <span className="sr-only">Loading debtor records…</span>
      </div>
    )
  }

  if (debtors.isError) {
    return (
      <section className="rounded-2xl border border-[#f0d1cf] bg-white p-6">
        <h2 className="text-sm font-semibold text-[#20354d]">Could not load debtors</h2>
        <p className="mt-2 text-xs text-[#74869a]">{debtors.error.message}</p>
        <button
          className="mt-4 rounded-lg bg-[#193452] px-4 py-2 text-xs font-semibold text-white"
          onClick={() => void debtors.refetch()}
          type="button"
        >
          Try again
        </button>
      </section>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1050px]">
      <Link
        className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-[#718398] hover:text-[#193452]"
        to="/transactions"
      >
        <span aria-hidden="true">←</span> Back to transactions
      </Link>

      <section className="overflow-hidden rounded-2xl border border-[#e5eaf0] bg-white">
        <div className="border-b border-[#edf0f3] px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#35a66b]">
                New credit transaction
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#193452]">
                Create a transaction
              </h2>
              <p className="mt-1 text-xs text-[#8090a1]">
                Record credit terms and repayment reminders for a debtor.
              </p>
            </div>
            <span className="rounded-full bg-[#f2f6f9] px-3 py-1.5 text-[10px] font-medium text-[#738397]">
              Step {step + 1} of {steps.length}
            </span>
          </div>

          <ol className="mt-6 grid grid-cols-5 gap-2" aria-label="Creation steps">
            {steps.map((stepName, index) => (
              <li className="min-w-0" key={stepName}>
                <div
                  className={`h-1 rounded-full ${
                    index <= step ? 'bg-[#2eaa68]' : 'bg-[#e9edf1]'
                  }`}
                />
                <p
                  className={`mt-2 truncate text-[9px] sm:text-[10px] ${
                    index === step
                      ? 'font-semibold text-[#193452]'
                      : 'text-[#8997a7]'
                  }`}
                >
                  {stepName}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="px-5 py-6 sm:px-7">
          {step === 0 && (
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold text-[#20354d]">
                Choose a debtor and invoice
              </h3>
              <p className="mt-1 text-[11px] text-[#8090a1]">
                Select a mock debtor record and enter the credit amount.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="transaction-debtor">Debtor name</label>
                  <input
                    aria-autocomplete="list"
                    className={fieldClass}
                    id="transaction-debtor"
                    list="transaction-debtor-suggestions"
                    onChange={(event) => {
                      const value = event.target.value
                      setDebtorName(value)
                      const exactMatch = debtors.data.find(
                        (debtor) => debtor.name.toLowerCase() === value.trim().toLowerCase(),
                      )
                      setDebtorId(exactMatch?.id ?? '')
                      setShowNewDebtor(Boolean(value.trim()) && !exactMatch)
                    }}
                    placeholder="Search or enter a debtor name"
                    value={debtorName}
                  />
                  <datalist id="transaction-debtor-suggestions">
                    {debtors.data.map((debtor) => (
                      <option key={debtor.id} value={debtor.name} />
                    ))}
                  </datalist>
                  {errors.debtorId && <p className="mt-1 text-[10px] text-[#c44742]">{errors.debtorId}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="transaction-invoice">Invoice reference</label>
                  <input
                    className={fieldClass}
                    id="transaction-invoice"
                    onChange={(event) => setInvoiceReference(event.target.value)}
                    placeholder="e.g. INV-2401"
                    value={invoiceReference}
                  />
                  {errors.invoiceReference && <p className="mt-1 text-[10px] text-[#c44742]">{errors.invoiceReference}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="transaction-amount">Transaction amount (NGN)</label>
                  <input
                    className={fieldClass}
                    id="transaction-amount"
                    min="0.01"
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={amount}
                  />
                  {errors.amount && <p className="mt-1 text-[10px] text-[#c44742]">{errors.amount}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="transaction-date">Transaction date</label>
                  <input
                    className={fieldClass}
                    id="transaction-date"
                    onChange={(event) => setTransactionDate(event.target.value)}
                    type="date"
                    value={transactionDate}
                  />
                  {errors.transactionDate && <p className="mt-1 text-[10px] text-[#c44742]">{errors.transactionDate}</p>}
                </div>
              </div>
              {showNewDebtor && (
                <div className="mt-5 rounded-xl border border-[#e5eaf0] bg-[#f8fafc] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#20354d]">Create this debtor</p>
                      <p className="mt-1 text-[10px] text-[#8090a1]">This debtor will be added to the transaction and debtor directory.</p>
                    </div>
                    <button className="text-[10px] font-semibold text-[#718398]" onClick={() => setShowNewDebtor(false)} type="button">Cancel</button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="new-debtor-contact">Contact name</label>
                      <input className={fieldClass} id="new-debtor-contact" onChange={(event) => setNewDebtorContact(event.target.value)} value={newDebtorContact} />
                      {errors.newDebtorContact && <p className="mt-1 text-[10px] text-[#c44742]">{errors.newDebtorContact}</p>}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="new-debtor-email">Email address</label>
                      <input className={fieldClass} id="new-debtor-email" onChange={(event) => setNewDebtorEmail(event.target.value)} type="email" value={newDebtorEmail} />
                      {errors.newDebtorEmail && <p className="mt-1 text-[10px] text-[#c44742]">{errors.newDebtorEmail}</p>}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="new-debtor-phone">Phone number</label>
                      <input className={fieldClass} id="new-debtor-phone" onChange={(event) => setNewDebtorPhone(event.target.value)} type="tel" value={newDebtorPhone} />
                      {errors.newDebtorPhone && <p className="mt-1 text-[10px] text-[#c44742]">{errors.newDebtorPhone}</p>}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="new-debtor-bvn">BVN <span className="font-normal text-[#8594a4]">(11 digits)</span></label>
                      <input className={fieldClass} id="new-debtor-bvn" inputMode="numeric" maxLength={11} onChange={(event) => setNewDebtorBvn(event.target.value.replace(/\D/g, '').slice(0, 11))} type="password" value={newDebtorBvn} />
                      {errors.newDebtorBvn && <p className="mt-1 text-[10px] text-[#c44742]">{errors.newDebtorBvn}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold text-[#20354d]">Set repayment terms</h3>
              <p className="mt-1 text-[11px] text-[#8090a1]">
                Add an agreed due date, schedule and optional terms.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="transaction-due-date">Repayment due date</label>
                  <input
                    className={fieldClass}
                    id="transaction-due-date"
                    min={transactionDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    type="date"
                    value={dueDate}
                  />
                  {errors.dueDate && <p className="mt-1 text-[10px] text-[#c44742]">{errors.dueDate}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="repayment-frequency">Repayment schedule</label>
                  <select
                    className={fieldClass}
                    id="repayment-frequency"
                    onChange={(event) => setRepaymentFrequency(event.target.value as RepaymentFrequency)}
                    value={repaymentFrequency}
                  >
                    <option>One-time</option>
                    <option>Weekly</option>
                    <option>Biweekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="transaction-terms">Transaction terms (optional)</label>
                  <textarea
                    className="mt-1.5 min-h-24 w-full resize-y rounded-lg border border-[#e1e7ed] bg-white px-3 py-2.5 text-xs text-[#263e58] outline-none placeholder:text-[#9aa8b6] focus:border-[#65b883] focus:ring-4 focus:ring-[#65b883]/10"
                    id="transaction-terms"
                    onChange={(event) => setTerms(event.target.value)}
                    placeholder="Add any agreed repayment terms"
                    value={terms}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold text-[#20354d]">Capacity check</h3>
              <div className="mt-4 rounded-xl border border-[#e7ebf0] bg-[#f8fafc] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8eef4] text-[#193452]">
                    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
                      <path d="M12 8v4m0 4h.01M10.3 3.8 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                    </svg>
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#263e58]">
                      Capacity validation is not available
                    </h4>
                    <p className="mt-1 max-w-2xl text-[11px] leading-5 text-[#718398]">
                      There is no confirmed backend credit-limit or capacity service. This step does not assess eligibility or approve credit; review the agreed amount with your own process.
                    </p>
                  </div>
                </div>
              </div>
              {selectedDebtor && (
                <div className="mt-4 rounded-xl border border-[#e7ebf0] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8594a4]">
                    Transaction draft
                  </p>
                  <div className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
                    <span><span className="block text-[#8594a4]">Debtor</span><strong className="mt-1 block text-[#34485f]">{selectedDebtor.name}</strong></span>
                    <span><span className="block text-[#8594a4]">Amount</span><strong className="mt-1 block text-[#34485f]">{formatNaira(parsedAmount)}</strong></span>
                    <span><span className="block text-[#8594a4]">Invoice</span><strong className="mt-1 block text-[#34485f]">{invoiceReference}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold text-[#20354d]">Reminder schedule</h3>
              <p className="mt-1 text-[11px] text-[#8090a1]">
                Choose the reminder timings to record with this mock transaction.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {reminderOptions.map((option) => (
                  <label
                    className="flex min-h-11 items-center gap-3 rounded-lg border border-[#e5eaf0] px-3 text-xs text-[#52657a]"
                    key={option}
                  >
                    <input
                      checked={reminderSchedule.includes(option)}
                      className="size-4 accent-[#21965a]"
                      onChange={() => toggleReminder(option)}
                      type="checkbox"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-[#8594a4]">
                Reminders are saved in mock data only. No emails or messages will be sent.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-3xl">
              <h3 className="text-sm font-semibold text-[#20354d]">Review transaction</h3>
              <p className="mt-1 text-[11px] text-[#8090a1]">
                Confirm the details before adding this transaction to the mock records.
              </p>
              <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-[#e5eaf0] bg-[#e5eaf0] sm:grid-cols-2">
                {[
                  ['Debtor', selectedDebtor?.name ?? '—'],
                  ['Invoice reference', invoiceReference || '—'],
                  ['Amount', formatNaira(parsedAmount)],
                  ['Transaction date', transactionDate ? formatTransactionDate(transactionDate) : '—'],
                  ['Due date', dueDate ? formatTransactionDate(dueDate) : '—'],
                  ['Repayment schedule', repaymentFrequency],
                  ['Terms', terms.trim() || 'No additional terms'],
                  ['Reminders', reminderSchedule.length ? reminderSchedule.join(', ') : 'None selected'],
                ].map(([label, value]) => (
                  <div className="bg-white px-4 py-3" key={label}>
                    <dt className="text-[10px] text-[#8594a4]">{label}</dt>
                    <dd className="mt-1 break-words text-xs font-medium text-[#34485f]">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-lg bg-[#fff8e9] px-3 py-2.5 text-[10px] leading-4 text-[#866b35]">
                This action creates a local mock record only. It will not be sent to the Credence backend.
              </p>
              {createTransaction.isError && (
                <p className="mt-3 text-xs text-[#c44742]" role="alert">
                  {createTransaction.error.message}
                </p>
              )}
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0f3] px-5 py-4 sm:px-7">
          <button
            className="h-10 rounded-lg border border-[#dfe5eb] px-4 text-xs font-medium text-[#52657a] transition hover:bg-[#f8fafc] disabled:opacity-50"
            disabled={step === 0 || createTransaction.isPending}
            onClick={() => {
              setErrors({})
              setStep((current) => Math.max(current - 1, 0))
            }}
            type="button"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              className="h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white transition hover:bg-[#122943]"
              onClick={continueToNextStep}
              type="button"
            >
              Continue
            </button>
          ) : (
            <button
              className="h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white transition hover:bg-[#122943] disabled:cursor-wait disabled:opacity-60"
              disabled={createTransaction.isPending}
              onClick={submitTransaction}
              type="button"
            >
              {createTransaction.isPending ? 'Creating mock transaction…' : 'Create transaction'}
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}
