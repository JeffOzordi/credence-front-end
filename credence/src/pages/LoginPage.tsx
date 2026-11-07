
import { LoginForm } from '../components/auth/LoginForm.tsx'
import logo from '../assets/credence_logo.png'

export function LoginPage() {
  return (
    <div className="w-full max-w-105">
      <div className="mb-6 sm:mb-9">
       <div className="relative z-10 flex items-center gap-3">
          <div className="mb-5 flex items-center gap-2.5">
          <img alt="Credence logo" className="size-9 rounded-full" height={36} src={logo} width={36} />
          <div>
            <p className="text-lg font-semibold leading-none tracking-tight text-[#193432]">Credence</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#5b866e]">Make trust measurable.</p>
          </div>
        </div>
        </div>

        <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-none tracking-[-0.065em] text-[#193452]">
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
