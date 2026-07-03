import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { getAuthSession } from '@/lib/auth-server'
import { jsonError, serverError } from '@/lib/security'
import { isRequestIpBlocked } from '@/lib/ip-block'

export const preferredRegion = 'sin1'

export async function GET(req: Request) {
  try {
    // Security check
    if (!getDbPool()) {
      return jsonError('Database belum dikonfigurasi.', 503)
    }

    if (await isRequestIpBlocked(req)) {
      return jsonError('Akses dari IP ini diblokir.', 403)
    }

    if (!getAuthSession(req)) {
      return jsonError('Unauthorized: Sesi tidak sah.', 401)
    }

    const { rows } = await query('SELECT * FROM activity_logs ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (err) {
    return serverError('API logs GET error:', err)
  }
}
