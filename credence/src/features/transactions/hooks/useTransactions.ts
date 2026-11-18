import { useQuery } from '@tanstack/react-query'
import { listTransactions } from '../services/transactionService.ts'
import { transactionQueryKeys } from '../queryKeys.ts'

export function useTransactions() {
  return useQuery({
    queryKey: transactionQueryKeys.lists(),
    queryFn: listTransactions,
  })
}
