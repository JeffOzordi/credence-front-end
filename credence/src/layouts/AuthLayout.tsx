import { Outlet, useLocation } from 'react-router-dom'
import { BrandingPanel } from '../components/auth/BrandingPanel.tsx'
import { OnboardingValuePanel } from '../components/auth/OnboardingValuePanel.tsx'
import { SignupValuePanel } from '../components/auth/SignupValuePanel.tsx'

export function AuthLayout() {
  const { pathname } = useLocation()
  const isSignup = pathname === '/signup'
  const isOnboarding = pathname === '/onboarding/business'

  return (
    <main className="flex min-h-dvh flex-col overflow-x-hidden bg-[#f4f6f4] lg:h-dvh lg:flex-row">
      {isSignup || isOnboarding ? (
        <>
          <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-visible px-5 py-8 sm:px-10 lg:overflow-hidden lg:px-12 lg:py-16">
            <Outlet />
          </section>
          {isSignup ? <SignupValuePanel /> : <OnboardingValuePanel />}
        </>
      ) : (
        <>
          <BrandingPanel />
          <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-5 py-4 sm:px-10 lg:px-12 lg:py-16">
            <Outlet />
          </section>
        </>
      )}
    </main>
  )
}
