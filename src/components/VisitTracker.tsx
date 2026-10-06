import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackVisit } from '../lib/visits.ts'

export function VisitTracker() {
  const loc = useLocation()
  useEffect(() => {
    trackVisit(loc.pathname)
  }, [loc.pathname])
  return null
}
