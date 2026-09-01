// Reads the market-page title/description test (lib/titleTest.ts) out of Search
// Console: control vs variant, split further by whether the market has a schedule
// (variant pages without a schedule changed only their description).
//
//   node scripts/gsc-title-test.mjs                      # last 14 complete days
//   node scripts/gsc-title-test.mjs --start 2026-08-03 --end 2026-08-30   # baseline
//
// Compare CTR at matched position bands, not overall CTR: the groups are a
// hash split so their position mix should already be near-identical (check the
// baseline run first). Zero deps: signs its own JWT with node:crypto.
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KEY_PATH = 'C:/Projects/Web/TrueAppliance/gsc-credentials.json'
const SITE = 'https://www.farmersmarkets.io/'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// ---- args ----
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => (a.startsWith('--') ? [a.slice(2), arr[i + 1]] : [])).filter((x) => x.length))
const iso = (d) => d.toISOString().slice(0, 10)
const today = new Date()
const endDefault = new Date(today); endDefault.setUTCDate(endDefault.getUTCDate() - 3)
const startDefault = new Date(endDefault); startDefault.setUTCDate(startDefault.getUTCDate() - 13)
const START = args.start || iso(startDefault)
const END = args.end || iso(endDefault)

// ---- the split: identical to lib/titleTest.ts ----
function titleTestGroup(slug) {
  let h = 5381
  for (let i = 0; i < slug.length; i++) h = ((h * 33) ^ slug.charCodeAt(i)) >>> 0
  return h % 2 === 1 ? 'variant' : 'control'
}

// ---- GSC auth ----
const key = JSON.parse(await fs.readFile(KEY_PATH, 'utf8'))
const b64url = (x) => Buffer.from(x).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
async function token() {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = b64url(JSON.stringify({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now }))
  const sig = crypto.createSign('RSA-SHA256').update(`${header}.${claim}`).sign(key.private_key)
  const jwt = `${header}.${claim}.${sig.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}`
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) })
  const j = await res.json()
  if (!j.access_token) throw new Error(`auth failed: ${JSON.stringify(j).slice(0, 200)}`)
  return j.access_token
}
const TOKEN = await token()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function sa(body, attempt = 0) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (res.ok) return (await res.json()).rows ?? []
  const txt = (await res.text()).replace(/\s+/g, ' ')
  if ((res.status === 429 || res.status >= 500 || (res.status === 403 && /quota/i.test(txt))) && attempt < 6) { process.stdout.write('q'); await sleep(45000); return sa(body, attempt + 1) }
  throw new Error(`${res.status}: ${txt.slice(0, 200)}`)
}

// ---- which markets have a schedule (Supabase anon key from .env.local) ----
async function scheduleSlugs() {
  const env = {}
  try {
    for (const raw of (await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')).split(/\r?\n/)) {
      const i = raw.indexOf('='); if (i < 1 || raw.startsWith('#')) continue
      env[raw.slice(0, i).trim()] = raw.slice(i + 1).trim().replace(/^"|"$/g, '')
    }
  } catch { return null }
  const url = env.NEXT_PUBLIC_SUPABASE_URL, anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  const out = new Set()
  for (let offset = 0; offset < 20000; offset += 1000) {
    const r = await fetch(`${url}/rest/v1/markets?select=slug&is_active=eq.true&schedule=not.is.null&limit=1000&offset=${offset}`, { headers: { apikey: anon, Authorization: `Bearer ${anon}` } })
    if (!r.ok) return null
    const rows = await r.json()
    rows.forEach((x) => out.add(x.slug))
    if (rows.length < 1000) break
  }
  return out
}

// ---- pull ----
console.log(`farmersmarkets.io market pages, ${START} → ${END}`)
const rows = []
for (let startRow = 0; startRow < 100000; startRow += 25000) {
  const r = await sa({ startDate: START, endDate: END, dimensions: ['page'], rowLimit: 25000, startRow })
  rows.push(...r)
  if (r.length < 25000) break
}
const market = rows.filter((r) => r.keys[0].includes('/market/')).map((r) => {
  const slug = r.keys[0].split('/market/')[1].split(/[?#]/)[0].replace(/\/$/, '')
  return { slug, group: titleTestGroup(slug), clicks: r.clicks, impressions: r.impressions, position: r.position }
})
const withSchedule = await scheduleSlugs()
if (!withSchedule) console.log('(no Supabase access: schedule split skipped)')

const band = (p) => (p <= 3 ? '1-3' : p <= 10 ? '4-10' : p <= 20 ? '11-20' : '21+')
const BANDS = ['1-3', '4-10', '11-20', '21+']
function agg(list) {
  const t = { pages: list.length, clicks: 0, impressions: 0, posW: 0, bands: {} }
  for (const r of list) {
    t.clicks += r.clicks; t.impressions += r.impressions; t.posW += r.position * r.impressions
    const b = band(r.position); t.bands[b] ??= { pages: 0, clicks: 0, impressions: 0 }
    t.bands[b].pages++; t.bands[b].clicks += r.clicks; t.bands[b].impressions += r.impressions
  }
  return t
}
const pct = (c, i) => (i ? `${((c / i) * 100).toFixed(2)}%` : '–')
function print(label, list) {
  const t = agg(list)
  console.log(`\n${label}: ${t.pages} pages · ${Math.round(t.impressions)} impressions · ${t.clicks} clicks · CTR ${pct(t.clicks, t.impressions)} · avg pos ${(t.posW / (t.impressions || 1)).toFixed(1)}`)
  for (const b of BANDS) { const x = t.bands[b]; if (x) console.log(`   pos ${b.padEnd(5)} ${String(x.pages).padStart(5)} pages ${String(Math.round(x.impressions)).padStart(7)} impr ${String(x.clicks).padStart(5)} clicks  CTR ${pct(x.clicks, x.impressions)}`) }
}

const groups = { control: market.filter((r) => r.group === 'control'), variant: market.filter((r) => r.group === 'variant') }
print('CONTROL (all)', groups.control)
print('VARIANT (all)', groups.variant)
if (withSchedule) {
  print('CONTROL, has schedule', groups.control.filter((r) => withSchedule.has(r.slug)))
  print('VARIANT, has schedule (title + description changed)', groups.variant.filter((r) => withSchedule.has(r.slug)))
  print('CONTROL, no schedule', groups.control.filter((r) => !withSchedule.has(r.slug)))
  print('VARIANT, no schedule (description only)', groups.variant.filter((r) => !withSchedule.has(r.slug)))
}

// side-by-side band table
console.log('\nCTR by position band, control vs variant (all pages):')
const a = agg(groups.control), b = agg(groups.variant)
for (const bd of BANDS) {
  const x = a.bands[bd] || { clicks: 0, impressions: 0 }, y = b.bands[bd] || { clicks: 0, impressions: 0 }
  const lift = x.impressions && y.impressions ? (((y.clicks / y.impressions) / (x.clicks / x.impressions || 1e-9) - 1) * 100) : null
  console.log(`   ${bd.padEnd(6)} control ${pct(x.clicks, x.impressions).padStart(7)} (${Math.round(x.impressions)} impr)   variant ${pct(y.clicks, y.impressions).padStart(7)} (${Math.round(y.impressions)} impr)   ${lift == null ? '' : `lift ${lift >= 0 ? '+' : ''}${lift.toFixed(0)}%`}`)
}
console.log(`\nTest started 2026-09-02. A pre-start window is the balance check (both groups should read alike); a post-start window of 14+ days is the result. Impressions in band 4-10 carry the money.`)
