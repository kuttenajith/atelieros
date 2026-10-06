import { Link, useNavigate } from 'react-router-dom'
import { NewMenu } from '../components/NewMenu.tsx'
import { StatusPill } from '../components/StatusPill.tsx'
import { greeting, money, niceDate, relative } from '../lib/format.ts'
import { currentUser, dueFor, studioId, useApp } from '../lib/store.ts'
import { STAGE_LABEL, type Stage } from '../lib/types.ts'

const pipeline: Stage[] = ['new', 'cutting', 'stitching', 'trial', 'ready']

export function Dashboard() {
  const data = useApp()
  const sid = studioId()
  const user = currentUser()
  const nav = useNavigate()
  const orders = data.orders.filter((o) => o.studioId === sid && o.stage !== 'cancelled')
  const active = orders.filter((o) => o.stage !== 'delivered')
  const outstanding = active.reduce((s, o) => s + dueFor(o), 0)
  const dueWeek = active.filter((o) => relative(o.deliveryOn).includes('Today') || relative(o.deliveryOn).includes('Tomorrow') || relative(o.deliveryOn).includes('in '))
  const trialsToday = data.trials.filter((t) => t.studioId === sid && relative(t.date) === 'Today')
  const appts = data.appointments.filter((a) => a.studioId === sid).sort((a, b) => a.time.localeCompare(b.time))

  const attention = [
    ...orders
      .filter((o) => o.stage === 'trial' || relative(o.deliveryOn) === 'Yesterday' || o.deliveryOn < new Date().toISOString().slice(0, 10))
      .slice(0, 3)
      .map((o) => {
        const c = data.customers.find((x) => x.id === o.customerId)
        const overduePay = dueFor(o) > 0 && o.deliveryOn <= new Date().toISOString().slice(0, 10)
        return {
          id: o.id,
          name: c?.name || 'Customer',
          item: o.items[0]?.name || 'Order',
          hint: overduePay ? `${money(dueFor(o))} payment overdue` : `Due ${relative(o.deliveryOn)} · ${STAGE_LABEL[o.stage]}`,
          to: `/app/orders/${o.id}`,
        }
      }),
  ]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">
            {greeting()}, {user?.name} 
          </h1>
          <p className="mt-1 text-mute">{niceDate()}</p>
        </div>
        <NewMenu />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [active.length, 'Active orders'],
          [money(outstanding), 'Outstanding'],
          [dueWeek.length, 'Due this week'],
          [trialsToday.length, 'Trials today'],
        ].map(([n, l]) => (
          <article key={String(l)} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-display text-3xl">{n}</p>
            <p className="mt-1 text-sm text-mute">{l}</p>
          </article>
        ))}
      </div>

      <section className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-danger">Needs your attention</p>
        <div className="mt-3 space-y-2">
          {attention.map((a) => (
            <article key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-sm text-mute">
                  {a.item} · {a.hint}
                </p>
              </div>
              <ButtonGhost to={a.to} />
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-2xl">Today's studio</h2>
          <ol className="mt-4 space-y-4">
            {appts.map((a) => (
              <li key={a.id} className="flex gap-4">
                <span className="w-20 text-sm text-primary">{a.time}</span>
                <span className="text-sm">{a.title}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-2xl">Production</h2>
          <div className="mt-4 grid grid-cols-5 gap-2 text-center">
            {pipeline.map((s) => (
              <button key={s} className="rounded-xl bg-bg py-3" onClick={() => nav(`/app/production?stage=${s}`)}>
                <p className="font-display text-2xl">{orders.filter((o) => o.stage === s).length}</p>
                <p className="mt-1 text-[11px] capitalize text-mute">{STAGE_LABEL[s]}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent orders</h2>
          <Link to="/app/orders" className="text-sm text-primary">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {orders.slice(0, 5).map((o) => {
            const c = data.customers.find((x) => x.id === o.customerId)
            return (
              <Link key={o.id} to={`/app/orders/${o.id}`} className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-bg">
                <span>
                  <span className="font-medium">{o.id}</span>
                  <span className="ml-2 text-sm text-mute">
                    {c?.name} · {o.items[0]?.name}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <StatusPill stage={o.stage} />
                  <span className="text-sm">{money(dueFor(o))} due</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function ButtonGhost({ to }: { to: string }) {
  return (
    <Link to={to} className="rounded-full border border-line px-4 py-2 text-sm hover:border-primary/40">
      Open
    </Link>
  )
}
