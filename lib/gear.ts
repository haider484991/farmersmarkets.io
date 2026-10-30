import type { MarketProducts } from '@/types/database'

/** Amazon Associates tracking ID for this site (created 2026-10-30). */
export const AMAZON_TAG = 'farmersmarketsio-20'

export interface GearItem {
  name: string
  why: string
  asin: string
}

/**
 * Things shoppers and vendors actually use at a market, matched to the pages
 * where readers land.
 *
 * Every item is a real Amazon US listing checked on 2026-10-30: an organic (not
 * sponsored) result, rated 4.3 stars or better, in stock with an Add to Cart
 * button. Names and reasons are ours. No prices are shown, because Amazon only
 * allows prices that come from its API.
 */
export const GEAR = {
  produceBags: {
    name: 'Earthwise reusable mesh produce bags (set of 9)',
    why: 'See-through, so vendors can weigh produce without unpacking it, and they are washable.',
    asin: 'B005E2QRPG',
  },
  marketTote: {
    name: 'VeraMia canvas grocery bags with pockets (set of 3)',
    why: 'Heavy canvas with a shoulder strap, so a full haul of squash and jars stays on your shoulder.',
    asin: 'B09P7LV1CS',
  },
  coolerBag: {
    name: 'Creative Green Life jumbo insulated cooler bag',
    why: 'Keeps meat, cheese, and eggs cold on the drive home.',
    asin: 'B081LM4H92',
  },
  wagon: {
    name: 'Amazon Basics collapsible utility wagon',
    why: 'Rolls flats of plants, pumpkins, and heavy bags across a big market lot, then folds into the trunk.',
    asin: 'B07W4JBRTM',
  },
  herbKeeper: {
    name: 'OXO Good Grips GreenSaver herb keeper',
    why: 'Holds stems in water inside the fridge, so cilantro and parsley last days longer.',
    asin: 'B073SHH2TZ',
  },
  produceSaver: {
    name: 'Rubbermaid FreshWorks produce saver containers (set of 4)',
    why: 'Vented lids and a raised tray keep berries and greens out of the moisture that turns them slimy.',
    asin: 'B08D9S3N9S',
  },
  vacuumSealer: {
    name: 'FoodSaver FM2100 vacuum sealer',
    why: 'Seals peak-season berries, corn, and peppers for the freezer and helps prevent freezer burn.',
    asin: 'B00LUGK5QW',
  },
  canopy: {
    name: 'Eurmax 10x10 commercial pop-up canopy',
    why: 'The standard market stall size, with a rolling storage bag for the walk from the car.',
    asin: 'B07GJ8WGTF',
  },
  canopyWeights: {
    name: 'US Weight 40 lb canopy weights (set of 4)',
    why: 'Many markets require weights on every canopy leg; these come with a carry strap and go on and off each leg easily.',
    asin: 'B06XQ6BLLJ',
  },
  foldingTable: {
    name: 'Amazon Basics 6 ft folding table',
    why: 'Folds in half with a handle, and six feet fills the front of a 10x10 stall.',
    asin: 'B0D1CBMMNF',
  },
  cashBox: {
    name: 'KYODOLED locking cash box with money tray',
    why: 'Separate slots for bills and coins, so making change for a $20 stays quick.',
    asin: 'B07FFR8FK9',
  },
  cardReader: {
    name: 'Square Reader for contactless and chip (2nd gen)',
    why: 'Takes tap, chip, and phone payments through a free app, for shoppers who carry no cash.',
    asin: 'B0C29GRRCZ',
  },
  herbSpinner: {
    name: 'OXO Good Grips Little Salad & Herb Spinner',
    why: 'Spins rinsed herbs bone-dry in seconds, and dry leaves are what keep in the fridge.',
    asin: 'B00005QB5U',
  },
  herbCubes: {
    name: 'Souper Cubes 2-tablespoon freezer tray with lid',
    why: 'Freezes chopped herbs in oil in two-tablespoon portions, ready to drop straight into a pan.',
    asin: 'B0C3GVWRWZ',
  },
  juteTote: {
    name: 'KAF Home jute market tote',
    why: 'Stiff jute stands open on its own, so peaches and tomatoes go in without getting crushed.',
    asin: 'B08PCDRY4H',
  },
  pocketTote: {
    name: 'CapaBunga 7-pocket farmer’s market tote',
    why: 'Outside pockets hold a jar of honey, a bottle of cider, or a carton of eggs upright.',
    asin: 'B07RTS9PKR',
  },
  rollingCart: {
    name: 'dbest products Quik Cart collapsible rolling crate',
    why: 'Narrow enough for a crowded aisle, rated to 80 lb, and folds flat for the trunk.',
    asin: 'B074T8WDJV',
  },
  sunWall: {
    name: 'ABCCANOPY 10x10 canopy sun wall',
    why: 'Hangs on the side facing the afternoon sun or wind, so produce and the vendor stay cooler.',
    asin: 'B01D71OD88',
  },
  tablecloth: {
    name: 'Obstal 6 ft stretch fitted tablecloths (2 pack)',
    why: 'Fits a folding table snugly, won’t blow up in the wind, and hides the bins stored underneath.',
    asin: 'B0BYCCGPNW',
  },
  displayCrates: {
    name: 'Nesting wooden display crates (set of 5)',
    why: 'Stack or tip them toward shoppers to build height into a flat table.',
    asin: 'B0DYDNS127',
  },
  chalkboardSigns: {
    name: 'Mini chalkboard signs with easels (20 pack)',
    why: 'A price on every bin, and easy to change when the zucchini goes two for $3.',
    asin: 'B07FSZ7NS5',
  },
} satisfies Record<string, GearItem>

export type GearKey = keyof typeof GEAR

export function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`
}

/**
 * Up to three picks for one market, chosen from what it sells: a cooler for
 * meat, dairy, eggs, or seafood; produce bags for fruit and vegetables; a
 * wagon where people haul plants, flowers, or flea-market finds. Markets that
 * list no products get the general shopping kit.
 */
export function gearForMarket(products: MarketProducts | null, name: string): GearKey[] {
  const p = products ?? {}
  const listed = Object.values(p).some(Boolean)
  const cold = p.meat || p.poultry || p.dairy || p.eggs || p.seafood
  const produce = !listed || p.vegetables || p.fruits || p.herbs
  const bulky = p.plants || p.flowers || /flea|swap meet|trade days/i.test(name)

  const picks: GearKey[] = []
  if (cold) picks.push('coolerBag')
  if (produce) picks.push('produceBags')
  if (bulky) picks.push('wagon')
  if (picks.length < 3 && p.herbs) picks.push('herbKeeper')
  if (picks.length < 3) picks.push('marketTote')
  if (picks.length < 3 && !cold) picks.push('coolerBag')
  return picks.slice(0, 3)
}
