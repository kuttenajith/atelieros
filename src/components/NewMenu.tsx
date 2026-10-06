import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button.tsx'

const items = [
  { label: 'New Customer', to: '/app/customers/new' },
  { label: 'New Order', to: '/app/orders/new' },
  { label: 'New Measurement', to: '/app/measurements/new' },
  { label: 'New Payment', to: '/app/payments' },
  { label: 'New Trial', to: '/app/trials' },
]

export function NewMenu({ compact }: { compact?: boolean }) {
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <Button className={compact ? 'h-12 w-12 rounded-full px-0 text-xl' : ''} onClick={() => setOpen((v) => !v)}>
        {compact ? '+' : '+ New'}
      </Button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
          {items.map((item) => (
            <button
              key={item.to}
              className="block w-full px-4 py-2.5 text-left text-sm hover:bg-bg"
              onClick={() => {
                setOpen(false)
                nav(item.to)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
