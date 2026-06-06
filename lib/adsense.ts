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
