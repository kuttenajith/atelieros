import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/store.ts'
import { studioId } from '../lib/store.ts'

export function CommandPalette() {
  const nav = useNavigate()
  const data = useApp()
  const sid = studioId()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const customers = useMemo(
    () => data.customers.filter((c) => (!sid || c.studioId === sid) && c.name.toLowerCase().includes(q.toLowerCase())),
    [data.customers, q, sid],
  )
  const orders = useMemo(
    () =>
      data.orders.filter(
        (o) =>
          (!sid || o.studioId === sid) &&
          (o.id.toLowerCase().includes(q.toLowerCase()) || o.items[0]?.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [data.orders, q, sid],
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] bg-ink/30 p-4 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
      <div
        className="mx-auto mt-[12vh] max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search customers, orders, phone numbers..."
          className="h-14 w-full border-b border-line px-4 text-sm outline-none"
        />
        <div className="max-h-80 overflow-auto p-2 text-sm">
          <p className="px-2 py-1 text-[11px] uppercase tracking-wide text-mute">Customers</p>
          {customers.slice(0, 5).map((c) => (
            <button
              key={c.id}
              className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-bg"
              onClick={() => {
                setOpen(false)
                nav(`/app/customers/${c.id}`)
              }}
            >
              <span>{c.name}</span>
              <span className="text-xs text-mute">+91 {c.phone}</span>
            </button>
          ))}
          <p className="mt-2 px-2 py-1 text-[11px] uppercase tracking-wide text-mute">Orders</p>
          {orders.slice(0, 5).map((o) => (
            <button
              key={o.id}
              className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-bg"
              onClick={() => {
                setOpen(false)
                nav(`/app/orders/${o.id}`)
              }}
            >
              <span>{o.id}</span>
              <span className="text-xs text-mute">{o.items[0]?.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
