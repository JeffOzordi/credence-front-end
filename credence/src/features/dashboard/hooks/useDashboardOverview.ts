import { useQuery } from '@tanstack/react-query'
import { getDashboardOverview } from '../../../services/api/dashboard.ts'
import { dashboardQueryKeys } from '../queryKeys.ts'

export function useDashboardOverview() {
  const simulateError = import.meta.env.VITE_MOCK_DASHBOARD_ERROR === 'true'

  return useQuery({
    queryKey: dashboardQueryKeys.overview(simulateError),
    queryFn: () => getDashboardOverview(simulateError),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
