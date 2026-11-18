import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '../services/transactionService.ts'
import type { NewCreditTransaction } from '../types.ts'
import { transactionQueryKeys } from '../queryKeys.ts'

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewCreditTransaction) => createTransaction(input),
    onSuccess: (transaction) => {
      queryClient.setQueryData(
        transactionQueryKeys.detail(transaction.id),
        transaction,
      )
      return queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.lists(),
      })
    },
  })
}
