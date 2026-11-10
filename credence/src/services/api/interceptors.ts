import axios from 'axios'
import type { AxiosInstance } from 'axios'

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
    config.headers.set('Accept', 'application/json')
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        const message =
          error.response?.data?.message ??
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
