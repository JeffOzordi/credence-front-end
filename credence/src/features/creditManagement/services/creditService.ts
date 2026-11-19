import { approvedCreditLimit, creditApprovalRules, debtorCreditLimits } from '../data/creditData.ts'
import { listTransactions } from '../../transactions/services/transactionService.ts'

const LIMITS_STORAGE_KEY = 'credence.mock-credit-limits.v1'

function readLimitOverrides(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.sessionStorage.getItem(LIMITS_STORAGE_KEY) ?? '{}') as Record<string, number>
  } catch {
    return {}
  }
}

export async function saveDebtorCreditLimit(debtorId: string, limit: number): Promise<void> {
  await Promise.resolve()
  if (!Number.isFinite(limit) || limit < 0) throw new Error('Credit limit must be zero or greater.')
  const overrides = readLimitOverrides()
  window.sessionStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify({ ...overrides, [debtorId]: limit }))
}

export async function getCreditManagement() {
  await Promise.resolve()
  const transactions = await listTransactions()
  const overrides = readLimitOverrides()
  const outstandingByDebtor = new Map<string, number>()

  for (const transaction of transactions) {
    const balance = Math.max(0, transaction.amount - transaction.paid)
    outstandingByDebtor.set(
      transaction.debtor.id,
      (outstandingByDebtor.get(transaction.debtor.id) ?? 0) + balance,
    )
  }

  const limits = debtorCreditLimits.map((record) => ({
    ...record,
    limit: overrides[record.debtorId] ?? record.limit,
    outstanding: outstandingByDebtor.get(record.debtorId) ?? 0,
  }))
  const outstanding = limits.reduce((total, record) => total + record.outstanding, 0)

  return {
    approvedLimit: approvedCreditLimit,
    outstanding,
    available: Math.max(0, approvedCreditLimit - outstanding),
    utilization: approvedCreditLimit ? Math.round((outstanding / approvedCreditLimit) * 100) : 0,
    limits,
    rules: creditApprovalRules,
  }
}
