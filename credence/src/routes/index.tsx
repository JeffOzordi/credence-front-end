import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout.tsx'
import { LoginPage } from '../pages/LoginPage.tsx'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Route>,
  ),
)
