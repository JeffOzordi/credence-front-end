import { mockDebtors, mockTransactions } from '../data/mockTransactions.ts'
import { listDebtors as listMockDebtorRecords } from '../../debtors/services/debtorService.ts'
import type {
  CreditTransaction,
  NewCreditTransaction,
  TransactionTimelineEvent,
} from '../types.ts'

const CREATED_TRANSACTIONS_KEY = 'credence.mock-transactions.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStoredTransaction(value: unknown): value is CreditTransaction {
  if (!isRecord(value) || !isRecord(value.debtor)) {
    return false
  }

  const debtor = value.debtor
  const statusValues = [
    'Partially paid',
    'Overdue',
    'Settled',
    'Active',
    'Disputed',
    'Pending',
  ]

  return (
    typeof value.id === 'string' &&
    typeof value.reference === 'string' &&
    typeof value.invoiceReference === 'string' &&
    typeof value.amount === 'number' &&
    typeof value.paid === 'number' &&
    typeof value.transactionDate === 'string' &&
    typeof value.dueDate === 'string' &&
    typeof value.repaymentFrequency === 'string' &&
    typeof value.terms === 'string' &&
    Array.isArray(value.reminderSchedule) &&
    value.reminderSchedule.every((item) => typeof item === 'string') &&
    typeof value.status === 'string' &&
    statusValues.includes(value.status) &&
    Array.isArray(value.timeline) &&
    value.timeline.every(isTimelineEvent) &&
    typeof debtor.id === 'string' &&
    typeof debtor.name === 'string' &&
    typeof debtor.contactName === 'string' &&
    typeof debtor.phone === 'string' &&
    typeof debtor.email === 'string' &&
    typeof debtor.onTimeRate === 'number' &&
    typeof debtor.pastTransactionCount === 'number'
  )
}

function isTimelineEvent(value: unknown): value is TransactionTimelineEvent {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.occurredAt === 'string' &&
    typeof value.description === 'string'
  )
}

function readCreatedTransactions(): CreditTransaction[] {
  if (typeof window === 'undefined') {
    return []
  }

  const stored = window.sessionStorage.getItem(CREATED_TRANSACTIONS_KEY)
  if (!stored) {
    return []
  }

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isStoredTransaction)) {
    throw new Error('Stored mock transactions have an invalid format.')
  }

  return parsed
}

function writeCreatedTransactions(transactions: CreditTransaction[]) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(
      CREATED_TRANSACTIONS_KEY,
      JSON.stringify(transactions),
    )
  }
}

function waitForMockResponse() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 180)
  })
}

export async function listTransactions(): Promise<CreditTransaction[]> {
  await waitForMockResponse()
  return [...mockTransactions, ...readCreatedTransactions()]
}

export async function listMockDebtors() {
  await waitForMockResponse()
  const fullDebtors = await listMockDebtorRecords()
  const combined = new Map(mockDebtors.map((debtor) => [debtor.id, debtor]))
  for (const debtor of fullDebtors) {
    combined.set(debtor.id, {
      id: debtor.id,
      name: debtor.name,
      contactName: debtor.contactName,
      phone: debtor.phone,
      email: debtor.email,
      onTimeRate: debtor.onTimeRate ?? 0,
      pastTransactionCount: debtor.credits.length,
    })
  }
  return [...combined.values()]
}

export async function getTransaction(
  transactionId: string,
): Promise<CreditTransaction | null> {
  await waitForMockResponse()
  return (
    [...mockTransactions, ...readCreatedTransactions()].find(
      (transaction) => transaction.id === transactionId,
    ) ?? null
  )
}

export async function createTransaction(
  input: NewCreditTransaction,
): Promise<CreditTransaction> {
  await waitForMockResponse()

  const debtor = (await listMockDebtors()).find((record) => record.id === input.debtorId)
  if (!debtor) {
    throw new Error('Select a debtor from the available mock records.')
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('Transaction amount must be greater than zero.')
  }

  if (input.dueDate < input.transactionDate) {
    throw new Error('Repayment due date cannot be before the transaction date.')
  }

  const year = input.transactionDate.slice(0, 4)
  const latestReferenceNumber = [...mockTransactions, ...readCreatedTransactions()]
    .map((transaction) => {
      const match = transaction.reference.match(
        new RegExp(`^CRD-${year}-(\\d+)$`),
      )
      return match ? Number(match[1]) : 0
    })
    .reduce((latest, current) => Math.max(latest, current), 0)
  const reference = `CRD-${year}-${String(latestReferenceNumber + 1).padStart(4, '0')}`

  const transaction: CreditTransaction = {
    id: `mock-${crypto.randomUUID()}`,
    reference,
    invoiceReference: input.invoiceReference.trim(),
    debtor,
    amount: input.amount,
    paid: 0,
    transactionDate: input.transactionDate,
    dueDate: input.dueDate,
    repaymentFrequency: input.repaymentFrequency,
    terms: input.terms.trim(),
    reminderSchedule: input.reminderSchedule,
    status: 'Pending',
    timeline: [
      {
        id: `event-${crypto.randomUUID()}`,
        title: 'Transaction created',
        channel: 'System',
        occurredAt: new Date().toISOString(),
        description: 'Created in the Credence frontend mock transaction service.',
      },
    ],
  }

  const createdTransactions = readCreatedTransactions()
  writeCreatedTransactions([...createdTransactions, transaction])

  return transaction
}
