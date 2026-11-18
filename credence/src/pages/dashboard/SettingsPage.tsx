import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ApiRequestError } from '../../services/api/interceptors.ts'
import type {
  BusinessCategory,
  CurrentBusiness,
} from '../../services/api/types.ts'
import { useCurrentBusiness } from '../../features/auth/hooks/useCurrentBusiness.ts'

const categoryLabels: Record<BusinessCategory, string> = {
  banking_financial_services: 'Banking & Financial Services',
  microfinance: 'Microfinance',
  fintech_digital_lending: 'Fintech & Digital Lending',
  cooperatives_credit_unions: 'Cooperatives & Credit Unions',
  wholesale_distribution: 'Wholesale & Distribution',
  manufacturing: 'Manufacturing',
  retail_ecommerce: 'Retail & E-commerce',
  education: 'Education',
  healthcare: 'Healthcare',
  real_estate_property_management: 'Real Estate & Property Management',
  logistics_transportation: 'Logistics & Transportation',
  equipment_leasing_rentals: 'Equipment Leasing & Rentals',
  agriculture_agribusiness: 'Agriculture & Agribusiness',
  professional_services: 'Professional Services',
  utilities_telecommunications: 'Utilities & Telecommunications',
  other: 'Other',
}

type BusinessDraft = Omit<CurrentBusiness, 'id'>
type EditableField = keyof BusinessDraft

const fields: Array<{
  key: EditableField
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'category'
}> = [
  { key: 'name', label: 'Business name', type: 'text' },
  {
    key: 'registration_number',
    label: 'Business registration number',
    type: 'text',
  },
  { key: 'category', label: 'Business category', type: 'category' },
  { key: 'email', label: 'Email address', type: 'email' },
  { key: 'phone', label: 'Phone number', type: 'tel' },
  { key: 'address', label: 'Business address', type: 'textarea' },
]

function toDraft(business: CurrentBusiness): BusinessDraft {
  return {
    name: business.name,
    email: business.email,
    phone: business.phone,
    address: business.address,
    registration_number: business.registration_number,
    category: business.category,
  }
}

function ProfileSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#e5eaf0] bg-white p-4 shadow-[0_2px_8px_rgba(28,53,79,0.025)] sm:p-6">
      <h2 className="text-sm font-semibold text-[#20354d]">{title}</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  )
}

