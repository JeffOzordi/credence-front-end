import type { DebtorStatus } from '../types.ts'

const statusClassNames: Record<DebtorStatus, string> = {
  'Good standing': 'bg-[#e6f5eb] text-[#25834a]',
  Watch: 'bg-[#fff4df] text-[#a66a0a]',
  'At risk': 'bg-[#ffeded] text-[#bd4147]',
  New: 'bg-[#eef1f5] text-[#64748b]',
}

export function DebtorStatusBadge({ status }: { status: DebtorStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClassNames[status]}`}
    >
      {status}
    </span>
  )
}
