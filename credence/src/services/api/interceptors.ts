import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { getAuthToken } from '../auth/tokenStorage.ts'

export class ApiRequestError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

export function attachApiInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    const token = getAuthToken()
    config.headers.set('Accept', 'application/json')

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (
        axios.isAxiosError<{
          message?: string
          detail?: string | Array<{ msg?: string }>
        }>(error)
      ) {
        const detail = error.response?.data?.detail
        const detailMessage = Array.isArray(detail)
          ? detail.map((item) => item.msg).filter(Boolean).join(' ')
          : detail
        const message =
          error.response?.data?.message ??
          detailMessage ??
          (error.response
            ? `Request failed with status ${error.response.status}.`
            : 'Unable to reach the server. Check your connection and try again.')
        return Promise.reject(
          new ApiRequestError(message, error.response?.status),
        )
      }

      return Promise.reject(
        new ApiRequestError('An unexpected request error occurred.'),
      )
    },
  )
}
