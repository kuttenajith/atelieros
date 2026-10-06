import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Shield } from 'lucide-react'
import { BrandMark } from '../components/BrandMark.tsx'
import { currentUser, logout } from '../lib/store.ts'

export function AdminShell() {
  const user = currentUser()
  const nav = useNavigate()
  return (
    <div className="min-h-dvh bg-bg">
      <header className="flex h-14 items-center justify-between border-b border-line bg-surface px-4">
        <div className="flex items-center gap-3">
          <BrandMark to="/admin" />
          <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-white">HQ</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
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
      </header>
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="hidden w-52 border-r border-line p-4 sm:block">
          <NavLink to="/admin" className="flex items-center gap-2 rounded-xl bg-[#efe8dc] px-3 py-2 text-sm text-primary-dark">
            <LayoutDashboard size={15} /> Command
          </NavLink>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
