import {
  emptyDebtorBehaviour,
  emptyDebtorReminderHistory,
  mockDebtors,
} from '../data/mockDebtors.ts'
import type {
  Debtor,
  DebtorNote,
  DebtorSummary,
  NewDebtor,
} from '../types.ts'

const CREATED_DEBTORS_KEY = 'credence.mock-debtors.v1'
const DEBTOR_NOTES_KEY = 'credence.mock-debtor-notes.v1'
const debtorCreditStatuses = [
  'Partially paid',
  'Overdue',
  'Settled',
  'Active',
  'Pending',
]

type StoredDebtorNote = {
  debtorId: string
  note: DebtorNote
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNote(value: unknown): value is DebtorNote {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.text === 'string' &&
    typeof value.createdAt === 'string'
  )
}

function isStoredDebtorNote(value: unknown): value is StoredDebtorNote {
  return (
    isRecord(value) &&
    typeof value.debtorId === 'string' &&
    isNote(value.note)
  )
}

function isDebtor(value: unknown): value is Debtor {
  if (
    !isRecord(value) ||
    !Array.isArray(value.credits) ||
    !Array.isArray(value.communications)
  ) {
    return false
  }

  const behaviour = value.repaymentBehaviour
  const reminders = value.reminderHistory
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.type === 'Business' || value.type === 'Individual') &&
    typeof value.contactName === 'string' &&
    typeof value.email === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.address === 'string' &&
    (value.registrationNumber === undefined ||
      typeof value.registrationNumber === 'string') &&
    (value.onTimeRate === null || typeof value.onTimeRate === 'number') &&
    ['Good standing', 'Watch', 'At risk', 'New'].includes(String(value.status)) &&
    value.credits.every(
      (credit) =>
        isRecord(credit) &&
        typeof credit.id === 'string' &&
        typeof credit.reference === 'string' &&
        typeof credit.invoiceReference === 'string' &&
        typeof credit.amount === 'number' &&
        typeof credit.paid === 'number' &&
        typeof credit.issuedAt === 'string' &&
        typeof credit.dueAt === 'string' &&
        typeof credit.status === 'string' &&
        debtorCreditStatuses.includes(credit.status) &&
        (credit.paymentNote === undefined ||
          typeof credit.paymentNote === 'string'),
    ) &&
    value.communications.every(
      (communication) =>
        isRecord(communication) &&
        typeof communication.id === 'string' &&
        (communication.kind === 'Reminder' ||
          communication.kind === 'Response') &&
        (communication.channel === 'Email' ||
          communication.channel === 'WhatsApp') &&
        typeof communication.occurredAt === 'string' &&
        typeof communication.message === 'string' &&
        (communication.commitment === undefined ||
          typeof communication.commitment === 'string'),
    ) &&
    Array.isArray(value.notes) &&
    value.notes.every(isNote) &&
    isRecord(behaviour) &&
    typeof behaviour.onTimePayments === 'number' &&
    typeof behaviour.latePayments === 'number' &&
    typeof behaviour.averageDelayDays === 'number' &&
    typeof behaviour.missedCommitments === 'number' &&
    typeof behaviour.partialPayments === 'number' &&
    typeof behaviour.disputed === 'number' &&
    isRecord(reminders) &&
    typeof reminders.sent === 'number' &&
    typeof reminders.scheduled === 'number' &&
    typeof reminders.nextReminder === 'string' &&
    typeof reminders.deliveredRate === 'number' &&
    typeof reminders.responded === 'number'
  )
}

function readCreatedDebtors(): Debtor[] {
  if (typeof window === 'undefined') {
    return []
  }

  const stored = window.sessionStorage.getItem(CREATED_DEBTORS_KEY)
  if (!stored) {
    return []
  }

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isDebtor)) {
    throw new Error('Stored mock debtors have an invalid format.')
  }
  return parsed
}

function writeCreatedDebtors(debtors: Debtor[]) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(CREATED_DEBTORS_KEY, JSON.stringify(debtors))
  }
}

