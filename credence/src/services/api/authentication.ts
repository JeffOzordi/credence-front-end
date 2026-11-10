import { apiClient } from './apiClient.ts'
import { apiEndpoints } from './endpoints.ts'
import type {
  BusinessOnboardingRequest,
  BusinessOnboardingResponse,
  RegisterRequest,
  RegisterResponse,
} from './types.ts'

export async function registerAccount(
  request: RegisterRequest,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    apiEndpoints.register,
    request,
  )
  return data
}

export async function completeBusinessOnboarding(
  request: BusinessOnboardingRequest,
): Promise<BusinessOnboardingResponse> {
  const { data } = await apiClient.post<BusinessOnboardingResponse>(
    apiEndpoints.businessOnboarding,
    request,
  )
  return data
}
