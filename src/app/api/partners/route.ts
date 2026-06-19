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

export async function GET() {
  try {
    await ensureDb()
    const { rows } = await query('SELECT * FROM partners ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (err: any) {
    console.error('API partners GET error:', err)
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
    const { id, name, description, wa_channel_url, whatsapp_number, image_url, status, created_at } = body

    // Check if partner exists to determine if we are adding or editing
    const checkExist = await query('SELECT 1 FROM partners WHERE id = $1', [id])
    const isNew = checkExist.rowCount === 0

    await query(
      `INSERT INTO partners (id, name, description, wa_channel_url, whatsapp_number, image_url, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         wa_channel_url = EXCLUDED.wa_channel_url,
         whatsapp_number = EXCLUDED.whatsapp_number,
         image_url = EXCLUDED.image_url,
         status = EXCLUDED.status,
         created_at = EXCLUDED.created_at`,
      [id, name, description, wa_channel_url, whatsapp_number, image_url, status || 'Online', created_at]
    )

    // Log the action
    const actionText = `${isNew ? 'Menambahkan' : 'Mengubah'} partner: ${name} (Status: ${status})`
    await insertLog(adminUser, actionText)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('API partners POST error:', err)
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 })
    }

    // Get name before deletion for log
    const checkPartner = await query('SELECT name FROM partners WHERE id = $1', [id])
    const name = checkPartner.rows[0]?.name || id

    await query('DELETE FROM partners WHERE id = $1', [id])

    // Log the action
    await insertLog(adminUser, `Menghapus partner: ${name}`)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('API partners DELETE error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
