import { useSyncExternalStore } from 'react'
import { nid, todayIso } from './format.ts'
import { ADMIN_EMAIL, ADMIN_PASSWORD, DEMO_PIN, seedState } from './seed.ts'
import { paidBilling, trialBilling } from './plans.ts'
import type { AppState, Billing, Customer, Measurement, Order, Payment, Stage, Studio, User } from './types.ts'

const KEY = 'atelieros-v2'

type Session = { email: string; viewingStudioId: string | null }

let state: AppState = load()
let session: Session | null = readSession()
const listeners = new Set<() => void>()

function fallbackBilling(): Billing {
  return {
    plan: 'studio_pro',
    status: 'active',
    trialEndsOn: todayIso(),
    periodEndsOn: todayIso(),
    requestedPlan: null,
  }
}

function normalize(raw: AppState): AppState {
  return {
    ...raw,
    studios: (raw.studios || []).map((s) => ({
      ...s,
      billing: s.billing || fallbackBilling(),
    })),
    users: (raw.users || []).map((u) =>
      u.isAdmin || u.email.toLowerCase() === ADMIN_EMAIL ? { ...u, password: ADMIN_PASSWORD, isAdmin: true, role: 'admin' } : u,
    ),
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem('atelieros-v1')
    if (raw) return normalize(JSON.parse(raw) as AppState)
  } catch {
    /* empty */
  }
  return seedState()
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((fn) => fn())
}

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem('atelieros-session')
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function writeSession(next: Session | null) {
  session = next
  if (next) sessionStorage.setItem('atelieros-session', JSON.stringify(next))
  else sessionStorage.removeItem('atelieros-session')
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useApp() {
  return useSyncExternalStore(subscribe, () => state, () => state)
}

export function useSession() {
  return useSyncExternalStore(subscribe, () => session, () => session)
}

export function currentUser(): User | null {
  if (!session) return null
  return state.users.find((u) => u.email === session!.email) || null
}

export function studioId(): string | null {
  const u = currentUser()
  if (!u) return null
  if (u.isAdmin) return session?.viewingStudioId || null
  return u.studioId
}

export function login(email: string, password: string) {
  const user = state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || user.password !== password) throw new Error('Incorrect email or password')
  writeSession({ email: user.email, viewingStudioId: user.studioId })
  return user
}

export function loginDemo(pin: string) {
  if (pin !== DEMO_PIN) throw new Error('Demo PIN is 2026')
  const user = state.users.find((u) => u.email === 'priya@meenakshi.atelier')!
  writeSession({ email: user.email, viewingStudioId: user.studioId })
  return user
}

export function logout() {
  writeSession(null)
}

export function homeAfter(user: User) {
  if (user.isAdmin) return '/admin'
  const s = state.studios.find((x) => x.id === user.studioId)
  if (!billingActive(s)) return '/app/billing'
  return '/app'
}

export function resetDemo() {
  state = seedState()
  save()
}

export function impersonateStudio(id: string | null) {
  if (!session) return
  writeSession({ ...session, viewingStudioId: id })
}

