import { STAGE_LABEL, type CustomerType, type Stage } from '../lib/types.ts'
import { clsx } from '../lib/clsx.ts'

const stageTone: Record<string, string> = {
  new: 'bg-[#efe8dc] text-primary-dark',
  measurement: 'bg-[#efe8dc] text-primary-dark',
  cutting: 'bg-[#e8efe9] text-success',
  stitching: 'bg-[#f4ead8] text-warning',
  trial: 'bg-[#e7eef6] text-[#3d5a80]',
  alteration: 'bg-[#f6e8e7] text-danger',
  ready: 'bg-[#e8efe9] text-success',
  delivered: 'bg-line text-mute',
  cancelled: 'bg-line text-mute',
}

export function StatusPill({ stage }: { stage: Stage }) {
  return (
    <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', stageTone[stage])}>
      {STAGE_LABEL[stage]}
    </span>
  )
}

export function TypePill({ type }: { type: CustomerType }) {
  return (
    <span className="inline-flex rounded-full bg-[#efe8dc] px-2.5 py-0.5 text-xs font-medium capitalize text-primary-dark">
      {type}
    </span>
  )
}
