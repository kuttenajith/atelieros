import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Field, Input, Select, Textarea } from '../components/Field.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { addCustomer } from '../lib/store.ts'
import type { CustomerType } from '../lib/types.ts'

export function CustomerNew() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [type, setType] = useState<CustomerType>('regular')
  const [notes, setNotes] = useState('')

  function save(andOrder: boolean) {
    const c = addCustomer({
      name,
      phone,
      whatsapp,
      email,
      city,
      type,
      tags: type === 'vip' || type === 'bridal' ? [type.toUpperCase()] : [],
      notes,
    })
    nav(andOrder ? `/app/orders/new?customer=${c.id}` : `/app/customers/${c.id}`)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    save(false)
  }

  return (
    <form className="mx-auto max-w-2xl" onSubmit={onSubmit}>
      <PageHeader kicker="Customers" title="Add customer" />
      <div className="space-y-4 rounded-2xl border border-line bg-surface p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *">
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Phone *">
            <Input required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="City">
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label="Customer type">
            <Select value={type} onChange={(e) => setType(e.target.value as CustomerType)}>
              <option value="regular">Regular</option>
              <option value="vip">VIP</option>
              <option value="bridal">Bridal</option>
              <option value="wholesale">Wholesale</option>
            </Select>
          </Field>
        </div>
        <Field label="Notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button tone="ghost" onClick={() => nav(-1)}>
          Cancel
        </Button>
        <Button type="submit">Save Customer</Button>
        <Button
          type="button"
          onClick={() => {
            if (!name || !phone) return
            save(true)
          }}
        >
          Save & Create Order
        </Button>
      </div>
    </form>
  )
}
