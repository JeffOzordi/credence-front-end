import { NavLink } from 'react-router-dom'
import logo from '../../assets/credence_logo.png'

const navigation = [
  { label: 'Overview', path: '/overview', icon: 'grid' },
  { label: 'Transactions', path: '/transactions', icon: 'arrows' },
  { label: 'Debtors', path: '/debtors', icon: 'users' },
  { label: 'Reminders', path: '/reminders', icon: 'bell', badge: '8' },
  { label: 'Credit Management', path: '/credit-management', icon: 'shield' },
  { label: 'Reports & Insights', path: '/reports', icon: 'chart' },
  { label: 'Email Templates', path: '/email-templates', icon: 'mail' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
] as const

function NavigationIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    arrows: 'M7 7h12l-3-3m3 3-3 3M17 17H5l3 3m-3-3 3-3',
    users: 'M16 20v-1.5a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4V20m12-5.5a4 4 0 0 1 4 4V20M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7.5a4 4 0 0 1 0 7.5',
    bell: 'M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4',
    shield: 'm12 3 7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-3Zm-3 9 2 2 4-4',
    chart: 'M4 19V9m5 10V5m5 14v-7m5 7V3M2 19h20',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  }

  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24">
      <path d={paths[name] ?? paths.grid} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

type SidebarProps = {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full min-h-0 w-[260px] shrink-0 flex-col bg-[#193452] px-4 py-5 text-white">
      <div className="mb-7 flex items-center gap-2.5 px-2">
        <img alt="" className="size-10 rounded-full" height={40} src={logo} width={40} />
        <div>
          <p className="text-[20px] font-semibold leading-5 tracking-tight">Credence</p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#c1cfdb]">Make trust measurable.</p>
        </div>
      </div>

      <nav aria-label="Dashboard" className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white before:absolute before:left-0 before:h-7 before:w-[3px] before:rounded-r before:bg-[#42c579]'
                  : 'text-[#c2cfdb] hover:bg-white/[0.07] hover:text-white'
              }`
            }
            end={item.path === '/overview'}
            key={item.path}
            onClick={onNavigate}
            to={item.path}
          >
            <NavigationIcon name={item.icon} />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {'badge' in item && (
              <span className="grid size-5 place-items-center rounded-full bg-[#39b979] text-[10px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.07] p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Growth Plan</p>
          <span className="rounded-full bg-[#d6f5e3] px-2 py-0.5 text-[9px] font-bold text-[#167246]">ACTIVE</span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#bfccda]">Your business is growing. Explore more tools to scale collections.</p>
        <NavLink className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#72d69e] hover:text-white" onClick={onNavigate} to="/credit-management">
          Explore plan <span aria-hidden="true">→</span>
        </NavLink>
      </div>

      <NavLink
        className="mt-3 flex min-h-10 items-center gap-3 rounded-lg px-3 text-[12px] font-medium text-[#c2cfdb] transition hover:bg-white/[0.07] hover:text-white"
        onClick={onNavigate}
        to="/settings"
      >
        <span aria-hidden="true" className="grid size-[18px] place-items-center rounded-full border border-current text-[11px]">?</span>
        Help &amp; Support
      </NavLink>

      <div className="mt-4 flex items-center gap-3 border-t border-white/15 pt-4">
        <span className="grid size-9 place-items-center rounded-full bg-[#d6eadb] text-xs font-bold text-[#20563d]">AO</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">Adaeze Okafor</p>
          <p className="truncate text-[10px] text-[#bdcbd8]">Aster Works</p>
        </div>
        <button aria-label="Open account menu" className="rounded-md p-1.5 text-[#bdcbd8] hover:bg-white/10 hover:text-white" type="button">
          <span aria-hidden="true">···</span>
        </button>
      </div>
    </aside>
  )
}
