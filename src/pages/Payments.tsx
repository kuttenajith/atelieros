import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Field, Input, Select } from '../components/Field.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { day, money } from '../lib/format.ts'
import { dueFor, recordPayment, studioId, useApp } from '../lib/store.ts'
import type { PayMethod } from '../lib/types.ts'

export function Payments() {
  const data = useApp()
  const sid = studioId()
  const pays = data.payments.filter((p) => p.studioId === sid)
  const orders = data.orders.filter((o) => o.studioId === sid)
  const collected = pays.reduce((s, p) => s + p.amount, 0)
  const outstanding = orders.reduce((s, o) => s + dueFor(o), 0)
  const overdue = orders.filter((o) => o.stage !== 'delivered' && dueFor(o) > 0 && o.deliveryOn < new Date().toISOString().slice(0, 10)).reduce((s, o) => s + dueFor(o), 0)
  const [open, setOpen] = useState(false)
  const [orderId, setOrderId] = useState(orders[0]?.id || '')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PayMethod>('upi')

  const rows = useMemo(
    () =>
      [...pays].sort((a, b) => b.date.localeCompare(a.date)),
    [pays],
  )

  return (
    <div>
      <PageHeader title="Payments" action={<Button onClick={() => setOpen(true)}>Record payment</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-mute">Collected</p>
          <p className="font-display text-3xl">{money(collected)}</p>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-mute">Outstanding</p>
          <p className="font-display text-3xl">{money(outstanding)}</p>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-mute">Overdue</p>
          <p className="font-display text-3xl text-danger">{money(overdue)}</p>
        </article>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-mute">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Method</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const c = data.customers.find((x) => x.id === p.customerId)
              return (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3">{day(p.date)}</td>
                  <td className="px-4 py-3">{c?.name}</td>
                  <td className="px-4 py-3">
                    <Link className="underline" to={`/app/orders/${p.orderId}`}>
                      {p.orderId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">{money(p.amount)}</td>
                  <td className="px-4 py-3 uppercase">{p.method}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/30 p-4" onClick={() => setOpen(false)}>
          <form
            className="w-full max-w-md rounded-2xl bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault()
              const o = orders.find((x) => x.id === orderId)
              if (!o) return
              recordPayment({
                customerId: o.customerId,
                orderId: o.id,
                amount: Number(amount) || dueFor(o),
                method,
                date: new Date().toISOString().slice(0, 10),
              })
              setOpen(false)
            }}
          >
            <h3 className="font-display text-2xl">Record payment</h3>
            <div className="mt-4 space-y-3">
              <Field label="Order">
                <Select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} · due {money(dueFor(o))}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Amount">
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
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
