export type ThemeChoice = 'light' | 'dark' | 'system'

const KEY = 'atelieros-theme'

export function getTheme(): ThemeChoice {
  const raw = localStorage.getItem(KEY)
  if (raw === 'dark' || raw === 'light' || raw === 'system') return raw
  return 'system'
}

export function resolvedTheme(choice = getTheme()) {
  if (choice === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return choice
}

export function applyTheme(choice: ThemeChoice) {
  localStorage.setItem(KEY, choice)
  document.documentElement.dataset.theme = resolvedTheme(choice)
}

export function bootTheme() {
  applyTheme(getTheme())
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') applyTheme('system')
  })
}
