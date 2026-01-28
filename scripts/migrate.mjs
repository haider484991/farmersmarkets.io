/**
 * Run Migration with pg client
 */
import pg from 'pg'
import fs from 'fs'
import 'dotenv/config'

const { Client } = pg

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set.')
  console.error('Please ensure DATABASE_URL is set in .env.local')
  process.exit(1)
}

async function runMigration() {
  console.log('Connecting to database...')

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('Connected!\n')

    // Read migration file
    const sql = fs.readFileSync('./supabase/migrations/001_initial_schema.sql', 'utf8')

    console.log('Running migration...')
    console.log('SQL length:', sql.length, 'characters\n')

    // Execute the entire migration
    await client.query(sql)

    console.log('Migration completed successfully!')

    // Verify tables were created
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('\nCreated tables:')
    result.rows.forEach(row => console.log('  -', row.table_name))

  } catch (err) {
    console.error('Migration error:', err.message)

    // If there's an error, it might be because some objects already exist
    // Let's try to check what exists
    try {
      const result = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)

      if (result.rows.length > 0) {
        console.log('\nExisting tables found:')
        result.rows.forEach(row => console.log('  -', row.table_name))
      }
    } catch (e) {
      // ignore
    }
  } finally {
    await client.end()
  }
}

runMigration()
