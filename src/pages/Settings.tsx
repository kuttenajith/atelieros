import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button.tsx'
import { Field, Input } from '../components/Field.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { currentUser, studio, updateStudio } from '../lib/store.ts'

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
    </div>
  )
}
