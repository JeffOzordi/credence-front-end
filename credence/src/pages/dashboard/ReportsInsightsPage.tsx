import { useState } from 'react'
import { useReports } from '../../features/reports/hooks/useReports.ts'
import { formatNaira } from '../../features/transactions/formatters.ts'

export function ReportsInsightsPage() {
  const reports = useReports()
  const [range, setRange] = useState('Last 6 months')

  if (reports.isPending) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading reports">
        {[0, 1, 2, 3].map((item) => <div className="h-28 animate-pulse rounded-xl bg-white" key={item} />)}
      </div>
    )
  }

  if (reports.isError) return <p className="rounded-xl bg-white p-6 text-sm text-[#9a4d4d]">{reports.error.message}</p>

  const data = reports.data
  const collectionRate = data.extended ? Math.round((data.collected / data.extended) * 100) : 0
  const monthly = [
    { month: 'Jun', extended: 1.62, collected: 1.08 },
    { month: 'Jul', extended: 1.78, collected: 1.12 },
    { month: 'Aug', extended: 1.95, collected: 1.28 },
    { month: 'Sep', extended: 2.18, collected: 1.36 },
    { month: 'Oct', extended: 2.32, collected: 1.48 },
    { month: 'Nov', extended: 2.63, collected: 1.34 },
  ]
  const maxMonthly = 3

  function exportReport() {
    const rows = [
      ['Metric', 'Value'],
      ['Extended', String(data.extended)],
      ['Collected', String(data.collected)],
      ['Outstanding', String(data.outstanding)],
      ['On-time rate', `${data.onTimeRate}%`],
      ...data.debtorPerformance.map((debtor) => [debtor.name, `${debtor.onTimeRate}%`]),
    ]
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'credence-reports-insights.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#20354d]">Collection health</h2>
          <p className="mt-1 text-[11px] text-[#7e8f9f]">Trends and debtor rankings from demo data</p>
        </div>
        <div className="flex gap-2">
          <select className="h-9 rounded-lg border border-[#dfe5ea] bg-white px-3 text-xs text-[#52657a]" onChange={(event) => setRange(event.target.value)} value={range}>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>This month</option>
          </select>
          <button className="h-9 rounded-lg border border-[#dfe5ea] px-3 text-xs font-semibold text-[#52657a] hover:bg-white" onClick={exportReport} type="button">Export</button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Extended', formatNaira(data.extended), '+9.1%'],
          ['Collected', formatNaira(data.collected), `${collectionRate}% rate`],
          ['On-time rate', `${data.onTimeRate}%`, '+3.2 pts'],
          ['Outstanding', formatNaira(data.outstanding), `${data.settled} settled`],
        ].map(([label, value, detail]) => (
          <article className="rounded-xl border border-[#e5eaf0] bg-white p-4" key={label}>
            <p className="text-[11px] font-medium text-[#8291a2]">{label}</p>
            <p className="mt-2 text-xl font-bold text-[#20354d]">{value}</p>
            <p className="mt-1 text-[10px] font-semibold text-[#4b8061]">{detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-xl border border-[#e5eaf0] bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#34495d]">Monthly trends — extended vs collected</h3>
            <div className="flex gap-3 text-[9px] text-[#8291a2]"><span>● Extended</span><span className="text-[#57b27a]">● Collected</span></div>
          </div>
          <div className="mt-5 flex h-52 items-end gap-3 border-b border-l border-[#edf0f3] px-3 pb-0">
            {monthly.map((item) => (
              <div className="flex h-full flex-1 items-end justify-center gap-1" key={item.month}>
                <div className="w-[32%] rounded-t bg-[#193452]" style={{ height: `${(item.extended / maxMonthly) * 100}%` }} title={`Extended: ₦${item.extended}M`} />
                <div className="w-[32%] rounded-t bg-[#56b77b]" style={{ height: `${(item.collected / maxMonthly) * 100}%` }} title={`Collected: ₦${item.collected}M`} />
              </div>
            ))}
          </div>
          <div className="flex px-3 pt-2">
            {monthly.map((item) => <span className="flex-1 text-center text-[10px] text-[#8291a2]" key={item.month}>{item.month}</span>)}
          </div>
        </section>

        <section className="rounded-xl border border-[#e5eaf0] bg-white p-5">
          <h3 className="text-xs font-semibold text-[#34495d]">Debtor performance</h3>
          <div className="mt-4 space-y-3">
            {data.debtorPerformance.slice(0, 5).map((debtor) => (
              <div key={debtor.name}>
                <div className="mb-1 flex justify-between text-[11px]"><span className="truncate text-[#61758a]">{debtor.name}</span><span className="font-semibold text-[#34495d]">{debtor.onTimeRate}%</span></div>
                <div className="h-1.5 rounded-full bg-[#edf1f4]"><div className="h-full rounded-full bg-[#56b77b]" style={{ width: `${debtor.onTimeRate}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-[#e5eaf0] bg-white p-5">
        <h3 className="text-xs font-semibold text-[#34495d]">Overdue by age</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[['1–7 days', '₦890K'], ['8–30 days', '₦760K'], ['30+ days', '₦500K']].map(([label, value]) => (
            <div className="rounded-lg bg-[#f8fafb] px-4 py-3" key={label}>
              <p className="text-[10px] text-[#8291a2]">{label}</p>
              <p className="mt-1 text-sm font-bold text-[#34495d]">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
