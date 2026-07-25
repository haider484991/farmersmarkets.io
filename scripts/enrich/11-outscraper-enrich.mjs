/**
 * Enrich markets via the Outscraper Google Maps API.
 *
 * Faster and far more accurate than scraping: Outscraper resolves the real
 * place, so there's no wrong-business guessing. ~$3 per 1,000 markets.
 *
 * Sends many queries per request (Outscraper batches them), polls the async
 * results_location, then writes photos + business data back to Supabase.
 *
 * IMPORTANT: the photo URLs Outscraper returns are googleusercontent links that
 * EXPIRE. Always follow this with 10-selfhost-photos.mjs.
 *
 * Run:
 *   DRY_RUN=1 LIMIT=10 node scripts/enrich/11-outscraper-enrich.mjs
 *   LIMIT=500 node scripts/enrich/11-outscraper-enrich.mjs
 *   MODE=all LIMIT=500 node scripts/enrich/11-outscraper-enrich.mjs   # refresh data too
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
// Outscraper is a SEARCH api — it returns the nearest match, which is often a
// different business ("Bullock County Farmers Market" -> "Wayne Farms - Union
// Springs", a poultry plant). Reuse the same verified matcher the scraper uses.
import { nameSimilarity } from './08-scrape-google-photos.mjs'
config({ path: '.env.local' })

const MATCH_THRESHOLD = process.env.MATCH_THRESHOLD
  ? parseFloat(process.env.MATCH_THRESHOLD)
  : 0.7

const API_KEY = process.env.OUTSCRAPER_API_KEY
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DRY_RUN = process.env.DRY_RUN === '1'
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 200
// 'missing' = only markets with no photo (cheapest, highest value).
// 'all'     = re-enrich everything (refreshes hours/rating/phone too).
const MODE = process.env.MODE || 'missing'
const CHUNK = process.env.CHUNK ? parseInt(process.env.CHUNK, 10) : 25
const POLL_MS = 5000
const POLL_MAX = 60

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function buildQuery(m) {
  return [m.name, m.address, m.city, m.state].filter(Boolean).join(', ')
}

/** Submit a batch of queries and wait for the async result. */
async function outscraperSearch(queries) {
  const params = new URLSearchParams()
  queries.forEach((q) => params.append('query', q))
  params.set('limit', '1')
  params.set('language', 'en')
  params.set('region', 'US')
  params.set('async', 'true')

  const submit = await fetch(`https://api.app.outscraper.com/maps/search-v3?${params}`, {
    headers: { 'X-API-KEY': API_KEY },
  })
  const job = await submit.json()
  if (!job.results_location) {
    throw new Error(`submit failed (${submit.status}): ${JSON.stringify(job).slice(0, 200)}`)
  }

  for (let i = 0; i < POLL_MAX; i++) {
    await sleep(POLL_MS)
    const r = await fetch(job.results_location, { headers: { 'X-API-KEY': API_KEY } })
    const j = await r.json().catch(() => null)
    if (j && (j.status === 'Success' || j.data)) return j.data || []
    if (j && j.status === 'Error') throw new Error('job failed: ' + JSON.stringify(j).slice(0, 200))
  }
  throw new Error('timed out waiting for results')
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

/** Outscraper working_hours -> our schedule shape. */
function mapSchedule(wh) {
  if (!wh || typeof wh !== 'object') return null
  const out = {}
  let any = false
  for (const day of DAYS) {
    const key = day.charAt(0).toUpperCase() + day.slice(1)
    const val = wh[key]
    const raw = Array.isArray(val) ? val[0] : val
    if (!raw || /closed/i.test(raw)) {
      out[day] = null
      continue
    }
    // "8 AM-1 PM" / "8:00 AM–1:00 PM"
    const m = String(raw).split(/[-–—]/)
    if (m.length === 2) {
      out[day] = { open: m[0].trim(), close: m[1].trim() }
      any = true
    } else {
      out[day] = null
    }
  }
  return any ? out : null
}

function mapRow(row) {
  const photos = []
  if (row.photo) photos.push(row.photo)
  const update = {
    google_place_id: row.place_id || undefined,
    google_rating: typeof row.rating === 'number' ? row.rating : undefined,
    google_reviews_count: typeof row.reviews === 'number' ? row.reviews : undefined,
    phone: row.phone || undefined,
    website: row.website || undefined,
    business_status: row.business_status || undefined,
    price_range: row.range || undefined,
    latitude: typeof row.latitude === 'number' ? row.latitude : undefined,
    longitude: typeof row.longitude === 'number' ? row.longitude : undefined,
    popular_times: row.popular_times || undefined,
    reviews_tags: row.reviews_tags || undefined,
    amenities: row.about || undefined,
    last_enriched_at: new Date().toISOString(),
  }
  const schedule = mapSchedule(row.working_hours)
  if (schedule) update.schedule = schedule
  if (photos.length) {
    update.featured_image = photos[0]
    update.photos = photos
  }
  if (row.place_id) {
    update.directions_url = `https://www.google.com/maps/dir/?api=1&destination_place_id=${row.place_id}`
  }
  // strip undefined so we never overwrite good data with nulls
  Object.keys(update).forEach((k) => update[k] === undefined && delete update[k])
  return update
}

async function run() {
  if (!API_KEY) throw new Error('OUTSCRAPER_API_KEY missing from .env.local')
  console.log(`\nOutscraper enrichment ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'} — mode=${MODE} limit=${LIMIT} chunk=${CHUNK}`)
  console.log(`Estimated cost: ~$${((LIMIT / 1000) * 3).toFixed(2)} at $3/1,000 records\n`)

  let q = supabase
    .from('markets')
    .select('id, name, address, city, state, featured_image')
    .eq('is_active', true)
    .order('id', { ascending: true })
  if (MODE === 'missing') q = q.is('featured_image', null)
  const { data: markets, error } = await q.limit(LIMIT)
  if (error) throw error
  if (!markets?.length) {
    console.log('Nothing to enrich.')
    return
  }
  console.log(`Processing ${markets.length} markets.\n`)

  let updated = 0
  let noResult = 0
  let rejected = 0
  let failed = 0

  for (let i = 0; i < markets.length; i += CHUNK) {
    const batch = markets.slice(i, i + CHUNK)
    const queries = batch.map(buildQuery)
    try {
      const data = await outscraperSearch(queries)
      for (let j = 0; j < batch.length; j++) {
        const row = Array.isArray(data[j]) ? data[j][0] : data[j]
        if (!row || !row.name) {
          noResult++
          continue
        }

        // Verify Outscraper matched OUR market before trusting its data.
        const score = nameSimilarity(batch[j].name, row.name)
        if (score < MATCH_THRESHOLD) {
          rejected++
          if (DRY_RUN && rejected <= 6) {
            console.log(
              `  ✗ REJECT [${score.toFixed(2)}] ${batch[j].name.slice(0, 32)} -> ${row.name.slice(0, 34)}`
            )
          }
          continue
        }

        const update = mapRow(row)
        if (!Object.keys(update).length) {
          noResult++
          continue
        }
        if (DRY_RUN) {
          if (updated < 5) {
            console.log(`  ✓ ${batch[j].name.slice(0, 34)} -> ${row.name.slice(0, 30)}`)
            console.log(`     rating=${row.rating} reviews=${row.reviews} photo=${row.photo ? 'yes' : 'no'} hours=${update.schedule ? 'yes' : 'no'}`)
          }
          updated++
        } else {
          const { error: upErr } = await supabase.from('markets').update(update).eq('id', batch[j].id)
          if (upErr) {
            failed++
            console.error(`    write failed (${batch[j].name}): ${upErr.message}`)
          } else updated++
        }
      }
      console.log(`  [${Math.min(i + CHUNK, markets.length)}/${markets.length}] updated=${updated} rejected=${rejected} noResult=${noResult} failed=${failed}`)
    } catch (e) {
      failed += batch.length
      console.error(`  ✗ batch ${i / CHUNK + 1}: ${e.message}`)
    }
  }

  console.log(`\nDone. updated=${updated} rejected=${rejected} noResult=${noResult} failed=${failed}`)
  if (DRY_RUN) console.log('(DRY RUN — nothing written.)')
  else console.log('NEXT: run 10-selfhost-photos.mjs so these photo URLs never expire.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
