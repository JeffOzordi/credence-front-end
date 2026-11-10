import logo from '../assets/credence_logo.png'
import { SignupForm } from '../components/auth/SignupForm.tsx'

export function SignupPage() {
  return (
    <div className="w-full max-w-[28rem] lg:max-w-[30rem]">
      <div className="mb-6 sm:mb-8">
        <div className="mb-5 flex items-center gap-2.5">
          <img alt="Credence logo" className="size-9 rounded-full" height={36} src={logo} width={36} />
          <div>
            <p className="text-lg font-semibold leading-none tracking-tight text-[#193432]">Credence</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#5b866e]">Make trust measurable.</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b866e]">Step 1 of 2 — Account details</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#dce3df]">
            <div className="h-full w-1/2 rounded-full bg-[#527f6a]" />
          </div>
        </div>

        <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-none tracking-[-0.065em] text-[#193432]">Create your account</h1>
        <p className="mt-3 text-[15px] leading-6 text-[#74807b]">Start tracking credit and collections.</p>
      </div>
      <SignupForm />
    </div>
  )
}
