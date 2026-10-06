import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'
import { SiteFooter } from '../components/SiteFooter.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { PLANS } from '../lib/plans.ts'

const steps = [
  { n: '01', title: 'Find the customer', copy: 'Name, phone, measurements and notes — off chat, onto a desk the tailor can open with one hand.' },
  { n: '02', title: 'Fit the garment', copy: 'Blouse, lehenga, gown templates. Compare history. Attach the version to the order.' },
  { n: '03', title: 'Make it', copy: 'Studio keeps the book. Pro adds cutting, stitching, trial and ready on a kanban the floor actually uses.' },
  { n: '04', title: 'Collect & deliver', copy: 'Advance, balance, pickup. A signed customer link so they never have to ask “is it ready?”' },
]

const looks = [
  ['/photos/blouse.jpg', 'Blouse'],
  ['/photos/lehenga.jpg', 'Lehenga'],
  ['/photos/saree.jpg', 'Saree'],
  ['/photos/stitch.jpg', 'Atelier'],
]

export function Landing() {
  return (
    <div className="overflow-x-clip bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="page-wide flex items-center justify-between gap-3 py-3">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm text-mute md:flex">
            <a href="#product" className="hover:text-ink">
              Product
            </a>
            <a href="#looks" className="hover:text-ink">
              Looks
            </a>
            <a href="#pricing" className="hover:text-ink">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Link to="/login" className="hidden text-sm text-mute hover:text-ink sm:inline">
              Log in
            </Link>
            <Link to="/signup">
              <Button className="px-4">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="page-wide grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20 xl:py-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Boutique operating system</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] sm:text-6xl xl:text-7xl">
            Custom stitching,
            <span className="italic text-primary"> beautifully run.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-mute sm:text-lg">
            AtelierOS is the desk for independent designers and made-to-measure studios — customers, measurements, orders and payments in one place. Built for ateliers anywhere, from a phone on the floor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button>
                Start 14-day trial <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button tone="ghost">Open the demo</Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src="/photos/hero.jpg" alt="" className="h-56 w-full rounded-[1.5rem] object-cover sm:h-72 lg:h-[22rem]" />
          <div className="grid gap-3">
            <img src="/photos/blouse.jpg" alt="" className="h-[8.5rem] w-full rounded-[1.5rem] object-cover sm:h-40 lg:h-[10.5rem]" />
            <img src="/photos/lehenga.jpg" alt="" className="h-[8.5rem] w-full rounded-[1.5rem] object-cover sm:h-40 lg:h-[10.5rem]" />
          </div>
        </div>
      </section>

      <section id="product" className="border-t border-line py-16 sm:py-24">
        <div className="page-wide">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">How a piece moves</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">Find. Fit. Make. Deliver.</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((s) => (
              <article key={s.n} className="rounded-3xl border border-line bg-surface p-6">
                <p className="text-xs tracking-[0.18em] text-primary">{s.n}</p>
                <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{s.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="looks" className="border-t border-line py-16 sm:py-24">
        <div className="page-wide">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">The floor</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Blouse to bridal. One customer at a time.</h2>
            </div>
            <p className="max-w-sm text-sm text-mute">Independent designers, custom stitching, measurements and direct communication — the same work FashKnit and boutique floors already live, organised.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {looks.map(([src, label]) => (
              <figure key={label} className="relative overflow-hidden rounded-3xl">
                <img src={src} alt={label} className="aspect-[3/4] w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 pb-4 pt-10 text-sm font-medium text-cream">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-line bg-surface py-16 sm:py-24">
        <div className="page-wide">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Pricing</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Fourteen days free. Then pick a desk.</h2>
          <p className="mt-3 max-w-xl text-mute">Studio is the book. Studio Pro is the floor. Trial includes Pro so you can feel the difference before you pay.</p>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {PLANS.map((p) => (
              <article key={p.id} className={p.featured ? 'rounded-3xl bg-primary p-8 text-cream' : 'rounded-3xl border border-line bg-bg p-8'}>
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">{p.name}</p>
                <p className="mt-3 font-display text-5xl">
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
                  <Button tone={p.featured ? 'ghost' : 'primary'} className={p.featured ? 'border-cream/40 bg-transparent text-cream' : ''}>
                    Get started
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wide py-16 sm:py-24">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-blush">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Go live</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">For ateliers everywhere.</h2>
              <p className="mt-4 max-w-md text-mute">Open a desk, walk one real order, invite the floor. No city waitlist — AtelierOS is ready wherever you stitch.</p>
              <Link to="/signup" className="mt-8 inline-flex">
                <Button>
                  Create your studio <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <img src="/photos/atelier.jpg" alt="" className="h-64 w-full object-cover lg:h-full" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
