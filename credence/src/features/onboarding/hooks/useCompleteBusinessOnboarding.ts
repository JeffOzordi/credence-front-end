import { useMutation } from '@tanstack/react-query'
import { completeBusinessOnboarding } from '../../../services/api/authentication.ts'

export function useCompleteBusinessOnboarding() {
  return useMutation({
    mutationFn: completeBusinessOnboarding,
  })
}
