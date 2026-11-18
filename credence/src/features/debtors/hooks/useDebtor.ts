import { useQuery } from '@tanstack/react-query'
import { debtorQueryKeys } from '../queryKeys.ts'
import { getDebtor } from '../services/debtorService.ts'

export function useDebtor(debtorId: string | undefined) {
  return useQuery({
    queryKey: debtorQueryKeys.detail(debtorId ?? ''),
    queryFn: () => {
      if (!debtorId) {
        throw new Error('A debtor ID is required.')
      }
      return getDebtor(debtorId)
    },
    enabled: Boolean(debtorId),
  })
}
