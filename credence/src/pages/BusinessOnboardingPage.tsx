import { BusinessInfoForm } from '../components/auth/BusinessInfoForm.tsx'
import { useLocation } from 'react-router-dom'
import logo from '../assets/credence_logo.png'

export function BusinessOnboardingPage() {
  const location = useLocation()
  return (
    <div className="w-full max-w-105">
      <div className="mb-7 flex items-center gap-2.5">
        <img alt="Credence logo" className="size-9 rounded-full" height={36} src={logo} width={36} />
        <div>
          <p className="text-lg font-semibold leading-none tracking-tight text-[#193452]">Credence</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#527f6a]">Make trust measurable.</p>
        </div>
      </div>
      <div className="mb-7">
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-[-0.065em] text-[#193452]">Tell us about your business</h1>
        <p className="mt-4 max-w-120 text-[15px] leading-6 text-[#74807b]">Help us understand your business so we can tailor Credence to your credit and collection needs.</p>
      </div>
      <BusinessInfoForm key={location.key} />
    </div>
  )
}
