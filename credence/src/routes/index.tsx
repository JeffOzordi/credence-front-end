import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout.tsx'
import { LoginPage } from '../pages/LoginPage.tsx'
import { SignupPage } from '../pages/SignupPage.tsx'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Route>,
  ),
)
