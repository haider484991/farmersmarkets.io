// Data-driven content generators.
// These turn the structured market data we already have into UNIQUE prose and
// real FAQ answers, so no two pages ship the same boilerplate. Used by both the
// visible page and the JSON-LD schema (kept in sync on purpose).
import type {
  Market,
  Location,
  MarketSchedule,
  MarketProducts,
  PaymentMethods,
} from '@/types/database'
import { DAYS_OF_WEEK, formatDay, formatPhone } from '@/lib/utils'

const WEEK_ORDER = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

/** Join a list into readable English: "a, b, and c" (capped at `max`). */
export function humanList(items: string[], max = 4): string {
  const a = items.slice(0, max)
  if (a.length === 0) return ''
  if (a.length === 1) return a[0]
  if (a.length === 2) return `${a[0]} and ${a[1]}`
  return `${a.slice(0, -1).join(', ')}, and ${a[a.length - 1]}`
}

/** Names of the days a market is open, in week order. */
export function openDays(schedule: MarketSchedule | null): string[] {
  if (!schedule) return []
  return DAYS_OF_WEEK.filter((d) => schedule[d]).map((d) => formatDay(d))
}

/** Days with their hours, e.g. "Saturday (8:00 AM–1:00 PM)". */
export function openDaysWithHours(
  schedule: MarketSchedule | null
): { day: string; label: string }[] {
  if (!schedule) return []
  return DAYS_OF_WEEK.filter((d) => schedule[d]).map((d) => {
    const h = schedule[d]!
    return { day: formatDay(d), label: `${formatDay(d)} (${h.open}–${h.close})` }
  })
}

/** Products flagged available on a market, as readable labels. */
export function productList(products: MarketProducts | null): string[] {
  if (!products) return []
  return Object.entries(products)
    .filter(([, available]) => available)
    .map(([k]) => k.replace(/_/g, ' '))
}

function orderDays(days: Iterable<string>): string[] {
  return [...new Set(days)].sort(
    (a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b)
  )
}

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

/** One sentence describing the market season, or '' if unknown. */
export function seasonSentence(market: Market): string {
  if (market.season_start && market.season_end)
    return `The market season runs from ${fmtDate(market.season_start)} to ${fmtDate(
      market.season_end
    )}.`
  if (market.season_start) return `The season opens ${fmtDate(market.season_start)}.`
  if (market.season_end) return `The season runs through ${fmtDate(market.season_end)}.`
  return ''
}

/**
 * Unique, data-driven intro paragraph for a market page.
 * If the market already has a real editorial description, we keep it verbatim.
 */
export function generateMarketDescription(market: Market): string {
  if (market.description && market.description.trim().length > 40) {
    return market.description.trim()
  }

  const schedule = market.schedule as MarketSchedule | null
  const products = market.products as MarketProducts | null
  const payment = market.payment_methods as PaymentMethods | null
  const days = openDays(schedule)
  const prods = productList(products)
  const cityState = [market.city, market.state].filter(Boolean).join(', ')

  const sentences: string[] = []
  sentences.push(
    `${market.name} is a farmers market${cityState ? ` in ${cityState}` : ''}${
      market.address ? `, located at ${market.address}` : ''
    }.`
  )

  if (days.length) {
    const season = seasonSentence(market)
    sentences.push(
      `It operates on ${humanList(orderDays(days), 7)}, bringing local growers and makers together in one place.${
        season ? ` ${season}` : ''
      }`
    )
  }
  if (prods.length) {
    sentences.push(
      `Shoppers can find ${humanList(
        prods,
        5
      )} and other fresh, locally sourced goods from area farmers and artisans.`
    )
  }
  if (payment?.snap || payment?.wic) {
    const progs = [payment?.snap && 'SNAP/EBT', payment?.wic && 'WIC'].filter(
      Boolean
    ) as string[]
    sentences.push(
      `${market.name} accepts ${humanList(progs)}, helping make fresh food accessible to the ${
        market.city || 'local'
      } community.`
    )
  }
  if (market.google_rating && market.google_reviews_count) {
    sentences.push(
      `It holds a ${market.google_rating.toFixed(
        1
      )}-star rating from ${market.google_reviews_count.toLocaleString()} visitor reviews.`
    )
  }

  if (sentences.length < 2) {
    sentences.push(
      `Visiting ${market.name} is a great way to support ${
        market.city || 'local'
      } agriculture and enjoy seasonal, farm-fresh products close to home.`
    )
  }
  return sentences.join(' ')
}

/**
 * Real FAQ Q&A built from actual market data. Consumed by BOTH the visible FAQ
 * section and the FAQPage JSON-LD, so the structured data always matches the page.
 */
