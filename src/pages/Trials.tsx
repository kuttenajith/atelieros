import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Field, Select, Textarea } from '../components/Field.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { clock } from '../lib/format.ts'
import { studioId, updateTrial, useApp } from '../lib/store.ts'
import type { Trial } from '../lib/types.ts'

export function Trials() {
  const data = useApp()
  const sid = studioId()
  const trials = data.trials.filter((t) => t.studioId === sid)
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      <PageHeader title="Trials" subtitle="Today’s fittings — mark the result before the customer leaves." />
      <div className="space-y-3">
        {trials.map((t) => {
          const c = data.customers.find((x) => x.id === t.customerId)
          const o = data.orders.find((x) => x.id === t.orderId)
          return (
            <article key={t.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-mute">{t.id}</p>
                  <h2 className="font-display text-2xl">{c?.name}</h2>
                  <p className="text-sm text-mute">
                    {o?.items[0]?.name} · {t.date} {clock(t.time)}
                  </p>
                </div>
                <Button tone="ghost" onClick={() => setOpen(open === t.id ? null : t.id)}>
                  {open === t.id ? 'Close' : 'Record result'}
                </Button>
              </div>
              {open === t.id ? (
                <form
                  className="mt-4 space-y-3 border-t border-line pt-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const form = e.currentTarget
                    const result = (form.elements.namedItem('result') as HTMLSelectElement).value as Trial['result']
                    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value
                    updateTrial(t.id, { result, notes })
                    setOpen(null)
                  }}
                >
                  <Field label="Fitting result">
                    <Select name="result" defaultValue={t.result || 'perfect'}>
                      <option value="perfect">Perfect</option>
                      <option value="minor">Minor alteration</option>
                      <option value="major">Major alteration</option>
                    </Select>
                  </Field>
                  <Field label="Notes">
                    <Textarea name="notes" defaultValue={t.notes} placeholder="Sleeve is slightly tight" />
                  </Field>
                  <div className="flex gap-2">
                    <Button type="submit">Save trial</Button>
                    {o ? (
                      <Link to={`/app/orders/${o.id}`}>
                        <Button tone="ghost" type="button">
                          Open order
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </form>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
