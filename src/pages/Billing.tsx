import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { PLANS, planName } from '../lib/plans.ts'
import { billingOf, currentUser, requestPlan, studio, useApp } from '../lib/store.ts'

export function Billing() {
  const data = useApp()
  const s = studio() || data.studios.find((x) => x.id === currentUser()?.studioId)
  const user = currentUser()
  const b = billingOf(s)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const paid = PLANS.filter((p) => p.id !== 'trial')

  function pay(plan: 'studio' | 'studio_pro') {
    setError('')
    setNote('')
    setBusy(plan)
    try {
      requestPlan(plan)
      setNote(`HQ has your ${planName(plan)} request. Once they approve, this desk switches immediately.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not request plan')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="min-h-dvh bg-bg px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <span className="text-sm text-mute">{user?.name}</span>
          </div>
        </div>
        <p className="mt-10 text-sm uppercase tracking-[0.12em] text-primary">Billing</p>
        <h1 className="mt-2 font-display text-5xl">Studio or Studio Pro</h1>
        <p className="mt-4 max-w-xl text-mute">
          {b.status === 'active'
            ? `${planName(b.plan)} is active until ${b.periodEndsOn}.`
            : b.status === 'trialing'
              ? `Trial (Pro extras included) until ${b.trialEndsOn}.`
              : `Access ended on ${b.trialEndsOn}. Choose a plan to reopen the desk.`}
        </p>
        <p className="mt-3 text-sm text-mute">
          Studio runs customers, measurements, orders and payments. Production kanban, trials, WhatsApp and reports stay on Pro.
        </p>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        {note ? <p className="mt-4 text-sm text-primary">{note}</p> : null}
        {b.requestedPlan ? (
          <p className="mt-4 text-sm text-primary">HQ has your {planName(b.requestedPlan)} request.</p>
        ) : null}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {paid.map((p) => (
            <article key={p.id} className="rounded-3xl border border-line bg-surface p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-mute">{p.name}</p>
              <p className="mt-3 font-display text-5xl">
                {p.price}
                <span className="text-lg text-mute"> / month</span>
              </p>
              <p className="mt-3 text-sm text-mute">{p.note}</p>
              <ul className="mt-4 space-y-1 text-sm text-primary">
                {p.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                disabled={busy !== null || s?.isDemo}
                onClick={() => pay(p.id as 'studio' | 'studio_pro')}
              >
                {busy === p.id ? 'Starting…' : `Request ${p.name}`}
              </Button>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-mute">
          After HQ approves, return to{' '}
          <Link className="text-primary" to="/app">
            the desk
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
