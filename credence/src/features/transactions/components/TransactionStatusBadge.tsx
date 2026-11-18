import type { TransactionStatus } from '../types.ts'

const statusClasses: Record<TransactionStatus, string> = {
  'Partially paid': 'bg-[#fff4df] text-[#a66a0a]',
  Overdue: 'bg-[#ffeded] text-[#bd4147]',
  Settled: 'bg-[#e5f6ec] text-[#21864b]',
  Active: 'bg-[#e9f1fb] text-[#38668f]',
  Disputed: 'bg-[#f0eafa] text-[#7550a4]',
  Pending: 'bg-[#eef1f5] text-[#64748b]',
}

export function TransactionStatusBadge({
  status,
}: {
  status: TransactionStatus
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses[status]}`}
    >
      {status}
    </span>
  )
}
