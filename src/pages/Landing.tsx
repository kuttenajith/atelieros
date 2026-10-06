import { Link } from 'react-router-dom'
import { ArrowRight, Columns3, CreditCard, Ruler, Scissors, Shirt, Truck, Users, MessageCircle } from 'lucide-react'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
import { SiteFooter } from '../components/SiteFooter.tsx'
import { PLANS } from '../lib/plans.ts'

const suite = [
  {
    icon: Users,
    title: 'Customer',
    copy: 'Name, phone, VIP tags, notes — off WhatsApp, onto a desk the tailor can open with one thumb.',
    photo: '/photos/blouse.jpg',
  },
  {
    icon: Ruler,
    title: 'Measurement',
    copy: 'Blouse, lehenga, gown templates. History and compare. Use this version on the next order.',
    photo: '/photos/stitch.jpg',
  },
  {
    icon: Shirt,
    title: 'Style library',
    copy: 'Neck, sleeve, fabric, colour — attach a look to the order so the floor is not guessing.',
    photo: '/photos/saree.jpg',
  },
  {
    icon: CreditCard,
    title: 'Payments',
    copy: 'Advance, balance, overdue. Outstanding is always on the order, never in a notebook.',
    photo: '/photos/lehenga.jpg',
  },
  {
    icon: Columns3,
    title: 'Production',
    copy: 'New → cutting → stitching → trial → ready. Urgent cards do not hide. Studio Pro.',
  },
  {
    icon: Scissors,
    title: 'Trials & alterations',
    copy: 'Perfect, minor, major. Sleeve tight by 0.5" becomes a job, not a voice note.',
  },
  {
    icon: Truck,
    title: 'Delivery',
    copy: 'Collect the balance, inspect, hand over. The customer link already told them it was ready.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp desk',
    copy: 'Order confirmed. Trial tomorrow. Balance due. Ready for pickup. Studio Pro.',
  },
]

const verticals = [
  ['/photos/blouse.jpg', 'Blouse'],
  ['/photos/lehenga.jpg', 'Lehenga'],
  ['/photos/saree.jpg', 'Saree'],
  ['/photos/atelier.jpg', 'Atelier'],
]

