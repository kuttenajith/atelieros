import { Link } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Empty, PageHeader } from '../components/PageHeader.tsx'
import { money } from '../lib/format.ts'
import { dueFor, moveStage, studioId, useApp } from '../lib/store.ts'

export function Deliveries() {
  const data = useApp()
  const sid = studioId()
  const today = new Date().toISOString().slice(0, 10)
  const list = data.orders.filter(
    (o) => o.studioId === sid && o.stage !== 'cancelled' && (o.stage === 'ready' || o.deliveryOn <= today),
  )

  return (
    <div>
      <PageHeader title="Deliveries" subtitle="Collect the balance, inspect, then hand over." />
      {list.length === 0 ? (
        <Empty title="Nothing to deliver today." body="Ready garments and due pickups will land here." />
      ) : (
        <div className="space-y-3">
          {list.map((o) => {
            const c = data.customers.find((x) => x.id === o.customerId)
            const due = dueFor(o)
            return (
              <article key={o.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-mute">{o.id}</p>
                    <h2 className="font-display text-2xl">{c?.name}</h2>
                    <p className="text-sm text-mute">
                      {o.items[0]?.name} · {o.deliveryMethod} · {o.deliveryOn}
                    </p>
                    <p className={due > 0 ? 'mt-1 text-danger' : 'mt-1 text-success'}>{money(due)} balance</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {due > 0 ? (
                      <Link to={`/app/orders/${o.id}`}>
                        <Button tone="ghost">Collect payment</Button>
                      </Link>
                    ) : null}
                    <Button onClick={() => moveStage(o.id, 'delivered')}>Mark delivered</Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
