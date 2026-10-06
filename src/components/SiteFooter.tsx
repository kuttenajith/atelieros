import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark.tsx'

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-4 py-14 text-sm text-mute sm:px-6">
      <div className="page-wide grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xs text-mute">
            The boutique desk for independent designers — measurements, orders and the floor, without a spreadsheet.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Product</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="#product" className="hover:text-ink">
                Desk
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-ink">
                Pricing
              </a>
            </li>
            <li>
              <Link to="/signup" className="hover:text-ink">
                14-day trial
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Studio</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/login" className="hover:text-ink">
                Log in
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-ink">
                Get started
              </Link>
            </li>
            <li>
              <Link to="/forgot" className="hover:text-ink">
                Reset password
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Plans</p>
          <ul className="mt-4 space-y-2">
            <li>Studio · ₹999 / month</li>
            <li>Studio Pro · ₹1,500 / month</li>
            <li>Worldwide</li>
          </ul>
        </div>
      </div>
      <p className="page-wide mt-12 text-xs">© {new Date().getFullYear()} AtelierOS. For the people who make clothes.</p>
    </footer>
  )
}
