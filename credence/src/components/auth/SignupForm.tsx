import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useOnboardingDraft } from '../../providers/OnboardingDraftProvider.tsx'
import { useRegisterAccount } from '../../features/onboarding/hooks/useRegisterAccount.ts'

export type SignupValues = {
  businessName: string
  fullName: string
  email: string
  password: string
  acceptedTerms: boolean
}

type FormErrors = {
  businessName?: string
  fullName?: string
  email?: string
  password?: string
  terms?: string
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.6 4.3 9.5 6-.4.8-1.3 2-2.7 3.2M6.2 6.2C3.9 7.7 2.7 10 2.5 11c.9 1.7 4.3 6 9.5 6 1 0 1.9-.2 2.8-.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

const inputClass = (hasError: boolean) =>
  `h-12 w-full rounded-[9px] border bg-white px-4 text-sm text-[#203333] outline-none transition placeholder:text-[#a7b0ad] focus:border-[#527f6a] focus:ring-4 focus:ring-[#527f6a]/10 ${hasError ? 'border-[#c66b68]' : 'border-[#dce3df]'}`

type SignupFormProps = {
  initialValues?: Partial<SignupValues>
}

export function SignupForm({ initialValues }: SignupFormProps) {
  const navigate = useNavigate()
  const { signupDraft, setSignupDraft } = useOnboardingDraft()
  const registration = useRegisterAccount()
  const [values, setValues] = useState({
    businessName: initialValues?.businessName ?? signupDraft.businessName,
    fullName: initialValues?.fullName ?? signupDraft.fullName,
    email: initialValues?.email ?? signupDraft.email,
    password: initialValues?.password ?? '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(initialValues?.acceptedTerms ?? false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  function updateValue(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    registration.reset()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    if (!values.businessName.trim()) nextErrors.businessName = 'Business name is required.'
    if (!values.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if (!values.email.trim()) nextErrors.email = 'Business email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Enter a valid business email.'
    if (!values.password) nextErrors.password = 'Password is required.'
    else if (!/(?=.*[A-Za-z])(?=.*\d).{8,}/.test(values.password)) nextErrors.password = 'Use at least 8 characters, including a letter and number.'
    if (!acceptedTerms) nextErrors.terms = 'Please agree to the terms to continue.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSignupDraft({
      businessName: values.businessName.trim(),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
    })

    try {
      await registration.mutateAsync({
        businessName: values.businessName.trim(),
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      navigate('/onboarding/business', {
        state: { registrationComplete: true },
      })
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4">
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-[#344344]" htmlFor="business-name">Business name</label>
          <input className={inputClass(Boolean(errors.businessName))} id="business-name" type="text" autoComplete="organization" placeholder="Your business name" value={values.businessName} onChange={(event) => updateValue('businessName', event.target.value)} aria-invalid={Boolean(errors.businessName)} aria-describedby={errors.businessName ? 'business-name-error' : undefined} />
          {errors.businessName && <p className="mt-1.5 text-xs text-[#b34f55]" id="business-name-error">{errors.businessName}</p>}
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-semibold text-[#344344]" htmlFor="full-name">Full name</label>
          <input className={inputClass(Boolean(errors.fullName))} id="full-name" type="text" autoComplete="name" placeholder="Your full name" value={values.fullName} onChange={(event) => updateValue('fullName', event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'full-name-error' : undefined} />
          {errors.fullName && <p className="mt-1.5 text-xs text-[#b34f55]" id="full-name-error">{errors.fullName}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-[13px] font-semibold text-[#344344]" htmlFor="signup-email">Business email</label>
          <input className={inputClass(Boolean(errors.email))} id="signup-email" type="email" autoComplete="email" placeholder="you@company.com" value={values.email} onChange={(event) => updateValue('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'signup-email-error' : undefined} />
          {errors.email && <p className="mt-1.5 text-xs text-[#b34f55]" id="signup-email-error">{errors.email}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-[13px] font-semibold text-[#344344]" htmlFor="signup-password">Password</label>
          <div className="relative">
            <input className={`${inputClass(Boolean(errors.password))} pr-12`} id="signup-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a password" value={values.password} onChange={(event) => updateValue('password', event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'signup-password-error' : undefined} />
            <button className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#899590] hover:bg-[#eff3f0] hover:text-[#42674f]" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-[#b34f55]" id="signup-password-error">{errors.password}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-2 text-xs leading-5 text-[#6d7974]" htmlFor="terms">
          <input className="mt-0.5 size-4 shrink-0 rounded border-[#cbd6d0] accent-[#234d3c]" id="terms" type="checkbox" checked={acceptedTerms} onChange={(event) => { setAcceptedTerms(event.target.checked); if (errors.terms) setErrors((current) => ({ ...current, terms: undefined })) }} aria-invalid={Boolean(errors.terms)} aria-describedby={errors.terms ? 'terms-error' : undefined} />
          <span>I agree to the <a className="font-semibold text-[#416d54] hover:underline" href="#terms-and-conditions">Terms of Service</a> and consent to collections-related processing.</span>
        </label>
        {errors.terms && <p className="mt-1.5 text-xs text-[#b34f55]" id="terms-error">{errors.terms}</p>}
      </div>

      {registration.error && (
        <p className="mt-4 rounded-lg border border-[#efc7c5] bg-[#fff4f3] px-3 py-2 text-sm text-[#9c3d42]" role="alert">
          {registration.error.message}
        </p>
      )}

      <button className="mt-5 h-12 w-full rounded-[9px] bg-[#193452] text-sm font-semibold text-white shadow-[0_7px_18px_rgba(24,59,54,0.18)] transition hover:bg-[#102f2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527f6a] disabled:cursor-wait disabled:opacity-70" type="submit" disabled={registration.isPending}>
        {registration.isPending ? 'Creating account...' : 'Create account & continue'}
      </button>

      <p className="mt-6 text-center text-sm text-[#77827d]">
        Already have an account?{' '}
        <Link className="font-semibold text-[#416d54] hover:underline" to="/login">Sign in</Link>
      </p>
    </form>
  )
}
