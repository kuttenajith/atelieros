import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
import { Field, Input, Select } from '../components/Field.tsx'
import { createStudio } from '../lib/store.ts'

const garments = [
  'Blouses',
  'Sarees',
  'Lehengas',
  'Salwar / Churidar',
  'Dresses',
  'Gowns',
  'Bridal Wear',
  "Men's Wear",
  'Kids Wear',
  'Custom Tailoring',
  'Ready Made',
]

const teams = ['Solo', 'Small team', 'Boutique + Tailors', 'Multi-branch']

export function Onboarding() {
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('India')
  const [password, setPassword] = useState('')
  const [picked, setPicked] = useState<string[]>(['Blouses', 'Custom Tailoring'])
  const [team, setTeam] = useState('Boutique + Tailors')
  const [error, setError] = useState('')

  function toggle(g: string) {
    setPicked((list) => (list.includes(g) ? list.filter((x) => x !== g) : [...list, g]))
  }

  function finish(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      createStudio({
        name,
        owner,
        phone,
        email,
        city,
        country,
        garments: picked,
        teamSize: team,
        password: password || '2026',
      })
      setStep(4)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create studio')
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-8">
        <BrandMark />
        {step === 1 ? (
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
          >
            <h1 className="font-display text-3xl">Tell us about your studio</h1>
            <Field label="Studio name *">
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Owner name *">
              <Input required value={owner} onChange={(e) => setOwner(e.target.value)} />
            </Field>
            <Field label="Phone *">
              <Input required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Email *">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="City *">
                <Input required value={city} onChange={(e) => setCity(e.target.value)} />
              </Field>
              <Field label="Country">
                <Input value={country} onChange={(e) => setCountry(e.target.value)} />
              </Field>
            </div>
            <Field label="Password">
              <Input type="password" value={password} placeholder="Leave blank for 2026" onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Button className="w-full" type="submit">
              Continue
            </Button>
          </form>
        ) : null}

        {step === 2 ? (
          <div className="mt-6">
            <h1 className="font-display text-3xl">What do you create?</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {garments.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggle(g)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${picked.includes(g) ? 'border-primary bg-primary text-white' : 'border-line'}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <Button className="mt-6 w-full" onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        ) : null}

        {step === 3 ? (
          <form className="mt-6" onSubmit={finish}>
            <h1 className="font-display text-3xl">How do you work?</h1>
            <div className="mt-4">
              <Field label="Studio size">
                <Select value={team} onChange={(e) => setTeam(e.target.value)}>
                  {teams.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
            </div>
            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
            <Button className="mt-6 w-full" type="submit">
              Open studio
            </Button>
          </form>
        ) : null}

        {step === 4 ? (
          <div className="mt-6 text-center">
            <h1 className="font-display text-4xl">Your studio is ready</h1>
            <p className="mt-2 text-mute">Walk one order from customer to delivery — without Excel.</p>
            <Button className="mt-6" onClick={() => nav('/app')}>
              Go to Atelier
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
