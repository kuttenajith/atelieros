import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark.tsx'
import { Button } from '../components/Button.tsx'

export function Forgot() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-4">
      <div className="w-full max-w-md">
        <BrandMark />
        <h1 className="mt-10 font-display text-4xl">Reset password</h1>
        <p className="mt-4 text-mute">
          Mail HQ at <span className="text-primary">ajithkutten1998@gmail.com</span> from the studio email. We reset the desk the same day.
        </p>
        <p className="mt-3 text-sm text-mute">Demo floor still opens with PIN 2026.</p>
        <Link to="/login" className="mt-8 inline-block">
          <Button>Back to sign in</Button>
        </Link>
      </div>
    </div>
  )
}
