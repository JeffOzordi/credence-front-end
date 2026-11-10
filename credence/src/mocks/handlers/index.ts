import { delay, http, HttpResponse } from 'msw'
import type {
  ApiErrorResponse,
  BusinessOnboardingRequest,
  BusinessOnboardingResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../services/api/types.ts'
import { apiEndpoints } from '../../services/api/endpoints.ts'
import { dashboardOverview } from '../data/dashboardOverview.ts'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

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

      return HttpResponse.json({
        userId: 'usr_demo_204',
        businessId: 'biz_demo_108',
        message: 'Account created successfully.',
      })
    },
  ),
  http.post<
    never,
    BusinessOnboardingRequest,
    BusinessOnboardingResponse | ApiErrorResponse
  >(`${apiBaseUrl}${apiEndpoints.businessOnboarding}`, async ({ request }) => {
    await delay(650)
    const body = await request.json()

    if (body.otherCategory?.toLowerCase() === 'mock error') {
      return HttpResponse.json(
        { message: 'Business information could not be saved. Please try again.' },
        { status: 503 },
      )
    }

    return HttpResponse.json<BusinessOnboardingResponse>({
      businessId: 'biz_demo_108',
      message: 'Business setup completed successfully.',
      businessInfo: body,
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
