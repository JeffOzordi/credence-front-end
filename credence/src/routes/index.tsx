import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout.tsx'
import { LoginPage } from '../pages/LoginPage.tsx'
import { SignupPage } from '../pages/SignupPage.tsx'
import { BusinessOnboardingPage } from '../pages/BusinessOnboardingPage.tsx'
import { DashboardLayout } from '../layouts/DashboardLayout.tsx'
import { OverviewPage } from '../pages/dashboard/OverviewPage.tsx'
import { DashboardPlaceholderPage } from '../pages/dashboard/DashboardPlaceholderPage.tsx'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding/business" element={<BusinessOnboardingPage />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/transactions" element={<DashboardPlaceholderPage />} />
        <Route path="/debtors" element={<DashboardPlaceholderPage />} />
        <Route path="/reminders" element={<DashboardPlaceholderPage />} />
        <Route path="/credit-management" element={<DashboardPlaceholderPage />} />
        <Route path="/reports" element={<DashboardPlaceholderPage />} />
        <Route path="/email-templates" element={<DashboardPlaceholderPage />} />
        <Route path="/settings" element={<DashboardPlaceholderPage />} />
      </Route>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </>,
  ),
)
