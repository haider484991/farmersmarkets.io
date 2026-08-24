import { ADS_DEBUG } from '@/lib/adsense'

interface AdFrameProps {
  /** The slot ID backing this placement, used to decide what to render. */
  slot: string
  /** Placement name, shown only in debug mode. */
  label: string
  /** Extra classes for the wrapper. */
  className?: string
  children: React.ReactNode
}

/**
 * Shared wrapper for every ad placement.
 *
 * Adds the "Advertisement" label AdSense policy expects above paid content,
 * and decides what an unconfigured placement does: normally nothing at all,
 * but a labelled outline when NEXT_PUBLIC_ADS_DEBUG=1, so a placement that is
 * missing entirely can be told apart from one that simply isn't filling.
 */
export function AdFrame({ slot, label, className = '', children }: AdFrameProps) {
  if (!slot) {
    if (!ADS_DEBUG) return null
    return (
      <div
        className={`my-8 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-center ${className}`.trim()}
      >
        <p className="text-xs font-medium text-amber-800">
          Ad placement &ldquo;{label}&rdquo; — no slot ID configured
        </p>
        <p className="mt-1 text-[11px] text-amber-700">
          Add it to SLOT_IDS in lib/adsense.ts
        </p>
      </div>
    )
  }

  return (
    <div
      className={`my-8 ${className}`.trim()}
      data-ad-placement={ADS_DEBUG ? label : undefined}
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-gray-400">
        Advertisement
      </p>
      {children}
    </div>
  )
}
