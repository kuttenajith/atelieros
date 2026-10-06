import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarClock,
  Columns3,
  CreditCard,
  Home,
  LogOut,
  Package,
  Settings,
  Shirt,
  Truck,
  Users,
  Ruler,
  MessageCircle,
  BarChart3,
} from 'lucide-react'
import { BrandMark } from '../components/BrandMark.tsx'
import { CommandPalette } from '../components/CommandPalette.tsx'
import { NewMenu } from '../components/NewMenu.tsx'
import { currentUser, impersonateStudio, logout, studioId, useApp, useSession } from '../lib/store.ts'
import { clsx } from '../lib/clsx.ts'

const nav = [
  { group: 'WORKSPACE', items: [
    { to: '/app', label: 'Overview', icon: Home, end: true },
    { to: '/app/customers', label: 'Customers', icon: Users },
    { to: '/app/measurements', label: 'Measurements', icon: Ruler },
    { to: '/app/styles', label: 'Styles', icon: Shirt },
  ]},
  { group: 'ORDERS', items: [
    { to: '/app/orders', label: 'Orders', icon: Package },
    { to: '/app/production', label: 'Production', icon: Columns3 },
    { to: '/app/trials', label: 'Trials', icon: CalendarClock },
    { to: '/app/deliveries', label: 'Deliveries', icon: Truck },
  ]},
  { group: 'BUSINESS', items: [
    { to: '/app/payments', label: 'Payments', icon: CreditCard },
    { to: '/app/whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { to: '/app/reports', label: 'Reports', icon: BarChart3 },
  ]},
  { group: 'SETTINGS', items: [
    { to: '/app/settings', label: 'Studio', icon: Settings },
    { to: '/app/billing', label: 'Subscription', icon: CreditCard },
  ]},
]

const mobile = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/orders', label: 'Orders', icon: Package },
  { to: '__new', label: '+', icon: Bell },
  { to: '/app/customers', label: 'Clients', icon: Users },
  { to: '/app/settings', label: 'More', icon: Settings },
]

export function StudioShell() {
  const data = useApp()
  const sid = studioId()
  const user = currentUser()
  const session = useSession()
  const studio = data.studios.find((s) => s.id === sid)
  const navTo = useNavigate()
  const viewingAsHq = Boolean(user?.isAdmin && session?.viewingStudioId)

  function signOut() {
    logout()
    navTo('/')
  }

  return (
    <div className="min-h-dvh bg-bg">
      <CommandPalette />
      {viewingAsHq ? (
        <div className="flex items-center justify-between bg-ink px-4 py-2 text-xs text-white">
          <span>HQ viewing {studio?.name}</span>
          <button
            className="underline"
            onClick={() => {
              impersonateStudio(null)
              navTo('/admin')
            }}
          >
            Back to HQ
          </button>
        </div>
      ) : null}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur">
        <BrandMark to="/app" />
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-mute sm:inline">{studio?.name}</span>
          <NewMenu />
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs text-white">
            {(user?.name || 'A').slice(0, 1)}
          </span>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-14 hidden h-[calc(100dvh-56px)] w-56 shrink-0 overflow-auto border-r border-line p-4 lg:block">
          {nav.map((g) => (
            <div key={g.group} className="mb-5">
              <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-mute">{g.group}</p>
              {g.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    clsx(
                      'mb-0.5 flex min-h-9 items-center gap-2 rounded-xl px-2.5 text-sm',
                      isActive ? 'bg-[#efe8dc] text-primary-dark' : 'text-mute hover:bg-surface hover:text-ink',
                    )
                  }
                >
                  <item.icon size={15} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
          <button onClick={signOut} className="mt-4 flex items-center gap-2 px-2.5 text-sm text-mute hover:text-ink">
            <LogOut size={15} /> Sign out
          </button>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface lg:hidden">
        {mobile.map((item) =>
          item.to === '__new' ? (
            <div key="new" className="-mt-4 flex flex-1 justify-center">
              <NewMenu compact />
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx('flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]', isActive ? 'text-primary' : 'text-mute')
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
    </div>
  )
}
