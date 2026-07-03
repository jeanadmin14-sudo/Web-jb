import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/db-init'
import { jsonError, serverError } from '@/lib/security'

export async function POST(req: Request) {
  try {
    const setupSecret = process.env.SETUP_SECRET

    if (process.env.NODE_ENV === 'production' && !setupSecret) {
      return jsonError('Setup endpoint dinonaktifkan.', 403)
    }

    if (setupSecret && req.headers.get('x-setup-secret') !== setupSecret) {
      return jsonError('Unauthorized.', 401)
    }

    const result = await initializeDatabase()
    if (result.success) {
      return NextResponse.json({ message: 'Database initialized successfully' })
    }

    return jsonError('Database initialization failed.', 500)
  } catch (err) {
    return serverError('API setup POST error:', err)
  }
}

export async function GET() {
  return jsonError('Gunakan POST dengan otorisasi setup.', 405)
}
