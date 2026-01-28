/**
 * USDA Farmers Market Data Import Script
 *
 * Downloads and imports farmers market data from the USDA directory
 * Source: https://apps.ams.usda.gov/FarmersMarketsExport/ExcelExport.aspx
 *
 * Run with: npm run import:usda
 */

import { createAdminClient } from '../../lib/supabase/admin'
import * as XLSX from 'xlsx'
import slugify from 'slugify'

// You'll need to download the USDA Excel file and place it in scripts/data/
const USDA_FILE_PATH = './scripts/data/farmers-markets.xlsx'

interface USDAMarket {
  FMID: string
  MarketName: string
  Website: string
  Facebook: string
  Twitter: string
  Youtube: string
  OtherMedia: string
  street: string
  city: string
  County: string
  State: string
  zip: string
  x: number // longitude
  y: number // latitude
  Location: string
  Credit: string
  WIC: string
  WICcash: string
  SFMNP: string
  SNAP: string
  Organic: string
  Bakedgoods: string
  Cheese: string
  Crafts: string
  Flowers: string
  Eggs: string
  Seafood: string
  Herbs: string
  Vegetables: string
  Honey: string
  Jams: string
  Maple: string
  Meat: string
  Nursery: string
  Nuts: string
  Plants: string
  Poultry: string
  Prepared: string
  Soap: string
  Trees: string
  Wine: string
  Coffee: string
  Beans: string
  Fruits: string
  Grains: string
  Juices: string
  Mushrooms: string
  PetFood: string
  Tofu: string
  WildHarvested: string
  updateTime: string
  Season1Date: string
  Season1Time: string
  Season2Date: string
  Season2Time: string
  Season3Date: string
  Season3Time: string
  Season4Date: string
  Season4Time: string
}

// State code mapping
const STATE_CODES: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC', 'Puerto Rico': 'PR'
}

function parseYesNo(value: string | undefined): boolean {
  return value?.toLowerCase() === 'y' || value?.toLowerCase() === 'yes'
}

function generateUniqueSlug(name: string, city: string, state: string): string {
  const baseSlug = slugify(`${name}-${city}-${state}`, {
    lower: true,
    strict: true,
    trim: true
  })
  return baseSlug
}

function parseProducts(market: USDAMarket): Record<string, boolean> {
  return {
    vegetables: parseYesNo(market.Vegetables),
    fruits: parseYesNo(market.Fruits),
    meat: parseYesNo(market.Meat),
    poultry: parseYesNo(market.Poultry),
    dairy: parseYesNo(market.Cheese),
    eggs: parseYesNo(market.Eggs),
    seafood: parseYesNo(market.Seafood),
    herbs: parseYesNo(market.Herbs),
    flowers: parseYesNo(market.Flowers),
    honey: parseYesNo(market.Honey),
    jams: parseYesNo(market.Jams),
    maple: parseYesNo(market.Maple),
    nuts: parseYesNo(market.Nuts),
    plants: parseYesNo(market.Plants),
    prepared: parseYesNo(market.Prepared),
    baked: parseYesNo(market.Bakedgoods),
    soap: parseYesNo(market.Soap),
    wine: parseYesNo(market.Wine),
    coffee: parseYesNo(market.Coffee),
    beans: parseYesNo(market.Beans),
    crafts: parseYesNo(market.Crafts),
    organic: parseYesNo(market.Organic),
  }
}

function parsePaymentMethods(market: USDAMarket): Record<string, boolean> {
  return {
    credit: parseYesNo(market.Credit),
    snap: parseYesNo(market.SNAP),
    wic: parseYesNo(market.WIC),
    sfmnp: parseYesNo(market.SFMNP),
  }
}

async function importUSDAData() {
  console.log('Starting USDA data import...')

  // Read Excel file
  let workbook: XLSX.WorkBook
  try {
    workbook = XLSX.readFile(USDA_FILE_PATH)
  } catch (error) {
    console.error(`Error reading file: ${USDA_FILE_PATH}`)
    console.error('Please download the USDA Excel file from:')
    console.error('https://apps.ams.usda.gov/FarmersMarketsExport/ExcelExport.aspx')
    console.error('And place it at: ./scripts/data/farmers-markets.xlsx')
    process.exit(1)
  }

  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json<USDAMarket>(sheet)

  console.log(`Found ${data.length} markets in USDA data`)

  const supabase = createAdminClient()

  // Process in batches
  const BATCH_SIZE = 100
  let imported = 0
  let skipped = 0
  const slugs = new Set<string>()

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE)

    const markets = batch
      .filter((market) => market.MarketName && market.city && market.State)
      .map((market) => {
        // Generate unique slug
        let slug = generateUniqueSlug(market.MarketName, market.city, market.State)
        let counter = 1
        while (slugs.has(slug)) {
          slug = `${generateUniqueSlug(market.MarketName, market.city, market.State)}-${counter}`
          counter++
        }
        slugs.add(slug)

        const stateCode = STATE_CODES[market.State] || market.State

        return {
          slug,
          name: market.MarketName.trim(),
          address: market.street?.trim() || null,
          city: market.city.trim(),
          state: market.State,
          state_code: stateCode,
          zip_code: market.zip?.toString() || null,
          county: market.County?.trim() || null,
          latitude: market.y || null,
          longitude: market.x || null,
          website: market.Website?.trim() || null,
          social_facebook: market.Facebook?.trim() || null,
          products: parseProducts(market),
          payment_methods: parsePaymentMethods(market),
          is_active: true,
        }
      })

    if (markets.length === 0) continue

    const { error } = await supabase.from('markets').upsert(markets, {
      onConflict: 'slug',
      ignoreDuplicates: false,
    })

    if (error) {
      console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error.message)
      skipped += markets.length
    } else {
      imported += markets.length
    }

    console.log(`Progress: ${Math.min(i + BATCH_SIZE, data.length)}/${data.length}`)
  }

  console.log('\nImport complete!')
  console.log(`Imported: ${imported}`)
  console.log(`Skipped: ${skipped}`)
}

importUSDAData().catch(console.error)
