import { useLocation } from 'react-router-dom'

const pageDescriptions: Record<string, string> = {
  '/transactions': 'Review and create business credit transactions.',
  '/debtors': 'View debtor accounts and repayment details.',
  '/reminders': 'Plan and track your debtor follow-ups.',
  '/credit-management': 'Monitor credit limits and exposure.',
  '/reports': 'Explore collection trends and portfolio insights.',
  '/email-templates': 'Manage messages sent to your debtors.',
  '/settings': 'Manage your workspace preferences.',
}

export function DashboardPlaceholderPage() {
  const { pathname } = useLocation()
  const page = pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ') ?? ''
  const title = page.replace(/\b\w/g, (letter) => letter.toUpperCase())

  return (
    <section className="mx-auto flex min-h-80 max-w-3xl flex-col items-center justify-center rounded-2xl border border-[#e5eaf0] bg-white px-6 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-[#e8f6ed] text-xl text-[#21864b]" aria-hidden="true">↗</span>
      <h2 className="mt-4 text-lg font-semibold text-[#20354d]">{title}</h2>
      <p className="mt-2 text-sm text-[#74869a]">{pageDescriptions[pathname] ?? 'This section is coming soon.'}</p>
      <p className="mt-3 text-xs text-[#94a2b1]">This page is part of the shared Credence dashboard.</p>
    </section>
  )
}
