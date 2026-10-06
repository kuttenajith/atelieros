import { todayIso } from './format.ts'

const KEY = 'atelieros-visits-v1'

export type VisitLog = {
  total: number
  sessions: number
  byDay: Record<string, number>
  byPath: Record<string, number>
  recent: { at: string; path: string }[]
}

function empty(): VisitLog {
  return { total: 0, sessions: 0, byDay: {}, byPath: {}, recent: [] }
}

export function loadVisits(): VisitLog {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as VisitLog
  } catch {
    /* empty */
  }
  return empty()
}

function save(log: VisitLog) {
  localStorage.setItem(KEY, JSON.stringify(log))
}

export function trackVisit(path: string) {
  const stamp = `${todayIso()}:${path}`
  if (sessionStorage.getItem(`atelieros-hit:${stamp}`)) return loadVisits()
  sessionStorage.setItem(`atelieros-hit:${stamp}`, '1')

  const log = loadVisits()
  const day = todayIso()
  const isNewSession = !sessionStorage.getItem('atelieros-vsid')
  if (isNewSession) {
    sessionStorage.setItem('atelieros-vsid', String(Date.now()))
    log.sessions += 1
  }
  log.total += 1
  log.byDay[day] = (log.byDay[day] || 0) + 1
  log.byPath[path] = (log.byPath[path] || 0) + 1
  log.recent = [{ at: new Date().toISOString(), path }, ...log.recent].slice(0, 12)
  save(log)
  window.dispatchEvent(new Event('atelieros-visits'))
  return log
}

export function visitsToday(log = loadVisits()) {
  return log.byDay[todayIso()] || 0
}

export function visitsWeek(log = loadVisits()) {
  const now = new Date()
  let n = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    n += log.byDay[key] || 0
  }
  return n
}
