import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
import { Field, Input } from '../components/Field.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { homeAfter, login, loginDemo } from '../lib/store.ts'
import { DEMO_PIN } from '../lib/seed.ts'

export function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function go(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = login(email, password)
      nav(homeAfter(user))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in')
    } finally {
      setBusy(false)
    }
  }

  function demo(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const user = loginDemo(pin || DEMO_PIN)
      nav(homeAfter(user))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo failed')
    }
  }

  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src="/photos/hero.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        <p className="absolute bottom-12 left-12 max-w-sm font-display text-4xl text-cream">
          Your boutique. Your orders. One quiet desk.
        </p>
      </div>
      <div className="flex flex-col justify-center px-6 py-16 sm:px-16">
        <div className="mb-8 flex items-center justify-between">
          <BrandMark />
          <ThemeToggle compact />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl">Sign in</h1>
        <p className="mt-3 max-w-md text-mute">Your studio desk, or the demo floor with PIN 2026.</p>
        <form className="mt-10 max-w-sm space-y-4" onSubmit={go}>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </Field>
          <Field label="Password">
            <div className="relative">
              <Input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
              <button type="button" className="absolute right-3 top-2.5 text-xs text-mute" onClick={() => setShow((v) => !v)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Opening…' : 'Enter the desk'}
          </Button>
        </form>
        <p className="mt-4 max-w-sm text-sm text-mute">
          <Link to="/forgot" className="text-primary">
            Forgot password
          </Link>
          {' · '}
          <Link to="/signup" className="text-primary">
            Start a 14-day trial
          </Link>
        </p>
        <form onSubmit={demo} className="mt-10 max-w-sm space-y-3 border-t border-line pt-8">
          <p className="text-sm text-mute">Walk Meenakshi Atelier (Studio Pro demo).</p>
          <Field label="Demo PIN">
            <Input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="2026" inputMode="numeric" />
          </Field>
          <Button type="submit" tone="ghost" className="w-full">
            Open demo desk
          </Button>
        </form>
      </div>
    </div>
  )
}
