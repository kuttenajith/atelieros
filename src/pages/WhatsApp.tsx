import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { Textarea } from '../components/Field.tsx'
import { hasPro, studio } from '../lib/store.ts'

const templates = [
  {
    name: 'Order confirmed',
    body: 'Hi {{customer_name}},\n\nYour {{item_name}} is booked. Order {{order_number}}. Advance received.\n\nThank you,\n{{studio_name}}',
  },
  {
    name: 'Trial reminder',
    body: 'Hi {{customer_name}},\n\nTrial tomorrow for {{item_name}} ({{order_number}}).\n\nSee you at the studio,\n{{studio_name}}',
  },
  {
    name: 'Payment reminder',
    body: 'Hi {{customer_name}},\n\nBalance {{balance}} is due on {{order_number}}.\n\nThank you,\n{{studio_name}}',
  },
  {
    name: 'Order ready',
    body: 'Hi {{customer_name}},\n\nYour {{item_name}} is ready 🎉\nOrder: {{order_number}}\nBalance: {{balance}}\n\nThank you,\n{{studio_name}}',
  },
]

export function WhatsApp() {
  const s = studio()
  const [open, setOpen] = useState(templates[0].name)
  if (!hasPro(s)) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <h1 className="font-display text-3xl">WhatsApp desk is Studio Pro</h1>
        <p className="mt-2 text-mute">Trial reminders and ready messages without leaving AtelierOS.</p>
        <Link to="/app/billing" className="mt-5 inline-block">
          <Button>View plans</Button>
        </Link>
      </div>
    )
  }
  const t = templates.find((x) => x.name === open) || templates[0]
  const preview = t.body
    .replaceAll('{{customer_name}}', 'Priya Sharma')
    .replaceAll('{{item_name}}', 'Bridal Blouse')
    .replaceAll('{{order_number}}', 'AT-1048')
    .replaceAll('{{balance}}', '₹5,500')
    .replaceAll('{{studio_name}}', s?.name || 'Studio')

  return (
    <div>
      <PageHeader title="WhatsApp" subtitle="Templates the boutique actually sends." />
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr_18rem]">
        <div className="space-y-1">
          {templates.map((x) => (
            <button
              key={x.name}
              onClick={() => setOpen(x.name)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${open === x.name ? 'bg-primary text-white' : 'bg-surface text-mute'}`}
            >
              {x.name}
            </button>
          ))}
        </div>
        <Textarea value={t.body} readOnly className="min-h-64" />
        <article className="rounded-2xl bg-[#efe8dc] p-4 text-sm whitespace-pre-wrap">{preview}</article>
      </div>
    </div>
  )
}
