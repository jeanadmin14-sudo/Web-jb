import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { initializeDatabase } from '@/lib/db-init'

// Helper to ensure database is initialized on demand
let isDbInitialized = false
async function ensureDb() {
  if (!isDbInitialized) {
    await initializeDatabase()
    isDbInitialized = true
  }
}

export async function GET() {
  try {
    await ensureDb()
    const { rows } = await query('SELECT * FROM activity_logs ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (err: any) {
    console.error('API logs GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
