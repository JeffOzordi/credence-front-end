import { useMutation } from '@tanstack/react-query'
import { loginAccount } from '../../../services/api/authentication.ts'

export function useLoginAccount() {
  return useMutation({
    mutationFn: loginAccount,
  })
}
