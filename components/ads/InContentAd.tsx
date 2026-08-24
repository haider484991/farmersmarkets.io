import { AdUnit } from './AdUnit'
import { AdFrame } from './AdFrame'
import { ADSENSE_SLOTS } from '@/lib/adsense'

/**
 * An in-article ad placement for guide and article body copy.
 *
 * Renders nothing until `article` has a slot ID in lib/adsense.ts.
 */
export function InContentAd({ className = '' }: { className?: string }) {
  const slot = ADSENSE_SLOTS.article

  return (
    <AdFrame slot={slot} label="in-content" className={className}>
      <AdUnit
        slot={slot}
        format="fluid"
        layout="in-article"
        style={{ textAlign: 'center' }}
      />
    </AdFrame>
  )
}
