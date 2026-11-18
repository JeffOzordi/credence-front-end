import { useQuery } from '@tanstack/react-query'
import { getTransaction } from '../services/transactionService.ts'
import { transactionQueryKeys } from '../queryKeys.ts'

export function useTransaction(transactionId: string | undefined) {
  return useQuery({
    queryKey: transactionQueryKeys.detail(transactionId ?? ''),
    queryFn: () => {
      if (!transactionId) {
        throw new Error('A transaction ID is required.')
      }

      return getTransaction(transactionId)
    },
    enabled: Boolean(transactionId),
  })
}
