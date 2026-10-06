import { PageHeader } from '../components/PageHeader.tsx'
import { studioId, useApp } from '../lib/store.ts'

const palette = ['#6b2d2d', '#f3e6d8', '#e8d5a3', '#2c4a3e']

export function Styles() {
  const data = useApp()
  const sid = studioId()
  const list = data.styles.filter((s) => s.studioId === sid)
  return (
    <div>
      <PageHeader title="Style library" subtitle="Attach a look to any order" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <article key={s.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="h-36" style={{ background: palette[i % palette.length] }} />
            <div className="p-4">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-mute">
                {s.category} · {s.fabric} · {s.neck}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
