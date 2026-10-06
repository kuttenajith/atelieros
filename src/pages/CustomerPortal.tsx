import { Link, useParams } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
import { clock, day, money } from '../lib/format.ts'
import { dueFor, paidFor, useApp } from '../lib/store.ts'
import { STAGES, STAGE_LABEL } from '../lib/types.ts'

export function CustomerPortal() {
  const { orderId } = useParams()
  const data = useApp()
  const o = data.orders.find((x) => x.id === orderId)
  if (!o) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-4">
        <div className="max-w-md text-center">
          <BrandMark />
          <p className="mt-6 font-display text-3xl">We could not find that order.</p>
          <p className="mt-2 text-mute">Ask the boutique for a fresh link.</p>
        </div>
      </div>
    )
  }
  const c = data.customers.find((x) => x.id === o.customerId)
  const studio = data.studios.find((s) => s.id === o.studioId)
  const trial = data.trials.find((t) => t.orderId === o.id)
  const due = dueFor(o)
  const paid = paidFor(o.id)
  const idx = STAGES.indexOf(o.stage)

  return (
    <div className="min-h-dvh bg-bg px-4 py-8">
      <div className="mx-auto max-w-md">
        <BrandMark />
        <p className="mt-8 text-sm text-mute">{studio?.name}</p>
        <h1 className="font-display text-4xl">Hi {c?.name?.split(' ')[0] || 'there'}</h1>
        <p className="mt-2 text-mute">Your order {o.id}</p>
        <article className="mt-6 rounded-3xl border border-line bg-surface p-5">
          <p className="font-display text-2xl">{o.items[0]?.name}</p>
          <p className="capitalize text-sm text-mute">{o.occasion} · {o.deliveryMethod}</p>
          <ol className="mt-5 space-y-2">
            {STAGES.filter((s) => s !== 'cancelled' && s !== 'alteration').map((s, i) => (
              <li key={s} className="flex items-center gap-2 text-sm">
                <span className={i <= idx ? 'text-primary' : 'text-mute'}>
                  {i < idx ? '✓' : i === idx ? '●' : '○'}
                </span>
                <span className={i <= idx ? 'text-ink' : 'text-mute'}>{STAGE_LABEL[s]}</span>
              </li>
            ))}
          </ol>
        </article>
        {trial ? (
          <article className="mt-4 rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-mute">Trial</p>
            <p className="mt-1 font-medium">
              {day(trial.date)} · {clock(trial.time)}
            </p>
          </article>
        ) : null}
        <article className="mt-4 rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-mute">Balance</p>
          <p className="font-display text-3xl">{money(due)}</p>
          <p className="text-sm text-mute">
            {money(paid)} paid of {money(o.total)}
          </p>
          {due > 0 ? (
            <a
              className="mt-4 block"
              href={`https://wa.me/91${studio?.phone}?text=${encodeURIComponent(`Hi, I would like to pay ${money(due)} for ${o.id}`)}`}
            >
              <Button className="w-full">Pay now via WhatsApp</Button>
            </a>
          ) : (
            <p className="mt-3 text-sm text-success">Fully paid. See you at pickup.</p>
          )}
        </article>
        <p className="mt-8 text-center text-sm text-mute">
          Studio desk? <Link className="text-primary" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
