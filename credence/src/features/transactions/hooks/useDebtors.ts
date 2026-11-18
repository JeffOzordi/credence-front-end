import { useQuery } from '@tanstack/react-query'
import { listMockDebtors } from '../services/transactionService.ts'
import { transactionQueryKeys } from '../queryKeys.ts'

export function useDebtors() {
  return useQuery({
    queryKey: transactionQueryKeys.debtors(),
    queryFn: listMockDebtors,
  })
}
