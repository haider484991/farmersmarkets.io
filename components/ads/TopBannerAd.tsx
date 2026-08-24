import { AdUnit } from './AdUnit'
import { AdFrame } from './AdFrame'
import { ADSENSE_SLOTS } from '@/lib/adsense'

/**
 * A horizontal banner for the top of landing pages, right below the header.
 *
 * This is the highest-visibility placement, so it differs from DisplayAd in
 * two deliberate ways:
 *
 * - `format="horizontal"` keeps it a banner shape instead of letting AdSense
 *   pick a tall rectangle that would shove the actual content below the fold.
 * - The min-height classes reserve the banner's space before the ad loads.
 *   Without that, every fill would push the whole page down after render —
 *   layout shift (CLS) on exactly the pages that rank, which Google's Core
 *   Web Vitals score punishes. Reserved-but-unfilled space is cleaned up by
 *   the [data-ad-status="unfilled"] rule in globals.css.
 */
export function TopBannerAd({ className = '' }: { className?: string }) {
  const slot = ADSENSE_SLOTS.display

  return (
    <AdFrame slot={slot} label="top-banner" className={className}>
      <AdUnit
        slot={slot}
        format="horizontal"
        className="min-h-[100px] sm:min-h-[90px]"
      />
    </AdFrame>
  )
}
