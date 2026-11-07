import logo from '../assets/credence_logo.png'
import { SignupForm } from '../components/auth/SignupForm.tsx'
import { useLocation } from 'react-router-dom'

export function SignupPage() {
  const location = useLocation()
  const signupValues = (location.state as { signupValues?: { businessName: string; fullName: string; email: string; password: string; acceptedTerms: boolean } } | null)?.signupValues

  return (
    <div className="w-full max-w-105">
      <div className="mb-6 sm:mb-8">
        <div className="mb-5 flex items-center gap-2.5">
          <img alt="Credence logo" className="size-9 rounded-full" height={36} src={logo} width={36} />
          <div>
            <p className="text-lg font-semibold leading-none tracking-tight text-[#193432]">Credence</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#5b866e]">Make trust measurable.</p>
          </div>
        </div>
        <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-none tracking-[-0.065em] text-[#193432]">Create your account</h1>
        <p className="mt-3 text-[15px] leading-6 text-[#74807b]">Start tracking credit and collections.</p>
      </div>
      <SignupForm initialValues={signupValues} />
    </div>
  )
}
