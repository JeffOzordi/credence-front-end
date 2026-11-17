import type { ReactNode } from 'react'
import { ApiRequestError } from '../../services/api/interceptors.ts'
import type { BusinessCategory } from '../../services/api/types.ts'
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

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[#74869a]">{label}</dt>
      <dd className="mt-2 min-h-11 break-words rounded-lg border border-[#e5eaf0] bg-[#f8fafc] px-3.5 py-3 text-sm text-[#20354d]">
        {value}
      </dd>
    </div>
  )
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

export function SettingsPage() {
  const profile = useCurrentBusiness()

  if (profile.isPending) {
    return (
      <div aria-label="Loading business profile" className="mx-auto max-w-4xl space-y-5" role="status">
        <span className="sr-only">Loading business profile…</span>
        {[0, 1].map((section) => (
          <div className="animate-pulse rounded-xl border border-[#e5eaf0] bg-white p-5" key={section}>
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

  if (profile.isError) {
    return (
      <section className="mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border border-[#f0d1cf] bg-white px-6 text-center">
        <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#fff0ef] text-xl text-[#bd4147]">!</span>
        <h2 className="mt-4 text-base font-semibold text-[#20354d]">We couldn’t load your business details</h2>
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
        <h2 className="text-base font-semibold text-[#20354d]">Business details unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-[#74869a]">
          No business profile was returned for this account.
        </p>
      </section>
    )
  }

  const business = profile.data
  const category =
    categoryLabels[business.category] ??
    business.category.replaceAll('_', ' ')

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#20354d]">Business profile</h2>
        <p className="mt-1 text-sm leading-6 text-[#74869a]">
          Your registered business details. Contact support if any information needs to be updated.
        </p>
      </div>

      <ProfileSection title="Business information">
        <ProfileField label="Business name" value={business.name} />
        <ProfileField label="Business registration number" value={business.registration_number} />
        <ProfileField label="Business category" value={category} />
      </ProfileSection>

      <ProfileSection title="Contact information">
        <ProfileField label="Email address" value={business.email} />
        <ProfileField label="Phone number" value={business.phone} />
        <ProfileField label="Business address" value={business.address} />
      </ProfileSection>
    </div>
  )
}
