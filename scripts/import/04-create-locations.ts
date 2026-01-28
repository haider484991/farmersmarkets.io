/**
 * Create Location Records Script
 *
 * Generates city location records from existing market data
 * and updates market counts for states and cities.
 *
 * Run with: npm run import:locations
 */

import { createAdminClient } from '../../lib/supabase/admin'
import slugify from 'slugify'

async function createLocations() {
  console.log('Creating location records...')

  const supabase = createAdminClient()

  // Get all markets grouped by city and state
  const { data: markets, error: marketsError } = await supabase
    .from('markets')
    .select('city, state_code')
    .eq('is_active', true)

  if (marketsError) {
    console.error('Error fetching markets:', marketsError)
    process.exit(1)
  }

  // Group by city and state
  const cityCounts = new Map<string, { city: string; state_code: string; count: number }>()

  markets.forEach((market) => {
    if (!market.city || !market.state_code) return

    const key = `${market.city.toLowerCase()}-${market.state_code}`
    const existing = cityCounts.get(key)

    if (existing) {
      existing.count++
    } else {
      cityCounts.set(key, {
        city: market.city,
        state_code: market.state_code,
        count: 1,
      })
    }
  })

  console.log(`Found ${cityCounts.size} unique cities`)

  // Get state location IDs
  const { data: states } = await supabase
    .from('locations')
    .select('id, state_code')
    .eq('type', 'state')

  const stateIdMap = new Map(states?.map((s) => [s.state_code, s.id]) || [])

  // Create city locations
  const cityLocations = Array.from(cityCounts.values()).map((city) => ({
    type: 'city',
    name: city.city,
    slug: slugify(city.city, { lower: true, strict: true }),
    state_code: city.state_code,
    parent_id: stateIdMap.get(city.state_code) || null,
    market_count: city.count,
  }))

  // Insert in batches
  const BATCH_SIZE = 100
  let inserted = 0

  for (let i = 0; i < cityLocations.length; i += BATCH_SIZE) {
    const batch = cityLocations.slice(i, i + BATCH_SIZE)

    const { error } = await supabase.from('locations').upsert(batch, {
      onConflict: 'type,slug,state_code',
      ignoreDuplicates: false,
    })

    if (error) {
      console.error(`Error inserting city batch:`, error.message)
    } else {
      inserted += batch.length
    }

    console.log(`Cities progress: ${Math.min(i + BATCH_SIZE, cityLocations.length)}/${cityLocations.length}`)
  }

  console.log(`\nInserted ${inserted} city locations`)

  // Update state market counts
  console.log('\nUpdating state market counts...')

  const stateCounts = new Map<string, number>()
  markets.forEach((market) => {
    if (!market.state_code) return
    stateCounts.set(market.state_code, (stateCounts.get(market.state_code) || 0) + 1)
  })

  for (const [stateCode, count] of stateCounts) {
    const { error } = await supabase
      .from('locations')
      .update({ market_count: count })
      .eq('type', 'state')
      .eq('state_code', stateCode)

    if (error) {
      console.error(`Error updating state ${stateCode}:`, error.message)
    }
  }

  console.log(`Updated ${stateCounts.size} state market counts`)
  console.log('\nDone!')
}

createLocations().catch(console.error)
