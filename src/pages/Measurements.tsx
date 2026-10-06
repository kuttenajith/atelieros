import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { studioId, useApp } from '../lib/store.ts'

export function Measurements() {
  const data = useApp()
  const sid = studioId()
  const nav = useNavigate()
  const list = data.measurements.filter((m) => m.studioId === sid)
  return (
    <div>
      <PageHeader
        title="Measurements"
        action={<Button onClick={() => nav('/app/measurements/new')}>+ New measurement</Button>}
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {['Blouse', 'Lehenga', 'Churidar', 'Gown', 'Kids', 'Custom'].map((t) => (
          <span key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-sm">
            {t}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {list.map((m) => {
          const c = data.customers.find((x) => x.id === m.customerId)
          return (
            <Link key={m.id} to={`/app/customers/${m.customerId}`} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
              <span>
                <span className="font-medium">{c?.name}</span>
                <span className="ml-2 text-sm text-mute">{m.template}</span>
              </span>
              <span className="text-sm text-mute">{m.date}{m.current ? ' · Current' : ''}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
