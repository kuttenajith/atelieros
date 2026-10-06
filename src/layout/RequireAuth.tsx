import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { billingActive, currentUser, expireIfNeeded, studio, useSession } from '../lib/store.ts'

export function RequireAuth() {
  const session = useSession()
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RequireStudio() {
  const session = useSession()
  const loc = useLocation()
  expireIfNeeded()
  if (!session) return <Navigate to="/login" replace />
  const u = currentUser()
  if (u?.isAdmin && !session.viewingStudioId) return <Navigate to="/admin" replace />
  const s = studio()
  if (!u?.isAdmin && !billingActive(s) && loc.pathname !== '/app/billing') {
    return <Navigate to="/app/billing" replace />
  }
  return <Outlet />
}

export function RequireAdmin() {
  const session = useSession()
  if (!session) return <Navigate to="/login" replace />
  const u = currentUser()
  if (!u?.isAdmin) return <Navigate to="/app" replace />
  return <Outlet />
}
