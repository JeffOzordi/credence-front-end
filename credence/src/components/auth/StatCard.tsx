type StatCardProps = {
  value: string
  label: string
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="min-w-0 flex-1 border-r border-white/15 px-4 first:pl-0 last:border-0 last:pr-0">
      <p className="text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl">{value}</p>
      <p className="mt-1 text-[10px] leading-4 text-slate-300 sm:text-xs">{label}</p>
    </div>
  )
}
