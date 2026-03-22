import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function ProtectedRoute() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

export function GuestRoute() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Navigate to="/diary" replace /> : <Outlet />
}
