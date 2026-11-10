import { useMutation } from '@tanstack/react-query'
import { registerAccount } from '../../../services/api/authentication.ts'

export function useRegisterAccount() {
  return useMutation({
    mutationFn: registerAccount,
  })
}
