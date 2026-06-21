import { Pool } from 'pg'

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
}

function normalizePostgresConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString)
    const sslMode = url.searchParams.get('sslmode')

    if (sslMode === 'require' || sslMode === 'prefer' || sslMode === 'verify-ca') {
      url.searchParams.set('sslmode', 'verify-full')
      return url.toString()
    }
  } catch {
    return connectionString
  }

  return connectionString
}

export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  const normalizedConnectionString = normalizePostgresConnectionString(connectionString)

  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({
      connectionString: normalizedConnectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Neon PostgreSQL SSL connections
      },
    })
  }
  return globalForDb.pool
}

export async function query(text: string, params?: unknown[]) {
  const pool = getDbPool()
  if (!pool) {
    throw new Error('Database connection is not configured. Please set the DATABASE_URL environment variable.')
  }
  return pool.query(text, params)
}
