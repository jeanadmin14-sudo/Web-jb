import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { generateSessionToken } from '@/lib/auth-server'

const DEFAULT_ADMINS = [
  { username: 'admin', passwordHash: 'admin123' },
]

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi.' }, { status: 400 })
    }

    const pool = getDbPool()
    let isValid = false

    if (pool) {
      // Connect to Neon PostgreSQL
      const { rows } = await query('SELECT username, password_hash FROM admins WHERE username = $1', [username.trim()])
      const admin = rows[0]
      if (admin && admin.password_hash === password) {
        isValid = true
      }
    } else {
      // Fallback local mock mode
      const admin = DEFAULT_ADMINS.find(
        (a) => a.username === username.trim() && a.passwordHash === password
      )
      if (admin) {
        isValid = true
      }
    }

    if (isValid) {
      const token = generateSessionToken(username.trim())
      return NextResponse.json({ success: true, username: username.trim(), token })
    } else {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 })
    }
  } catch (err: any) {
    console.error('API login POST error:', err)
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
