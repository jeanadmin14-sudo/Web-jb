import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { getRequestLogContext, insertLog } from '@/lib/db-log'
import { getAuthSession } from '@/lib/auth-server'
import { assertText, jsonError, PublicInputError, serverError } from '@/lib/security'
import { isRequestIpBlocked } from '@/lib/ip-block'

export const preferredRegion = 'sin1'

const SETTING_KEYS = [
  'wa_stock_url',
  'wa_rental_url',
  'wa_partner_url',
  'instagram_url',
  'tiktok_url',
  'wa_channel_url',
] as const

type SettingRow = {
  key: string
  value: string
}

export async function GET() {
  try {
    if (!getDbPool()) {
      return jsonError('Database belum dikonfigurasi.', 503)
    }

    const { rows } = await query('SELECT key, value FROM settings')
    const map: Record<string, string> = {}
    for (const row of rows as SettingRow[]) {
      map[row.key] = row.value
    }

    return NextResponse.json(map, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    return serverError('API settings GET error:', err)
  }
}

export async function POST(req: Request) {
  try {
    if (!getDbPool()) {
      return jsonError('Database belum dikonfigurasi.', 503)
    }

    if (await isRequestIpBlocked(req)) {
      return jsonError('Akses dari IP ini diblokir.', 403)
    }

    if (!getAuthSession(req)) {
      return jsonError('Unauthorized: Sesi tidak sah.', 401)
    }

    const adminUser = req.headers.get('x-admin-user')
    const logContext = getRequestLogContext(req)
    const body = await req.json()

    for (const key of SETTING_KEYS) {
      if (body[key] === undefined) continue
      const safeValue = assertText(body[key], key, 500, false)
      await query(
        `INSERT INTO settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, safeValue]
      )
    }

    await insertLog(adminUser, 'Mengubah pengaturan kontak & sosmed', logContext)

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError) {
      return jsonError(err.message, 400)
    }
    return serverError('API settings POST error:', err)
  }
}
