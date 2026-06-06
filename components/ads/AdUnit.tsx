'use client'

import { useEffect } from 'react'
import { ADSENSE_CLIENT_ID } from '@/lib/adsense'

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[]
  }
}

interface AdUnitProps {
  /** The ad slot ID created in your AdSense dashboard (data-ad-slot). */
  slot: string
  /** AdSense ad format. Defaults to "auto" for responsive units. */
  format?: string
  /** Whether the unit should resize responsively. Defaults to true. */
  responsive?: boolean
  /** Extra classes for the wrapping <ins> element. */
  className?: string
  /** Inline styles. Defaults to a block-level display required by AdSense. */
  style?: React.CSSProperties
}

/**
 * Renders a single Google AdSense ad unit.
 *
 * Requires the AdSense loader script (added in app/layout.tsx) to be present.
 * Use this for manual ad placements after your account is approved — create an
 * ad unit in the AdSense dashboard, then pass its slot ID:
 *
 *   <AdUnit slot="1234567890" />
 *
 * Note: ad units render blank until the AdSense account is approved and the
 * slot is active.
 */
export function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style,
}: AdUnitProps) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // adsbygoogle not yet loaded (e.g. blocked by an ad blocker) — ignore.
    }
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className}`.trim()}
      style={style ?? { display: 'block' }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}
