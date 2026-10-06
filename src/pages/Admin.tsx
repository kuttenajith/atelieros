import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Input } from '../components/Field.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { StatusPill } from '../components/StatusPill.tsx'
import { money } from '../lib/format.ts'
import { dueFor, impersonateStudio, resetDemo, useApp } from '../lib/store.ts'

export function Admin() {
  const data = useApp()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(data.studios[0]?.id || null)

  const studios = useMemo(
    () => data.studios.filter((s) => `${s.name} ${s.owner} ${s.city}`.toLowerCase().includes(q.toLowerCase())),
    [data.studios, q],
  )

  const allOutstanding = data.orders.reduce((s, o) => s + dueFor(o), 0)

  return (
    <div>
      <PageHeader
        kicker="Headquarters"
        title="Command"
        subtitle="Every studio, every customer, every rupee — without entering the floor."
        action={
          <Button tone="ghost" onClick={() => resetDemo()}>
            Reset demo data
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          [studios.length, 'Studios'],
          [data.customers.length, 'Customers'],
          [data.orders.filter((o) => o.stage !== 'delivered' && o.stage !== 'cancelled').length, 'Open orders'],
          [money(allOutstanding), 'Outstanding'],
        ].map(([n, l]) => (
          <article key={String(l)} className="rounded-2xl border border-line bg-surface p-4">
            <p className="font-display text-3xl">{n}</p>
            <p className="text-xs text-mute">{l}</p>
          </article>
        ))}
      </div>
      <Input className="mt-6 max-w-sm" placeholder="Search studios..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-4 space-y-4">
        {studios.map((s) => {
          const customers = data.customers.filter((c) => c.studioId === s.id)
          const orders = data.orders.filter((o) => o.studioId === s.id)
          const payments = data.payments.filter((p) => p.studioId === s.id)
          const collected = payments.reduce((n, p) => n + p.amount, 0)
          const due = orders.reduce((n, o) => n + dueFor(o), 0)
          const activity = data.activity.filter((a) => a.studioId === s.id).slice(0, 6)
          const isOpen = open === s.id
          return (
            <section key={s.id} className="overflow-hidden rounded-3xl border border-line bg-surface">
              <button
                type="button"
                className="flex w-full flex-col gap-2 p-5 text-left sm:flex-row sm:items-center sm:justify-between"
                onClick={() => setOpen(isOpen ? null : s.id)}
              >
                <span>
                  <span className="block font-display text-2xl">{s.name}</span>
                  <span className="text-sm text-mute">
                    {s.owner} · {s.city} · {s.email}
                  </span>
                </span>
                <span className="flex flex-wrap gap-4 text-sm">
                  <span>{customers.length} clients</span>
                  <span>{orders.length} orders</span>
                  <span>{money(collected)} in</span>
                  <span className="text-danger">{money(due)} due</span>
                </span>
              </button>
              {isOpen ? (
                <div className="space-y-5 border-t border-line p-5">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        impersonateStudio(s.id)
                        nav('/app')
                      }}
                    >
                      Open as studio
                    </Button>
                    <p className="self-center text-sm text-mute">
                      {s.phone} · {s.garments.join(', ')} · {s.teamSize}
                    </p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-mute">Customers</h3>
                      <ul className="mt-2 space-y-2">
                        {customers.map((c) => (
                          <li key={c.id} className="flex justify-between rounded-xl bg-bg px-3 py-2 text-sm">
                            <span>
                              {c.name}
                              <span className="ml-2 text-mute">+91 {c.phone}</span>
                            </span>
                            <span className="capitalize text-mute">{c.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-mute">Orders</h3>
                      <ul className="mt-2 space-y-2">
                        {orders.map((o) => {
                          const c = customers.find((x) => x.id === o.customerId)
                          return (
                            <li key={o.id} className="flex items-center justify-between rounded-xl bg-bg px-3 py-2 text-sm">
                              <span>
                                {o.id} · {c?.name} · {o.items[0]?.name}
                              </span>
                              <StatusPill stage={o.stage} />
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-mute">Activity</h3>
                    <ul className="mt-2 space-y-1 text-sm text-mute">
                      {activity.map((a) => (
                        <li key={a.id}>
                          {a.at} · {a.who} · {a.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </section>
          )
        })}
      </div>
    </div>
  )
}
