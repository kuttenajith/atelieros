import { Link } from 'react-router-dom'
import { clsx } from '../lib/clsx.ts'

export function BrandMark({ to = '/', light = false }: { to?: string; light?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm text-cream">✦</span>
      <span className={clsx('font-display text-2xl leading-none', light ? 'text-cream' : 'text-ink')}>AtelierOS</span>
    </Link>
  )
}
