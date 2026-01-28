/**
 * Run Database Migration via Supabase pg-meta API
 */

import fs from 'fs'
import 'dotenv/config'

// Extract project ref from SUPABASE_URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Error: Missing required environment variables.')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

// Extract project ref from URL (e.g., 'https://xxxxx.supabase.co' -> 'xxxxx')
const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

if (!PROJECT_REF) {
  console.error('Error: Could not extract project reference from SUPABASE_URL')
  process.exit(1)
}

// Split SQL into executable chunks
function splitSQL(sql) {
  const chunks = []
  let current = ''
  let inDollarQuote = false

  const lines = sql.split('\n')
  for (const line of lines) {
    // Skip comment-only lines
    if (line.trim().startsWith('--') && !current.trim()) continue

    // Track dollar quoting for function bodies
    const dollarMatches = line.match(/\$\$/g)
    if (dollarMatches) {
      for (const _ of dollarMatches) {
        inDollarQuote = !inDollarQuote
      }
    }

    current += line + '\n'

    // If we hit a semicolon and we're not in a dollar quote, that's end of statement
    if (line.trim().endsWith(';') && !inDollarQuote) {
      const stmt = current.trim()
      if (stmt && stmt !== ';') {
        chunks.push(stmt)
      }
      current = ''
    }
  }

  // Don't forget any remaining content
  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks
}

async function executeSQL(sql) {
  // Try the pg-meta query endpoint
  const response = await fetch(`https://${PROJECT_REF}.supabase.co/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({ query: sql })
  })

  const text = await response.text()
  return { ok: response.ok, status: response.status, body: text }
}

async function runMigration() {
  console.log('Reading migration file...')
  const sql = fs.readFileSync('./supabase/migrations/001_initial_schema.sql', 'utf8')

  const statements = splitSQL(sql)
  console.log(`Found ${statements.length} SQL statements\n`)

  let success = 0
  let failed = 0
  const errors = []

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    const preview = stmt.substring(0, 50).replace(/\n/g, ' ').trim()

    const result = await executeSQL(stmt)

    if (result.ok || result.body.includes('already exists')) {
      console.log(`[${i + 1}/${statements.length}] OK: ${preview}...`)
      success++
    } else {
      console.log(`[${i + 1}/${statements.length}] FAIL: ${preview}...`)
      console.log(`   Error: ${result.body.substring(0, 100)}`)
      errors.push({ stmt: preview, error: result.body })
      failed++
    }
  }

  console.log(`\n========================================`)
  console.log(`Migration complete: ${success} succeeded, ${failed} failed`)

  if (errors.length > 0) {
    console.log(`\nFailed statements:`)
    errors.slice(0, 5).forEach(e => console.log(`  - ${e.stmt}`))
  }
}

runMigration().catch(console.error)
