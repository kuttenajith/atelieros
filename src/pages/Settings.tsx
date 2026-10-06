import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Field, Input } from '../components/Field.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { planName } from '../lib/plans.ts'
import { billingOf, currentUser, studio, updateStudio } from '../lib/store.ts'

export function Settings() {
  const s = studio()
  const user = currentUser()
  const [name, setName] = useState(s?.name || '')
  const [phone, setPhone] = useState(s?.phone || '')
  const [city, setCity] = useState(s?.city || '')
  const [saved, setSaved] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!s) return
    updateStudio({ name, phone, city })
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Studio" subtitle="How the boutique appears on invoices and the customer link." />
      <form className="space-y-4 rounded-2xl border border-line bg-surface p-5" onSubmit={onSubmit}>
        <Field label="Studio name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="City">
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <p className="text-sm text-mute">
          Signed in as {user?.name} · {user?.role}
        </p>
        {s?.garments?.length ? <p className="text-sm text-mute">Makes {s.garments.join(', ')}</p> : null}
        <Button type="submit">Save studio</Button>
        {saved ? <p className="text-sm text-success">Saved.</p> : null}
      </form>
      <article className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-mute">Appearance</p>
        <p className="mt-1 text-sm text-mute">Light, dark, or follow the device.</p>
        <div className="mt-3">
          <ThemeToggle />
        </div>
      </article>
      <article className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-mute">Your plan</p>
        <p className="mt-1 font-display text-3xl">{planName(billingOf(s).plan)}</p>
        <p className="mt-1 text-sm text-mute">
          {billingOf(s).status === 'trialing' ? `Trial until ${billingOf(s).trialEndsOn}` : `Renewal ${billingOf(s).periodEndsOn || '—'}`}
        </p>
        <Link to="/app/billing" className="mt-4 inline-block">
          <Button tone="ghost">Manage subscription</Button>
        </Link>
      </article>
    </div>
  )
}
