import { useMemo, useState } from 'react'
import { Link, useLocation, useOutletContext } from 'react-router-dom'
import type { DashboardOutletContext } from '../../layouts/DashboardLayout.tsx'
import { useReminders, useCancelReminder, useCreateReminder, useTriggerReminder } from '../../features/reminders/hooks/useReminders.ts'
import { useTransactions } from '../../features/transactions/hooks/useTransactions.ts'
import { formatNaira } from '../../features/transactions/formatters.ts'
import type { Reminder, ReminderChannel, ReminderType } from '../../features/reminders/types.ts'

const statusClass: Record<Reminder['status'], string> = {
  Sent: 'bg-[#eaf7ee] text-[#2f7c4b]',
  Scheduled: 'bg-[#edf3f7] text-[#4d6d89]',
  Failed: 'bg-[#fdebea] text-[#b64b50]',
  Cancelled: 'bg-[#f1f3f5] text-[#718398]',
}

export function RemindersPage() {
  const { search } = useOutletContext<DashboardOutletContext>()
  const location = useLocation()
  const reminders = useReminders()
  const transactions = useTransactions()
  const createReminder = useCreateReminder()
  const cancelReminder = useCancelReminder()
  const triggerReminder = useTriggerReminder()
  const [status, setStatus] = useState('All statuses')
  const [channel, setChannel] = useState('All channels')
  const [detail, setDetail] = useState<Reminder | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createTransactionId, setCreateTransactionId] = useState('')
  const [createChannel, setCreateChannel] = useState<ReminderChannel>('Email')
  const [createType, setCreateType] = useState<ReminderType>('Upcoming')
  const [createDate, setCreateDate] = useState('')
  const [message, setMessage] = useState('')
  const settingsView = location.pathname.endsWith('/settings')

  const filtered = useMemo(() => (reminders.data ?? []).filter((reminder) => {
    const query = `${reminder.debtorName} ${reminder.transactionReference} ${reminder.type}`.toLowerCase()
    return query.includes(search.trim().toLowerCase()) &&
      (status === 'All statuses' || reminder.status === status) &&
      (channel === 'All channels' || reminder.channel === channel)
  }), [reminders.data, search, status, channel])

  if (reminders.isPending) {
    return <div className="h-96 animate-pulse rounded-xl bg-white" role="status" aria-label="Loading reminders" />
  }

  if (reminders.isError) {
    return <p className="rounded-xl bg-white p-6 text-sm text-[#9a4d4d]">{reminders.error.message}</p>
  }

  const sent = filtered.filter((item) => item.status === 'Sent').length
  const scheduled = filtered.filter((item) => item.status === 'Scheduled').length
  const failed = filtered.filter((item) => item.status === 'Failed').length
  const responded = filtered.filter((item) => item.response === 'Responded').length

  function openCreate() {
    setCreateOpen(true)
    setCreateTransactionId(transactions.data?.[0]?.id ?? '')
  }

  function submitCreate() {
    const transaction = transactions.data?.find((item) => item.id === createTransactionId)
    if (!transaction || !createDate) return
    createReminder.mutate({
      transactionId: transaction.id,
      debtorId: transaction.debtor.id,
      debtorName: transaction.debtor.name,
      transactionReference: transaction.reference,
      amount: transaction.amount - transaction.paid,
      type: createType,
      scheduledAt: `${createDate}T09:00:00`,
      channel: createChannel,
    }, {
      onSuccess: () => {
        setCreateOpen(false)
        setMessage('Reminder scheduled in this mock session.')
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4">
      {message && (
        <div className="flex items-center justify-between rounded-lg border border-[#cfe9d8] bg-[#edf8f1] px-4 py-3 text-xs text-[#34744d]" role="status">
          {message}<button aria-label="Dismiss" onClick={() => setMessage('')} type="button">×</button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-[#dfe5ea] bg-white p-1">
          <Link className={`rounded-md px-3 py-2 text-xs font-semibold ${!settingsView ? 'bg-[#193452] text-white' : 'text-[#61758a]'}`} to="/reminders">Reminders</Link>
          <Link className={`rounded-md px-3 py-2 text-xs font-semibold ${settingsView ? 'bg-[#193452] text-white' : 'text-[#61758a]'}`} to="/reminders/settings">Reminder settings</Link>
        </div>
        {!settingsView && (
          <button className="h-9 rounded-lg bg-[#193452] px-4 text-xs font-semibold text-white" onClick={openCreate} type="button">Send or schedule reminder</button>
        )}
      </div>

      {settingsView ? <ReminderSettings /> : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Sent', sent, 'M1 12h8V4m8 16V4'],
              ['Scheduled', scheduled, 'M5 3v18M19 3v18M3 8h18'],
              ['Failed', failed, 'M12 8v4m0 4h.01M10.3 3.8 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z'],
              ['Responded', responded, 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M8 13l3 3 5-6'],
            ].map(([label, value, icon]) => (
              <article className="rounded-xl border border-[#e5eaf0] bg-white p-4" key={String(label)}>
                <div className="flex items-start justify-between">
                  <div><p className="text-[11px] text-[#8291a2]">{label}</p><p className="mt-2 text-xl font-bold text-[#20354d]">{value}</p></div>
                  <svg aria-hidden="true" className="size-5 text-[#8098aa]" fill="none" viewBox="0 0 24 24"><path d={String(icon)} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>
                </div>
              </article>
            ))}
          </div>

          <section className="overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
            <div className="flex flex-wrap gap-2 border-b border-[#edf0f3] p-3">
              <select className="h-9 rounded-lg border border-[#dfe5ea] px-3 text-xs text-[#52657a]" onChange={(event) => setStatus(event.target.value)} value={status}>
                <option>All statuses</option><option>Sent</option><option>Scheduled</option><option>Failed</option><option>Cancelled</option>
              </select>
              <select className="h-9 rounded-lg border border-[#dfe5ea] px-3 text-xs text-[#52657a]" onChange={(event) => setChannel(event.target.value)} value={channel}>
                <option>All channels</option><option>Email</option><option>WhatsApp</option>
              </select>
              <p className="ml-auto self-center text-[10px] text-[#8594a4]">{filtered.length} result{filtered.length === 1 ? '' : 's'}</p>
            </div>

            <div className="hidden grid-cols-[1.3fr_.8fr_.75fr_.9fr_.75fr_.75fr_72px] gap-3 border-b border-[#edf0f3] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.06em] text-[#8a99a8] md:grid">
              <span>Debtor</span><span>Reference</span><span>Amount</span><span>Type</span><span>Channel</span><span>Status</span><span />
            </div>
            {filtered.length === 0 ? (
              <div className="flex min-h-56 items-center justify-center text-xs text-[#718398]">No reminders match these filters.</div>
            ) : filtered.map((reminder) => (
              <div className="grid gap-2 border-b border-[#edf0f3] px-5 py-4 last:border-b-0 md:grid-cols-[1.3fr_.8fr_.75fr_.9fr_.75fr_.75fr_72px] md:items-center" key={reminder.id}>
                <p className="text-xs font-semibold text-[#34495d]">{reminder.debtorName}</p>
                <p className="text-xs text-[#61758a]">{reminder.transactionReference}</p>
                <p className="text-xs text-[#61758a]">{formatNaira(reminder.amount)}</p>
                <p className="text-xs text-[#61758a]">{reminder.type}</p>
                <p className="text-xs text-[#61758a]">{reminder.channel}</p>
                <span className={`w-fit rounded-full px-2 py-1 text-[10px] font-bold ${statusClass[reminder.status]}`}>{reminder.status}</span>
                <button className="h-8 rounded-lg border border-[#dfe5ea] text-[11px] font-semibold text-[#52657a]" onClick={() => setDetail(reminder)} type="button">Manage</button>
              </div>
            ))}
          </section>

          <p className="rounded-lg bg-[#eef3f7] px-4 py-3 text-[10px] text-[#61758a]">Sent status represents simulated mock activity only. It does not confirm real email or provider delivery.</p>
        </>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#10243a]/35" role="dialog" aria-modal="true" aria-label="Reminder details">
          <section className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#35a66b]">Reminder details</p><h2 className="mt-1 text-lg font-semibold text-[#20354d]">{detail.debtorName}</h2></div>
              <button aria-label="Close reminder details" className="size-8 rounded-lg text-[#718398] hover:bg-[#f1f4f7]" onClick={() => setDetail(null)} type="button">×</button>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-[#e5eaf0] p-4 text-xs">
              <div><dt className="text-[#8493a3]">Transaction</dt><dd className="mt-1 font-semibold">{detail.transactionReference}</dd></div>
              <div><dt className="text-[#8493a3]">Amount</dt><dd className="mt-1 font-semibold">{formatNaira(detail.amount)}</dd></div>
              <div><dt className="text-[#8493a3]">Channel</dt><dd className="mt-1 font-semibold">{detail.channel}</dd></div>
              <div><dt className="text-[#8493a3]">Status</dt><dd className="mt-1 font-semibold">{detail.status}</dd></div>
              <div className="col-span-2"><dt className="text-[#8493a3]">Scheduled</dt><dd className="mt-1 font-semibold">{new Date(detail.scheduledAt).toLocaleString()}</dd></div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {detail.status !== 'Sent' && detail.status !== 'Cancelled' && (
                <button className="h-9 rounded-lg bg-[#193452] px-4 text-xs font-semibold text-white" disabled={triggerReminder.isPending} onClick={() => triggerReminder.mutate(detail.id, { onSuccess: () => setDetail(null) })} type="button">Send now (mock)</button>
              )}
              {detail.status === 'Scheduled' && (
                <button className="h-9 rounded-lg border border-[#dfe5ea] px-4 text-xs font-semibold text-[#52657a]" disabled={cancelReminder.isPending} onClick={() => cancelReminder.mutate(detail.id, { onSuccess: () => setDetail(null) })} type="button">Cancel reminder</button>
              )}
            </div>
          </section>
        </div>
      )}

      {createOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#10243a]/35 p-4" role="dialog" aria-modal="true" aria-label="Schedule reminder">
          <section className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-semibold text-[#20354d]">Send or schedule reminder</h2>
            <p className="mt-1 text-[11px] text-[#8090a1]">This action only updates mock reminder activity.</p>
            <div className="mt-4 grid gap-3">
              <label className="text-[11px] font-semibold text-[#52657a]" htmlFor="reminder-transaction">Transaction
                <select className="mt-1 h-10 w-full rounded-lg border border-[#dfe5ea] px-3 text-xs" id="reminder-transaction" onChange={(event) => setCreateTransactionId(event.target.value)} value={createTransactionId}>
                  {(transactions.data ?? []).map((transaction) => <option key={transaction.id} value={transaction.id}>{transaction.reference} — {transaction.debtor.name}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-[11px] font-semibold text-[#52657a]" htmlFor="reminder-channel">Channel
                  <select className="mt-1 h-10 w-full rounded-lg border border-[#dfe5ea] px-3 text-xs" id="reminder-channel" onChange={(event) => setCreateChannel(event.target.value as ReminderChannel)} value={createChannel}><option>Email</option><option>WhatsApp</option></select>
                </label>
                <label className="text-[11px] font-semibold text-[#52657a]" htmlFor="reminder-type">Type
                  <select className="mt-1 h-10 w-full rounded-lg border border-[#dfe5ea] px-3 text-xs" id="reminder-type" onChange={(event) => setCreateType(event.target.value as ReminderType)} value={createType}><option>Upcoming</option><option>Due today</option><option>Overdue</option><option>After due date</option></select>
                </label>
              </div>
              <label className="text-[11px] font-semibold text-[#52657a]" htmlFor="reminder-date">Schedule date
                <input className="mt-1 h-10 w-full rounded-lg border border-[#dfe5ea] px-3 text-xs" id="reminder-date" onChange={(event) => setCreateDate(event.target.value)} type="date" value={createDate} />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button className="h-9 rounded-lg border border-[#dfe5ea] px-4 text-xs font-semibold text-[#52657a]" onClick={() => setCreateOpen(false)} type="button">Cancel</button>
              <button className="h-9 rounded-lg bg-[#193452] px-4 text-xs font-semibold text-white disabled:opacity-60" disabled={!createDate || createReminder.isPending} onClick={submitCreate} type="button">{createReminder.isPending ? 'Scheduling…' : 'Schedule mock reminder'}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function ReminderSettings() {
  const [saved, setSaved] = useState(false)
  const [schedule, setSchedule] = useState([
    ['Before due date', '3 days before • Email + WhatsApp', true],
    ['On due date', 'Due date, 9:00am • Email + WhatsApp', true],
    ['After due date', '3 days after • WhatsApp first', true],
    ['After due date', '7 days after • Email + WhatsApp', true],
    ['Ongoing', 'Every 7 days until settled • Escalating tone', true],
  ])

  function toggle(index: number) {
    setSchedule((current) => current.map((item, itemIndex) => itemIndex === index ? [item[0], item[1], !item[2]] : item))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="rounded-xl border border-[#e5eaf0] bg-white p-5">
        <h2 className="text-sm font-semibold text-[#20354d]">Default Reminder Settings</h2>
        <p className="mt-1 text-[11px] text-[#8090a1]">Applies to new transactions using the default schedule.</p>
        <div className="mt-5 divide-y divide-[#edf0f3] border-y border-[#edf0f3]">
          {schedule.map(([label, description, enabled], index) => (
            <div className="flex items-center justify-between gap-4 py-4" key={`${label}-${description}`}>
              <div><p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#8a99a8]">{label}</p><p className="mt-1 text-xs text-[#52657a]">{description}</p></div>
              <button aria-label={`Toggle ${description}`} aria-pressed={Boolean(enabled)} className={`relative h-6 w-11 rounded-full transition ${enabled ? 'bg-[#42b876]' : 'bg-[#ccd5dd]'}`} onClick={() => toggle(index)} type="button"><span className={`absolute top-1 size-4 rounded-full bg-white transition ${enabled ? 'left-6' : 'left-1'}`} /></button>
            </div>
          ))}
        </div>
        <button className="mt-5 h-9 rounded-lg bg-[#193452] px-4 text-xs font-semibold text-white" onClick={() => setSaved(true)} type="button">Save default schedule</button>
        {saved && <p className="mt-3 text-[11px] text-[#367751]" role="status">Default reminder schedule saved for this mock session.</p>}
      </section>
      <aside className="space-y-4">
        <section className="rounded-xl border border-[#e5eaf0] bg-white p-5">
          <h3 className="text-xs font-semibold text-[#34495d]">Channels</h3>
          <div className="mt-3 space-y-2 text-xs"><p className="flex justify-between"><span>Email</span><span className="text-[#2f7c4b]">Connected ✓</span></p><p className="flex justify-between"><span>WhatsApp</span><span className="text-[#2f7c4b]">Connected ✓</span></p></div>
        </section>
        <section className="rounded-xl border border-[#e5eaf0] bg-white p-5">
          <h3 className="text-xs font-semibold text-[#34495d]">Confirmation preview</h3>
          <p className="mt-3 text-[11px] leading-5 text-[#718398]">“Your transaction was created. Debtor gets reminders: 3 days before • on due date • 3 days after • every 7 days until settled.”</p>
        </section>
      </aside>
    </div>
  )
}
