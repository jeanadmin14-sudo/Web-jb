import { Pool } from 'pg'

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
}

export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Neon PostgreSQL SSL connections
      },
    })
  }
  return globalForDb.pool
}

export async function query(text: string, params?: any[]) {
  const pool = getDbPool()
  if (!pool) {
    throw new Error('Database connection is not configured. Please set the DATABASE_URL environment variable.')
  }
  return pool.query(text, params)
}
