/**
 * Download market photos and re-host them in Supabase Storage.
 *
 * WHY: Google photo URLs (from Outscraper OR the Maps scraper) expire — 4,039
 * of them 403'd and rendered as broken images. Once a photo lives in our own
 * bucket it never expires, so this is the permanent fix.
 *
 * Downloads each external image, resizes + converts to WebP (small enough that
 * thousands fit the Supabase free tier), uploads to the `market-photos` bucket,
 * and rewrites the DB to point at our own URL.
 *
 * Safe to re-run: markets already pointing at Supabase are skipped, and the DB
 * is only updated after a successful upload.
 *
 * Run:
 *   DRY_RUN=1 LIMIT=5 node scripts/enrich/10-selfhost-photos.mjs
 *   LIMIT=500 node scripts/enrich/10-selfhost-photos.mjs
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUCKET = 'market-photos'
const DRY_RUN = process.env.DRY_RUN === '1'
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 500
const CONCURRENCY = process.env.CONCURRENCY ? parseInt(process.env.CONCURRENCY, 10) : 8
// Storage budget: Supabase's free tier is 1GB. Measured ~95KB/market at these
// settings, so all 8,675 markets land near 825MB with headroom. The hero image
// renders at ~50vw (~700px on desktop), so 720px is not a visible downgrade.
const MAX_PER_MARKET = process.env.MAX_PER_MARKET ? parseInt(process.env.MAX_PER_MARKET, 10) : 2
const WIDTH = process.env.WIDTH ? parseInt(process.env.WIDTH, 10) : 720
const QUALITY = process.env.QUALITY ? parseInt(process.env.QUALITY, 10) : 70

const PUBLIC_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`
const isSelfHosted = (u) => typeof u === 'string' && u.startsWith(PUBLIC_BASE)

/** Download → resize → WebP. Returns a Buffer, or null if the source is dead. */
async function fetchAndConvert(url) {
  const r = await fetch(url)
  if (!r.ok) return null
  const ct = r.headers.get('content-type') || ''
  if (!ct.startsWith('image')) return null
  const input = Buffer.from(await r.arrayBuffer())
  return sharp(input)
    .rotate()
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer()
}

async function uploadPhoto(slug, index, buffer) {
  const path = `${slug}-${index}.webp`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: 'image/webp', upsert: true })
  if (error) throw new Error(error.message)
  return PUBLIC_BASE + path
}

async function run() {
  console.log(`\nSelf-host photos ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'} — limit ${LIMIT}, up to ${MAX_PER_MARKET}/market @ ${WIDTH}px webp q${QUALITY}`)

  // Markets whose featured image is still an external URL.
  const rows = []
  for (let from = 0; rows.length < LIMIT; from += 1000) {
    const { data, error } = await supabase
      .from('markets')
      .select('id, slug, name, featured_image, photos')
      .eq('is_active', true)
      .not('featured_image', 'is', null)
      .order('id', { ascending: true })
      .range(from, from + 999)
    if (error) throw error
    if (!data?.length) break
    for (const m of data) {
      if (!isSelfHosted(m.featured_image)) rows.push(m)
      if (rows.length >= LIMIT) break
    }
    if (data.length < 1000) break
  }

  if (!rows.length) {
    console.log('Nothing to do — all photos are already self-hosted.')
    return
  }
  console.log(`Processing ${rows.length} markets.\n`)

  let migrated = 0
  let dead = 0
  let failed = 0
  let bytes = 0
  let done = 0
  const queue = [...rows]

  async function worker() {
    while (queue.length) {
      const m = queue.shift()
      if (!m) break
      try {
        // featured first, then any extra gallery shots (deduped).
        const gallery = Array.isArray(m.photos) ? m.photos : []
        const sources = [m.featured_image, ...gallery.filter((p) => p !== m.featured_image)]
          .filter(Boolean)
          .slice(0, MAX_PER_MARKET)

        const hosted = []
        for (let i = 0; i < sources.length; i++) {
          const buf = await fetchAndConvert(sources[i]).catch(() => null)
          if (!buf) continue
          bytes += buf.length
          if (DRY_RUN) {
            hosted.push(`${PUBLIC_BASE}${m.slug}-${i}.webp (${Math.round(buf.length / 1024)}KB)`)
          } else {
            hosted.push(await uploadPhoto(m.slug, i, buf))
          }
        }

        if (!hosted.length) {
          // Every source was dead — clear so the scraper can refill it.
          dead++
          if (!DRY_RUN) {
            await supabase
              .from('markets')
              .update({ featured_image: null, photos: null })
              .eq('id', m.id)
          }
        } else {
          migrated++
          if (!DRY_RUN) {
            await supabase
              .from('markets')
              .update({ featured_image: hosted[0], photos: hosted })
              .eq('id', m.id)
          } else if (migrated <= 5) {
            console.log(`  ✓ ${m.name.slice(0, 38)} -> ${hosted.length} file(s)`)
            hosted.forEach((h) => console.log(`      ${h}`))
          }
        }
      } catch (e) {
        failed++
        console.error(`  ✗ ${m.name?.slice(0, 34)}: ${e.message}`)
      }
      done++
      if (done % 100 === 0) {
        console.log(
          `  [${done}/${rows.length}] migrated=${migrated} deadSource=${dead} failed=${failed} — ${(bytes / 1048576).toFixed(1)}MB`
        )
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  console.log(
    `\nDone. migrated=${migrated} deadSource=${dead} failed=${failed} storage=${(bytes / 1048576).toFixed(1)}MB` +
      ` (avg ${migrated ? Math.round(bytes / 1024 / Math.max(migrated, 1)) : 0}KB/market)`
  )
  if (DRY_RUN) console.log('(DRY RUN — nothing uploaded or written.)')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
