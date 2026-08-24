'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ADSENSE_CLIENT_ID, ADS_DEBUG } from '@/lib/adsense'

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
  /** AdSense layout hint (data-ad-layout), e.g. "in-article". */
  layout?: string
  /** Whether the unit should resize responsively. Defaults to true. */
  responsive?: boolean
  /** Extra classes for the wrapping <ins> element. */
  className?: string
  /** Inline styles, merged over the defaults. */
  style?: React.CSSProperties
}

/**
 * Renders a single Google AdSense ad unit.
 *
 * Requires the AdSense loader script (added in app/layout.tsx) to be present,
 * and a slot ID from the AdSense dashboard — see lib/adsense.ts. Renders
 * nothing without a slot, since an <ins> with no slot can never fill.
 */
export function AdUnit({
  slot,
  format = 'auto',
  layout,
  responsive = true,
  className = '',
  style,
}: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const ins = insRef.current
    if (!ins) return

    let frame = 0
    let attempts = 0

    const push = () => {
      // The loader stamps data-adsbygoogle-status on an element once it claims
      // it. Pushing the same <ins> twice throws "All 'ins' elements in the DOM
      // with class=adsbygoogle already have ads in them", which React's
      // double-invoked dev effects trigger every time, so check the stamp.
      if (ins.getAttribute('data-adsbygoogle-status')) return

      // AdSense silently skips an <ins> that measures 0px wide
      // ("availableWidth=0"). That happens whenever the unit is pushed before
      // its parent has laid out, so wait for a frame that has real width.
      if (ins.offsetWidth === 0) {
        if (attempts++ < 20) frame = requestAnimationFrame(push)
        return
      }

      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {
        // Loader absent or blocked by an ad blocker — nothing to recover.
      }
    }

    push()
    return () => cancelAnimationFrame(frame)
  }, [pathname, slot])

  if (!slot) return null

  return (
    <ins
      // A fresh element per route: on client-side navigation the old <ins>
      // still carries its data-adsbygoogle-status stamp and would never
      // refill, so remount rather than reuse it.
      key={`${pathname}:${slot}`}
      ref={insRef}
      className={`adsbygoogle ${className}`.trim()}
      // No min-height on purpose: an unfilled unit collapses to nothing
      // instead of leaving a blank gap, which matters most right after
      // approval when fill rates are still ramping up.
      style={{ display: 'block', width: '100%', ...style }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { 'data-ad-layout': layout } : {})}
      data-full-width-responsive={responsive ? 'true' : 'false'}
      data-adtest={ADS_DEBUG ? 'on' : undefined}
    />
  )
}
