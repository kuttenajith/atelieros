import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
import { Field, Input } from '../components/Field.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { createStudio, homeAfter } from '../lib/store.ts'

export function Signup() {
  const nav = useNavigate()
  const [studioName, setStudioName] = useState('')
  const [owner, setOwner] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be 8+ characters')
      return
    }
    setBusy(true)
    try {
      const user = createStudio({
        name: studioName,
        owner,
        phone,
        email,
        city,
        garments: ['Blouses', 'Custom Tailoring'],
        teamSize: 'Boutique + Tailors',
        password,
      })
      nav(homeAfter(user))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create studio')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-dvh bg-bg px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between">
          <BrandMark />
          <ThemeToggle compact />
        </div>
        <h1 className="mt-10 font-display text-4xl sm:text-5xl">Start your boutique desk</h1>
        <p className="mt-3 text-mute">
          14 days free with Studio Pro extras. Then ₹999 Studio or ₹1,500 Pro — wherever you stitch.
        </p>
        <form onSubmit={submit} className="mt-10 space-y-4">
          <Field label="Studio name">
            <Input required value={studioName} onChange={(e) => setStudioName(e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Owner">
              <Input required value={owner} onChange={(e) => setOwner(e.target.value)} />
            </Field>
            <Field label="City">
              <Input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Any city" />
            </Field>
          </div>
          <Field label="WhatsApp / phone">
            <Input required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="tel" />
          </Field>
          <Field label="Email">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value.trim())} />
          </Field>
          <Field label="Password (8+ characters)">
            <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Creating…' : 'Create studio · 14-day trial'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-mute">
          Already have a desk?{' '}
          <Link to="/login" className="text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
