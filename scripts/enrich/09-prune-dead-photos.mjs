/**
 * Find and clear dead photo URLs.
 *
 * Google photo links from the original Outscraper enrichment expire — they now
 * return 403, so the site renders broken images. Measured ~53% of the older
 * photos are dead, versus 0% of the ones the Playwright scraper collects.
 *
 * This checks each stored URL with a cheap HEAD request and nulls out the dead
 * ones (both featured_image and any dead entries in the photos array). Cleared
 * markets automatically become eligible for 08-scrape-google-photos.mjs.
 *
 * Run:
 *   DRY_RUN=1 node scripts/enrich/09-prune-dead-photos.mjs   # report only
 *   node scripts/enrich/09-prune-dead-photos.mjs             # clear dead ones
 *   ONLY_OLD=1 node scripts/enrich/09-prune-dead-photos.mjs  # skip freshly scraped
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DRY_RUN = process.env.DRY_RUN === '1'
const ONLY_OLD = process.env.ONLY_OLD === '1'
const CONCURRENCY = process.env.CONCURRENCY ? parseInt(process.env.CONCURRENCY, 10) : 24
const PAGE = 1000

/** True when the URL still serves a real image. */
async function isAlive(url) {
  if (!url) return false
  try {
    const r = await fetch(url, { method: 'HEAD' })
    return r.ok && (r.headers.get('content-type') || '').startsWith('image')
  } catch {
    return false
  }
}

async function run() {
  console.log(`\nPrune dead photos ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'}${ONLY_OLD ? ' [older photos only]' : ''}`)

  // Page through every market that has a photo.
  const rows = []
  for (let from = 0; ; from += PAGE) {
    let q = supabase
      .from('markets')
      .select('id, name, featured_image, photos')
      .eq('is_active', true)
      .not('featured_image', 'is', null)
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1)
    if (ONLY_OLD) q = q.not('featured_image', 'like', '%w1200-h800-k-no%')
    const { data, error } = await q
    if (error) throw error
    if (!data?.length) break
    rows.push(...data)
    if (data.length < PAGE) break
  }
  console.log(`Checking ${rows.length} markets with photos...\n`)

  let alive = 0
  let dead = 0
  let cleared = 0
  let partial = 0
  let checked = 0
  const queue = [...rows]

  async function worker() {
    while (queue.length) {
      const m = queue.shift()
      if (!m) break
      const featuredOk = await isAlive(m.featured_image)

      // Keep any still-working images from the gallery.
      const gallery = Array.isArray(m.photos) ? m.photos : []
      const survivors = []
      for (const p of gallery) {
        if (p === m.featured_image) {
          if (featuredOk) survivors.push(p)
          continue
        }
        if (await isAlive(p)) survivors.push(p)
      }

      if (featuredOk) {
        alive++
        // Featured is fine, but drop any dead gallery entries.
        if (!DRY_RUN && survivors.length !== gallery.length) {
          partial++
          await supabase
            .from('markets')
            .update({ photos: survivors.length ? survivors : null })
            .eq('id', m.id)
        }
      } else {
        dead++
        // Promote a surviving gallery image, else clear entirely so the
        // scraper picks this market up again.
        const replacement = survivors[0] || null
        if (!DRY_RUN) {
          const { error } = await supabase
            .from('markets')
            .update({
              featured_image: replacement,
              photos: survivors.length ? survivors : null,
            })
            .eq('id', m.id)
          if (!error) cleared++
        } else {
          cleared++
        }
      }

      checked++
      if (checked % 250 === 0) {
        console.log(`  [${checked}/${rows.length}] alive=${alive} dead=${dead}`)
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  console.log(
    `\nDone. checked=${checked} alive=${alive} dead=${dead} cleared=${cleared} galleryTrimmed=${partial}`
  )
  if (DRY_RUN) console.log('(DRY RUN — nothing written.)')
  else console.log('Cleared markets are now eligible for the photo scraper again.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
