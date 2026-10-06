import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
import { Field, Input } from '../components/Field.tsx'
import { homeAfter, login, loginDemo } from '../lib/store.ts'
import { DEMO_PIN } from '../lib/seed.ts'

export function Login() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('demo') ? 'priya@meenakshi.atelier' : '')
  const [password, setPassword] = useState(params.get('demo') ? DEMO_PIN : '')
  const [show, setShow] = useState(false)
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

  function demo(asAdmin = false) {
    setError('')
    try {
      const user = loginDemo(DEMO_PIN, asAdmin)
      nav(homeAfter(user))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo failed')
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <BrandMark />
        <p className="mt-4 font-display text-3xl">Run your boutique beautifully.</p>
        <form className="mt-8 space-y-4" onSubmit={go}>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password">
            <div className="relative">
              <Input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute right-3 top-2.5 text-xs text-mute" onClick={() => setShow((v) => !v)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-mute">Forgot password? Use demo PIN 2026 for this preview.</p>
        <div className="my-6 h-px bg-line" />
        <Button tone="ghost" className="w-full" onClick={() => demo(false)}>
          Open Meenakshi Atelier demo
        </Button>
        <Button tone="ghost" className="mt-2 w-full" onClick={() => demo(true)}>
          Open HQ admin
        </Button>
        <p className="mt-6 text-center text-sm text-mute">
          Customer looking up an order? <Link className="text-primary" to="/o/AT-1048">Open portal</Link>
        </p>
        <p className="mt-2 text-center text-sm text-mute">
          Don&apos;t have an account? <Link className="text-primary" to="/onboarding">Create your studio</Link>
        </p>
      </div>
    </div>
  )
}
