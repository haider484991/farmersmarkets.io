/**
 * One command to keep market photos populated AND permanent.
 *
 * Each cycle:
 *   1. scrape a batch of markets for photos   (08-scrape-google-photos.mjs)
 *   2. re-host whatever it found in Supabase  (10-selfhost-photos.mjs)
 *   3. pause so Google doesn't rate-limit us
 *
 * Step 2 matters: raw Google photo URLs expire (4,039 of them died and rendered
 * as broken images), so every newly scraped photo is copied into our own bucket
 * before the next batch starts.
 *
 * Run:
 *   node scripts/enrich/run-photo-pipeline.mjs            # default 8 cycles
 *   CYCLES=20 BATCH=250 node scripts/enrich/run-photo-pipeline.mjs
 *   RETRY=1 node scripts/enrich/run-photo-pipeline.mjs     # re-try previously
 *                                                          # failed markets with
 *                                                          # the current matcher
 */
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const CYCLES = process.env.CYCLES ? parseInt(process.env.CYCLES, 10) : 8
const BATCH = process.env.BATCH || '250'
const PAUSE_MS = process.env.PAUSE_MS ? parseInt(process.env.PAUSE_MS, 10) : 540000
const RETRY = process.env.RETRY === '1'

// Settings measured as sustainable — 6+ consecutive batches with no throttling.
const SCRAPE_ENV = {
  LIMIT: BATCH,
  CONCURRENCY: process.env.CONCURRENCY || '2',
  NAV_DELAY_MS: process.env.NAV_DELAY_MS || '2500',
  COOLDOWN_MS: process.env.COOLDOWN_MS || '360000',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function run(script, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [join(HERE, script)], {
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let tail = ''
    const capture = (buf) => {
      const s = buf.toString()
      tail = (tail + s).slice(-2000)
      for (const line of s.split('\n')) {
        if (/^(Done|\s+\[|!!|No un-attempted|Nothing to do)/.test(line) && line.trim()) {
          console.log('   ' + line.trim())
        }
      }
    }
    child.stdout.on('data', capture)
    child.stderr.on('data', capture)
    child.on('close', (code) => resolve({ code, tail }))
  })
}

const run_ = async () => {
  console.log(
    `\nPhoto pipeline — ${CYCLES} cycles x ${BATCH} markets` +
      `${RETRY ? ' (RETRY mode: re-testing previously failed markets)' : ''}\n`
  )

  for (let i = 1; i <= CYCLES; i++) {
    console.log(`=== CYCLE ${i}/${CYCLES} — scraping ===`)
    const scrapeEnv = { ...SCRAPE_ENV }
    // Only reset the attempted list once, on the first cycle.
    if (RETRY && i === 1) scrapeEnv.RESET_ATTEMPTED = '1'
    const scraped = await run('08-scrape-google-photos.mjs', scrapeEnv)

    if (/No un-attempted markets left/.test(scraped.tail)) {
      console.log('   nothing left to scrape — stopping early.')
      break
    }

    console.log(`=== CYCLE ${i}/${CYCLES} — self-hosting new photos ===`)
    await run('10-selfhost-photos.mjs', { LIMIT: '600', CONCURRENCY: '8' })

    if (i < CYCLES) {
      console.log(`--- pause ${Math.round(PAUSE_MS / 60000)}min ---\n`)
      await sleep(PAUSE_MS)
    }
  }

  console.log('\n=== PIPELINE COMPLETE ===')
}

run_().catch((e) => {
  console.error(e)
  process.exit(1)
})
