import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/ui/Spinner'

export default function PublicRoute() {
  const { isAuthenticated, isLoading, role } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    if (role === 'JOB_SEEKER') {
      return <Navigate to="/dashboard" replace />
    }
    if (role === 'EMPLOYER') {
      return <Navigate to="/employer/dashboard" replace />
    }
    if (role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
