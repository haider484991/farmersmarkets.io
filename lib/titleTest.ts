import type { MarketProducts, MarketSchedule, PaymentMethods } from '@/types/database'

/**
 * Market-page title and description test, started 2026-09-02.
 *
 * Hypothesis: a searcher who types a market's name wants to know WHEN it runs.
 * The control template ends in the generic hook "Hours & Directions"; the
 * variant states the actual days and times in the title and leads the
 * description with facts (schedule, address, what is sold, SNAP, rating).
 *
 * Half of all /market pages receive the variant. The split is a hash of the
 * slug, so it is stable across deploys and reproducible without a database in
 * scripts/gsc-title-test.mjs, which compares click-through rate at matched
 * positions after ~14 days. Flip TITLE_TEST_ENABLED to false to send every page
 * back to the control template.
 *
 * Measured on 2026-09-02 (GSC, Aug 3–30): market pages held 1,727 queries at
 * positions 4–10 earning 453 clicks from 27k impressions (1.7%), with
 * "farmers market near me" at 36 clicks / 3,395 impressions at position 8.7.
 */
export const TITLE_TEST_ENABLED = true
export const TITLE_TEST_STARTED = '2026-09-02'

export type TitleTestGroup = 'control' | 'variant'

/**
 * djb2 over the slug; odd hashes get the variant.
 * Mirrored byte-for-byte in scripts/gsc-title-test.mjs — change both or neither.
 */
export function titleTestGroup(slug: string): TitleTestGroup {
  let h = 5381
  for (let i = 0; i < slug.length; i++) h = ((h * 33) ^ slug.charCodeAt(i)) >>> 0
  return h % 2 === 1 ? 'variant' : 'control'
}

/** Google truncates titles around here; past it the tail is invisible. */
export const TITLE_BUDGET = 60
/** Snippets get cut around here on desktop; keep the facts inside it. */
export const DESCRIPTION_BUDGET = 155

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
type DayKey = (typeof DAYS)[number]
const ABBR: Record<DayKey, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}
const PLURAL: Record<DayKey, string> = {
  monday: 'Mondays', tuesday: 'Tuesdays', wednesday: 'Wednesdays', thursday: 'Thursdays',
  friday: 'Fridays', saturday: 'Saturdays', sunday: 'Sundays',
}

/**
 * "8 AM" → "8am", "12:30 PM" → "12:30pm", "9:00 AM" → "9am", "6PM" → "6pm".
 * Stored times are inconsistent (some carry no meridiem at all, e.g. "3");
 * anything that does not parse is returned trimmed rather than invented.
 */
export function compactTime(raw: string): string {
  const m = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp])\.?\s*[Mm]\.?$/)
  if (!m) return raw.trim()
  const minutes = m[2] && m[2] !== '00' ? `:${m[2]}` : ''
  return `${Number(m[1])}${minutes}${m[3].toLowerCase()}m`
}

export interface ScheduleSummary {
  /** "Saturdays", "Sat & Sun", "Tue, Thu & Sat", "Mon–Fri", "Daily" */
  dayPhrase: string
  /** "8am–12pm" when every open day keeps the same hours, otherwise null */
  hours: string | null
  /** one entry per open day, in week order */
  slots: { day: string; open: string; close: string }[]
}

export function summarizeSchedule(schedule: MarketSchedule | null | undefined): ScheduleSummary | null {
  if (!schedule || typeof schedule !== 'object') return null
  const open = DAYS.filter((d) => {
    const s = schedule[d]
    return Boolean(s && typeof s.open === 'string' && typeof s.close === 'string' && s.open.trim() && s.close.trim())
  })
  if (open.length === 0) return null

  const slots = open.map((d) => ({
    day: ABBR[d],
    open: compactTime(schedule[d]!.open),
    close: compactTime(schedule[d]!.close),
  }))

  let dayPhrase: string
  if (open.length === 7) {
    dayPhrase = 'Daily'
  } else if (open.length === 1) {
    dayPhrase = PLURAL[open[0]]
  } else {
    const idx = open.map((d) => DAYS.indexOf(d))
    const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1)
    const ab = open.map((d) => ABBR[d])
    if (consecutive && open.length >= 3) dayPhrase = `${ab[0]}–${ab[ab.length - 1]}`
    else if (ab.length === 2) dayPhrase = `${ab[0]} & ${ab[1]}`
    else dayPhrase = `${ab.slice(0, -1).join(', ')} & ${ab[ab.length - 1]}`
  }

  const ranges = new Set(slots.map((s) => `${s.open}–${s.close}`))
  const hours = ranges.size === 1 ? [...ranges][0] : null
  return { dayPhrase, hours, slots }
}

