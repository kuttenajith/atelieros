import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'

export function Landing() {
  return (
    <div className="min-h-dvh bg-bg">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <BrandMark />
        <div className="flex gap-2">
          <Link to="/login" className="px-3 py-2 text-sm text-mute hover:text-ink">
            Sign in
          </Link>
          <Link to="/login?demo=1">
            <Button>Open demo</Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Boutique operating system</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink sm:text-6xl">
          Run your boutique beautifully.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-mute">
          Enquiry to delivery in one studio desk — customers, measurements, production, trials and payments.
          Built for Indian ateliers, not generic CRM.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/login">
            <Button>Sign in to your studio</Button>
          </Link>
          <Link to="/onboarding">
            <Button tone="ghost">Create your studio</Button>
          </Link>
          <Link to="/o/AT-1048">
            <Button tone="ghost">Customer order portal</Button>
          </Link>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            ['Who needs attention', 'Overdue trials, unpaid balances, tomorrow’s deliveries.'],
            ['What to make next', 'Kanban from cutting to stitching to ready.'],
            ['Who owes money', 'Advances, dues, reminders — without Excel.'],
          ].map(([t, d]) => (
            <article key={t} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-display text-xl">{t}</h3>
              <p className="mt-2 text-sm text-mute">{d}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
