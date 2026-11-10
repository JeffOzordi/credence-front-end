import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { BusinessInfo } from '../services/api/types.ts'

export type SignupDraft = {
  businessName: string
  fullName: string
  email: string
}

export type BusinessDraft = Omit<BusinessInfo, 'otherCategory'> & {
  otherCategory: string
}

type OnboardingDraftContextValue = {
  signupDraft: SignupDraft
  businessDraft: BusinessDraft
  setSignupDraft: (draft: SignupDraft) => void
  setBusinessDraft: (draft: BusinessDraft) => void
}

const OnboardingDraftContext =
  createContext<OnboardingDraftContextValue | null>(null)

const emptySignupDraft: SignupDraft = {
  businessName: '',
  fullName: '',
  email: '',
}

const emptyBusinessDraft: BusinessDraft = {
  category: '',
  otherCategory: '',
  phoneNumber: '',
  registrationNumber: '',
  address: '',
}

export function OnboardingDraftProvider({ children }: PropsWithChildren) {
  const [signupDraft, setSignupDraft] = useState(emptySignupDraft)
  const [businessDraft, setBusinessDraft] = useState(emptyBusinessDraft)
  const value = useMemo(
    () => ({ signupDraft, businessDraft, setSignupDraft, setBusinessDraft }),
    [signupDraft, businessDraft],
  )

  return (
    <OnboardingDraftContext.Provider value={value}>
      {children}
    </OnboardingDraftContext.Provider>
  )
}

export function useOnboardingDraft() {
  const context = useContext(OnboardingDraftContext)
  if (!context) {
    throw new Error(
      'useOnboardingDraft must be used within OnboardingDraftProvider.',
    )
  }
  return context
}
