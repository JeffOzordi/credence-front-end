
import { apiClient } from './apiClient.ts'
import { apiEndpoints } from './endpoints.ts'
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  CurrentBusiness,
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

export async function loginAccount(
  request: LoginRequest,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    apiEndpoints.login,
    request,
  )

  return data
}

export function getLoginAccessToken(response: LoginResponse): string | null {
  if (
    typeof response !== 'object' ||
    response === null ||
    !('access_token' in response)
  ) {
    return null
  }

  const token = response.access_token
  return typeof token === 'string' && token.length > 0 ? token : null
}

export async function getCurrentBusiness(): Promise<CurrentBusiness> {
  const { data } = await apiClient.get<CurrentBusiness>(
    apiEndpoints.currentBusiness,
  )

  return data
}