export function Landing() {
  return (
    <div className="overflow-x-clip bg-night text-cream">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-night/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <BrandMark light />
          <nav className="hidden items-center gap-8 text-sm text-mute lg:flex">
            <a href="#product" className="hover:text-cream">
              Product
            </a>
            <a href="#desk" className="hover:text-cream">
              The desk
            </a>
            <a href="#pricing" className="hover:text-cream">
              Pricing
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/login" className="text-sm text-mute hover:text-cream">
              Log in
            </Link>
            <Link to="/signup">
              <Button tone="gold" className="px-3 text-xs sm:px-5 sm:text-sm">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-soft">AtelierOS boutique desk</p>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] text-cream sm:text-6xl">
            Designed for boutiques.
            <span className="block text-gold-soft">Built to run the order.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-mute sm:text-lg">
            Enquiry, measurement, stitching, trial, advance — then Pro adds production, WhatsApp and reports. Built for ateliers, not for generic CRM.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup">
              <Button tone="gold" className="px-6">
                Start 14-day trial <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button tone="ghostGold" className="px-6">
                Sign in / demo
              </Button>
            </Link>
          </div>
        </div>
        <figure className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/10">
          <img src="/photos/hero.jpg" alt="Silk drape in a boutique" className="aspect-[16/10] w-full object-cover sm:aspect-[21/9]" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
          <figcaption className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 sm:bottom-6 sm:left-6">
            {['Customers', 'Measurements', 'Production', 'Payments'].map((chip) => (
              <span key={chip} className="rounded-full border border-gold/35 bg-night/70 px-3 py-1 text-xs uppercase tracking-wider text-gold-soft backdrop-blur">
                {chip}
              </span>
            ))}
          </figcaption>
        </figure>
      </section>

      <section id="product" className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">The desk</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">One blouse on the board. Then the next.</h2>
              <p className="mt-5 text-lg text-mute">
                A WhatsApp “I need a bridal blouse for the 18th” becomes a customer, a measurement, an order, an advance, and a trial slot.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-cream/85">
                <li>Customer portal — no login, just a signed link</li>
                <li>Production stages the tailor can tap from a phone</li>
                <li>Advance, balance, overdue — always on the order</li>
              </ul>
              <Link to="/signup" className="mt-8 inline-block">
                <Button tone="gold">
                  Open a boutique <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3">
              <article className="rounded-3xl border border-white/10 bg-night-2 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-mute">Needs attention</p>
                {[
                  ['Priya Sharma', 'Trial overdue'],
                  ['Anitha', '₹4,500 due'],
                  ['Meena', 'Delivery tomorrow'],
                ].map(([n, p]) => (
                  <div key={n} className="mt-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0">
                    <span className="min-w-0 truncate">{n}</span>
                    <span className="shrink-0 text-gold-soft">{p}</span>
                  </div>
                ))}
              </article>
              <article className="rounded-3xl border border-white/10 bg-night-2 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-mute">Floor today</p>
                {[
                  ['Cutting', '6'],
                  ['Stitching', '8'],
                  ['Trial', '3'],
                ].map(([n, p]) => (
                  <div key={n} className="mt-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0">
                    <span>{n}</span>
                    <span className="font-display text-2xl text-gold-soft">{p}</span>
                  </div>
                ))}
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-night-2 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">All on one desk</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl sm:text-5xl">Everything you need. In the order a garment actually runs.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {suite.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-3xl border border-white/10 bg-night">
                {item.photo ? <img src={item.photo} alt="" className="h-44 w-full object-cover sm:h-52" /> : null}
                <div className="p-6">
                  <item.icon className="text-gold" size={22} />
                  <h3 className="mt-4 font-display text-3xl">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-mute">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-4 sm:px-6">
          {[
            ['14 days', 'Free trial on your own account'],
            ['₹999', 'Studio, billed monthly'],
            ['₹1,500', 'Studio Pro, when you are ready'],
            ['Madurai', 'Built for Tamil Nadu first'],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="font-display text-3xl text-gold-soft sm:text-4xl">{k}</p>
              <p className="mt-2 text-sm text-mute">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="desk" className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Made for the season</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl sm:text-5xl">Blouse to bridal. One customer at a time.</h2>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {verticals.map(([src, label]) => (
              <figure key={label} className="relative overflow-hidden rounded-2xl">
                <img src={src} alt={label} className="aspect-[3/4] w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night to-transparent px-3 pb-4 pt-10 text-sm font-semibold uppercase tracking-[0.08em]">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-white/10 bg-night-2 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Pricing</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Fourteen days free. Then the boutique pays.</h2>
          <p className="mt-4 max-w-xl text-mute">
            Create an account, run a real order, pay ₹999 / month when the trial ends. Studio Pro is ₹1,500 for production, WhatsApp and reports.
          </p>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {PLANS.map((p) => (
              <article key={p.id} className={p.featured ? 'rounded-3xl bg-gold p-8 text-night' : 'rounded-3xl border border-white/10 bg-night p-8'}>
                <p className="text-xs uppercase tracking-[0.22em] opacity-70">{p.name}</p>
                <p className="mt-3 font-display text-5xl tabular-nums">
                  {p.price}
                  <span className="text-lg opacity-70"> / month</span>
                </p>
                <p className="mt-3 text-sm opacity-80">{p.note}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.items.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-6 inline-block">
                  <Button tone={p.featured ? 'cream' : 'gold'}>Get started</Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center bg-night-2 p-8 sm:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Start today</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">Madurai first. Then the rest of Tamil Nadu.</h2>
              <p className="mt-5 text-mute">
                Open a desk, save a real customer, take an advance. Upgrade when the trial still earns its morning.
              </p>
              <Link to="/signup" className="mt-8 inline-flex">
                <Button tone="gold">
                  Create a boutique account <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <img src="/photos/atelier.jpg" alt="Atelier at work" className="h-64 w-full object-cover lg:h-full" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
