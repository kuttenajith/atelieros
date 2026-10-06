import { useSyncExternalStore } from 'react'
import { applyTheme, getTheme, type ThemeChoice } from '../lib/theme.ts'
import { Moon, Sun } from 'lucide-react'

function subscribe(fn: () => void) {
  window.addEventListener('atelieros-theme', fn)
  return () => window.removeEventListener('atelieros-theme', fn)
}

function snapshot() {
  return getTheme()
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const choice = useSyncExternalStore(subscribe, snapshot, snapshot)
  const next: ThemeChoice = choice === 'light' ? 'dark' : choice === 'dark' ? 'system' : 'light'
  const label = choice === 'system' ? 'Auto' : choice === 'dark' ? 'Dark' : 'Light'

  return (
    <button
      type="button"
      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs text-mute hover:text-ink"
      onClick={() => {
        applyTheme(next)
        window.dispatchEvent(new Event('atelieros-theme'))
      }}
      title="Theme"
    >
      {choice === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
      {compact ? null : label}
    </button>
  )
}
