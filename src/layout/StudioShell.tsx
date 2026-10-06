import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  CalendarClock,
  Columns3,
  CreditCard,
  Home,
  LogOut,
  MessageCircle,
  Package,
  Ruler,
  Settings,
  Shirt,
  Truck,
  Users,
} from 'lucide-react'
import { BrandMark } from '../components/BrandMark.tsx'
import { CommandPalette } from '../components/CommandPalette.tsx'
import { NewMenu } from '../components/NewMenu.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { billingOf, currentUser, hasPro, impersonateStudio, logout, studioId, useApp, useSession } from '../lib/store.ts'
import { planName } from '../lib/plans.ts'
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
    { to: '/app/production', label: 'Production', icon: Columns3, pro: true },
    { to: '/app/trials', label: 'Trials', icon: CalendarClock, pro: true },
    { to: '/app/deliveries', label: 'Deliveries', icon: Truck },
  ]},
  { group: 'BUSINESS', items: [
    { to: '/app/payments', label: 'Payments', icon: CreditCard },
    { to: '/app/whatsapp', label: 'WhatsApp', icon: MessageCircle, pro: true },
    { to: '/app/reports', label: 'Reports', icon: BarChart3, pro: true },
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
  const pro = hasPro(studio)
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
        <div className="flex items-center justify-between bg-primary px-4 py-2 text-xs text-cream">
          <span>HQ viewing {studio?.name} · {planName(billingOf(studio).plan)}</span>
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
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
        <div className="page-wide flex h-14 items-center justify-between gap-3">
          <BrandMark to="/app" />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-blush px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-primary sm:inline">
              {planName(billingOf(studio).plan)}
            </span>
            <span className="hidden text-sm text-mute lg:inline">{studio?.name}</span>
            <ThemeToggle compact />
            <NewMenu />
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs text-cream">
              {(user?.name || 'A').slice(0, 1)}
            </span>
          </div>
        </div>
      </header>
      <div className="page-wide grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="sticky top-14 hidden h-[calc(100dvh-56px)] overflow-auto border-r border-line py-6 pr-6 lg:block">
          {nav.map((g) => (
            <div key={g.group} className="mb-6">
              <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-mute">{g.group}</p>
              {g.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    clsx(
                      'mb-0.5 flex min-h-9 items-center gap-2 rounded-xl px-2.5 text-sm',
                      isActive ? 'bg-blush text-primary-dark' : 'text-mute hover:bg-surface hover:text-ink',
                    )
                  }
                >
                  <item.icon size={15} />
                  <span className="flex-1">{item.label}</span>
                  {item.pro && !pro ? <span className="text-[9px] uppercase tracking-wide text-primary">Pro</span> : null}
                </NavLink>
              ))}
            </div>
          ))}
          <button onClick={signOut} className="mt-4 flex items-center gap-2 px-2.5 text-sm text-mute hover:text-ink">
            <LogOut size={15} /> Sign out
          </button>
        </aside>
        <main className="min-w-0 py-6 pb-24 lg:py-8 lg:pl-8 lg:pb-8">
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