function log(text: string, sid?: string) {
  const u = currentUser()
  state = {
    ...state,
    activity: [
      {
        id: nid('ac'),
        studioId: sid || studioId() || 'stu_meenakshi',
        at: `${todayIso()} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
        who: u?.name || 'Staff',
        text,
      },
      ...state.activity,
    ],
  }
}

export function paidFor(orderId: string) {
  return state.payments.filter((p) => p.orderId === orderId).reduce((s, p) => s + p.amount, 0)
}

export function dueFor(order: Order) {
  return Math.max(0, order.total - paidFor(order.id))
}

export function addCustomer(partial: Omit<Customer, 'id' | 'studioId' | 'createdOn'>) {
  const sid = studioId()
  if (!sid) throw new Error('No studio')
  const customer: Customer = {
    ...partial,
    id: nid('cus'),
    studioId: sid,
    createdOn: todayIso(),
  }
  state = { ...state, customers: [customer, ...state.customers] }
  log(`Added customer ${customer.name}`, sid)
  save()
  return customer
}

export function addOrder(partial: Omit<Order, 'studioId' | 'createdOn' | 'total'> & { total?: number }) {
  const sid = studioId()
  if (!sid) throw new Error('No studio')
  const total = partial.total ?? partial.items.reduce((s, i) => s + i.qty * i.price, 0)
  const order: Order = {
    ...partial,
    studioId: sid,
    createdOn: todayIso(),
    total,
  }
  state = { ...state, orders: [order, ...state.orders] }
  log(`Created order ${order.id}`, sid)
  save()
  return order
}

export function recordPayment(partial: Omit<Payment, 'id' | 'studioId'>) {
  const sid = studioId()
  if (!sid) throw new Error('No studio')
  const payment: Payment = { ...partial, id: nid('pay'), studioId: sid }
  state = { ...state, payments: [payment, ...state.payments] }
  log(`Recorded payment ₹${payment.amount.toLocaleString('en-IN')} on ${payment.orderId}`, sid)
  save()
  return payment
}

export function moveStage(orderId: string, stage: Stage) {
  state = {
    ...state,
    orders: state.orders.map((o) => (o.id === orderId ? { ...o, stage } : o)),
  }
  log(`Moved ${orderId} → ${stage}`)
  save()
}

export function saveMeasurement(m: Omit<Measurement, 'id' | 'studioId'>) {
  const sid = studioId()
  if (!sid) throw new Error('No studio')
  const measurement: Measurement = { ...m, id: nid('m'), studioId: sid }
  const rest = measurement.current
    ? state.measurements.map((x) => (x.customerId === m.customerId ? { ...x, current: false } : x))
    : state.measurements
  state = { ...state, measurements: [measurement, ...rest] }
  log(`Saved ${m.template} measurement`)
  save()
  return measurement
}

export function studio() {
  const sid = studioId()
  return state.studios.find((s) => s.id === sid) || null
}

export function updateStudio(patch: Partial<AppState['studios'][0]>) {
  const sid = studioId()
  if (!sid) return
  state = {
    ...state,
    studios: state.studios.map((s) => (s.id === sid ? { ...s, ...patch } : s)),
  }
  log('Updated studio profile', sid)
  save()
}

export function updateTrial(id: string, patch: Partial<Pick<AppState['trials'][0], 'result' | 'notes'>>) {
  state = {
    ...state,
    trials: state.trials.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  }
  log(`Updated trial ${id}`)
  save()
}

export function createStudio(input: {
  name: string
  owner: string
  phone: string
  email: string
  city: string
  country?: string
  garments: string[]
  teamSize: string
  password: string
}) {
  if (state.users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error('That email already has a studio')
  }
  const id = nid('stu')
  const studioRow: AppState['studios'][0] = {
    id,
    name: input.name,
    owner: input.owner,
    phone: input.phone,
    email: input.email,
    city: input.city,
    country: input.country || 'India',
    currency: 'INR',
    garments: input.garments,
    teamSize: input.teamSize,
    createdOn: todayIso(),
    billing: trialBilling(),
  }
  const user: User = {
    email: input.email,
    name: input.owner,
    role: 'owner',
    studioId: id,
    isAdmin: false,
    password: input.password,
  }
  state = {
    ...state,
    studios: [studioRow, ...state.studios],
    users: [user, ...state.users],
  }
  log(`Studio ${input.name} opened`, id)
  save()
  writeSession({ email: user.email, viewingStudioId: id })
  return user
}

export function completeOnboarding(studioPatch: Partial<AppState['studios'][0]>) {
  const sid = studioId()
  if (!sid) return
  state = {
    ...state,
    studios: state.studios.map((s) => (s.id === sid ? { ...s, ...studioPatch } : s)),
  }
  save()
}

export function billingOf(s?: Studio | null): Billing {
  return s?.billing || fallbackBilling()
}

export function billingActive(s?: Studio | null) {
  const u = currentUser()
  if (u?.isAdmin) return true
  const b = billingOf(s)
  if (b.status === 'active') return true
  if (b.status === 'trialing' && b.trialEndsOn >= todayIso()) return true
  return false
}

export function hasPro(s?: Studio | null) {
  const b = billingOf(s)
  return b.plan === 'studio_pro' || b.status === 'trialing'
}

export function requestPlan(plan: 'studio' | 'studio_pro') {
  const sid = studioId()
  if (!sid) return
  const s = state.studios.find((x) => x.id === sid)
  if (s?.isDemo) throw new Error('Demo desk cannot subscribe. Create your own studio.')
  state = {
    ...state,
    studios: state.studios.map((x) =>
      x.id === sid ? { ...x, billing: { ...billingOf(x), requestedPlan: plan } } : x,
    ),
  }
  log(`Requested ${plan} plan`, sid)
  save()
}

export function activatePlan(studioRowId: string, plan: 'studio' | 'studio_pro') {
  const u = currentUser()
  if (!u?.isAdmin) throw new Error('HQ only')
  state = {
    ...state,
    studios: state.studios.map((x) =>
      x.id === studioRowId ? { ...x, billing: paidBilling(plan) } : x,
    ),
  }
  log(`HQ activated ${plan} for ${studioRowId}`, studioRowId)
  save()
}

export function expireIfNeeded() {
  const today = todayIso()
  let changed = false
  const studios = state.studios.map((s) => {
    const b = billingOf(s)
    if (b.status === 'trialing' && b.trialEndsOn < today) {
      changed = true
      return { ...s, billing: { ...b, status: 'expired' as const } }
    }
    if (b.status === 'active' && b.periodEndsOn && b.periodEndsOn < today) {
      changed = true
      return { ...s, billing: { ...b, status: 'expired' as const } }
    }
    return s
  })
  if (changed) {
    state = { ...state, studios }
    save()
  }
}
