import { Link } from 'react-router-dom'
import { NotificationButton } from './NotificationButton.tsx'

type DashboardHeaderProps = {
  title: string
  description: string
  search: string
  onSearchChange: (value: string) => void
  onOpenMenu: () => void
}

export function DashboardHeader({
  title,
  description,
  search,
  onSearchChange,
  onOpenMenu,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-[#e3e9ef] bg-[#f5f7fa] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="flex items-start gap-3">
        <button
          aria-label="Open navigation menu"
          className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-[#e3e8ee] bg-white text-[#193452] lg:hidden"
          onClick={onOpenMenu}
          type="button"
        >
          <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-bold tracking-[-0.045em] text-[#193452] sm:text-[26px]">{title}</h1>
          <p className="mt-1 text-xs leading-5 text-[#77889a] sm:text-[13px]">{description}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <NotificationButton />
          <Link
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#1fa35b] px-4 text-xs font-semibold text-white shadow-[0_6px_14px_rgba(31,163,91,0.18)] transition hover:bg-[#17874a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16824a] sm:text-[13px]"
            to="/transactions"
          >
            <span aria-hidden="true" className="text-lg leading-none">+</span>
            <span>Create New Credit Transaction</span>
          </Link>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 sm:mt-5">
        <label className="relative min-w-0 flex-1 sm:max-w-90">
          <span className="sr-only">Search debtors or invoices</span>
          <svg aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a2b1]" fill="none" viewBox="0 0 24 24">
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
            <path d="m16 16 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          </svg>
          <input
            className="h-10 w-full rounded-xl border border-[#e3e8ee] bg-white pl-9 pr-3 text-xs text-[#20354d] outline-none placeholder:text-[#9aa8b6] focus:border-[#65b883] focus:ring-4 focus:ring-[#65b883]/10"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search debtors or invoices..."
            type="search"
            value={search}
          />
        </label>
        <div className="flex items-center gap-2 sm:hidden">
          <NotificationButton />
          <Link
            aria-label="Create a new credit transaction"
            className="grid size-10 place-items-center rounded-xl bg-[#1fa35b] text-xl font-medium text-white"
            to="/transactions"
          >
            +
          </Link>
        </div>
      </div>
    </header>
  )
}
