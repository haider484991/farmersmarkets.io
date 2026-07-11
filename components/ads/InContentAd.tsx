import { AdUnit } from './AdUnit'

/**
 * An in-article ad placement that stays invisible until you activate it.
 *
 * After your AdSense account is approved, create an in-article ad unit and set
 * its slot id in the NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT environment variable.
 * Until then this renders nothing, so pages stay clean during the AdSense review.
 */
export function InContentAd({ className = '' }: { className?: string }) {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT
  if (!slot) return null

  return (
    <div className={`my-8 ${className}`.trim()}>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 text-center">
        Advertisement
      </p>
      <AdUnit slot={slot} format="fluid" />
    </div>
  )
}
