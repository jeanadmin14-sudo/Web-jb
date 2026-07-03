import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { generateSessionToken } from '@/lib/auth-server'
import { assertText, assertUsername, jsonError, PublicInputError, serverError } from '@/lib/security'
import { getRequestLogContext, insertLog } from '@/lib/db-log'
import { autoBlockAfterFailedLogin, isRequestIpBlocked } from '@/lib/ip-block'

const DEFAULT_ADMINS = [
  { username: 'admin', passwordHash: 'admin123' },
]

export const preferredRegion = 'sin1'

export async function POST(req: Request) {
  try {
    if (await isRequestIpBlocked(req)) {
      return jsonError('Akses dari IP ini diblokir.', 403)
    }

    const { username, password } = await req.json()

    const safeUsername = assertUsername(username)
    const safePassword = assertText(password, 'Password', 200)

    const pool = getDbPool()
    let isValid = false

    if (pool) {
      // Connect to Neon PostgreSQL
      const { rows } = await query('SELECT username, password_hash FROM admins WHERE username = $1', [safeUsername])
      const admin = rows[0]
      if (admin && admin.password_hash === safePassword) {
        isValid = true
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        return jsonError('Database belum dikonfigurasi.', 503)
      }

      // Fallback local mock mode
      const admin = DEFAULT_ADMINS.find(
        (a) => a.username === safeUsername && a.passwordHash === safePassword
      )
      if (admin) {
        isValid = true
      }
    }

    if (isValid) {
      const token = generateSessionToken(safeUsername)
      await insertLog(safeUsername, 'Login admin berhasil', getRequestLogContext(req))
      return NextResponse.json({ success: true, username: safeUsername, token })
    } else {
      await insertLog(safeUsername, 'Percobaan login gagal', {
        ...getRequestLogContext(req),
        riskLevel: 'High',
        riskFlags: ['Login gagal'],
      })
      await autoBlockAfterFailedLogin(req, safeUsername)
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 })
    }
  } catch (err) {
    if (err instanceof PublicInputError) {
      return jsonError(err.message, 400)
    }
    return serverError('API login POST error:', err)
  }
}
