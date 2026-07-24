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
// Parallel workers. Measured: 5 workers throttles after ~150 markets (Google
// silently stops serving photos). 3 is the sustainable sweet spot.
const CONCURRENCY = process.env.CONCURRENCY ? parseInt(process.env.CONCURRENCY, 10) : 3
// Throttle detection: this many consecutive photo-less markets means Google has
// soft-blocked us (it returns pages with no photos rather than an error).
const THROTTLE_STREAK = process.env.THROTTLE_STREAK
  ? parseInt(process.env.THROTTLE_STREAK, 10)
  : 35
const COOLDOWN_MS = process.env.COOLDOWN_MS ? parseInt(process.env.COOLDOWN_MS, 10) : 240000
const MAX_COOLDOWNS = process.env.MAX_COOLDOWNS ? parseInt(process.env.MAX_COOLDOWNS, 10) : 3
const MAX_PHOTOS = 4
// Per-worker pause between markets (effective request rate = CONCURRENCY / this).
const NAV_DELAY_MS = process.env.NAV_DELAY_MS ? parseInt(process.env.NAV_DELAY_MS, 10) : 600
// How long to let the page settle after the first photo appears. Too low and
// lazy-loaded photos are missed; too high wastes time.
const SETTLE_MS = process.env.SETTLE_MS ? parseInt(process.env.SETTLE_MS, 10) : 600
const SELECTOR_TIMEOUT = process.env.SELECTOR_TIMEOUT
  ? parseInt(process.env.SELECTOR_TIMEOUT, 10)
  : 6000

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

// --- Name verification -------------------------------------------------
// Google search often returns a DIFFERENT nearby business (measured: ~30-40% of
// the time). Attaching that business's photos to a market is bad data, so we
// compare the matched place name against ours and reject weak matches.
// 0.7 measured as the accuracy/yield sweet spot: 0.6 let through cross-town
// matches (e.g. "Feria Agrícola de Luquillo" → "...Valle De Lajas"). Wrong
// photos are worse than no photos, so we err toward rejecting.
const MATCH_THRESHOLD = process.env.MATCH_THRESHOLD
  ? parseFloat(process.env.MATCH_THRESHOLD)
  : 0.7

const STOPWORDS =
  /\b(the|a|an|of|at|on|in|and|association|assoc|inc|llc|co|company|market|markets|farmers|farmer|farm|growers|grower)\b/g

