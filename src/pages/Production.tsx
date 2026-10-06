import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.tsx'
import { day } from '../lib/format.ts'
import { moveStage, studioId, useApp } from '../lib/store.ts'
import { STAGE_LABEL, type Stage } from '../lib/types.ts'

const cols: Stage[] = ['new', 'cutting', 'stitching', 'trial', 'ready']

export function Production() {
  const data = useApp()
  const sid = studioId()
  const [params] = useSearchParams()
  const highlight = params.get('stage')
  const orders = data.orders.filter((o) => o.studioId === sid && o.stage !== 'delivered' && o.stage !== 'cancelled')

  return (
    <div>
      <PageHeader title="Production" subtitle="Drag is a later sprint — tap a card, then move the stage." />
      <div className="grid gap-3 md:grid-cols-5">
        {cols.map((col) => (
          <section key={col} className={`rounded-2xl border p-3 ${highlight === col ? 'border-primary' : 'border-line'} bg-surface`}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute">
              {STAGE_LABEL[col]} · {orders.filter((o) => o.stage === col).length}
            </p>
            <div className="space-y-2">
              {orders
                .filter((o) => o.stage === col)
                .map((o) => {
                  const c = data.customers.find((x) => x.id === o.customerId)
                  return (
                    <article key={o.id} className="rounded-xl border border-line bg-bg p-3">
                      <Link to={`/app/orders/${o.id}`} className="font-medium">
                        {o.id}
                      </Link>
                      <p className="text-xs text-mute">
                        {c?.name}
                        <br />
                        {o.items[0]?.name}
                      </p>
                      <p className="mt-1 text-xs">Due {day(o.deliveryOn)}</p>
                      {o.priority === 'urgent' ? <p className="text-xs text-danger">Urgent</p> : null}
                      <select
                        className="mt-2 w-full rounded-lg border border-line bg-surface px-2 py-1 text-xs"
                        value={o.stage}
                        onChange={(e) => moveStage(o.id, e.target.value as Stage)}
                      >
                        {cols.concat('alteration', 'delivered').map((s) => (
                          <option key={s} value={s}>
                            {STAGE_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </article>
                  )
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
