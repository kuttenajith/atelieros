export type Role = 'owner' | 'manager' | 'staff' | 'tailor' | 'accountant' | 'admin'

export type CustomerType = 'regular' | 'vip' | 'bridal' | 'wholesale'

export type OrderType = 'custom' | 'ready' | 'alteration' | 'other'
export type Occasion = 'wedding' | 'reception' | 'party' | 'festival' | 'casual' | 'other'
export type Priority = 'normal' | 'urgent'
export type DeliveryMethod = 'pickup' | 'delivery'

export type Stage =
  | 'new'
  | 'measurement'
  | 'cutting'
  | 'stitching'
  | 'trial'
  | 'alteration'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export type PayMethod = 'upi' | 'cash' | 'card' | 'bank'

export type AttentionKind = 'overdue' | 'payment' | 'delivery' | 'trial'

export type MeasurementField = { key: string; label: string; group: string; value: string }

export type Customer = {
  id: string
  studioId: string
  name: string
  phone: string
  whatsapp?: string
  email?: string
  city?: string
  type: CustomerType
  tags: string[]
  notes?: string
  createdOn: string
}

export type Measurement = {
  id: string
  studioId: string
  customerId: string
  template: string
  date: string
  measuredBy: string
  fields: MeasurementField[]
  notes?: string
  current?: boolean
}

export type StyleItem = {
  id: string
  studioId: string
  name: string
  category: string
  fabric?: string
  color?: string
  neck?: string
  sleeve?: string
  notes?: string
}

export type OrderItem = {
  name: string
  qty: number
  price: number
  styleId?: string
  measurementId?: string
  fabric?: string
  color?: string
  notes?: string
}

export type Payment = {
  id: string
  studioId: string
  customerId: string
  orderId: string
  amount: number
  method: PayMethod
  date: string
  reference?: string
  notes?: string
}

export type Trial = {
  id: string
  studioId: string
  orderId: string
  customerId: string
  date: string
  time: string
  result?: 'perfect' | 'minor' | 'major'
  notes?: string
}

export type Appointment = {
  id: string
  studioId: string
  customerId: string
  orderId?: string
  title: string
  date: string
  time: string
  kind: 'measurement' | 'trial' | 'pickup' | 'other'
}

export type Order = {
  id: string
  studioId: string
  customerId: string
  type: OrderType
  occasion: Occasion
  items: OrderItem[]
  stage: Stage
  assignee?: string
  deliveryOn: string
  deliveryTime?: string
  priority: Priority
  deliveryMethod: DeliveryMethod
  total: number
  createdOn: string
}

export type Activity = {
  id: string
  studioId: string
  at: string
  who: string
  text: string
}

export type Studio = {
  id: string
  name: string
  owner: string
  phone: string
  email: string
  city: string
  country: string
  currency: string
  garments: string[]
  teamSize: string
  createdOn: string
}

export type User = {
  email: string
  name: string
  role: Role
  studioId: string | null
  isAdmin: boolean
  password: string
}

export type AppState = {
  studios: Studio[]
  users: User[]
  customers: Customer[]
  measurements: Measurement[]
  styles: StyleItem[]
  orders: Order[]
  payments: Payment[]
  trials: Trial[]
  appointments: Appointment[]
  activity: Activity[]
}

export const STAGES: Stage[] = [
  'new',
  'measurement',
  'cutting',
  'stitching',
  'trial',
  'alteration',
  'ready',
  'delivered',
]

export const STAGE_LABEL: Record<Stage, string> = {
  new: 'New',
  measurement: 'Measurement',
  cutting: 'Cutting',
  stitching: 'Stitching',
  trial: 'Trial',
  alteration: 'Alteration',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}
