/**
 * Google AdSense configuration.
 *
 * The publisher ID is read from the NEXT_PUBLIC_ADSENSE_CLIENT_ID environment
 * variable when present, so it can be changed per-environment without a code
 * change. It falls back to the production publisher ID below so the loader
 * script and ad units work out of the box.
 *
 * Format: "ca-pub-XXXXXXXXXXXXXXXX"
 */
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-6873688003145340'

/** URL of the AdSense loader script for the configured publisher. */
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`
