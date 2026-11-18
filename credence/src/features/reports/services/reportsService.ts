import { listTransactions } from '../../transactions/services/transactionService.ts'

export async function getReports() {
  const transactions = await listTransactions()
  const extended = transactions.reduce((total, transaction) => total + transaction.amount, 0)
  const collected = transactions.reduce((total, transaction) => total + transaction.paid, 0)
  const outstanding = transactions.reduce(
    (total, transaction) => total + Math.max(0, transaction.amount - transaction.paid),
    0,
  )
  const settled = transactions.filter((transaction) => transaction.status === 'Settled').length
  const onTimeRate = transactions.length
    ? Math.round(transactions.reduce((total, transaction) => total + transaction.debtor.onTimeRate, 0) / transactions.length)
    : 0
  const debtorPerformance = [...new Map(
    transactions.map((transaction) => [transaction.debtor.id, transaction.debtor]),
  ).values()]
    .map((debtor) => ({ name: debtor.name, onTimeRate: debtor.onTimeRate }))
    .sort((left, right) => right.onTimeRate - left.onTimeRate)

  return {
    extended,
    collected,
    outstanding,
    onTimeRate,
    settled,
    debtorPerformance,
  }
}
