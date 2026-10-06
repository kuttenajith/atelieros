import { PageHeader } from '../components/PageHeader.tsx'
import { money } from '../lib/format.ts'
import { dueFor, hasPro, studio, studioId, useApp } from '../lib/store.ts'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button.tsx'

export function Reports() {
  const data = useApp()
  const sid = studioId()
  const s = studio()
  if (!hasPro(s)) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <h1 className="font-display text-3xl">Reports are Studio Pro</h1>
        <p className="mt-2 text-mute">Revenue, on-time delivery and repeat customers — unlock with ₹1,500 / month.</p>
        <Link to="/app/billing" className="mt-5 inline-block">
          <Button>View plans</Button>
        </Link>
      </div>
    )
  }
  const orders = data.orders.filter((o) => o.studioId === sid)
  const customers = data.customers.filter((c) => c.studioId === sid)
  const collected = data.payments.filter((p) => p.studioId === sid).reduce((n, p) => n + p.amount, 0)
  const outstanding = orders.reduce((n, o) => n + dueFor(o), 0)
  const delivered = orders.filter((o) => o.stage === 'delivered').length

  return (
    <div>
      <PageHeader title="Reports" subtitle="Keep it to the numbers a boutique actually uses." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [money(collected), 'Collected'],
          [money(outstanding), 'Outstanding'],
          [String(orders.length), 'Orders'],
          [String(customers.length), 'Customers'],
        ].map(([n, l]) => (
          <article key={l} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-display text-3xl">{n}</p>
            <p className="text-sm text-mute">{l}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          ['Production', `${delivered} delivered · ${orders.filter((o) => o.stage !== 'delivered' && o.stage !== 'cancelled').length} on the floor`],
          ['Customers', `${customers.filter((c) => c.type === 'vip' || c.tags.includes('VIP')).length} VIP · ${customers.filter((c) => c.type === 'bridal').length} bridal`],
          ['Average order', money(orders.length ? orders.reduce((n, o) => n + o.total, 0) / orders.length : 0)],
        ].map(([t, d]) => (
          <article key={t} className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-2xl">{t}</h2>
            <p className="mt-2 text-sm text-mute">{d}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
