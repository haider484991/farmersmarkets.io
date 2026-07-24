import { nameSimilarity } from './enrich/08-scrape-google-photos.mjs'

const THRESH = 0.7
// [our name, google's name, should we accept?] — all from real observed data.
const cases = [
  // Should ACCEPT (previously false-rejected)
  ['Federal Way Farmers Market - Town Square', 'Federal Way Farmers Market', true],
  ['Fitchburg/Burbank Campus Farmers Market', 'Fitchburg Farmers Market', true],
  ['Abilene Farmers Market', "Abilene Farmer's Market", true],
  ['Fayette County Farmers Market', 'Fayette County Farmers Market', true],
  ["Ferguson Farmers' Market", 'Ferguson Farmers Market', true],
  ['First & Main Town Center Mall Farmers Market', 'First & Main Town Center', true],
  ["Fisherman's Memorial Park Farmers Market", "Fisherman's Memorial Park Farmers Market", true],

  // Should REJECT (real wrong-business matches)
  ['Arroyo Grande Spencers CFM', "Christian's Mattress Xpress Arroyo Grande", false],
  ["Fayette Area Farmers' Market", "The Sedalia Area Farmers' Market", false],
  ['Festival Foods Farmers Market - Marshfield', 'Marshfield Farmers Market Co-operative', false],
  ['Casa Larga Vineyards Farm to Table', 'via Turk Hill Rd', false],
  ['Downtown Cleveland Farmers Market', 'West Side Market', false],
  ['Elgin Area Growers Market', 'Valley Fresh Market', false],
  ['Feria Agrícola de Luquillo', 'Feria Agrícola Nacional Del Valle De Lajas', false],
  // Guard against short-name over-matching
  ['Springfield Farmers Market', 'Springfield Mall', false],
]

let pass = 0
let fail = 0
for (const [ours, theirs, want] of cases) {
  const score = nameSimilarity(ours, theirs)
  const got = score >= THRESH
  const ok = got === want
  ok ? pass++ : fail++
  console.log(
    `${ok ? 'PASS' : 'FAIL'} [${score.toFixed(2)}] ${got ? 'accept' : 'reject'} (want ${want ? 'accept' : 'reject'})` +
      `\n     ours: ${ours}\n     goog: ${theirs}`
  )
}
console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
