import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateDebtor } from '../../features/debtors/hooks/useCreateDebtor.ts'
import type { NewDebtor } from '../../features/debtors/types.ts'

type Props = {
  onClose: () => void
}

type FormValues = {
  name: string
  type: 'Business' | 'Individual'
  contactName: string
  email: string
  phone: string
  address: string
  registrationNumber: string
}

const initialValues: FormValues = {
  name: '',
  type: 'Business',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  registrationNumber: '',
}

const fieldClass =
  'mt-1.5 h-10 w-full rounded-lg border border-[#e1e7ed] bg-white px-3 text-xs text-[#263e58] outline-none placeholder:text-[#9aa8b6] focus:border-[#65b883] focus:ring-4 focus:ring-[#65b883]/10'
const labelClass = 'text-[11px] font-semibold text-[#52657a]'

export function CreateDebtorDialog({ onClose }: Props) {
  const navigate = useNavigate()
  const createDebtor = useCreateDebtor()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>(
    {},
  )

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    createDebtor.reset()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof FormValues, string>> = {}
    const requiredFields: Array<keyof FormValues> = [
      'name',
      'contactName',
      'email',
      'phone',
      'address',
    ]

    for (const field of requiredFields) {
      if (!values[field].trim()) {
        nextErrors[field] = 'This field is required.'
      }
    }

    if (
      values.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
    ) {
      nextErrors.email = 'Enter a valid email address.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const input: NewDebtor = {
      name: values.name,
      type: values.type,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      registrationNumber: values.registrationNumber,
    }

    createDebtor.mutate(input, {
      onSuccess: (debtor) => {
        onClose()
        navigate(`/debtors/${debtor.id}`)
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0b1c2f]/50 p-0 sm:items-center sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget && !createDebtor.isPending) {
          onClose()
        }
      }}
    >
      <section
        aria-labelledby="create-debtor-title"
        aria-modal="true"
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#edf0f3] px-5 py-4 sm:px-6">
          <div>
            <h2
              className="text-base font-semibold text-[#20354d]"
              id="create-debtor-title"
            >
              Add debtor
            </h2>
            <p className="mt-1 text-[11px] text-[#8090a1]">
              Add a business or individual to your mock debtor directory.
            </p>
          </div>
          <button
            aria-label="Close add debtor dialog"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-[#718398] hover:bg-[#f1f4f7]"
            disabled={createDebtor.isPending}
            onClick={onClose}
            type="button"
          >
            <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
          </button>
        </div>

        <form className="space-y-4 px-5 py-5 sm:px-6" noValidate onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="debtor-type">Debtor type</label>
              <select
                className={fieldClass}
                id="debtor-type"
                onChange={(event) =>
                  updateField(
                    'type',
                    event.target.value === 'Individual' ? 'Individual' : 'Business',
                  )
                }
                value={values.type}
              >
                <option>Business</option>
                <option>Individual</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="debtor-name">Business or individual name</label>
              <input
                aria-invalid={Boolean(errors.name)}
                className={fieldClass}
                id="debtor-name"
                onChange={(event) => updateField('name', event.target.value)}
                value={values.name}
              />
              {errors.name && <p className="mt-1 text-[10px] text-[#bd4147]">{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="debtor-contact">Contact person</label>
              <input
                aria-invalid={Boolean(errors.contactName)}
                className={fieldClass}
                id="debtor-contact"
                onChange={(event) => updateField('contactName', event.target.value)}
                value={values.contactName}
              />
              {errors.contactName && <p className="mt-1 text-[10px] text-[#bd4147]">{errors.contactName}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="debtor-email">Email address</label>
              <input
                aria-invalid={Boolean(errors.email)}
                className={fieldClass}
                id="debtor-email"
                onChange={(event) => updateField('email', event.target.value)}
                type="email"
                value={values.email}
              />
              {errors.email && <p className="mt-1 text-[10px] text-[#bd4147]">{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="debtor-phone">Phone number</label>
              <input
                aria-invalid={Boolean(errors.phone)}
                className={fieldClass}
                id="debtor-phone"
                onChange={(event) => updateField('phone', event.target.value)}
                type="tel"
                value={values.phone}
              />
              {errors.phone && <p className="mt-1 text-[10px] text-[#bd4147]">{errors.phone}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="debtor-registration">Registration number <span className="font-normal text-[#8594a4]">(optional)</span></label>
              <input
                className={fieldClass}
                id="debtor-registration"
                onChange={(event) => updateField('registrationNumber', event.target.value)}
                value={values.registrationNumber}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="debtor-address">Address</label>
              <input
                aria-invalid={Boolean(errors.address)}
                className={fieldClass}
                id="debtor-address"
                onChange={(event) => updateField('address', event.target.value)}
                value={values.address}
              />
              {errors.address && <p className="mt-1 text-[10px] text-[#bd4147]">{errors.address}</p>}
            </div>
          </div>

          <p className="rounded-lg bg-[#fff8e9] px-3 py-2.5 text-[10px] leading-4 text-[#866b35]">
            Debtors are saved in this browser session only. No information is sent to the backend.
          </p>
          {createDebtor.isError && (
            <p className="text-xs text-[#bd4147]" role="alert">
              {createDebtor.error.message}
            </p>
          )}
          <div className="flex justify-end gap-2 border-t border-[#edf0f3] pt-4">
            <button
              className="h-10 rounded-lg border border-[#dfe5eb] px-4 text-xs font-medium text-[#52657a] hover:bg-[#f8fafc]"
              disabled={createDebtor.isPending}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-10 rounded-lg bg-[#193452] px-5 text-xs font-semibold text-white hover:bg-[#122943] disabled:cursor-wait disabled:opacity-60"
              disabled={createDebtor.isPending}
              type="submit"
            >
              {createDebtor.isPending ? 'Adding debtor…' : 'Add debtor'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
