import { addDays, todayIso } from './format.ts'
import type { Billing, PlanId } from './types.ts'

export const PLANS: {
  id: PlanId
  name: string
  price: string
  monthly: number
  note: string
  items: string[]
  featured?: boolean
}[] = [
  {
    id: 'trial',
    name: 'Trial',
    price: '₹0',
    monthly: 0,
    note: '14 days. Your own boutique desk — Pro extras included while you try it.',
    items: ['Customers and measurements', 'Orders and production', 'Trials and deliveries', 'Payments', 'Customer order link'],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '₹999',
    monthly: 999,
    note: 'The boutique desk after the trial.',
    items: ['Unlimited customers', 'Measurements and styles', 'Orders and payments', 'Deliveries', 'Customer portal links'],
    featured: true,
  },
  {
    id: 'studio_pro',
    name: 'Studio Pro',
    price: '₹1,500',
    monthly: 1500,
    note: 'The full atelier CRM HQ can switch on for a boutique.',
    items: [
      'Everything in Studio',
      'Production kanban',
      'Trial calendar',
      'WhatsApp desk',
      'Reports',
      'HQ monitoring',
    ],
  },
]

export function planName(id?: string | null) {
  if (id === 'studio_pro') return 'Studio Pro'
  if (id === 'studio') return 'Studio'
  if (id === 'trial') return 'Trial'
  return id || '—'
}

export function trialBilling(): Billing {
  return {
    plan: 'trial',
    status: 'trialing',
    trialEndsOn: addDays(todayIso(), 14),
    periodEndsOn: null,
    requestedPlan: null,
  }
}

export function paidBilling(plan: 'studio' | 'studio_pro'): Billing {
  return {
    plan,
    status: 'active',
    trialEndsOn: addDays(todayIso(), 14),
    periodEndsOn: addDays(todayIso(), 30),
    requestedPlan: null,
  }
}
