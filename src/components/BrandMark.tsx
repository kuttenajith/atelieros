import { Link } from 'react-router-dom'
import { clsx } from '../lib/clsx.ts'

export function BrandMark({ to = '/', light = false }: { to?: string; light?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2">
      <span className={clsx('grid h-8 w-8 place-items-center rounded-lg text-white', light ? 'bg-gold text-night' : 'bg-primary')}>✦</span>
      <span className={clsx('font-display text-xl', light ? 'text-cream' : 'text-ink')}>AtelierOS</span>
    </Link>
  )
}
