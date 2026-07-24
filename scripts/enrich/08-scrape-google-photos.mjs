/**
 * FREE Google Maps photo scraper (Playwright).
 *
 * Renders each market's Google Maps place page in a headless browser and
 * extracts the real photo URLs (googleusercontent) directly — no API key, no
 * card. This is the same approach the waterdamage directory used.
 *
 * HONEST LIMITS: scraping Google at scale from one IP gets throttled/CAPTCHA'd.
 * Run in small batches (LIMIT=100–300), space them out, and re-run — it's
 * resumable (only touches markets still missing an image). Expect partial yield.
 *
 * Run:
 *   DRY_RUN=1 LIMIT=3 node scripts/enrich/08-scrape-google-photos.mjs   # test
 *   LIMIT=150 node scripts/enrich/08-scrape-google-photos.mjs           # a batch
 *   HEADFUL=1 LIMIT=3 node scripts/enrich/08-scrape-google-photos.mjs   # watch it
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DRY_RUN = process.env.DRY_RUN === '1'
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 150
const HEADFUL = process.env.HEADFUL === '1'
const MAX_PHOTOS = 4
const NAV_DELAY_MS = 1500

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Extract real photo URLs from a rendered Google Maps place page.
async function extractPhotos(page) {
  return page.evaluate(() => {
    const urls = new Set()
    const add = (u) => {
      if (!u) return
      // Real user/business photos live on googleusercontent / ggpht. Skip tiny
      // avatars and static assets.
      // Only real place/business photos: the /gps-cs-s/ (new) and /p/ (classic)
      // paths. This excludes reviewer avatars (/a/) and proxied images (/proxy/).
      if (/https:\/\/lh[0-9]+\.googleusercontent\.com\/(gps-cs-s|p)\//.test(u)) {
        // Upscale to a larger crop while PRESERVING Google's required trailing
        // params (e.g. -k-no). Stripping them yields a 400.
        let out = u
        if (/=w\d+-h\d+/.test(out)) out = out.replace(/=w\d+-h\d+[^=]*$/, '=w1200-h800-k-no')
        else if (/=s\d+/.test(out)) out = out.replace(/=s\d+[^=]*$/, '=s1200')
        else out = out + '=w1200-h800-k-no'
        urls.add(out)
      }
    }
    document.querySelectorAll('img').forEach((img) => add(img.src))
    document.querySelectorAll('[style*="googleusercontent"],[style*="ggpht"]').forEach((el) => {
      const m = (el.getAttribute('style') || '').match(/url\((["']?)(https:\/\/[^"')]+)\1\)/)
      if (m) add(m[2])
    })
    return [...urls]
  })
}

async function handleConsent(page) {
  if (!/consent\.google\.com|consent\.youtube/.test(page.url())) return
  for (const label of ['Reject all', 'Accept all', 'I agree']) {
    const btn = page.getByRole('button', { name: label }).first()
    if (await btn.count().catch(() => 0)) {
      await btn.click().catch(() => {})
      await page.waitForLoadState('domcontentloaded').catch(() => {})
      break
    }
  }
}

async function scrapeMarket(page, market) {
  const usePlace = !!market.google_place_id
  const url = usePlace
    ? `https://www.google.com/maps/place/?q=place_id:${market.google_place_id}`
    : `https://www.google.com/maps/search/${encodeURIComponent(
        `${market.name} ${market.city || ''} ${market.state || ''}`
      )}`
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await handleConsent(page)
  await page
    .waitForSelector('img[src*="googleusercontent"], img[src*="ggpht"]', { timeout: 8000 })
    .catch(() => {})
  await sleep(1000)

  let photos = await extractPhotos(page)
  // Search often lands on a results list with no hero photo — open the first
  // result to reach the place panel where the photos live.
  if (photos.length === 0 && !usePlace) {
    const first = page.locator('a[href*="/maps/place/"]').first()
    if (await first.count().catch(() => 0)) {
      await first.click({ timeout: 5000 }).catch(() => {})
      await page
        .waitForSelector('img[src*="googleusercontent"], img[src*="ggpht"]', { timeout: 8000 })
        .catch(() => {})
      await sleep(1200)
      photos = await extractPhotos(page)
    }
  }
  return photos.slice(0, MAX_PHOTOS)
}

async function run() {
  console.log(`\nGoogle Maps photo scraper ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'} — limit ${LIMIT}`)

  const { data: markets, error } = await supabase
    .from('markets')
    .select('id, name, address, city, state, google_place_id')
    .eq('is_active', true)
    .is('featured_image', null)
    .limit(LIMIT)
  if (error) throw error
  if (!markets?.length) {
    console.log('No markets missing images.')
    return
  }
  console.log(`Processing ${markets.length} markets.\n`)

  const browser = await chromium.launch({ headless: !HEADFUL })
  const context = await browser.newContext({
    locale: 'en-US',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  })
  // Pre-set consent so we skip the interstitial where possible.
  await context.addCookies([
    { name: 'SOCS', value: 'CAISNQgDEitib3gtMA', domain: '.google.com', path: '/' },
  ])
  const page = await context.newPage()
  // Block heavy resources we don't need (fonts/media) to speed things up.
  await page.route('**/*', (route) => {
    const t = route.request().resourceType()
    if (t === 'font' || t === 'media') return route.abort()
    route.continue()
  })

  let withPhotos = 0
  let none = 0
  let failed = 0

  for (const market of markets) {
    try {
      const photos = await scrapeMarket(page, market)
      if (photos.length) {
        withPhotos++
        console.log(`  ✓ ${photos.length} photo(s): ${market.name}`)
        if (!DRY_RUN) {
          const { error: upErr } = await supabase
            .from('markets')
            .update({ featured_image: photos[0], photos })
            .eq('id', market.id)
          if (upErr) {
            failed++
            console.error(`    write failed: ${upErr.message}`)
          }
        } else {
          console.log(`      ${photos[0].slice(0, 90)}`)
        }
      } else {
        none++
        console.log(`  · no photo: ${market.name}`)
      }
    } catch (e) {
      failed++
      console.error(`  ✗ ${market.name}: ${e.message}`)
    }
    await sleep(NAV_DELAY_MS)
  }

  await browser.close()
  console.log(`\nDone. withPhotos=${withPhotos} none=${none} failed=${failed}`)
  if (DRY_RUN) console.log('(DRY RUN — nothing written.)')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
