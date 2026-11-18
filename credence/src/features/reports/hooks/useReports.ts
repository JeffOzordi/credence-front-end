import { useQuery } from '@tanstack/react-query'
import { getReports } from '../services/reportsService.ts'

export function useReports() {
  return useQuery({
    queryKey: ['reports-insights'],
    queryFn: getReports,
  })
}
