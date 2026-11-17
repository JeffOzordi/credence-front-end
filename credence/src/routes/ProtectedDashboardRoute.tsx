import { Navigate, Outlet } from 'react-router-dom'
import { getAuthToken } from '../services/auth/tokenStorage.ts'

export function ProtectedDashboardRoute() {
  return getAuthToken() ? <Outlet /> : <Navigate to="/login" replace />
}