/**
 * Variant title: "{core}: Sat 8am–12pm" when it fits the budget, "{core}: Saturdays"
 * when only the days fit, otherwise the control title unchanged. Markets without a
 * schedule keep the control title (their description still changes).
 */
export function buildVariantTitle(core: string, summary: ScheduleSummary | null, controlTitle: string): string {
  if (!summary) return controlTitle
  if (summary.hours) {
    const withHours = `${core}: ${summary.dayPhrase} ${summary.hours}`
    if (withHours.length <= TITLE_BUDGET) return withHours
  }
  const daysOnly = `${core}: ${summary.dayPhrase}`
  if (daysOnly.length <= TITLE_BUDGET) return daysOnly
  return controlTitle
}

/** Product keys in the order a shopper cares about, with the label used in copy. */
const PRODUCT_LABELS: [string, string][] = [
  ['vegetables', 'vegetables'], ['fruits', 'fruit'], ['baked', 'baked goods'], ['eggs', 'eggs'],
  ['honey', 'honey'], ['meat', 'meat'], ['dairy', 'dairy'], ['flowers', 'flowers'], ['plants', 'plants'],
  ['prepared', 'prepared food'], ['coffee', 'coffee'], ['herbs', 'herbs'], ['jams', 'jams'],
  ['maple', 'maple syrup'], ['seafood', 'seafood'], ['poultry', 'poultry'], ['nuts', 'nuts'],
  ['wine', 'wine'], ['crafts', 'crafts'], ['soap', 'soap'],
]

export interface VariantDescriptionInput {
  name: string
  city: string | null
  stateCode: string | null
  address: string | null
  summary: ScheduleSummary | null
  products: MarketProducts | null
  payments: PaymentMethods | null
  rating: number | null
  reviews: number | null
}

const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s)

function soldSentence(labels: string[], max: number): string {
  if (labels.length === 0) return ''
  if (labels.length <= max) {
    return labels.length === 1
      ? `${capitalize(labels[0])}.`
      : `${capitalize(labels.slice(0, -1).join(', '))} & ${labels[labels.length - 1]}.`
  }
  return `${capitalize(labels.slice(0, max).join(', '))} & more.`
}

/**
 * Facts-first description assembled in priority order and kept inside the
 * snippet budget: when it runs and where, what is sold, SNAP/EBT, then the rating
 * (only when it rests on 5+ reviews). Falls back to the control description if
 * even the opening sentence cannot be built.
 */
export function buildVariantDescription(m: VariantDescriptionInput, fallback: string): string {
  const place = [m.city, m.stateCode].filter(Boolean).join(', ')
  const address = m.address?.trim() || null
  const whereAt = address ? ` at ${address}${place ? `, ${place}` : ''}` : place ? ` in ${place}` : ''
  const whereIn = place ? ` in ${place}` : ''

  let when: string | null = null
  if (m.summary) {
    if (m.summary.hours) when = `${m.summary.dayPhrase} ${m.summary.hours}`
    else if (m.summary.slots.length <= 2) when = m.summary.slots.map((s) => `${s.day} ${s.open}–${s.close}`).join(' & ')
    else when = m.summary.dayPhrase
  }

  let opening = when ? `Open ${when}${whereAt}.` : `${m.name}${whereAt}.`
  if (opening.length > DESCRIPTION_BUDGET) opening = when ? `Open ${when}${whereIn}.` : `${m.name}${whereIn}.`
  if (opening.length > DESCRIPTION_BUDGET || opening.length < 12) return fallback

  const sold = PRODUCT_LABELS.filter(([key]) => m.products?.[key]).map(([, label]) => label)
  const snap = m.payments?.snap ? 'SNAP/EBT accepted.' : ''
  const rated = m.rating && (m.reviews ?? 0) >= 5 ? `${m.rating.toFixed(1)}/5 from ${m.reviews} reviews.` : ''

  const parts = [opening]
  const fits = (candidate: string) => [...parts, candidate].join(' ').length <= DESCRIPTION_BUDGET
  for (const max of [5, 3, 2]) {
    const s = soldSentence(sold, max)
    if (s && fits(s)) { parts.push(s); break }
  }
  if (snap && fits(snap)) parts.push(snap)
  if (rated && fits(rated)) parts.push(rated)
  const closing = 'Hours, directions & what’s in season.'
  if (fits(closing)) parts.push(closing)
  return parts.join(' ')
}
