import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Field, Input, Select } from '../components/Field.tsx'
import { day, money } from '../lib/format.ts'
import { dueFor, hasPro, moveStage, paidFor, recordPayment, studio, useApp } from '../lib/store.ts'
import { PRO_STAGES, STAGE_LABEL, STUDIO_STAGES, type PayMethod, type Stage } from '../lib/types.ts'

export function OrderDetail() {
  const { id } = useParams()
  const data = useApp()
  const o = data.orders.find((x) => x.id === id)
  const [payOpen, setPayOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PayMethod>('upi')
  if (!o) return <p>Order not found.</p>
  const c = data.customers.find((x) => x.id === o.customerId)
  const paid = paidFor(o.id)
  const due = dueFor(o)
  const pro = hasPro(studio())
  const stages = pro ? PRO_STAGES.filter((s) => s !== 'cancelled') : STUDIO_STAGES.filter((s) => s !== 'cancelled')
  const idx = stages.indexOf(o.stage)

  return (
    <div>
      <Link to="/app/orders" className="text-sm text-mute">
        ← Orders
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">{o.id}</h1>
          <p className="mt-1 text-mute">
            {c?.name} · {o.items[0]?.name} · {o.occasion}
          </p>
        </div>
        <div className="flex gap-2">
          {c ? (
            <a href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(`Hi ${c.name}, update on ${o.id}`)}`}>
              <Button tone="ghost">WhatsApp</Button>
            </a>
          ) : null}
          <Link to={`/o/${o.id}`}>
            <Button tone="ghost">Customer link</Button>
          </Link>
        </div>
      </div>

      <ol className="mt-6 flex flex-wrap gap-2">
        {stages.map((s, i) => (
          <li key={s} className={`rounded-full px-3 py-1 text-xs ${i <= idx ? 'bg-primary text-cream' : 'bg-surface text-mute'}`}>
            {i < idx ? '✓ ' : i === idx ? '● ' : '○ '}
            {STAGE_LABEL[s]}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-line bg-surface p-5 lg:col-span-2">
          <p className="text-xs uppercase tracking-wide text-mute">Delivery</p>
          <p className="mt-1 font-medium">
            {day(o.deliveryOn)} {o.deliveryTime || ''}
          </p>
          <p className="text-sm capitalize text-mute">
            {o.priority} · {o.deliveryMethod} · {o.assignee || 'Unassigned'}
          </p>
          <div className="mt-4">
            <Field label="Move stage">
              <Select value={o.stage} onChange={(e) => moveStage(o.id, e.target.value as Stage)}>
                {(pro ? PRO_STAGES : STUDIO_STAGES).map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABEL[s]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-display text-3xl">{money(o.total)}</p>
          <p className="text-sm text-success">Paid {money(paid)}</p>
          <p className="text-sm text-danger">Due {money(due)}</p>
          <Button className="mt-4 w-full" onClick={() => setPayOpen(true)}>
            Record payment
          </Button>
        </article>
      </div>

      {payOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/30 p-4" onClick={() => setPayOpen(false)}>
          <form
            className="w-full max-w-md rounded-2xl bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault()
              recordPayment({
                customerId: o.customerId,
                orderId: o.id,
                amount: Number(amount) || due,
                method,
                date: new Date().toISOString().slice(0, 10),
              })
              setPayOpen(false)
            }}
          >
            <h3 className="font-display text-2xl">Record payment</h3>
            <p className="text-sm text-mute">Outstanding {money(due)}</p>
            <div className="mt-4 space-y-3">
              <Field label="Amount">
                <Input value={amount} placeholder={String(due)} onChange={(e) => setAmount(e.target.value)} />
              </Field>
              <Field label="Method">
                <Select value={method} onChange={(e) => setMethod(e.target.value as PayMethod)}>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank</option>
                </Select>
              </Field>
            </div>
            <Button className="mt-4 w-full" type="submit">
              Record payment
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
