import { AdUnit } from './AdUnit'
import { AdFrame } from './AdFrame'
import { ADSENSE_SLOTS } from '@/lib/adsense'

/**
 * A responsive display ad placement for the gaps between page sections.
 *
 * This is the general-purpose unit — use it on directory, market and landing
 * pages. Renders nothing until `display` has a slot ID in lib/adsense.ts.
 */
export function DisplayAd({ className = '' }: { className?: string }) {
  const slot = ADSENSE_SLOTS.display

  return (
    <AdFrame slot={slot} label="display" className={className}>
      <AdUnit slot={slot} format="auto" responsive />
    </AdFrame>
  )
}
