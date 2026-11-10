import { useMemo, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompleteBusinessOnboarding } from '../../features/onboarding/hooks/useCompleteBusinessOnboarding.ts'
import { useOnboardingDraft } from '../../providers/OnboardingDraftProvider.tsx'

const categories = [
  ['financial_services', 'Banking & Financial Services'],
  ['microfinance', 'Microfinance'],
  ['digital_lending', 'Fintech & Digital Lending'],
  ['cooperatives', 'Cooperatives & Credit Unions'],
  ['wholesale_distribution', 'Wholesale & Distribution'],
  ['manufacturing', 'Manufacturing'],
  ['retail_ecommerce', 'Retail & E-commerce'],
  ['education', 'Education'],
  ['healthcare', 'Healthcare'],
  ['real_estate', 'Real Estate & Property Management'],
  ['logistics_transportation', 'Logistics & Transportation'],
  ['equipment_leasing', 'Equipment Leasing & Rentals'],
  ['agriculture', 'Agriculture & Agribusiness'],
  ['professional_services', 'Professional Services'],
  ['utilities_telecommunications', 'Utilities & Telecommunications'],
  ['other', 'Other'],
] as const

type FormErrors = {
  category?: string
  otherCategory?: string
  phoneNumber?: string
  registrationNumber?: string
  address?: string
}

const inputClass = (hasError: boolean) =>
  `h-12 w-full rounded-[9px] border bg-white px-4 text-sm text-[#203333] outline-none transition placeholder:text-[#a7b0ad] focus:border-[#527f6a] focus:ring-4 focus:ring-[#527f6a]/10 ${
    hasError ? 'border-[#c66b68]' : 'border-[#dce3df]'
  }`

