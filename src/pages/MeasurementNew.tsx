import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { Field, Input, Select, Textarea } from '../components/Field.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { saveMeasurement, studioId, useApp } from '../lib/store.ts'
import { todayIso } from '../lib/format.ts'

const GROUPS = [
  { group: 'BODY', fields: ['Bust', 'Under bust', 'Waist', 'Hip'] },
  { group: 'UPPER BODY', fields: ['Shoulder', 'Armhole', 'Front neck', 'Back neck'] },
  { group: 'SLEEVE', fields: ['Sleeve length', 'Sleeve opening'] },
]

export function MeasurementNew() {
  const data = useApp()
  const sid = studioId()
  const nav = useNavigate()
  const customers = data.customers.filter((c) => c.studioId === sid)
  const [customerId, setCustomerId] = useState(customers[0]?.id || '')
  const [template, setTemplate] = useState('Bridal Blouse')
  const [vals, setVals] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')
  const [ask, setAsk] = useState(false)

  const fields = useMemo(
    () =>
      GROUPS.flatMap((g) =>
        g.fields.map((label) => ({ key: label.toLowerCase(), label, group: g.group, value: vals[label] || '' })),
      ),
    [vals],
  )

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    saveMeasurement({
      customerId,
      template,
      date: todayIso(),
      measuredBy: 'Priya',
      fields,
      notes,
      current: true,
    })
    setAsk(true)
  }

  return (
    <form className="mx-auto max-w-2xl" onSubmit={onSubmit}>
      <PageHeader title="New measurement" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Customer">
          <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Template">
          <Select value={template} onChange={(e) => setTemplate(e.target.value)}>
            {['Bridal Blouse', 'Lehenga', 'Churidar', 'Gown'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
      </div>
      {GROUPS.map((g) => (
        <section key={g.group} className="mt-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-mute">{g.group}</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {g.fields.map((label) => (
              <Field key={label} label={`${label} (in)`}>
                <Input
                  inputMode="decimal"
                  value={vals[label] || ''}
                  onChange={(e) => setVals((v) => ({ ...v, [label]: e.target.value }))}
                />
              </Field>
            ))}
          </div>
        </section>
      ))}
      <div className="mt-6">
        <Field label="Notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
      <Button className="mt-5" type="submit">
        Save measurement
      </Button>
      {ask ? (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
          <p>Use this measurement for a new order?</p>
          <div className="mt-3 flex gap-2">
            <Button type="button" onClick={() => nav(`/app/orders/new?customer=${customerId}`)}>
              Yes
            </Button>
            <Button type="button" tone="ghost" onClick={() => nav(`/app/customers/${customerId}`)}>
              Not now
            </Button>
          </div>
        </div>
      ) : null}
    </form>
  )
}