function BusinessProfileField({
  field,
  value,
  editing,
  error,
  onChange,
}: {
  field: (typeof fields)[number]
  value: string
  editing: boolean
  error?: string
  onChange: (value: string) => void
}) {
  const controlClass = `mt-2 min-h-11 w-full rounded-lg border px-3.5 py-3 text-sm text-[#20354d] outline-none transition focus:border-[#527f6a] focus:ring-4 focus:ring-[#527f6a]/10 ${
    error ? 'border-[#c66b68]' : 'border-[#e5eaf0]'
  } ${editing ? 'bg-white' : 'bg-[#f8fafc]'}`

  return (
    <div className={`min-w-0 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
      {editing ? (
        <label
          className="text-xs font-medium text-[#74869a]"
          htmlFor={`business-${field.key}`}
        >
          {field.label}
        </label>
      ) : (
        <dt className="text-xs font-medium text-[#74869a]">{field.label}</dt>
      )}
      <dd>
        {!editing ? (
          <div className="mt-2 min-h-11 break-words rounded-lg border border-[#e5eaf0] bg-[#f8fafc] px-3.5 py-3 text-sm text-[#20354d]">
            {field.key === 'category'
              ? categoryLabels[value as BusinessCategory] ?? value
              : value}
          </div>
        ) : field.type === 'category' ? (
          <select
            aria-invalid={Boolean(error)}
            className={controlClass}
            id={`business-${field.key}`}
            onChange={(event) => onChange(event.target.value)}
            value={value}
          >
            <option value="">Select a category</option>
            {Object.entries(categoryLabels).map(([category, label]) => (
              <option key={category} value={category}>
                {label}
              </option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            aria-invalid={Boolean(error)}
            className={`${controlClass} min-h-24 resize-y`}
            id={`business-${field.key}`}
            onChange={(event) => onChange(event.target.value)}
            rows={3}
            value={value}
          />
        ) : (
          <input
            aria-invalid={Boolean(error)}
            className={controlClass}
            id={`business-${field.key}`}
            onChange={(event) => onChange(event.target.value)}
            type={field.type}
            value={value}
          />
        )}
      </dd>
      {error && (
        <p className="mt-1.5 text-xs text-[#b34f55]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function LoadingProfile() {
  return (
    <div
      aria-label="Loading business profile"
      className="mx-auto max-w-4xl space-y-5"
      role="status"
    >
      <span className="sr-only">Loading business profile…</span>
      {[0, 1].map((section) => (
        <div
          className="animate-pulse rounded-xl border border-[#e5eaf0] bg-white p-5"
          key={section}
        >
          <div className="h-4 w-40 rounded bg-[#e8edf2]" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[0, 1].map((field) => (
              <div className="h-16 rounded-lg bg-[#f0f3f6]" key={field} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const profile = useCurrentBusiness()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<BusinessDraft | null>(null)
  const [errors, setErrors] = useState<Partial<Record<EditableField, string>>>(
    {},
  )
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  if (profile.isPending) {
    return <LoadingProfile />
  }

  if (profile.isError) {
    return (
      <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#f0d1cf] bg-white px-6 text-center">
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-[#fff0ef] text-xl text-[#bd4147]"
        >
          !
        </span>
        <h2 className="mt-4 text-base font-semibold text-[#20354d]">
          We couldn’t load your business details
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          {profile.error instanceof ApiRequestError
            ? profile.error.message
            : 'Please check your connection and try again.'}
        </p>
        <button
          className="mt-5 h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white hover:bg-[#122943] disabled:opacity-60"
          disabled={profile.isFetching}
          onClick={() => void profile.refetch()}
          type="button"
        >
          {profile.isFetching ? 'Retrying…' : 'Try again'}
        </button>
      </section>
    )
  }

  if (!profile.data) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-[#e5eaf0] bg-white px-6 py-10 text-center">
        <h2 className="text-base font-semibold text-[#20354d]">
          Business details unavailable
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          No business profile was returned for this account.
        </p>
      </section>
    )
  }

  const business = profile.data
  const displayedDraft = draft ?? toDraft(business)

  function updateField(field: EditableField, value: string) {
    setDraft((current) => (current ? { ...current, [field]: value } : current))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSaveNotice(null)
  }

  function cancelEditing() {
    setDraft(toDraft(business))
    setErrors({})
    setSaveNotice(null)
    setEditing(false)
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const draftToValidate = draft ?? toDraft(business)
    const nextErrors: Partial<Record<EditableField, string>> = {}

    for (const field of fields) {
      if (!draftToValidate[field.key].trim()) {
        nextErrors[field.key] = `${field.label} is required.`
      }
    }

    if (
      draftToValidate.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draftToValidate.email.trim())
    ) {
      nextErrors.email = 'Enter a valid email address.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSaveNotice(null)
      return
    }

    setSaveNotice(
      'Editing is available, but changes cannot be saved yet. A business profile update endpoint is awaiting backend integration.',
    )
  }

  const businessInformation = fields.slice(0, 3)
  const contactInformation = fields.slice(3)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#20354d]">
          Business profile
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#74869a]">
          Your registered business details.
        </p>
      </div>

      <form className="space-y-5" noValidate onSubmit={handleSave}>
        <ProfileSection title="Business information">
          {businessInformation.map((field) => (
            <BusinessProfileField
              editing={editing}
              error={errors[field.key]}
              field={field}
              key={field.key}
              onChange={(value) => updateField(field.key, value)}
              value={displayedDraft[field.key]}
            />
          ))}
        </ProfileSection>

        <ProfileSection title="Contact information">
          {contactInformation.map((field) => (
            <BusinessProfileField
              editing={editing}
              error={errors[field.key]}
              field={field}
              key={field.key}
              onChange={(value) => updateField(field.key, value)}
              value={displayedDraft[field.key]}
            />
          ))}
        </ProfileSection>

        {saveNotice && (
          <p
            className="rounded-lg border border-[#f0dcae] bg-[#fff9e9] px-4 py-3 text-sm text-[#80611a]"
            role="status"
          >
            {saveNotice}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {editing ? (
            <>
              <button
                className="h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white hover:bg-[#122943]"
                type="submit"
              >
                Save changes
              </button>
              <button
                className="h-10 rounded-lg border border-[#cbd6d0] bg-white px-5 text-xs font-semibold text-[#416d54] hover:bg-[#eff3f0]"
                onClick={cancelEditing}
                type="button"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white hover:bg-[#122943]"
              onClick={() => {
                setErrors({})
                setSaveNotice(null)
                setDraft(toDraft(business))
                setEditing(true)
              }}
              type="button"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
