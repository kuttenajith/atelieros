import { Link } from 'react-router-dom'
import { Button } from './Button.tsx'
import { hasPro, studio } from '../lib/store.ts'

export function ProGate({ children }: { children: React.ReactNode }) {
  const s = studio()
  if (hasPro(s)) return <>{children}</>
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-line bg-surface px-6 py-14 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Studio Pro</p>
      <h1 className="mt-3 font-display text-4xl">This desk is on Studio</h1>
      <p className="mt-3 text-sm text-mute">
        Production, trials, WhatsApp templates and reports stay on Studio Pro. Keep taking orders on Studio — upgrade when the floor needs a kanban.
      </p>
      <Link to="/app/billing" className="mt-6 inline-block">
        <Button>Compare plans</Button>
      </Link>
    </div>
  )
}
