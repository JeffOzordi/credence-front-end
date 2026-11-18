export type TransactionStatus =
  | 'Partially paid'
  | 'Overdue'
  | 'Settled'
  | 'Active'
  | 'Disputed'
  | 'Pending'

export type RepaymentFrequency = 'One-time' | 'Weekly' | 'Biweekly' | 'Monthly'

export type ReminderTiming =
  | '3 days before'
  | 'On due date'
  | '3 days after'
  | '7 days after'
  | 'Weekly after'

export type MockDebtor = {
  id: string
  name: string
  contactName: string
  phone: string
  email: string
  onTimeRate: number
  pastTransactionCount: number
}

export type TransactionTimelineEvent = {
  id: string
  title: string
  channel?: 'Email' | 'WhatsApp' | 'System'
  occurredAt: string
  description: string
}

export type CreditTransaction = {
  id: string
  reference: string
  invoiceReference: string
  debtor: MockDebtor
  amount: number
  paid: number
  transactionDate: string
  dueDate: string
  repaymentFrequency: RepaymentFrequency
  terms: string
  reminderSchedule: ReminderTiming[]
  status: TransactionStatus
  timeline: TransactionTimelineEvent[]
}

export type NewCreditTransaction = {
  debtorId: string
  invoiceReference: string
  amount: number
  transactionDate: string
  dueDate: string
  repaymentFrequency: RepaymentFrequency
  terms: string
  reminderSchedule: ReminderTiming[]
}
