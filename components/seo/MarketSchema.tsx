import type { Market, MarketSchedule } from '@/types/database'
import { DAYS_OF_WEEK, formatDay } from '@/lib/utils'
import { buildMarketFaqs } from '@/lib/content'

interface MarketSchemaProps {
  market: Market
}

export function MarketSchema({ market }: MarketSchemaProps) {
  const schedule = market.schedule as MarketSchedule | null

  // Format opening hours for schema.org
  const openingHoursSpecification = schedule
    ? DAYS_OF_WEEK.filter((day) => schedule[day])
        .map((day) => {
          const hours = schedule[day]!
          return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: formatDay(day),
            opens: hours.open,
            closes: hours.close,
          }
        })
    : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.farmersmarkets.io/market/${market.slug}`,
    name: market.name,
    description: market.description || market.meta_description,
    image: market.featured_image || (market.photos as string[])?.[0],
    url: `https://www.farmersmarkets.io/market/${market.slug}`,
    telephone: market.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: market.address,
      addressLocality: market.city,
      addressRegion: market.state,
      postalCode: market.zip_code,
      addressCountry: 'US',
    },
    geo:
      market.latitude && market.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: market.latitude,
            longitude: market.longitude,
          }
        : undefined,
    openingHoursSpecification,
    aggregateRating:
      market.google_rating && market.google_reviews_count
        ? {
            '@type': 'AggregateRating',
            ratingValue: market.google_rating,
            reviewCount: market.google_reviews_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    priceRange: market.price_range || '$',
    sameAs: [market.website, market.social_facebook, market.social_instagram].filter(
      Boolean
    ),
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}

// FAQ Schema for market pages — built from the SAME real-data source as the
// visible FAQ section so the structured data always matches the page.
export function MarketFAQSchema({ market }: MarketSchemaProps) {
  const faqs = buildMarketFaqs(market)

  if (faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
