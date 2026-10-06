import { Navigate, Outlet } from 'react-router-dom'
import { currentUser, useSession } from '../lib/store.ts'

function Boot() {
  return <div className="grid min-h-dvh place-items-center bg-bg text-mute">Opening AtelierOS…</div>
}

export function RequireStudio() {
  const session = useSession()
  if (session === undefined) return <Boot />
  if (!session) return <Navigate to="/login" replace />
  const u = currentUser()
  if (u?.isAdmin && !session.viewingStudioId) return <Navigate to="/admin" replace />
  return <Outlet />
}

export function RequireAdmin() {
  const session = useSession()
  if (!session) return <Navigate to="/login" replace />
  const u = currentUser()
  if (!u?.isAdmin) return <Navigate to="/app" replace />
  return <Outlet />
}
