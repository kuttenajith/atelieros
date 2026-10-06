import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Field, Input, Select } from '../components/Field.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { addDays, todayIso } from '../lib/format.ts'
import { addOrder, recordPayment, studioId, useApp } from '../lib/store.ts'
import type { DeliveryMethod, Occasion, OrderType, PayMethod, Priority } from '../lib/types.ts'

export function OrderNew() {
  const data = useApp()
  const sid = studioId()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const customers = data.customers.filter((c) => c.studioId === sid)
  const [customerId, setCustomerId] = useState(params.get('customer') || customers[0]?.id || '')
  const [type, setType] = useState<OrderType>('custom')
  const [occasion, setOccasion] = useState<Occasion>('wedding')
  const [item, setItem] = useState('Bridal Blouse')
  const [price, setPrice] = useState('8500')
  const [deliveryOn, setDeliveryOn] = useState(addDays(todayIso(), 14))
  const [priority, setPriority] = useState<Priority>('normal')
  const [method, setMethod] = useState<DeliveryMethod>('pickup')
  const [advance, setAdvance] = useState('3000')
  const [payMethod, setPayMethod] = useState<PayMethod>('upi')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const total = Number(price) || 0
    const order = addOrder({
      id: `AT-${Math.floor(2000 + Math.random() * 7000)}`,
      customerId,
      type,
      occasion,
      items: [{ name: item, qty: 1, price: total }],
      stage: 'new',
      deliveryOn,
      priority,
      deliveryMethod: method,
      total,
    })
    const adv = Number(advance) || 0
    if (adv > 0) {
      recordPayment({
        customerId,
        orderId: order.id,
        amount: adv,
        method: payMethod,
        date: todayIso(),
      })
    }
    nav(`/app/orders/${order.id}`)
  }

  return (
    <form className="mx-auto max-w-2xl space-y-5" onSubmit={onSubmit}>
      <PageHeader title="New order" />
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-xl">Customer</h2>
        <Field label="Customer *">
          <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
      </section>
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-xl">Details</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Order type">
            <Select value={type} onChange={(e) => setType(e.target.value as OrderType)}>
              <option value="custom">Custom garment</option>
              <option value="ready">Ready-made</option>
              <option value="alteration">Alteration</option>
            </Select>
          </Field>
          <Field label="Occasion">
            <Select value={occasion} onChange={(e) => setOccasion(e.target.value as Occasion)}>
              <option value="wedding">Wedding</option>
              <option value="reception">Reception</option>
              <option value="party">Party</option>
              <option value="festival">Festival</option>
              <option value="casual">Casual</option>
            </Select>
          </Field>
          <Field label="Item">
            <Input value={item} onChange={(e) => setItem(e.target.value)} />
          </Field>
          <Field label="Unit price">
            <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          </Field>
        </div>
      </section>
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-xl">Delivery & payment</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Expected delivery *">
            <Input type="date" value={deliveryOn} onChange={(e) => setDeliveryOn(e.target.value)} required />
          </Field>
          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </Select>
          </Field>
          <Field label="Method">
            <Select value={method} onChange={(e) => setMethod(e.target.value as DeliveryMethod)}>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </Select>
          </Field>
          <Field label="Advance">
            <Input value={advance} onChange={(e) => setAdvance(e.target.value)} />
          </Field>
          <Field label="Advance method">
            <Select value={payMethod} onChange={(e) => setPayMethod(e.target.value as PayMethod)}>
              <option value="upi">UPI</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank">Bank transfer</option>
            </Select>
          </Field>
        </div>
        <p className="mt-3 text-sm text-mute">
          Total ₹{Number(price || 0).toLocaleString('en-IN')} · Balance ₹
          {Math.max(0, Number(price || 0) - Number(advance || 0)).toLocaleString('en-IN')}
        </p>
      </section>
      <Button type="submit">Create Order</Button>
    </form>
  )
}
