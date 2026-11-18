import { useQuery } from '@tanstack/react-query'
import { debtorQueryKeys } from '../queryKeys.ts'
import { listDebtors } from '../services/debtorService.ts'

export function useDebtors() {
  return useQuery({
    queryKey: debtorQueryKeys.lists(),
    queryFn: listDebtors,
  })
}
