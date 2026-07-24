/**
 * Google Photos Enrichment
 *
 * Fills in featured_image + photos for markets that have no image, using the
 * official Google Places API (New). Free for a few thousand markets under
 * Google's monthly free tier — no scraping, no blocking.
 *
 * Setup:
 *   1. In Google Cloud, enable "Places API (New)" and create an API key.
 *   2. Add it to .env.local as GOOGLE_MAPS_API_KEY=your_key
 *
 * Run:
 *   DRY_RUN=1 LIMIT=10 npx tsx scripts/enrich/07-enrich-google-photos.ts   # preview
 *   LIMIT=50 npx tsx scripts/enrich/07-enrich-google-photos.ts             # small live batch
 *   npx tsx scripts/enrich/07-enrich-google-photos.ts                      # full run
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createAdminClient } from '../../lib/supabase/admin'
import { fetchMarketPhotos } from '../../lib/google-places'

const BATCH_SIZE = 10 // markets processed concurrently per batch
const DELAY_MS = 500 // pause between batches (politeness / quota smoothing)
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 5000

async function run() {
  console.log(`\nGoogle Photos enrichment ${DRY_RUN ? '(DRY RUN — no writes)' : '(LIVE)'}`)
  const supabase = createAdminClient()

  // Resumable: only markets that still have no featured image.
  const { data: markets, error } = await supabase
    .from('markets')
    .select('id, name, address, city, state, google_place_id')
    .eq('is_active', true)
    .is('featured_image', null)
    .limit(LIMIT)

  if (error) {
    console.error('Error fetching markets:', error.message)
    process.exit(1)
  }
  if (!markets || markets.length === 0) {
    console.log('No markets missing images. Done.')
    return
  }

  console.log(`Processing ${markets.length} markets missing images.\n`)

  let withPhotos = 0
  let noPhotos = 0
  let failed = 0

  for (let i = 0; i < markets.length; i += BATCH_SIZE) {
    const batch = markets.slice(i, i + BATCH_SIZE)
    const batchNo = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(markets.length / BATCH_SIZE)

    await Promise.all(
      batch.map(async (market) => {
        try {
          const result = await fetchMarketPhotos(market)

          if (!result.featuredImage) {
            noPhotos++
            console.log(`  · no photo: ${market.name}`)
            // Still persist a discovered place_id so future runs are cheaper.
            if (!DRY_RUN && result.placeId && !market.google_place_id) {
              await supabase
                .from('markets')
                .update({ google_place_id: result.placeId })
                .eq('id', market.id)
            }
            return
          }

          withPhotos++
          console.log(`  ✓ ${result.photos.length} photo(s): ${market.name}`)

          if (!DRY_RUN) {
            const update: Record<string, unknown> = {
              featured_image: result.featuredImage,
              photos: result.photos,
            }
            if (result.placeId && !market.google_place_id) {
              update.google_place_id = result.placeId
            }
            const { error: updateError } = await supabase
              .from('markets')
              .update(update)
              .eq('id', market.id)
            if (updateError) {
              failed++
              console.error(`  ✗ write failed for ${market.name}: ${updateError.message}`)
            }
          }
        } catch (err) {
          failed++
          console.error(`  ✗ ${market.name}: ${(err as Error).message}`)
        }
      })
    )

    console.log(
      `Batch ${batchNo}/${totalBatches} — with:${withPhotos} none:${noPhotos} failed:${failed}`
    )
    if (i + BATCH_SIZE < markets.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS))
    }
  }

  console.log(`\nDone.`)
  console.log(`  markets with new photos: ${withPhotos}`)
  console.log(`  markets with no Google photo: ${noPhotos}`)
  console.log(`  failed: ${failed}`)
  if (DRY_RUN) console.log(`\n(DRY RUN — nothing was written. Re-run without DRY_RUN=1 to apply.)`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