function readStoredNotes(): StoredDebtorNote[] {
  if (typeof window === 'undefined') {
    return []
  }

  const stored = window.sessionStorage.getItem(DEBTOR_NOTES_KEY)
  if (!stored) {
    return []
  }

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isStoredDebtorNote)) {
    throw new Error('Stored mock debtor notes have an invalid format.')
  }

  return parsed
}

function readNotesForDebtor(debtorId: string): DebtorNote[] {
  return readStoredNotes()
    .filter((entry) => entry.debtorId === debtorId)
    .map((entry) => entry.note)
}

function waitForMockResponse() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 180)
  })
}

function withStoredNotes(debtor: Debtor): Debtor {
  return {
    ...debtor,
    notes: [...debtor.notes, ...readNotesForDebtor(debtor.id)].sort(
      (left, right) => right.createdAt.localeCompare(left.createdAt),
    ),
  }
}

function getAllDebtors() {
  return [...mockDebtors, ...readCreatedDebtors()]
}

export function getDebtorSummary(debtor: Debtor): DebtorSummary {
  const extendedAmount = debtor.credits.reduce(
    (sum, credit) => sum + credit.amount,
    0,
  )
  const repaidAmount = debtor.credits.reduce(
    (sum, credit) => sum + credit.paid,
    0,
  )
  const outstandingAmount = extendedAmount - repaidAmount
  const activeTransactions = debtor.credits.filter(
    (credit) => credit.status !== 'Settled',
  ).length
  const overdueAmount = debtor.credits
    .filter((credit) => credit.status === 'Overdue')
    .reduce((sum, credit) => sum + credit.amount - credit.paid, 0)

  return {
    extendedAmount,
    repaidAmount,
    outstandingAmount,
    activeTransactions,
    overdueAmount,
  }
}

export async function listDebtors(): Promise<Debtor[]> {
  await waitForMockResponse()
  return getAllDebtors().map(withStoredNotes)
}

export async function getDebtor(
  debtorId: string,
): Promise<Debtor | null> {
  await waitForMockResponse()
  const debtor = getAllDebtors().find((item) => item.id === debtorId)
  return debtor ? withStoredNotes(debtor) : null
}

export async function createDebtor(input: NewDebtor): Promise<Debtor> {
  await waitForMockResponse()
  const name = input.name.trim()
  const contactName = input.contactName.trim()
  const email = input.email.trim().toLowerCase()
  const phone = input.phone.trim()
  const address = input.address.trim()

  if (!name || !contactName || !email || !phone || !address) {
    throw new Error('Complete all required debtor details.')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Enter a valid email address.')
  }
  if (getAllDebtors().some((debtor) => debtor.email.toLowerCase() === email)) {
    throw new Error('A debtor with this email address already exists.')
  }

  const debtor: Debtor = {
    id: `mock-debtor-${crypto.randomUUID()}`,
    name,
    type: input.type,
    contactName,
    email,
    phone,
    address,
    ...(input.registrationNumber?.trim()
      ? { registrationNumber: input.registrationNumber.trim() }
      : {}),
    onTimeRate: null,
    status: 'New',
    credits: [],
    communications: [],
    notes: [],
    repaymentBehaviour: { ...emptyDebtorBehaviour },
    reminderHistory: { ...emptyDebtorReminderHistory },
  }

  const createdDebtors = readCreatedDebtors()
  writeCreatedDebtors([...createdDebtors, debtor])
  return debtor
}

export async function addDebtorNote(
  debtorId: string,
  text: string,
): Promise<Debtor> {
  await waitForMockResponse()
  const trimmedText = text.trim()
  if (!trimmedText) {
    throw new Error('Enter a note before saving.')
  }

  const debtor = getAllDebtors().find((item) => item.id === debtorId)
  if (!debtor) {
    throw new Error('The selected debtor could not be found.')
  }

  const newNote: DebtorNote = {
    id: `mock-note-${crypto.randomUUID()}`,
    text: trimmedText,
    createdAt: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(
      DEBTOR_NOTES_KEY,
      JSON.stringify([
        ...readStoredNotes(),
        { debtorId, note: newNote },
      ]),
    )
  }

  return withStoredNotes(debtor)
}
