import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGuideSlugs } from '@/lib/guides'
import type { Location, Market } from '@/types/database'

/**
 * Supabase's REST API caps every response at 1,000 rows and does not signal
 * that it truncated. An unpaged select therefore looks like it returned the
 * whole table. This sitemap listed exactly 1,000 of 8,675 markets for that
 * reason, so ~88% of the site was never submitted to Google.
 */
const PAGE_SIZE = 1000

/** Stops a malformed query from looping forever; 100k rows is far past need. */
const MAX_PAGES = 100

/**
 * Reads every row a query matches, a page at a time.
 *
 * Takes a factory rather than a builder because each page needs its own
 * range() call, and a PostgREST builder cannot be re-ranged once awaited.
 */
async function fetchAllRows<T>(
  page: (from: number, to: number) => PromiseLike<{ data: unknown }>
): Promise<T[]> {
  const rows: T[] = []

  for (let i = 0; i < MAX_PAGES; i++) {
    const from = i * PAGE_SIZE
    const { data } = await page(from, from + PAGE_SIZE - 1)
    const batch = (data as T[] | null) ?? []

    rows.push(...batch)

    // A short page is the last page. An empty one means we already had all
    // of them and this request ran one page past the end.
    if (batch.length < PAGE_SIZE) break
  }

  return rows
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Must match the live host (www) so sitemap URLs don't 301/307-redirect.
  const baseUrl = 'https://www.farmersmarkets.io'

  // Editorial guides — static, no DB needed, so always included.
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getGuideSlugs().map((slug) => ({
      url: `${baseUrl}/guides/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/states`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/near-me`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    const supabase = createAdminClient()

    // Fetch all state locations
    const states = await fetchAllRows<Pick<Location, 'slug' | 'state_code'>>(
      (from, to) =>
        supabase
          .from('locations')
          .select('slug, state_code')
          .eq('type', 'state')
          .range(from, to)
    )

    const statePages: MetadataRoute.Sitemap =
      states.map((state) => ({
        url: `${baseUrl}/${state.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    // Fetch all city locations
    const cities = await fetchAllRows<Pick<Location, 'slug' | 'state_code'>>(
      (from, to) =>
        supabase
          .from('locations')
          .select('slug, state_code')
          .eq('type', 'city')
          .gt('market_count', 0)
          .range(from, to)
    )

    // Need to get state slugs for cities
    const stateSlugMap = new Map(states.map((s) => [s.state_code, s.slug]))

    const cityPages: MetadataRoute.Sitemap = cities
      // A city whose state is missing would build a "/undefined/<city>" URL,
      // so drop it rather than submit a 404 to Google.
      .filter((city) => stateSlugMap.get(city.state_code))
      .map((city) => ({
        url: `${baseUrl}/${stateSlugMap.get(city.state_code)}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

    // Fetch all markets
    const markets = await fetchAllRows<Pick<Market, 'slug' | 'updated_at'>>(
      (from, to) =>
        supabase
          .from('markets')
          .select('slug, updated_at')
          .eq('is_active', true)
          .range(from, to)
    )

    const marketPages: MetadataRoute.Sitemap = markets.map((market) => ({
      url: `${baseUrl}/market/${market.slug}`,
      lastModified: market.updated_at ? new Date(market.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...guidePages, ...statePages, ...cityPages, ...marketPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [...staticPages, ...guidePages]
  }
}
