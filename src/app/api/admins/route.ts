import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { initializeDatabase } from '@/lib/db-init'
import { insertLog } from '@/lib/db-log'
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

    // Security check - admins list GET must be protected
    if (getDbPool() && !getAuthSession(req)) {
      return NextResponse.json({ error: 'Unauthorized: Sesi tidak sah.' }, { status: 401 })
    }

    const { rows } = await query('SELECT username, password_hash FROM admins')
    
    // Map password_hash back to passwordHash to match type AdminAccount in frontend
    const formatted = rows.map((a: any) => ({
      username: a.username,
      passwordHash: a.password_hash,
    }))
    
    return NextResponse.json(formatted)
  } catch (err: any) {
    console.error('API admins GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await ensureDb()

    // Security check
    if (getDbPool() && !getAuthSession(req)) {
      return NextResponse.json({ error: 'Unauthorized: Sesi tidak sah.' }, { status: 401 })
    }

    const adminUser = req.headers.get('x-admin-user')
    const body = await req.json()
    const { username, passwordHash } = body

    if (!username || !passwordHash) {
      return NextResponse.json({ error: 'Username and passwordHash are required' }, { status: 400 })
    }

    // Check if admin exists to log either "Tambah" or "Ubah Password"
    const checkExist = await query('SELECT 1 FROM admins WHERE username = $1', [username.trim()])
    const isNew = checkExist.rowCount === 0

    await query(
      `INSERT INTO admins (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET
         password_hash = EXCLUDED.password_hash`,
      [username.trim(), passwordHash]
    )

    // Log the action
    const actionText = isNew 
      ? `Mendaftarkan akun admin baru: ${username.trim()}`
      : `Mengubah password akun admin: ${username.trim()}`
    await insertLog(adminUser, actionText)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('API admins POST error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDb()

    // Security check
    if (getDbPool() && !getAuthSession(req)) {
      return NextResponse.json({ error: 'Unauthorized: Sesi tidak sah.' }, { status: 401 })
    }

    const adminUser = req.headers.get('x-admin-user')
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Missing username parameter' }, { status: 400 })
    }

    await query('DELETE FROM admins WHERE username = $1', [username])

    // Log the action
    await insertLog(adminUser, `Menghapus akun admin: ${username}`)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('API admins DELETE error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
