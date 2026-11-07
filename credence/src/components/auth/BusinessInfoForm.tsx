import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { SignupValues } from './SignupForm.tsx'

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

type BusinessInfo = {
  category: string
  otherCategory: string
  phoneNumber: string
  registrationNumber: string
  address: string
}

type FormErrors = {
  category?: string
  otherCategory?: string
  registrationNumber?: string
}

const inputClass = (error: boolean) =>
  `h-12 w-full rounded-[9px] border bg-white px-4 text-sm text-[#203333] outline-none transition placeholder:text-[#a7b0ad] focus:border-[#527f6a] focus:ring-4 focus:ring-[#527f6a]/10 ${
    error ? 'border-[#c66b68]' : 'border-[#dce3df]'
  }`

const textareaClass =
  'min-h-28 w-full resize-y rounded-[9px] border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#203333] outline-none transition placeholder:text-[#a7b0ad] focus:border-[#527f6a] focus:ring-4 focus:ring-[#527f6a]/10'

export function BusinessInfoForm() {
  const navigate = useNavigate()
  const location = useLocation()

  const signupValues = (
    location.state as { signupValues?: SignupValues } | null
  )?.signupValues

  const [values, setValues] = useState<BusinessInfo>({
    category: '',
    otherCategory: '',
    phoneNumber: '',
    registrationNumber: '',
    address: '',
  })

  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedLabel =
    categories.find(([value]) => value === values.category)?.[1] ?? ''

  const filteredCategories = useMemo(
    () =>
      categories.filter(([, label]) =>
        label.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  )

  function updateValue(field: keyof BusinessInfo, value: string) {
    setValues((current) => ({ ...current, [field]: value }))

    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {}

    if (!values.category)
      nextErrors.category = 'Choose a business category.'

    if (
      values.category === 'other' &&
      !values.otherCategory.trim()
    )
      nextErrors.otherCategory = 'Specify your business category.'

    if (
      values.registrationNumber &&
      !/^[A-Za-z0-9\s-]+$/.test(values.registrationNumber)
    )
      nextErrors.registrationNumber = 'Enter a valid registration number.'

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    window.setTimeout(() => setIsSubmitting(false), 900)
  }

  return (
    <form className="w-full" onSubmit={handleSubmit} noValidate>
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#527f6a]">
          Step 2 of 2
        </p>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#dce3df]">
          <div className="h-full w-full rounded-full bg-[#527f6a]" />
        </div>
      </div>

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
            value={isOpen ? search : selectedLabel}
            onFocus={() => {
              setIsOpen(true)
              setSearch('')
            }}
            onChange={(event) => {
              setSearch(event.target.value)
              setValues((current) => ({ ...current, category: '' }))
            }}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="business-category-options"
            aria-invalid={Boolean(errors.category)}
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
                    onClick={() => {
                      updateValue('category', value)
                      setSearch('')
                      setIsOpen(false)
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
            <p className="mt-1.5 text-xs text-[#b34f55]">
              {errors.category}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label
            className="mb-2 block text-[13px] font-semibold text-[#344344]"
            htmlFor="business-phone"
          >
            Phone number
          </label>

          <input
            className={inputClass(false)}
            id="business-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+234 800 000 0000"
            value={values.phoneNumber}
            onChange={(event) =>
              updateValue('phoneNumber', event.target.value)
            }
          />
        </div>

        {/* Other Business Category */}
        {values.category === 'other' && (
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
              placeholder="Describe your category"
              value={values.otherCategory}
              onChange={(event) =>
                updateValue('otherCategory', event.target.value)
              }
            />

            {errors.otherCategory && (
              <p className="mt-1.5 text-xs text-[#b34f55]">
                {errors.otherCategory}
              </p>
            )}
          </div>
        )}

        {/* Registration Number */}
        <div className="sm:col-span-2">
          <label
            className="mb-2 block text-[13px] font-semibold text-[#344344]"
            htmlFor="business-registration"
          >
            Registration Number{' '}
            <span className="font-normal text-[#899590]">(optional)</span>
          </label>

          <input
            className={inputClass(Boolean(errors.registrationNumber))}
            id="business-registration"
            type="text"
            placeholder="RC 1842204 - e.g. CAC number"
            value={values.registrationNumber}
            onChange={(event) =>
              updateValue('registrationNumber', event.target.value)
            }
            aria-invalid={Boolean(errors.registrationNumber)}
          />

          {errors.registrationNumber && (
            <p className="mt-1.5 text-xs text-[#b34f55]">
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
            className={textareaClass}
            id="business-address"
            placeholder="Enter your business address"
            rows={4}
            value={values.address}
            onChange={(event) =>
              updateValue('address', event.target.value)
            }
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          className="h-12 rounded-[9px] border border-[#cbd6d0] px-6 text-sm font-semibold text-[#416d54] transition hover:bg-[#eff3f0]"
          type="button"
          onClick={() =>
            navigate('/signup', { state: { signupValues } })
          }
        >
          Back
        </button>

        <button
          className="h-12 flex-1 rounded-[9px] bg-[#193452] px-6 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(25,52,82,0.18)] transition hover:bg-[#122943] disabled:cursor-wait disabled:opacity-70 sm:max-w-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Complete setup'}
        </button>
      </div>
    </form>
  )
}
