/**
 * Where ads are allowed to serve.
 *
 * Ads serve everywhere except the locations listed below. The match runs on
 * Vercel's IP geolocation headers, which the platform attaches to every
 * incoming request.
 *
 * This decision deliberately does NOT happen while rendering the page. Market,
 * state and city pages are CDN-cached (see the `s-maxage` headers in
 * next.config.ts), so whichever region requested a page first would have its
 * ad decision cached and served to every other region. The decision is served
 * separately by /api/ads/geo instead, and applied in the browser.
 *
 * This module is imported from both the edge route and client components, so
 * it must stay free of Node and next/headers imports.
 */

export type AdsGeoDecision = 'allow' | 'block'

/**
 * Locations where ads must not serve.
 *
 * `city` is matched case-insensitively; `region` (state/province code) and
 * `country` (ISO code) are both required, since they are what separates
 * Dallas, Texas from Dallas, Georgia and Dallas, Oregon.
 *
 * Note that IP geolocation resolves to the city an address is registered to.
 * Dallas suburbs report their own names — Plano, Irving, Richardson, Garland —
 * so add them here too if the intent is to cover the whole metro rather than
 * the city proper.
 */
export const AD_BLOCKED_LOCATIONS: ReadonlyArray<{
  city: string
  region: string
  country: string
}> = [{ city: 'dallas', region: 'TX', country: 'US' }]

/** Vercel percent-encodes city names, e.g. "San%20Francisco". */
function normalizeCity(raw: string | null): string {
  if (!raw) return ''
  try {
    return decodeURIComponent(raw).trim().toLowerCase()
  } catch {
    // Malformed encoding — use the raw value rather than throwing.
    return raw.trim().toLowerCase()
  }
}

/**
 * Resolves a request's geo headers to an ad decision.
 *
 * An unknown location resolves to 'allow'. Local development and any host that
 * is not Vercel send no geo headers at all, and defaulting those to 'block'
 * would take every ad on the site down rather than just the ones in Dallas.
 */
export function adsDecisionFromHeaders(headers: Headers): AdsGeoDecision {
  if (AD_BLOCKED_LOCATIONS.length === 0) return 'allow'

  const city = normalizeCity(headers.get('x-vercel-ip-city'))
  if (!city) return 'allow'

  const region = (headers.get('x-vercel-ip-country-region') ?? '').trim().toUpperCase()
  const country = (headers.get('x-vercel-ip-country') ?? '').trim().toUpperCase()

  const isBlocked = AD_BLOCKED_LOCATIONS.some(
    (location) =>
      location.city === city &&
      location.region.toUpperCase() === region &&
      location.country.toUpperCase() === country
  )

  return isBlocked ? 'block' : 'allow'
}
