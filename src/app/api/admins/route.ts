import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { getRequestLogContext, insertLog } from '@/lib/db-log'
import { getAuthSession } from '@/lib/auth-server'
import { assertText, assertUsername, jsonError, PublicInputError, serverError } from '@/lib/security'
import { isRequestIpBlocked } from '@/lib/ip-block'

export const preferredRegion = 'sin1'

type AdminRow = {
  username: string
  password_hash: string
}

export async function GET(req: Request) {
  try {
    // Security check - admins list GET must be protected
    if (!getDbPool()) {
      return jsonError('Database belum dikonfigurasi.', 503)
    }

    if (await isRequestIpBlocked(req)) {
      return jsonError('Akses dari IP ini diblokir.', 403)
    }

    if (!getAuthSession(req)) {
      return jsonError('Unauthorized: Sesi tidak sah.', 401)
    }

    const { rows } = await query('SELECT username, password_hash FROM admins')
    
    // Map password_hash back to passwordHash to match type AdminAccount in frontend
    const formatted = (rows as AdminRow[]).map((a) => ({
      username: a.username,
      passwordHash: a.password_hash,
    }))
    
    return NextResponse.json(formatted)
  } catch (err) {
    return serverError('API admins GET error:', err)
  }
}

export async function POST(req: Request) {
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

    const adminUser = req.headers.get('x-admin-user')
    const logContext = getRequestLogContext(req)
    const body = await req.json()
    const { username, passwordHash } = body

    const safeUsername = assertUsername(username)
    const safePassword = assertText(passwordHash, 'Password', 200)

    // Check if admin exists to log either "Tambah" or "Ubah Password"
    const checkExist = await query('SELECT 1 FROM admins WHERE username = $1', [safeUsername])
    const isNew = checkExist.rowCount === 0

    await query(
      `INSERT INTO admins (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET
         password_hash = EXCLUDED.password_hash`,
      [safeUsername, safePassword]
    )

    // Log the action
    const actionText = isNew 
      ? `Mendaftarkan akun admin baru: ${safeUsername}`
      : `Mengubah password akun admin: ${safeUsername}`
    await insertLog(adminUser, actionText, logContext)

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError) {
      return jsonError(err.message, 400)
    }
    return serverError('API admins POST error:', err)
  }
}

export async function DELETE(req: Request) {
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

    const adminUser = req.headers.get('x-admin-user')
    const logContext = getRequestLogContext(req)
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')

    const safeUsername = assertUsername(username)

    await query('DELETE FROM admins WHERE username = $1', [safeUsername])

    // Log the action
    await insertLog(adminUser, `Menghapus akun admin: ${safeUsername}`, logContext)

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError) {
      return jsonError(err.message, 400)
    }
    return serverError('API admins DELETE error:', err)
  }
}
