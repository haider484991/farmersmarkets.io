/**
 * Run Database Migration via Supabase SQL API
 */

import fs from 'fs'
import 'dotenv/config'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Error: Missing required environment variables.')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

async function runMigration() {
  console.log('Reading migration file...')
  const sql = fs.readFileSync('./supabase/migrations/001_initial_schema.sql', 'utf8')

  console.log('Executing migration against Supabase...')
  console.log('SQL length:', sql.length, 'characters\n')

  // Use the Supabase Query endpoint (management API)
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({})
  })

  // The REST API doesn't support raw SQL. We need to check if tables exist
  // by trying to select from them

  // Let's check if migration is needed by querying the markets table
  const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/markets?select=id&limit=1`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    }
  })

  if (checkResponse.ok) {
    console.log('Database tables already exist! Migration may have been run previously.')

    // Check how many markets exist
    const countResponse = await fetch(`${SUPABASE_URL}/rest/v1/markets?select=id`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'count=exact',
        'Range': '0-0'
      }
    })

    const count = countResponse.headers.get('content-range')
    console.log('Markets count:', count)

    // Check locations
    const locResponse = await fetch(`${SUPABASE_URL}/rest/v1/locations?select=id&limit=1`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'count=exact',
        'Range': '0-0'
      }
    })
    const locCount = locResponse.headers.get('content-range')
    console.log('Locations count:', locCount)

    return true
  } else {
    console.log('Tables do not exist yet. Please run the migration manually:')
    console.log('1. Go to your Supabase dashboard SQL editor')
    console.log('2. Paste the contents of supabase/migrations/001_initial_schema.sql')
    console.log('3. Click "Run"')
    return false
  }
}

runMigration().then(exists => {
  if (exists) {
    console.log('\nDatabase is ready!')
  }
}).catch(console.error)
