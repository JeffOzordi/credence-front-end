import { Link } from 'react-router-dom'
import type {
  CollectionMonth,
  DashboardActivity,
  DashboardOverview,
  DashboardStat,
  OverduePayment,
  Transaction,
  UpcomingPayment,
} from '../../../services/api/types.ts'

const statTones: Record<DashboardStat['tone'], string> = {
  navy: 'bg-[#e9eff8] text-[#30537b]',
  amber: 'bg-[#fff3d9] text-[#b97812]',
  green: 'bg-[#e4f6eb] text-[#21864b]',
  red: 'bg-[#ffeded] text-[#d04c50]',
  blue: 'bg-[#e8f4fb] text-[#28779f]',
}

function StatIcon({ icon }: { icon: DashboardStat['icon'] }) {
  const paths: Record<DashboardStat['icon'], string> = {
    credit: 'M3 7h18v12H3zM3 10h18M7 15h4',
    outstanding: 'M12 3v18m5-14.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5 1.8 2.5 4 2.5 4 1.1 4 2.5-1.8 2.5-4 2.5-4-1.1-4-2.5',
    collected: 'm5 12 4 4L19 6',
    overdue: 'M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    capacity: 'M4 19V9m5 10V5m5 14v-7m5 7V3M2 19h20',
  }

  return (
    <svg aria-hidden="true" className="size-[18px]" fill="none" viewBox="0 0 24 24">
      <path d={paths[icon]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

function PanelHeading({
  title,
  action,
}: {
  title: string
  action?: { label: string; to: string }
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#edf0f3] px-4 py-4 sm:px-5">
      <h2 className="text-sm font-semibold text-[#20354d]">{title}</h2>
      {action && (
        <Link className="shrink-0 text-[11px] font-semibold text-[#218a50] hover:underline" to={action.to}>
          {action.label}
        </Link>
      )}
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return <p className="px-5 py-8 text-center text-xs text-[#8190a0]">{label}</p>
}

function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <article className="min-w-0 rounded-xl border border-[#e5eaf0] bg-white p-4 shadow-[0_2px_8px_rgba(28,53,79,0.025)] sm:p-[18px]">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-medium text-[#74869a]">{stat.title}</p>
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${statTones[stat.tone]}`}>
          <StatIcon icon={stat.icon} />
        </span>
      </div>
      <p className="mt-4 whitespace-nowrap text-[clamp(1.1rem,1.35vw,1.35rem)] font-bold tracking-[-0.045em] text-[#1d334c]">{stat.value}</p>
      <p className="mt-1.5 truncate text-[10px] text-[#8998a7]">{stat.description}</p>
    </article>
  )
}

function CreditHealth({ data }: { data: DashboardOverview['creditHealth'] }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-[#193452] p-5 text-white shadow-[0_12px_30px_rgba(25,52,82,0.12)] sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">Credit health: {data.label}</h2>
            <span className="rounded-full bg-[#39b979]/15 px-2.5 py-1 text-[10px] font-semibold text-[#7ee0a4]">{data.percentage}% on-time repayment</span>
          </div>
          <p className="mt-2 max-w-150 text-xs leading-5 text-[#c2cfdb]">
            {data.dueAmount} due in the next 7 days across {data.dueDebtorCount} debtors. {data.message}
          </p>
          <div aria-label={`${data.percentage}% on-time repayment`} className="mt-4 h-2 max-w-120 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={data.percentage} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-[#46c77f]" style={{ width: `${data.percentage}%` }} />
          </div>
        </div>
        <Link className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-white/25 px-4 text-xs font-semibold text-white transition hover:bg-white/10" to="/reports">
          View insights
        </Link>
      </div>
    </section>
  )
}

function TransactionStatus({ status }: { status: Transaction['status'] }) {
  const colors: Record<Transaction['status'], string> = {
    'Partially paid': 'bg-[#fff4df] text-[#a66a0a]',
    Overdue: 'bg-[#ffeded] text-[#bd4147]',
    Settled: 'bg-[#e5f6ec] text-[#21864b]',
    Active: 'bg-[#e9f1fb] text-[#38668f]',
  }

  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${colors[status]}`}>{status}</span>
}

function TransactionsPanel({
  transactions,
  search,
}: {
  transactions: Transaction[]
  search: string
}) {
  const filtered = transactions.filter((item) =>
    `${item.debtor} ${item.reference}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
      <PanelHeading title="Recent Transactions" action={{ label: 'View all transactions', to: '/transactions' }} />
      {filtered.length === 0 ? (
        <EmptyState label={transactions.length ? 'No transactions match your search.' : 'No transactions yet.'} />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[690px] text-left">
              <thead className="bg-[#f8fafc] text-[10px] font-semibold uppercase tracking-wide text-[#8594a4]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Debtor</th>
                  <th className="px-3 py-3 font-semibold">Reference</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                  <th className="px-3 py-3 font-semibold">Paid</th>
                  <th className="px-3 py-3 font-semibold">Due</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f3]">
                {filtered.map((item) => (
                  <tr className="text-[11px] text-[#52657a]" key={item.reference}>
                    <td className="px-4 py-3.5 font-semibold text-[#20354d]">{item.debtor}</td>
                    <td className="px-3 py-3.5">{item.reference}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#263e58]">{item.amount}</td>
                    <td className="whitespace-nowrap px-3 py-3.5">{item.paid}</td>
                    <td className="whitespace-nowrap px-3 py-3.5">{item.dueDate}</td>
                    <td className="px-3 py-3.5"><TransactionStatus status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-[#edf0f3] md:hidden">
            {filtered.map((item) => (
              <article className="p-4" key={item.reference}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#20354d]">{item.debtor}</p>
                    <p className="mt-1 text-[10px] text-[#8594a4]">{item.reference}</p>
                  </div>
                  <TransactionStatus status={item.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                  <span><span className="block text-[#8594a4]">Amount</span><strong className="mt-1 block text-[#34485f]">{item.amount}</strong></span>
                  <span><span className="block text-[#8594a4]">Paid</span><strong className="mt-1 block text-[#34485f]">{item.paid}</strong></span>
                  <span><span className="block text-[#8594a4]">Due</span><strong className="mt-1 block text-[#34485f]">{item.dueDate}</strong></span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function OverduePaymentsPanel({ payments }: { payments: OverduePayment[] }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
      <PanelHeading title="Overdue Payments" action={{ label: 'View all', to: '/debtors' }} />
      {payments.length === 0 ? (
        <EmptyState label="You have no overdue payments." />
      ) : (
        <div className="space-y-3 p-3 sm:p-4">
          {payments.map((payment) => (
            <article className="rounded-lg border border-[#edf0f3] p-3.5" key={payment.debtor}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#20354d]">{payment.debtor}</p>
                  <p className="mt-1.5 text-sm font-bold text-[#233b55]">{payment.amount}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#fff0ef] px-2 py-1 text-[9px] font-semibold text-[#c34b4c]">{payment.daysOverdue} days overdue</span>
              </div>
              <p className="mt-2 text-[10px] leading-4 text-[#8493a3]">{payment.lastCommunication}</p>
              <p className="mt-1 text-[10px] text-[#8493a3]">Next follow-up: <span className="font-medium text-[#53677d]">{payment.nextFollowUp}</span></p>
              <div className="mt-3 flex gap-2">
                <Link className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-[#e8f6ed] text-[10px] font-semibold text-[#21864b] hover:bg-[#d9f0e2]" to="/reminders">Follow up</Link>
                <Link className="inline-flex h-8 items-center justify-center rounded-md border border-[#e1e7ed] px-3 text-[10px] font-semibold text-[#52657a] hover:bg-[#f8fafc]" to="/debtors">View</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function CollectionPerformancePanel({
  data,
}: {
  data: DashboardOverview['collectionPerformance']
}) {
  const maxAmount = Math.max(...data.months.map((month) => month.amount), 1)

  return (
    <section className="overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
      <PanelHeading title="Collection Performance" action={{ label: 'View report', to: '/reports' }} />
      {data.months.length === 0 ? (
        <EmptyState label="Collection data will appear here." />
      ) : (
        <div className="p-4 sm:p-5">
          <div aria-label="Monthly collection performance, May to November" className="flex h-40 items-end justify-between gap-2 border-b border-[#e9edf1] pb-2 sm:gap-4">
            {data.months.map((month, index) => (
              <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" key={month.month}>
                <div
                  aria-label={`${month.month}: ${month.rate}`}
                  className={`w-full max-w-9 rounded-t-md ${index === data.months.length - 1 ? 'bg-[#38b873]' : 'bg-[#dce5ed]'}`}
                  style={{ height: `${Math.max(10, (month.amount / maxAmount) * 100)}%` }}
                  title={`${month.month}: ${month.rate}`}
                />
                <span className={`text-[9px] ${index === data.months.length - 1 ? 'font-semibold text-[#25894f]' : 'text-[#8796a5]'}`}>{month.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-[#8594a4]">Collected this month</p>
              <p className="mt-1 text-base font-bold tracking-tight text-[#233b55]">{data.totalCollected}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#8594a4]">Collection rate</p>
              <p className="mt-1 text-base font-bold text-[#21864b]">{data.rate}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const activityStyles: Record<DashboardActivity['type'], { icon: string; color: string }> = {
  payment: { icon: '₦', color: 'bg-[#e3f6eb] text-[#25884e]' },
  reminder: { icon: '↗', color: 'bg-[#e8f2fb] text-[#3d79a5]' },
  transaction: { icon: '+', color: 'bg-[#edf0fb] text-[#6267a8]' },
  response: { icon: '↩', color: 'bg-[#fff3df] text-[#b67a20]' },
  plan: { icon: '✓', color: 'bg-[#e5f6ee] text-[#25884e]' },
}

function RecentActivityPanel({ activities }: { activities: DashboardActivity[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
      <PanelHeading title="Recent Activity" action={{ label: 'View all', to: '/reports' }} />
      {activities.length === 0 ? (
        <EmptyState label="Recent activity will appear here." />
      ) : (
        <ol className="divide-y divide-[#edf0f3] px-4 sm:px-5">
          {activities.map((activity, index) => {
            const style = activityStyles[activity.type]
            return (
              <li className="flex gap-3 py-3.5" key={`${activity.type}-${activity.time}-${index}`}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${style.color}`}>{style.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-[#354b62]">{activity.title}</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#7f8e9d]">{activity.detail}</p>
                </div>
                <time className="shrink-0 pt-0.5 text-[9px] text-[#95a2af]">{activity.time}</time>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

function UpcomingPaymentsPanel({
  payments,
}: {
  payments: UpcomingPayment[]
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#e5eaf0] bg-white">
      <PanelHeading title="Upcoming Payments" action={{ label: 'View calendar', to: '/reminders' }} />
      {payments.length === 0 ? (
        <EmptyState label="No upcoming payments scheduled." />
      ) : (
        <ul className="divide-y divide-[#edf0f3]">
          {payments.map((payment) => (
            <li className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5" key={`${payment.debtor}-${payment.dueDate}`}>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-[#354b62]">{payment.debtor}</p>
                <p className="mt-1 text-[10px] text-[#8796a5]">Due {payment.dueDate}</p>
              </div>
              <p className="shrink-0 text-xs font-semibold text-[#354b62]">{payment.amount}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function OverviewDashboard({
  data,
  search,
}: {
  data: DashboardOverview
  search: string
}) {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5">
      <section aria-label="Credit statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 xl:gap-4">
        {data.stats.map((stat) => <StatCard key={stat.title} stat={stat} />)}
      </section>
      <CreditHealth data={data.creditHealth} />
      <div className="grid min-w-0 gap-5 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-7">
          <TransactionsPanel search={search} transactions={data.transactions} />
        </div>
        <div className="min-w-0 xl:col-span-5">
          <OverduePaymentsPanel payments={data.overduePayments} />
        </div>
      </div>
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <CollectionPerformancePanel data={data.collectionPerformance} />
        <RecentActivityPanel activities={data.activities} />
      </div>
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <UpcomingPaymentsPanel payments={data.upcomingPayments} />
        <section className="flex min-h-32 flex-col justify-center rounded-xl border border-dashed border-[#d8e1e9] bg-white/60 p-5">
          <p className="text-sm font-semibold text-[#354b62]">Keep collections moving</p>
          <p className="mt-1.5 max-w-lg text-xs leading-5 text-[#8190a0]">Use automated reminders to follow up with debtors before payments become overdue.</p>
          <Link className="mt-3 text-xs font-semibold text-[#218a50] hover:underline" to="/reminders">Manage reminders →</Link>
        </section>
      </div>
    </div>
  )
}

export type { CollectionMonth }
