import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Shield } from 'lucide-react'
import { BrandMark } from '../components/BrandMark.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { currentUser, logout } from '../lib/store.ts'

export function AdminShell() {
  const user = currentUser()
  const nav = useNavigate()
  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="page-wide flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark to="/admin" />
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-cream">HQ</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ThemeToggle compact />
            <Shield size={14} className="text-primary" />
            {user?.name}
            <button
              className="text-mute hover:text-ink"
              onClick={() => {
                logout()
                nav('/')
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>
      <div className="page-wide grid sm:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r border-line py-6 pr-4 sm:block">
          <NavLink to="/admin" className="flex items-center gap-2 rounded-xl bg-blush px-3 py-2 text-sm text-primary-dark">
            <LayoutDashboard size={15} /> Command
          </NavLink>
        </aside>
        <main className="min-w-0 py-6 sm:pl-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
