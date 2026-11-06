
import { Outlet } from 'react-router-dom'
import { BrandingPanel } from '../components/auth/BrandingPanel.tsx'

export function AuthLayout() {
  return (
    <main className="flex h-dvh flex-row overflow-hidden bg-[#f4f6f4]">
      <BrandingPanel />

      <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-5 py-4 sm:px-10 lg:px-12 lg:py-16">
        <Outlet />
      </section>
    </main>
  )
}
