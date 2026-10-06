import type { ReactNode } from 'react'
import { Button } from './Button.tsx'

export function PageHeader({
  kicker,
  title,
  action,
  subtitle,
}: {
  kicker?: string
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker ? <p className="text-xs uppercase tracking-[0.18em] text-mute">{kicker}</p> : null}
        <h1 className="font-display text-3xl text-ink sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-mute">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function Empty({
  title,
  body,
  cta,
  onClick,
}: {
  title: string
  body: string
  cta?: string
  onClick?: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-mute">{body}</p>
      {cta && onClick ? (
        <Button className="mt-5" onClick={onClick}>
          {cta}
        </Button>
      ) : null}
    </div>
  )
}
