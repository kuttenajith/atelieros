import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Empty, PageHeader } from '../components/PageHeader.tsx'
import { StatusPill } from '../components/StatusPill.tsx'
import { Input } from '../components/Field.tsx'
import { money, relative } from '../lib/format.ts'
import { dueFor, studioId, useApp } from '../lib/store.ts'
import type { Stage } from '../lib/types.ts'

const tabs: { id: Stage | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'stitching', label: 'In production' },
  { id: 'trial', label: 'Trial' },
  { id: 'alteration', label: 'Alteration' },
  { id: 'ready', label: 'Ready' },
  { id: 'delivered', label: 'Delivered' },
]

export function Orders() {
  const data = useApp()
  const sid = studioId()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('all')
  const list = useMemo(
    () =>
      data.orders.filter((o) => {
        if (o.studioId !== sid) return false
        if (tab !== 'all' && o.stage !== tab) {
          if (tab === 'stitching' && !['cutting', 'stitching', 'measurement'].includes(o.stage)) return false
          if (tab !== 'stitching') return false
        }
        const c = data.customers.find((x) => x.id === o.customerId)
        return `${o.id} ${c?.name} ${o.items[0]?.name}`.toLowerCase().includes(q.toLowerCase())
      }),
    [data, q, sid, tab],
  )

  return (
    <div>
      <PageHeader title="Orders" action={<Button onClick={() => nav('/app/orders/new')}>+ New Order</Button>} />
      <Input className="mb-3 max-w-sm" placeholder="Search orders..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${tab === t.id ? 'bg-primary text-white' : 'bg-surface text-mute'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <Empty title="Your first order is waiting to be created." body="Customer, measurement, delivery date — then the floor can start." cta="Create order" onClick={() => nav('/app/orders/new')} />
      ) : (
        <div className="space-y-2">
          {list.map((o) => {
            const c = data.customers.find((x) => x.id === o.customerId)
            return (
              <Link key={o.id} to={`/app/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
                <div>
                  <p className="font-medium">
                    {o.id} · {c?.name}
                  </p>
                  <p className="text-sm text-mute">
                    {o.items[0]?.name} · {relative(o.deliveryOn)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill stage={o.stage} />
                  <span className="text-sm">{money(dueFor(o))}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
