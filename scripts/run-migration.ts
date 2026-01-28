/**
 * Run Database Migration Script
 * Executes the SQL migration against Supabase
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  // Split into individual statements (simple split, handles most cases)
  // We need to be careful with function definitions that contain semicolons
  const statements: string[] = []
  let current = ''
  let inFunction = false

  for (const line of sql.split('\n')) {
    const trimmed = line.trim()

    // Track if we're inside a function definition
    if (trimmed.includes('$$')) {
      inFunction = !inFunction
    }

    current += line + '\n'

    // End of statement (not inside function)
    if (trimmed.endsWith(';') && !inFunction) {
      const stmt = current.trim()
      if (stmt && !stmt.startsWith('--')) {
        statements.push(stmt)
      }
      current = ''
    }
  }

  console.log(`Found ${statements.length} SQL statements to execute`)
  console.log('Running migration...\n')

  let success = 0
  let failed = 0

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ')

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: stmt })

      if (error) {
        // Try direct query for DDL statements
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
          },
          body: JSON.stringify({ sql: stmt })
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
      }

      console.log(`[${i + 1}/${statements.length}] OK: ${preview}...`)
      success++
    } catch (err: any) {
      console.log(`[${i + 1}/${statements.length}] SKIP: ${preview}... (${err.message || 'may already exist'})`)
      failed++
    }
  }

  console.log(`\nMigration complete: ${success} succeeded, ${failed} skipped/failed`)
}

runMigration().catch(console.error)
