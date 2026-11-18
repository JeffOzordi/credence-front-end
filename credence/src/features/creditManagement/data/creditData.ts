export type DebtorCreditLimit = {
  debtorId: string
  debtorName: string
  limit: number
  outstanding: number
}

export type CreditApprovalRule = {
  id: string
  name: string
  description: string
  enabled: boolean
}

export const approvedCreditLimit = 5_000_000

export const debtorCreditLimits: DebtorCreditLimit[] = [
  { debtorId: 'debtor-musa-trading', debtorName: 'Musa Trading Co.', limit: 1_000_000, outstanding: 550_000 },
  { debtorId: 'debtor-bright-foods', debtorName: 'Bright Foods Ltd', limit: 800_000, outstanding: 1_200_000 },
  { debtorId: 'debtor-sahara-provisions', debtorName: 'Sahara Provisions', limit: 700_000, outstanding: 470_000 },
  { debtorId: 'debtor-kano-agro', debtorName: 'Kano Agro Supply', limit: 500_000, outstanding: 640_000 },
  { debtorId: 'debtor-tunde-electronics', debtorName: 'Tunde Electronics', limit: 400_000, outstanding: 260_000 },
]

export const creditApprovalRules: CreditApprovalRule[] = [
  { id: 'capacity', name: 'Capacity guardrail', description: 'Transactions above available capacity require authorized approval.', enabled: true },
  { id: 'dispute', name: 'Disputed invoice hold', description: 'Disputed transactions cannot be automatically escalated.', enabled: true },
  { id: 'repeat', name: 'Repeat debtor review', description: 'Review debtors who exceed their approved limit.', enabled: true },
]
