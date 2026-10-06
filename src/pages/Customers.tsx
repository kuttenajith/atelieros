import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Empty, PageHeader } from '../components/PageHeader.tsx'
import { TypePill } from '../components/StatusPill.tsx'
import { Input } from '../components/Field.tsx'
import { money } from '../lib/format.ts'
import { dueFor, studioId, useApp } from '../lib/store.ts'

export function Customers() {
  const data = useApp()
  const sid = studioId()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')
  const list = useMemo(() => {
    return data.customers.filter((c) => {
      if (c.studioId !== sid) return false
      if (tab === 'vip' && c.type !== 'vip' && !c.tags.includes('VIP')) return false
      if (tab === 'active' && c.type === 'wholesale') return false
      const blob = `${c.name} ${c.phone} ${c.tags.join(' ')}`.toLowerCase()
      return blob.includes(q.toLowerCase())
    })
  }, [data.customers, q, sid, tab])

  return (
    <div>
      <PageHeader
        kicker="Workspace"
        title="Customers"
        subtitle={`${list.length} in this studio`}
        action={<Button onClick={() => nav('/app/customers/new')}>+ Add Customer</Button>}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Input className="max-w-sm" placeholder="Search customers..." value={q} onChange={(e) => setQ(e.target.value)} />
        {['all', 'vip', 'active'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1.5 text-sm capitalize ${tab === t ? 'bg-primary text-white' : 'bg-surface text-mute'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <Empty title="Add your first customer and start building their story." body="Every order begins with a person." cta="Add customer" onClick={() => nav('/app/customers/new')} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="bg-bg text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Pending</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const orders = data.orders.filter((o) => o.customerId === c.id)
                const pending = orders.reduce((s, o) => s + dueFor(o), 0)
                return (
                  <tr key={c.id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <Link to={`/app/customers/${c.id}`} className="font-medium hover:text-primary">
                        {c.name}
                      </Link>
                      <div className="mt-1">
                        <TypePill type={c.type} />
                      </div>
                    </td>
                    <td>+91 {c.phone}</td>
                    <td>{orders.length}</td>
                    <td>{money(pending)}</td>
                    <td>
                      <Link to={`/app/orders/new?customer=${c.id}`} className="text-primary">
                        Order
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="divide-y divide-line md:hidden">
            {list.map((c) => (
              <Link key={c.id} to={`/app/customers/${c.id}`} className="block p-4">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-mute">+91 {c.phone}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
