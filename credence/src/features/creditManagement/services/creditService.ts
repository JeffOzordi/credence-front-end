import { approvedCreditLimit, creditApprovalRules, debtorCreditLimits } from '../data/creditData.ts'
import { listTransactions } from '../../transactions/services/transactionService.ts'

export async function getCreditManagement() {
  await Promise.resolve()
  const transactions = await listTransactions()
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
