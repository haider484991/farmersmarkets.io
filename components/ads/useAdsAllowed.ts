'use client'

import { useEffect, useState } from 'react'
import { adsAllowed } from './adsAllowed'

/**
 * Whether ads may serve for this visitor, for hiding the surrounding chrome.
 *
 * Starts as `true` so the server render and the first client render agree —
 * returning `false` first would hide ads from everyone for a frame. A blocked
 * visitor sees the placement disappear once the check resolves; no ad is ever
 * requested for them, because AdUnit waits on the same check before pushing.
 */
export function useAdsAllowed(): boolean {
  const [allowed, setAllowed] = useState(true)

  useEffect(() => {
    let cancelled = false
    adsAllowed().then((result) => {
      if (!cancelled) setAllowed(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return allowed
}
