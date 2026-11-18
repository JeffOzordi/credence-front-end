import { useQuery } from '@tanstack/react-query'
import { getCreditManagement } from '../services/creditService.ts'

export function useCreditManagement() {
  return useQuery({
    queryKey: ['credit-management'],
    queryFn: getCreditManagement,
  })
}
