import { useMutation, useQueryClient } from '@tanstack/react-query'
import { debtorQueryKeys } from '../queryKeys.ts'
import { addDebtorNote } from '../services/debtorService.ts'

export function useAddDebtorNote(debtorId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (text: string) => addDebtorNote(debtorId, text),
    onSuccess: (debtor) => {
      queryClient.setQueryData(debtorQueryKeys.detail(debtor.id), debtor)
      return queryClient.invalidateQueries({
        queryKey: debtorQueryKeys.lists(),
      })
    },
  })
}
