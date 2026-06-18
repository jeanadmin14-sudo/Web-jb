import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/db-init'

export async function GET() {
  const result = await initializeDatabase()
  if (result.success) {
    return NextResponse.json({ message: 'Database initialized successfully' })
  } else {
    return NextResponse.json({ message: 'Database initialization failed', error: result.reason }, { status: 500 })
  }
}
