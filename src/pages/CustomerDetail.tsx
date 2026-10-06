import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { StatusPill, TypePill } from '../components/StatusPill.tsx'
import { money, relative } from '../lib/format.ts'
import { dueFor, useApp } from '../lib/store.ts'

export function CustomerDetail() {
  const { id } = useParams()
  const data = useApp()
  const c = data.customers.find((x) => x.id === id)
  if (!c) return <p>Customer not found.</p>
  const orders = data.orders.filter((o) => o.customerId === c.id)
  const pending = orders.reduce((s, o) => s + dueFor(o), 0)
  const measures = data.measurements.filter((m) => m.customerId === c.id)
  const paid = data.payments.filter((p) => p.customerId === c.id).reduce((s, p) => s + p.amount, 0)
  const upcoming = orders.find((o) => o.stage !== 'delivered' && o.stage !== 'cancelled')

  return (
    <div>
      <Link to="/app/customers" className="text-sm text-mute">
        ← Customers
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">{c.name}</h1>
          <p className="mt-1 text-mute">+91 {c.phone}</p>
          <div className="mt-2 flex gap-2">
            <TypePill type={c.type} />
            {c.tags.map((t) => (
              <span key={t} className="rounded-full bg-bg px-2 py-0.5 text-xs text-mute">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`https://wa.me/91${c.phone}`} target="_blank" rel="noreferrer">
            <Button tone="ghost">WhatsApp</Button>
          </a>
          <Link to={`/app/orders/new?customer=${c.id}`}>
            <Button>+ New Order</Button>
          </Link>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          [`${orders.length}`, 'Orders'],
          [money(paid), 'Lifetime'],
          [money(pending), 'Pending'],
          [`${orders.filter((o) => o.stage !== 'delivered').length}`, 'Open'],
        ].map(([n, l]) => (
          <div key={l} className="rounded-2xl border border-line bg-surface p-4">
            <p className="font-display text-2xl">{n}</p>
            <p className="text-xs text-mute">{l}</p>
          </div>
        ))}
      </div>
      {upcoming ? (
        <article className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-mute">Upcoming</p>
          <p className="mt-1 font-medium">
            {upcoming.id} · {upcoming.items[0]?.name}
          </p>
          <p className="text-sm text-mute">
            {relative(upcoming.deliveryOn)} · {upcoming.deliveryTime || ''}
          </p>
        </article>
      ) : null}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl">Orders</h2>
          <div className="mt-3 space-y-2">
            {orders.map((o) => (
              <Link key={o.id} to={`/app/orders/${o.id}`} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
                <span>
                  {o.id} · {o.items[0]?.name}
                </span>
                <StatusPill stage={o.stage} />
              </Link>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl">Measurements</h2>
          <div className="mt-3 space-y-2">
            {measures.map((m) => (
              <Link key={m.id} to={`/app/customers/${c.id}/measurements`} className="block rounded-xl border border-line bg-surface px-4 py-3">
                <p className="font-medium">
                  {m.template} {m.current ? '· Current' : ''}
                </p>
                <p className="text-sm text-mute">{m.date}</p>
              </Link>
            ))}
            <Link to="/app/measurements/new" className="text-sm text-primary">
              + New measurement
            </Link>
          </div>
          {c.notes ? (
            <div className="mt-6 rounded-xl bg-[#efe8dc] p-4 text-sm">
              <p className="text-xs uppercase tracking-wide text-primary-dark">Notes</p>
              <p className="mt-1">{c.notes}</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