function normalizeName(x) {
  return (x || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’`]/g, '')
    // Separators become spaces so "Fitchburg/Burbank" splits into two tokens.
    .replace(/[./,\-()&:;|@+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Levenshtein distance, capped early — we only care about "almost identical". */
function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 99
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        last + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
      last = tmp
    }
  }
  return prev[b.length]
}

/**
 * Token match tolerant of the typos in the USDA source data
 * (e.g. "fayettevill" vs "fayetteville"). Only fires on long, near-identical
 * words so distinct businesses never match.
 */
function tokenMatches(word, set) {
  if (set.has(word)) return true
  if (word.length < 6) return false
  for (const other of set) {
    if (other.length >= 6 && editDistance(word, other) <= 1) return true
  }
  return false
}

/** Does the matched business actually look like a market/farm? */
function looksLikeMarket(name) {
  return /\b(market|farm|farmers|grower|growers|produce|orchard|bazaar|greenmarket)\b/i.test(
    name || ''
  )
}

/** Distinctive tokens = the words that actually identify this market. */
function distinctiveTokens(name) {
  return new Set(
    normalizeName(name)
      .replace(STOPWORDS, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  )
}

/**
 * How confident are we that Google matched OUR market?
 *
 * Two accept paths, both required to be safe against near-miss businesses:
 *  1. Most of our distinctive tokens appear in Google's name.
 *  2. Google's name is fully contained in ours — our record just carries extra
 *     qualifiers ("Federal Way Farmers Market - Town Square" vs Google's
 *     "Federal Way Farmers Market"). Containment must be total, so an unrelated
 *     business ("Christian's Mattress Xpress") still fails on its own tokens.
 */
function nameSimilarity(dbName, googleName) {
  const A = distinctiveTokens(dbName)
  const B = distinctiveTokens(googleName)
  if (!A.size || !B.size) {
    // Nothing distinctive (e.g. plain "Farmers Market") — compare full strings.
    const a = normalizeName(dbName)
    const b = normalizeName(googleName)
    return a && b && (b.includes(a) || a.includes(b)) ? 1 : 0
  }
  let hit = 0
  for (const w of A) if (tokenMatches(w, B)) hit++
  const forward = hit / A.size

  // Path 2: every one of Google's distinctive tokens is in our name.
  let backHit = 0
  for (const w of B) if (tokenMatches(w, A)) backHit++
  const googleSubsetOfOurs = backHit === B.size

  // Weak evidence: our name has a single distinctive word (usually just a town,
  // e.g. "Springfield Farmers Market"). Any business in that town would match on
  // it, so also require the match to actually look like a market — otherwise
  // "Springfield Mall" sails through.
  if (A.size === 1 && !googleSubsetOfOurs && !looksLikeMarket(googleName)) return 0

  return googleSubsetOfOurs ? Math.max(forward, 1) : forward
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

/** Name of the place Google matched, plus the visible page text (for city check). */
async function matchedPlaceInfo(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim() || ''
    const card = document.querySelector('a[href*="/maps/place/"]')
    const name =
      h1 && !/^results$/i.test(h1) ? h1 : card?.getAttribute('aria-label')?.trim() || ''
    return { name, text: (document.body.innerText || '').slice(0, 4000) }
  })
}

/**
 * A wrong match is usually in a different town, so require the market's city to
 * appear somewhere on the page. Skipped when we have no city on record.
 */
function cityMatches(market, pageText) {
  const city = normalizeName(market.city)
  if (!city || city === '-') return true
  return normalizeName(pageText).includes(city)
}

/**
 * Returns { photos, matched, score }. Uses the SEARCH url — the place_id url
 * reliably returns zero photos (measured), so search is the only path that
 * yields anything. Accuracy is enforced by the caller via `score`.
 */
async function scrapeMarket(page, market) {
  const query = `${market.name} ${market.city || ''} ${market.state || ''}`.trim()
  await page.goto('https://www.google.com/maps/search/' + encodeURIComponent(query), {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  })
  await handleConsent(page)
  await page
    .waitForSelector('img[src*="googleusercontent"], img[src*="ggpht"]', { timeout: SELECTOR_TIMEOUT })
    .catch(() => {})
  await sleep(SETTLE_MS)

  let photos = await extractPhotos(page)
  let info = await matchedPlaceInfo(page)

  // Results list with no hero photo — open the first result for the place panel.
  if (photos.length === 0) {
    const first = page.locator('a[href*="/maps/place/"]').first()
    if (await first.count().catch(() => 0)) {
      await first.click({ timeout: 5000 }).catch(() => {})
      await page
        .waitForSelector('img[src*="googleusercontent"], img[src*="ggpht"]', { timeout: SELECTOR_TIMEOUT })
        .catch(() => {})
      await sleep(SETTLE_MS + 200)
      photos = await extractPhotos(page)
      const next = await matchedPlaceInfo(page)
      if (next.name) info = next
    }
  }

  return {
    photos: photos.slice(0, MAX_PHOTOS),
    matched: info.name,
    score: nameSimilarity(market.name, info.name),
    cityOk: cityMatches(market, info.text),
  }
}

async function run() {
  console.log(
    `\nGoogle Maps photo scraper ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'}` +
      ` — limit ${LIMIT}, concurrency ${CONCURRENCY}`
  )

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
  let withPhotos = 0
  let none = 0
  let failed = 0
  let rejected = 0
  let processed = 0
  const started = Date.now()
  const queue = [...markets]

  // Shared throttle state across workers.
  let noneStreak = 0
  let cooldowns = 0
  let cooldownUntil = 0
  let aborted = false

  // If we hit a long run of photo-less markets, Google is soft-blocking us.
  // Pause everything, let the block lapse, then resume.
  async function maybeCooldown() {
    if (noneStreak < THROTTLE_STREAK || Date.now() < cooldownUntil) return
    cooldowns++
    if (cooldowns > MAX_COOLDOWNS) {
      console.log(
        `\n!! Throttled ${cooldowns}x — stopping so we don't waste the queue.` +
          ` Remaining markets stay unprocessed and will be picked up next run.`
      )
      aborted = true
      return
    }
    cooldownUntil = Date.now() + COOLDOWN_MS
    console.log(
      `\n!! ${noneStreak} markets with no photos in a row — likely throttled.` +
        ` Cooling down ${Math.round(COOLDOWN_MS / 1000)}s (${cooldowns}/${MAX_COOLDOWNS})...`
    )
    await sleep(COOLDOWN_MS)
    noneStreak = 0
    console.log('   resuming.\n')
  }

  async function worker(id) {
    const page = await context.newPage()
    // Block bytes we never need. We only read img SRC strings from the DOM —
    // the actual image/font/media downloads are pure waste, and skipping them
    // is the single biggest speedup here.
    await page.route('**/*', (route) => {
      const t = route.request().resourceType()
      if (t === 'image' || t === 'font' || t === 'media') return route.abort()
      route.continue()
    })

    while (queue.length && !aborted) {
      // Hold here while another worker is cooling down.
      while (Date.now() < cooldownUntil && !aborted) await sleep(2000)
      const market = queue.shift()
      if (!market) break
      try {
        const { photos, matched, score, cityOk } = await scrapeMarket(page, market)
        if (photos.length && score >= MATCH_THRESHOLD && cityOk) {
          noneStreak = 0
          withPhotos++
          if (!DRY_RUN) {
            const { error: upErr } = await supabase
              .from('markets')
              .update({ featured_image: photos[0], photos })
              .eq('id', market.id)
            if (upErr) {
              failed++
              console.error(`    write failed (${market.name}): ${upErr.message}`)
            }
          } else {
            console.log(
              `  ✓ ${photos.length} [${score.toFixed(2)}] ${market.name} → ${matched.slice(0, 40)}`
            )
          }
        } else if (photos.length) {
          // Photos found, but they belong to a different business — discard.
          rejected++
          noneStreak = 0
          if (DRY_RUN) {
            console.log(
              `  ✗ REJECT [${score.toFixed(2)}${cityOk ? '' : ' city✗'}] ` +
                `${market.name.slice(0, 30)} → ${matched.slice(0, 38)}`
            )
          }
        } else {
          none++
          noneStreak++
          await maybeCooldown()
        }
      } catch (e) {
        failed++
        console.error(`  ✗ ${market.name}: ${e.message}`)
      }
      processed++
      if (processed % 25 === 0) {
        const mins = (Date.now() - started) / 60000
        console.log(
          `  [${processed}/${markets.length}] photos=${withPhotos} rejected=${rejected} none=${none} failed=${failed}` +
            ` streak=${noneStreak} — ${(processed / mins).toFixed(1)} markets/min`
        )
      }
      await sleep(NAV_DELAY_MS)
    }
    await page.close().catch(() => {})
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)))

  await browser.close()
  const mins = (Date.now() - started) / 60000
  console.log(
    `\nDone in ${mins.toFixed(1)}min. withPhotos=${withPhotos} rejected=${rejected} none=${none} failed=${failed}` +
      ` (${(processed / mins).toFixed(1)} markets/min)`
  )
  if (DRY_RUN) console.log('(DRY RUN — nothing written.)')
}

// Exported for unit-testing the match logic without launching a browser.
export { nameSimilarity, distinctiveTokens, normalizeName }

// Only scrape when executed directly (not when imported by a test).
const invokedDirectly = process.argv[1] && process.argv[1].endsWith('08-scrape-google-photos.mjs')
if (invokedDirectly) {
  run().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
