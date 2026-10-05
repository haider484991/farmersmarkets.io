/**
 * Google AdSense publisher ID.
 *
 * The site serves no ads: the ad units and the adsbygoogle.js loader were
 * removed. Only the `google-adsense-account` verification meta tag (app/layout.tsx)
 * and public/ads.txt still use this ID, so the site stays verified in AdSense
 * and ads can be switched back on by reverting that removal.
 *
 * The publisher ID is hardcoded on purpose. A stale
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID env var on the hosting platform was previously
 * overriding it with a placeholder (ca-pub-XXXXXXXXXX), which broke AdSense
 * site verification. Keeping the value in code makes it the single source of
 * truth.
 */
export const ADSENSE_CLIENT_ID = 'ca-pub-6873688003145340'
