import type { ReactNode } from 'react'
import { clsx } from '../lib/clsx.ts'

export function Button({
  children,
  tone = 'primary',
  className,
  type = 'button',
  onClick,
  disabled,
}: {
  children: ReactNode
  tone?: 'primary' | 'ghost' | 'danger' | 'success'
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition',
        tone === 'primary' && 'bg-primary text-white hover:bg-primary-dark',
        tone === 'ghost' && 'border border-line bg-surface text-ink hover:border-primary/40',
        tone === 'danger' && 'bg-danger text-white',
        tone === 'success' && 'bg-success text-white',
        disabled && 'pointer-events-none opacity-55',
        className,
      )}
    >
      {children}
    </button>
  )
}
