import { apiClient } from './apiClient.ts'
import { apiEndpoints } from './endpoints.ts'
import type { DashboardOverview } from './types.ts'

export async function getDashboardOverview(
  simulateError = false,
): Promise<DashboardOverview> {
  const { data } = await apiClient.get<DashboardOverview>(
    apiEndpoints.dashboardOverview,
    { params: simulateError ? { simulateError: true } : undefined },
  )
  return data
}
