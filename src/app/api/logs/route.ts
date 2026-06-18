import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { initializeDatabase } from '@/lib/db-init'
import { getAuthSession } from '@/lib/auth-server'

// Helper to ensure database is initialized on demand
let isDbInitialized = false
async function ensureDb() {
  if (!isDbInitialized) {
    await initializeDatabase()
    isDbInitialized = true
  }
}

export async function GET(req: Request) {
  try {
    await ensureDb()

    // Security check
    if (getDbPool() && !getAuthSession(req)) {
      return NextResponse.json({ error: 'Unauthorized: Sesi tidak sah.' }, { status: 401 })
    }

    const { rows } = await query('SELECT * FROM activity_logs ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (err: any) {
    console.error('API logs GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
