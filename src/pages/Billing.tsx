import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
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
      setNote(`HQ has your ${planName(plan)} request. UPI the amount to Ajith, then the desk unlocks when they approve.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not request plan')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="min-h-dvh bg-night px-4 py-12 text-cream sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <BrandMark light />
          <span className="text-sm text-mute">{user?.name}</span>
        </div>
        <p className="mt-10 text-sm uppercase tracking-[0.12em] text-gold-soft">Billing</p>
        <h1 className="mt-2 font-display text-5xl">Subscribe any time</h1>
        <p className="mt-4 max-w-xl text-mute">
          {b.status === 'active'
            ? `${planName(b.plan)} is active until ${b.periodEndsOn}.`
            : b.status === 'trialing'
              ? `Trial is on until ${b.trialEndsOn}. Pay now if you want — you do not have to wait for the trial to end.`
              : `Trial ended on ${b.trialEndsOn}. Pay to open the desk again.`}
        </p>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        {note ? <p className="mt-4 text-sm text-gold-soft">{note}</p> : null}
        {b.requestedPlan ? (
          <p className="mt-4 text-sm text-gold-soft">HQ has your {planName(b.requestedPlan)} request. The desk updates when they approve it.</p>
        ) : null}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {paid.map((p) => (
            <article key={p.id} className="rounded-3xl border border-white/10 bg-night-2 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-mute">{p.name}</p>
              <p className="mt-3 font-display text-5xl tabular-nums">
                {p.price}
                <span className="text-lg text-mute"> / month</span>
              </p>
              <p className="mt-3 text-sm text-mute">{p.note}</p>
              <ul className="mt-4 space-y-1 text-sm text-gold-soft">
                {p.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
              <Button
                tone="gold"
                className="mt-6 w-full"
                disabled={busy !== null || s?.isDemo}
                onClick={() => pay(p.id as 'studio' | 'studio_pro')}
              >
                {busy === p.id ? 'Starting…' : b.status === 'trialing' ? `Start ${p.name} now` : `Pay ${p.price}`}
              </Button>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-mute">
          After HQ approves, return to{' '}
          <Link className="text-gold-soft" to="/app">
            the desk
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