export function BusinessInfoForm() {
  const navigate = useNavigate()
  const { businessDraft, setBusinessDraft } = useOnboardingDraft()
  const onboarding = useCompleteBusinessOnboarding()

  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const selectedLabel =
    categories.find(([value]) => value === businessDraft.category)?.[1] ?? ''

  const filteredCategories = useMemo(
    () =>
      categories.filter(([, label]) =>
        label.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  )

  function updateDraft(
    field: keyof typeof businessDraft,
    value: string,
  ) {
    setBusinessDraft({ ...businessDraft, [field]: value })
    setErrors((current) => ({ ...current, [field]: undefined }))
    onboarding.reset()
  }

  function handleCategoryKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Escape') setIsOpen(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {}

    if (!businessDraft.category) {
      nextErrors.category = 'Choose a business category.'
    }

    if (
      businessDraft.category === 'other' &&
      !businessDraft.otherCategory.trim()
    ) {
      nextErrors.otherCategory = 'Please specify your business category.'
    }

    if (!businessDraft.phoneNumber.trim()) {
      nextErrors.phoneNumber = 'Enter your business phone number.'
    }

    if (!businessDraft.registrationNumber.trim()) {
      nextErrors.registrationNumber =
        'Enter your business registration number.'
    }

    if (!businessDraft.address.trim()) {
      nextErrors.address = 'Enter your business address.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      await onboarding.mutateAsync({
        category: businessDraft.category,
        ...(businessDraft.category === 'other'
          ? { otherCategory: businessDraft.otherCategory.trim() }
          : {}),
        phoneNumber: businessDraft.phoneNumber.trim(),
        registrationNumber: businessDraft.registrationNumber.trim(),
        address: businessDraft.address.trim(),
      })

      navigate('/overview', { state: { setupCompleted: true } })
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4">

        {/* Business Category */}
        <div className="relative">
          <label
            className="mb-2 block text-[13px] font-semibold text-[#344344]"
            htmlFor="business-category"
          >
            Business category
          </label>

          <input
            className={inputClass(Boolean(errors.category))}
            id="business-category"
            placeholder="Search or select a category"
            required
            value={isOpen ? search : selectedLabel}
            onFocus={() => {
              setIsOpen(true)
              setSearch('')
            }}
            onChange={(event) => {
              setSearch(event.target.value)
              if (businessDraft.category) {
                setBusinessDraft({
                  ...businessDraft,
                  category: '',
                })
              }
            }}
            onKeyDown={handleCategoryKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="business-category-options"
            aria-autocomplete="list"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? 'category-error' : undefined
            }
          />

          {isOpen && (
            <div
              className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-[#dce3df] bg-white py-1 shadow-lg"
              id="business-category-options"
              role="listbox"
            >
              {filteredCategories.length > 0 ? (
                filteredCategories.map(([value, label]) => (
                  <button
                    className="block w-full px-4 py-2.5 text-left text-sm text-[#344344] hover:bg-[#eff5f0]"
                    key={value}
                    type="button"
                    role="option"
                    aria-selected={businessDraft.category === value}
                    onClick={() => {
                      setBusinessDraft({
                        ...businessDraft,
                        category: value,
                        otherCategory:
                          value === 'other'
                            ? businessDraft.otherCategory
                            : '',
                      })

                      setErrors((current) => ({
                        ...current,
                        category: undefined,
                        otherCategory: undefined,
                      }))

                      setSearch('')
                      setIsOpen(false)
                      onboarding.reset()
                    }}
                  >
                    {label}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-[#74807b]">
                  No matching category.
                </p>
              )}
            </div>
          )}

          {errors.category && (
            <p className="mt-1.5 text-xs text-[#b34f55]" id="category-error">
              {errors.category}
            </p>
          )}
        </div>

        {/* Business Phone Number */}
        <div>
          <label
            className="mb-2 block text-[13px] font-semibold text-[#344344]"
            htmlFor="business-phone-number"
          >
            Business phone number
          </label>

          <input
            className={inputClass(Boolean(errors.phoneNumber))}
            id="business-phone-number"
            type="tel"
            autoComplete="tel"
            placeholder="+234 800 000 0000"
            required
            value={businessDraft.phoneNumber}
            onChange={(event) =>
              updateDraft('phoneNumber', event.target.value)
            }
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={
              errors.phoneNumber
                ? 'business-phone-number-error'
                : undefined
            }
          />

          {errors.phoneNumber && (
            <p
              className="mt-1.5 text-xs text-[#b34f55]"
              id="business-phone-number-error"
            >
              {errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Other Business Category */}
        {businessDraft.category === 'other' && (
          <div className="sm:col-span-2">
            <label
              className="mb-2 block text-[13px] font-semibold text-[#344344]"
              htmlFor="other-category"
            >
              Your business category
            </label>

            <input
              className={inputClass(Boolean(errors.otherCategory))}
              id="other-category"
              placeholder="Describe your business category"
              required
              value={businessDraft.otherCategory}
              onChange={(event) =>
                updateDraft('otherCategory', event.target.value)
              }
              aria-invalid={Boolean(errors.otherCategory)}
              aria-describedby={
                errors.otherCategory
                  ? 'other-category-error'
                  : undefined
              }
            />

            {errors.otherCategory && (
              <p
                className="mt-1.5 text-xs text-[#b34f55]"
                id="other-category-error"
              >
                {errors.otherCategory}
              </p>
            )}
          </div>
        )}

        {/* Business Registration Number */}
        <div className="sm:col-span-2">
          <label
            className="mb-2 block text-[13px] font-semibold text-[#344344]"
            htmlFor="business-registration-number"
          >
            Business registration number
          </label>

          <input
            className={inputClass(Boolean(errors.registrationNumber))}
            id="business-registration-number"
            placeholder="Enter your business registration number"
            required
            value={businessDraft.registrationNumber}
            onChange={(event) =>
              updateDraft('registrationNumber', event.target.value)
            }
            aria-invalid={Boolean(errors.registrationNumber)}
            aria-describedby={
              errors.registrationNumber
                ? 'business-registration-number-error'
                : undefined
            }
          />

          {errors.registrationNumber && (
            <p
              className="mt-1.5 text-xs text-[#b34f55]"
              id="business-registration-number-error"
            >
              {errors.registrationNumber}
            </p>
          )}
        </div>

        {/* Business Address */}
        <div className="sm:col-span-2">
          <label
            className="mb-2 block text-[13px] font-semibold text-[#344344]"
            htmlFor="business-address"
          >
            Business address
          </label>

          <textarea
            className={`min-h-28 w-full resize-y rounded-[9px] border bg-white px-4 py-3 text-sm text-[#203333] outline-none transition placeholder:text-[#a7b0ad] focus:border-[#527f6a] focus:ring-4 focus:ring-[#527f6a]/10 ${
              errors.address
                ? 'border-[#c66b68]'
                : 'border-[#dce3df]'
            }`}
            id="business-address"
            placeholder="Enter your business address"
            required
            rows={3}
            value={businessDraft.address}
            onChange={(event) =>
              updateDraft('address', event.target.value)
            }
            aria-invalid={Boolean(errors.address)}
            aria-describedby={
              errors.address ? 'business-address-error' : undefined
            }
          />

          {errors.address && (
            <p
              className="mt-1.5 text-xs text-[#b34f55]"
              id="business-address-error"
            >
              {errors.address}
            </p>
          )}
        </div>
      </div>

      {/* API Error */}
      {onboarding.error && (
        <p
          className="mt-4 rounded-lg border border-[#efc7c5] bg-[#fff4f3] px-3 py-2 text-sm text-[#9c3d42]"
          role="alert"
        >
          {onboarding.error.message}
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          className="h-12 rounded-[9px] border border-[#cbd6d0] px-6 text-sm font-semibold text-[#416d54] transition hover:bg-[#eff3f0]"
          type="button"
          onClick={() => navigate('/signup')}
        >
          Back
        </button>

        <button
          className="h-12 flex-1 rounded-[9px] bg-[#193452] px-6 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(25,52,82,0.18)] transition hover:bg-[#122943] disabled:cursor-wait disabled:opacity-70 sm:max-w-60"
          type="submit"
          disabled={onboarding.isPending}
        >
          {onboarding.isPending
            ? 'Completing setup...'
            : 'Complete setup'}
        </button>
      </div>
    </form>
  )
}
