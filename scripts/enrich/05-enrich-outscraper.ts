/**
 * Outscraper Enrichment Script
 *
 * Enriches market data with Google Business information
 * including phone, website, photos, ratings, and directions.
 *
 * Run with: npm run enrich:outscraper
 */

import { createAdminClient } from '../../lib/supabase/admin'
import {
  searchGoogleMaps,
  buildMarketSearchQuery,
  mapOutscraperToMarket,
  estimateEnrichmentCost,
} from '../../lib/outscraper'

const BATCH_SIZE = 20
const DELAY_MS = 2000

async function enrichMarkets() {
  console.log('Starting market enrichment with Outscraper...')

  const supabase = createAdminClient()

  // Get markets that haven't been enriched yet
  const { data: markets, error } = await supabase
    .from('markets')
    .select('id, name, address, city, state, state_code')
    .eq('is_active', true)
    .is('last_enriched_at', null)
    .limit(5000) // Limit to budget

  if (error) {
    console.error('Error fetching markets:', error)
    process.exit(1)
  }

  if (!markets || markets.length === 0) {
    console.log('No markets to enrich')
    return
  }

  console.log(`Found ${markets.length} markets to enrich`)

  // Estimate cost
  const cost = estimateEnrichmentCost(markets.length)
  console.log(`\nEstimated cost:`)
  console.log(`  Base enrichment: $${cost.baseCost}`)
  console.log(`  With photos: $${cost.withPhotosCost}`)
  console.log(`  Total estimate: $${cost.totalEstimate}`)
  console.log('')

  // Process in batches
  let enriched = 0
  let failed = 0

  for (let i = 0; i < markets.length; i += BATCH_SIZE) {
    const batch = markets.slice(i, i + BATCH_SIZE)
    console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(markets.length / BATCH_SIZE)}`)

    for (const market of batch) {
      try {
        const query = buildMarketSearchQuery(market)
        console.log(`  Searching: ${query.substring(0, 50)}...`)

        const result = await searchGoogleMaps({ query, limit: 1 })

        if (result) {
          const enrichmentData = mapOutscraperToMarket(result)

          const { error: updateError } = await supabase
            .from('markets')
            .update(enrichmentData)
            .eq('id', market.id)

          if (updateError) {
            console.error(`  Error updating ${market.name}:`, updateError.message)
            failed++
          } else {
            console.log(`  Enriched: ${market.name} (${result.rating || 'no rating'})`)
            enriched++
          }
        } else {
          console.log(`  No results for: ${market.name}`)
          // Mark as enriched but with no data
          await supabase
            .from('markets')
            .update({ last_enriched_at: new Date().toISOString() })
            .eq('id', market.id)
          failed++
        }
      } catch (err) {
        console.error(`  Error processing ${market.name}:`, err)
        failed++
      }
    }

    // Rate limiting
    if (i + BATCH_SIZE < markets.length) {
      console.log(`  Waiting ${DELAY_MS}ms before next batch...`)
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
    }
  }

  console.log(`\n\nEnrichment complete!`)
  console.log(`Enriched: ${enriched}`)
  console.log(`Failed: ${failed}`)
}

enrichMarkets().catch(console.error)
