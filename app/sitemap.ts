import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Location, Market } from '@/types/database'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://farmersmarkets.io'

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
  ]

  try {
    const supabase = createAdminClient()

    // Fetch all state locations
    const { data: states } = await supabase
      .from('locations')
      .select('slug, state_code')
      .eq('type', 'state') as { data: Pick<Location, 'slug' | 'state_code'>[] | null; error: unknown }

    const statePages: MetadataRoute.Sitemap =
      states?.map((state) => ({
        url: `${baseUrl}/${state.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })) || []

    // Fetch all city locations
    const { data: cities } = await supabase
      .from('locations')
      .select('slug, state_code')
      .eq('type', 'city')
      .gt('market_count', 0) as { data: Pick<Location, 'slug' | 'state_code'>[] | null; error: unknown }

    // Need to get state slugs for cities
    const stateSlugMap = new Map(states?.map((s) => [s.state_code, s.slug]) || [])

    const cityPages: MetadataRoute.Sitemap =
      cities?.map((city) => ({
        url: `${baseUrl}/${stateSlugMap.get(city.state_code)}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })) || []

    // Fetch all markets
    const { data: markets } = await supabase
      .from('markets')
      .select('slug, updated_at')
      .eq('is_active', true) as { data: Pick<Market, 'slug' | 'updated_at'>[] | null; error: unknown }

    const marketPages: MetadataRoute.Sitemap =
      markets?.map((market) => ({
        url: `${baseUrl}/market/${market.slug}`,
        lastModified: market.updated_at ? new Date(market.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })) || []

    return [...staticPages, ...statePages, ...cityPages, ...marketPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
