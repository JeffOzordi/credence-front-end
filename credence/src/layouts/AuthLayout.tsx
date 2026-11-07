
import { Outlet } from 'react-router-dom'
import { BrandingPanel } from '../components/auth/BrandingPanel.tsx'
import { SignupValuePanel } from '../components/auth/SignupValuePanel.tsx'
import { useLocation } from 'react-router-dom'

export function AuthLayout() {
  const { pathname } = useLocation()

  return (
    <main className="flex h-dvh flex-row overflow-hidden bg-[#f4f6f4]">
      {pathname === '/signup' ? <SignupValuePanel /> : <BrandingPanel />}

      <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-5 py-4 sm:px-10 lg:px-12 lg:py-16">
        <Outlet />
      </section>
    </main>
  )
}
