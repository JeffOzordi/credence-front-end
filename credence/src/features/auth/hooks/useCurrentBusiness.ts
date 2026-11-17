import { useQuery } from '@tanstack/react-query'
import { getCurrentBusiness } from '../../../services/api/authentication.ts'
import { authQueryKeys } from '../queryKeys.ts'

export function useCurrentBusiness() {
  return useQuery({
    queryKey: authQueryKeys.currentBusiness,
    queryFn: getCurrentBusiness,
  })
}
