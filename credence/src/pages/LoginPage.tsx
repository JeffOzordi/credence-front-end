
import { LoginForm } from '../components/auth/LoginForm.tsx'

export function LoginPage() {
  return (
    <div className="w-full max-w-105">
      <div className="mb-6 sm:mb-9">
        <p className="mb-2 sm:mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b866e]">
          Credence
        </p>

        <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-none tracking-[-0.065em] text-[#193432]">
          Welcome back
        </h2>

        <p className="mt-3 sm:mt-4 text-[15px] leading-6 text-[#74807b]">
          Sign in to manage credit, debtors and collections.
        </p>
      </div>

      <LoginForm />
    </div>
  )
}
