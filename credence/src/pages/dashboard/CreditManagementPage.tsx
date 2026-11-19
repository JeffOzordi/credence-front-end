import { useState } from 'react'
import { useCreditManagement } from '../../features/creditManagement/hooks/useCreditManagement.ts'
import { saveDebtorCreditLimit } from '../../features/creditManagement/services/creditService.ts'
import { formatNaira } from '../../features/transactions/formatters.ts'

export function CreditManagementPage() {
  const credit = useCreditManagement()
  const [editingLimit, setEditingLimit] = useState<string | null>(null)
  const [limitValue, setLimitValue] = useState('')
  const [rulesOpen, setRulesOpen] = useState(false)
  const [message, setMessage] = useState('')

  if (credit.isPending) {
    return (
      <div className="space-y-4" role="status">
        <span className="sr-only">Loading credit management…</span>
        <div className="h-36 animate-pulse rounded-xl bg-white" />
        <div className="h-72 animate-pulse rounded-xl bg-white" />
      </div>
    )
  }

  if (credit.isError) {
    return <p className="rounded-xl bg-white p-6 text-sm text-[#9a4d4d]">{credit.error.message}</p>
  }

  const data = credit.data

  function openEditor(debtorName: string, limit: number) {
    setEditingLimit(debtorName)
    setLimitValue(String(limit))
  }

  async function saveLimit() {
    const record = data.limits.find((limit) => limit.debtorName === editingLimit)
    if (!record) return
    try {
      await saveDebtorCreditLimit(record.debtorId, Number(limitValue))
      await credit.refetch()
      setMessage(`${editingLimit} limit updated for this session.`)
      setEditingLimit(null)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save the credit limit.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4">
      {message && (
        <div className="flex items-center justify-between rounded-lg border border-[#cfe9d8] bg-[#edf8f1] px-4 py-3 text-xs text-[#34744d]" role="status">
          {message}
          <button aria-label="Dismiss" onClick={() => setMessage('')} type="button">×</button>
        </div>
      )}

      <section className="grid gap-4 rounded-xl border border-[#e5eaf0] bg-white p-5 shadow-[0_2px_8px_rgba(28,53,79,0.025)] xl:grid-cols-[220px_1fr_auto] xl:items-center">
        <div className="relative grid size-32 place-items-center">
          <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#42bc73 ${data.utilization * 3.6}deg, #edf1f4 0deg)` }} />
          <div className="absolute inset-[12px] rounded-full bg-white" />
          <div className="relative text-center">
            <p className="text-2xl font-bold text-[#20354d]">{data.utilization}%</p>
            <p className="text-[10px] font-medium text-[#8493a3]">utilized</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border-b border-[#edf0f3] pb-3 sm:border-b-0 sm:border-r sm:pr-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a99a8]">Approved limit</p>
            <p className="mt-2 text-xl font-bold text-[#20354d]">{formatNaira(data.approvedLimit)}</p>
            <p className="mt-1 text-[11px] text-[#7e8f9f]">Max exposure you allow</p>
          </div>
          <div className="border-b border-[#edf0f3] pb-3 sm:border-b-0 sm:border-r sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a99a8]">Outstanding</p>
            <p className="mt-2 text-xl font-bold text-[#20354d]">{formatNaira(data.outstanding)}</p>
            <p className="mt-1 text-[11px] text-[#b36a2a]">Approaching limit</p>
          </div>
          <div className="sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a99a8]">Available</p>
            <p className="mt-2 text-xl font-bold text-[#20354d]">{formatNaira(data.available)}</p>
            <p className="mt-1 text-[11px] text-[#4d8062]">Safe to extend</p>
          </div>
        </div>

        <div className="flex gap-2 xl:flex-col">
          <button className="h-9 rounded-lg border border-[#dfe5ea] px-3 text-xs font-semibold text-[#52657a] hover:bg-[#f8fafb]" onClick={() => setMessage('Limit change request saved as a demo request.')} type="button">Request limit change</button>
          <button className="h-9 rounded-lg bg-[#193452] px-3 text-xs font-semibold text-white hover:bg-[#122943]" onClick={() => setRulesOpen(true)} type="button">Approval rules</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
        <div className="border-b border-[#edf0f3] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#20354d]">Debtor limits</h2>
        </div>
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr_72px] gap-4 border-b border-[#edf0f3] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a99a8] md:grid">
          <span>Debtor</span><span>Approved limit</span><span>Outstanding</span><span>Status</span><span />
        </div>
        {data.limits.map((record) => {
          const status = record.outstanding > record.limit ? 'Over limit' : record.outstanding / record.limit >= 0.8 ? 'Review' : 'OK'
          return (
            <div className="grid gap-3 border-b border-[#edf0f3] px-5 py-4 last:border-b-0 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_72px] md:items-center" key={record.debtorId}>
              <p className="text-xs font-semibold text-[#34495d]">{record.debtorName}</p>
              <p className="text-xs text-[#61758a]"><span className="font-medium md:hidden">Limit: </span>{formatNaira(record.limit)}</p>
              <p className="text-xs text-[#61758a]"><span className="font-medium md:hidden">Outstanding: </span>{formatNaira(record.outstanding)}</p>
              <span className={`w-fit rounded-full px-2 py-1 text-[10px] font-bold ${status === 'OK' ? 'bg-[#eaf7ee] text-[#2f7c4b]' : status === 'Over limit' ? 'bg-[#fdebea] text-[#b64b50]' : 'bg-[#fff3df] text-[#a86b23]'}`}>{status}</span>
              <button className="h-8 rounded-lg border border-[#dfe5ea] text-[11px] font-semibold text-[#52657a] hover:bg-[#f8fafb]" onClick={() => openEditor(record.debtorName, record.limit)} type="button">Edit</button>
            </div>
          )
        })}
      </section>

      {editingLimit && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#10243a]/35 p-4" role="dialog" aria-modal="true" aria-label="Edit credit limit">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-semibold text-[#20354d]">Edit {editingLimit} limit</h2>
            <label className="mt-4 block text-xs font-medium text-[#61758a]" htmlFor="credit-limit">Approved limit (₦)</label>
            <input className="mt-2 h-10 w-full rounded-lg border border-[#dfe5ea] px-3 text-sm outline-none focus:border-[#65b883]" id="credit-limit" min="0" onChange={(event) => setLimitValue(event.target.value)} type="number" value={limitValue} />
            <div className="mt-5 flex justify-end gap-2">
              <button className="h-9 rounded-lg border border-[#dfe5ea] px-4 text-xs font-semibold text-[#52657a]" onClick={() => setEditingLimit(null)} type="button">Cancel</button>
              <button className="h-9 rounded-lg bg-[#193452] px-4 text-xs font-semibold text-white" onClick={saveLimit} type="button">Save change</button>
            </div>
          </div>
        </div>
      )}

      {rulesOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#10243a]/35 p-4" role="dialog" aria-modal="true" aria-label="Credit approval rules">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-semibold text-[#20354d]">Approval rules</h2>
            <div className="mt-4 space-y-3">
              {data.rules.map((rule) => (
                <div className="rounded-lg border border-[#e5eaf0] p-3" key={rule.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-[#34495d]">{rule.name}</p>
                    <span className="rounded-full bg-[#eaf7ee] px-2 py-1 text-[10px] font-bold text-[#2f7c4b]">{rule.enabled ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-[#7e8f9f]">{rule.description}</p>
                </div>
              ))}
            </div>
            <button className="mt-5 h-9 w-full rounded-lg bg-[#193452] text-xs font-semibold text-white" onClick={() => setRulesOpen(false)} type="button">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
