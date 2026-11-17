import { delay, http, HttpResponse } from 'msw'
import type {
  ApiErrorResponse,
  CurrentBusiness,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from '../../services/api/types.ts'
import { apiEndpoints } from '../../services/api/endpoints.ts'
import { dashboardOverview } from '../data/dashboardOverview.ts'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://credence-back-end.onrender.com'

type MockLoginResponse = {
  access_token: string
  token_type: string
}

export const handlers = [
  http.post<never, RegisterRequest, RegisterResponse | ApiErrorResponse>(
    `${apiBaseUrl}${apiEndpoints.register}`,
    async ({ request }) => {
      await delay(700)
      const { email } = await request.json()

      if (email.toLowerCase() === 'error@credence.test') {
        return HttpResponse.json(
          { message: 'This email could not be registered. Try another address.' },
          { status: 409 },
        )
      }

      return HttpResponse.json<RegisterResponse>({
        user: {
          id: 'usr_demo_204',
          email,
        },
        access_token: 'mock_access_token',
        token_type: 'bearer',
      })
    },
  ),
  http.post<never, LoginRequest, MockLoginResponse | ApiErrorResponse>(
    `${apiBaseUrl}${apiEndpoints.login}`,
    async ({ request }) => {
      await delay(700)
      const { email, password } = await request.json()

      if (!email || !password) {
        return HttpResponse.json(
          { message: 'Invalid email or password.' },
          { status: 401 },
        )
      }

      if (email.toLowerCase() === 'error@credence.test' || password === 'wrongpass') {
        return HttpResponse.json(
          { message: 'Incorrect email or password.' },
          { status: 401 },
        )
      }

      return HttpResponse.json<MockLoginResponse>({
        access_token: 'mock_access_token',
        token_type: 'bearer',
      })
    },
  ),
  http.get(`${apiBaseUrl}${apiEndpoints.currentBusiness}`, async ({ request }) => {
    await delay(450)
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Authentication required.' },
        { status: 401 },
      )
    }

    return HttpResponse.json<CurrentBusiness>({
      id: 'biz_demo_108',
      name: 'Credence Demo Business',
      email: 'demo@credence.test',
      phone: '+2348000000000',
      address: '1 Market Road, Lagos, Nigeria',
      registration_number: 'RC-123456',
      category: 'retail_ecommerce',
    })
  }),
  http.get(`${apiBaseUrl}${apiEndpoints.dashboardOverview}`, async ({ request }) => {
    await delay(850)
    const url = new URL(request.url)

    if (url.searchParams.get('simulateError') === 'true') {
      return HttpResponse.json(
        { message: 'The dashboard is temporarily unavailable.' } satisfies ApiErrorResponse,
        { status: 503 },
      )
    }

    return HttpResponse.json(dashboardOverview)
  }),
]
