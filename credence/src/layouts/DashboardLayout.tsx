import { useCallback, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DashboardHeader } from '../components/dashboard/DashboardHeader.tsx'
import { MobileSidebar } from '../components/dashboard/MobileSidebar.tsx'
import { Sidebar } from '../components/dashboard/Sidebar.tsx'

const pageDetails: Record<string, { title: string; description: string }> = {
  '/overview': {
    title: 'Overview',
    description: 'Welcome back, Adaeze. Here is your credit position today.',
  },
  '/transactions': { title: 'Transactions', description: 'Manage your credit transactions.' },
  '/debtors': { title: 'Debtors', description: 'View and manage your debtors.' },
  '/reminders': { title: 'Reminders', description: 'Stay ahead of upcoming repayments.' },
  '/credit-management': { title: 'Credit Management', description: 'Monitor your credit exposure.' },
  '/reports': { title: 'Reports & Insights', description: 'Understand your collection performance.' },
  '/email-templates': { title: 'Email Templates', description: 'Manage your collection communications.' },
  '/settings': { title: 'Settings', description: 'Manage your account and preferences.' },
}

export type DashboardOutletContext = {
  search: string
}

export function DashboardLayout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const page = pageDetails[pathname] ?? pageDetails['/overview']

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f5f7fa]">
      <div className="hidden h-dvh shrink-0 lg:flex">
        <Sidebar />
      </div>
      <MobileSidebar open={menuOpen} onClose={closeMenu} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardHeader
          title={page.title}
          description={page.description}
          search={search}
          onSearchChange={setSearch}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <Outlet context={{ search } satisfies DashboardOutletContext} />
        </main>
      </div>
    </div>
  )
}
