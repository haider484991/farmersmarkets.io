/**
 * Google AdSense configuration.
 *
 * The publisher ID is hardcoded on purpose. A stale
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID env var on the hosting platform was previously
 * overriding it with a placeholder (ca-pub-XXXXXXXXXX), which broke AdSense
 * site verification. Keeping the value in code makes it the single source of
 * truth. To change publishers, edit the value below.
 *
 * Format: "ca-pub-XXXXXXXXXXXXXXXX"
 */
export const ADSENSE_CLIENT_ID = 'ca-pub-6873688003145340'

/** URL of the AdSense loader script for the configured publisher. */
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`

/**
 * Ad slot IDs, one per placement. THIS IS THE FILE TO EDIT to turn ads on.
 *
 * Get each value from AdSense → Ads → By ad unit → create the unit, then copy
 * the numeric `data-ad-slot` from the snippet Google shows you (e.g.
 * "1234567890") and paste it below. A placement whose slot is still an empty
 * string renders nothing at all, so the page stays clean rather than showing a
 * broken or blank ad box.
 *
 * These are code constants rather than env vars for the same reason as
 * ADSENSE_CLIENT_ID above: a stale value on the host silently broke AdSense
 * once already, and a missing slot ID fails exactly the same silent way — an
 * <ins> that never fills, with nothing to see in the AdSense dashboard.
 */
const SLOT_IDS = {
  /** In-article unit. Sits inside guide/article body copy. */
  article: '',
  /** Responsive display unit. Sits between page sections. */
  display: '',
  /** In-feed unit. Sits inside a market listing grid. */
  inFeed: '',
}

/**
 * Resolved slots. The constants above win; the env vars stay supported so a
 * preview deploy can test different units without a code change.
 *
 * Each `process.env.NEXT_PUBLIC_*` lookup must be written out literally —
 * Next.js inlines these at build time and does not resolve dynamic keys.
 */
export const ADSENSE_SLOTS = {
  article: SLOT_IDS.article || process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT || '',
  display: SLOT_IDS.display || process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT || '',
  inFeed: SLOT_IDS.inFeed || process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || '',
} as const

export type AdPlacement = keyof typeof ADSENSE_SLOTS

/** True when at least one placement has a slot ID, i.e. ads can serve at all. */
export const HAS_ADSENSE_SLOTS = Object.values(ADSENSE_SLOTS).some(Boolean)

/**
 * Draws a labelled outline where every ad unit sits, whether or not it has a
 * slot ID. Set NEXT_PUBLIC_ADS_DEBUG=1 to confirm placements are rendering
 * before real slot IDs exist, or to tell "no ad unit here" apart from "ad unit
 * here that isn't filling". Never enable this in production.
 */
export const ADS_DEBUG = process.env.NEXT_PUBLIC_ADS_DEBUG === '1'
