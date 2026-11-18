import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout.tsx'
import { LoginPage } from '../pages/LoginPage.tsx'
import { SignupPage } from '../pages/SignupPage.tsx'
import { BusinessOnboardingPage } from '../pages/BusinessOnboardingPage.tsx'
import { DashboardLayout } from '../layouts/DashboardLayout.tsx'
import { OverviewPage } from '../pages/dashboard/OverviewPage.tsx'
import { DashboardPlaceholderPage } from '../pages/dashboard/DashboardPlaceholderPage.tsx'
import { SettingsPage } from '../pages/dashboard/SettingsPage.tsx'
import { TransactionsPage } from '../pages/dashboard/TransactionsPage.tsx'
import { CreateTransactionPage } from '../pages/dashboard/CreateTransactionPage.tsx'
import { TransactionDetailsPage } from '../pages/dashboard/TransactionDetailsPage.tsx'
import { ProtectedDashboardRoute } from './ProtectedDashboardRoute.tsx'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding/business" element={<BusinessOnboardingPage />} />
      </Route>
      <Route element={<ProtectedDashboardRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/new" element={<CreateTransactionPage />} />
          <Route path="/transactions/:transactionId" element={<TransactionDetailsPage />} />
          <Route path="/debtors" element={<DashboardPlaceholderPage />} />
          <Route path="/reminders" element={<DashboardPlaceholderPage />} />
          <Route path="/credit-management" element={<DashboardPlaceholderPage />} />
          <Route path="/reports" element={<DashboardPlaceholderPage />} />
          <Route path="/email-templates" element={<DashboardPlaceholderPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </>,
  ),
)
