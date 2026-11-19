export type DebtorStatus = 'Good standing' | 'Watch' | 'At risk' | 'New'

export type DebtorCreditStatus =
  | 'Partially paid'
  | 'Overdue'
  | 'Settled'
  | 'Active'
  | 'Pending'

export type DebtorCredit = {
  id: string
  reference: string
  invoiceReference: string
  amount: number
  paid: number
  issuedAt: string
  dueAt: string
  status: DebtorCreditStatus
  paymentNote?: string
}

export type DebtorCommunication = {
  id: string
  kind: 'Reminder' | 'Response'
  channel: 'Email' | 'WhatsApp'
  occurredAt: string
  message: string
  commitment?: string
}

export type DebtorNote = {
  id: string
  text: string
  createdAt: string
}

export type DebtorRepaymentBehaviour = {
  onTimePayments: number
  latePayments: number
  averageDelayDays: number
  missedCommitments: number
  partialPayments: number
  disputed: number
}

export type DebtorReminderHistory = {
  sent: number
  scheduled: number
  nextReminder: string
  deliveredRate: number
  responded: number
}

export type Debtor = {
  id: string
  name: string
  type: 'Business' | 'Individual'
  contactName: string
  email: string
  phone: string
  address: string
  registrationNumber?: string
  bvnLast4?: string
  bvnHash?: string
  onTimeRate: number | null
  status: DebtorStatus
  credits: DebtorCredit[]
  communications: DebtorCommunication[]
  notes: DebtorNote[]
  repaymentBehaviour: DebtorRepaymentBehaviour
  reminderHistory: DebtorReminderHistory
}

export type DebtorSummary = {
  extendedAmount: number
  repaidAmount: number
  outstandingAmount: number
  activeTransactions: number
  overdueAmount: number
}

export type NewDebtor = Pick<
  Debtor,
  'name' | 'type' | 'contactName' | 'email' | 'phone' | 'address'
> & {
  registrationNumber?: string
  bvn: string
}