export function buildMarketFaqs(market: Market): { question: string; answer: string }[] {
  const schedule = market.schedule as MarketSchedule | null
  const products = market.products as MarketProducts | null
  const payment = market.payment_methods as PaymentMethods | null
  const days = openDaysWithHours(schedule)
  const prods = productList(products)
  const cityState = [market.city, market.state].filter(Boolean).join(', ')
  const faqs: { question: string; answer: string }[] = []

  // Hours
  if (days.length) {
    const season = seasonSentence(market)
    faqs.push({
      question: `What days and hours is ${market.name} open?`,
      answer: `${market.name} is open ${humanList(
        days.map((d) => d.label),
        7
      )}.${season ? ` ${season}` : ''}`,
    })
  } else {
    faqs.push({
      question: `What are the hours for ${market.name}?`,
      answer: `Hours vary by season. Contact ${market.name} or check this listing for current operating hours.`,
    })
  }

  // Location
  const addr = [market.address, cityState, market.zip_code].filter(Boolean).join(', ')
  if (addr) {
    faqs.push({
      question: `Where is ${market.name} located?`,
      answer: `${market.name} is located at ${addr}.`,
    })
  }

  // Products
  if (prods.length) {
    faqs.push({
      question: `What can I buy at ${market.name}?`,
      answer: `Vendors at ${market.name} offer ${humanList(
        prods,
        6
      )}, along with other seasonal, locally produced goods.`,
    })
  }

  // Payment / SNAP
  if (payment && Object.values(payment).some(Boolean)) {
    const snap = payment.snap || payment.wic
    if (snap) {
      const progs = [payment.snap && 'SNAP/EBT', payment.wic && 'WIC'].filter(
        Boolean
      ) as string[]
      faqs.push({
        question: `Does ${market.name} accept SNAP/EBT?`,
        answer: `Yes — ${market.name} accepts ${humanList(progs)} benefits.`,
      })
    } else {
      const methods = Object.entries(payment)
        .filter(([, v]) => v)
        .map(([k]) => (k === 'wic' ? 'WIC' : k))
      faqs.push({
        question: `What payment methods does ${market.name} accept?`,
        answer: `${market.name} accepts ${humanList(
          methods,
          5
        )}. Contact the market to confirm SNAP/EBT availability.`,
      })
    }
  }

  // Contact
  if (market.phone) {
    faqs.push({
      question: `How do I contact ${market.name}?`,
      answer: `You can reach ${market.name} by phone at ${formatPhone(market.phone)}${
        market.website ? ` or visit ${market.website}` : ''
      }.`,
    })
  }

  return faqs
}

/** Unique multi-paragraph intro for a city hub page. */
export function generateCityIntro(
  cityName: string,
  stateName: string,
  markets: Market[]
): string[] {
  const count = markets.length
  const rated = markets.filter((m) => m.google_rating)
  const topNames = markets.slice(0, 3).map((m) => m.name)
  const allProducts = new Set<string>()
  const days = new Set<string>()
  let snap = 0
  markets.forEach((m) => {
    productList(m.products as MarketProducts | null).forEach((p) => allProducts.add(p))
    openDays(m.schedule as MarketSchedule | null).forEach((d) => days.add(d))
    const pm = m.payment_methods as PaymentMethods | null
    if (pm?.snap) snap++
  })

  const paras: string[] = []
  paras.push(
    `${cityName}, ${stateName} is home to ${count} farmers ${
      count === 1 ? 'market' : 'markets'
    }${topNames.length ? `, including ${humanList(topNames, 3)}` : ''}. ${
      rated.length
        ? `${rated.length} of ${
            rated.length === count ? 'them' : `the ${count}`
          } carry verified Google ratings to help you find the best local produce and vendors.`
        : `Each offers fresh, locally grown produce and artisan goods.`
    }`
  )

  if (allProducts.size) {
    paras.push(
      `Across ${cityName}'s markets you'll find ${humanList(
        [...allProducts],
        6
      )} and more, sourced directly from farmers and makers in the ${stateName} region.`
    )
  }

  const parts: string[] = []
  if (days.size)
    parts.push(
      `markets in ${cityName} operate on ${humanList(orderDays(days), 7)}`
    )
  if (snap)
    parts.push(`${snap} ${snap === 1 ? 'market accepts' : 'markets accept'} SNAP/EBT benefits`)
  if (parts.length) {
    const joined = parts.join(', and ')
    paras.push(
      `${joined.charAt(0).toUpperCase() + joined.slice(1)}. Check each listing below for exact hours, directions, and accepted payment methods.`
    )
  } else {
    paras.push(
      `Browse the listings below for hours, directions, and details on each ${cityName} farmers market.`
    )
  }
  return paras
}

/** Unique multi-paragraph intro for a state hub page. */
export function generateStateIntro(
  stateName: string,
  totalMarkets: number,
  topCities: Location[],
  sampleMarkets: Market[]
): string[] {
  const cityNames = topCities.slice(0, 5).map((c) => c.name)
  const allProducts = new Set<string>()
  sampleMarkets.forEach((m) =>
    productList(m.products as MarketProducts | null).forEach((p) => allProducts.add(p))
  )

  const paras: string[] = []
  paras.push(
    `${stateName} has ${totalMarkets.toLocaleString()} farmers ${
      totalMarkets === 1 ? 'market' : 'markets'
    } in our directory${
      cityNames.length
        ? `, with active markets in cities like ${humanList(cityNames, 5)}`
        : ''
    }. From small community gatherings to large urban markets, there are fresh, local options across the state.`
  )
  paras.push(
    allProducts.size
      ? `Vendors at ${stateName} farmers markets sell ${humanList(
          [...allProducts],
          6
        )}, plus honey, flowers, baked goods, and handcrafted items — much of it grown or made within the state.`
      : `${stateName} farmers markets offer seasonal fruits and vegetables, locally raised meats, dairy, baked goods, and handcrafted items.`
  )
  paras.push(
    `Use the listings below to find a farmers market near you in ${stateName}. Each includes the market's address, operating hours, products available, and accepted payment methods, including SNAP/EBT where offered.`
  )
  return paras
}
