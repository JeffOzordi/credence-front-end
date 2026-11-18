import { useMutation, useQueryClient } from '@tanstack/react-query'
import { debtorQueryKeys } from '../queryKeys.ts'
import { createDebtor } from '../services/debtorService.ts'
import type { NewDebtor } from '../types.ts'

export function useCreateDebtor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewDebtor) => createDebtor(input),
    onSuccess: (debtor) => {
      queryClient.setQueryData(debtorQueryKeys.detail(debtor.id), debtor)
      return queryClient.invalidateQueries({
        queryKey: debtorQueryKeys.lists(),
      })
    },
  })
}
