import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { initializeDatabase } from '@/lib/db-init'
import { insertLog } from '@/lib/db-log'

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
    const { rows } = await query('SELECT * FROM products ORDER BY created_at DESC')
    
    // Postgres returns numeric types as strings, parse them to match frontend expectations
    const formatted = rows.map((p: any) => ({
      ...p,
      price: Number(p.price),
    }))
    
    return NextResponse.json(formatted)
  } catch (err: any) {
    console.error('API products GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await ensureDb()
    const adminUser = req.headers.get('x-admin-user')
    const body = await req.json()
    const { id, name, description, price, category, status, image_url, created_at, rent_end_date } = body

    // Check if product exists to determine if we are adding or editing
    const checkExist = await query('SELECT 1 FROM products WHERE id = $1', [id])
    const isNew = checkExist.rowCount === 0

    await query(
      `INSERT INTO products (id, name, description, price, category, status, image_url, created_at, rent_end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         price = EXCLUDED.price,
         category = EXCLUDED.category,
         status = EXCLUDED.status,
         image_url = EXCLUDED.image_url,
         created_at = EXCLUDED.created_at,
         rent_end_date = EXCLUDED.rent_end_date`,
      [id, name, description, Number(price), category, status, image_url, created_at, rent_end_date || null]
    )

    // Log the action
    const actionText = `${isNew ? 'Menambahkan' : 'Mengubah'} produk: ${name} (Kategori: ${category}, Status: ${status})`
    await insertLog(adminUser, actionText)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('API products POST error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDb()
    const adminUser = req.headers.get('x-admin-user')
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 })
    }

    // Get name before deletion for log
    const checkProduct = await query('SELECT name FROM products WHERE id = $1', [id])
    const name = checkProduct.rows[0]?.name || id

    await query('DELETE FROM products WHERE id = $1', [id])

    // Log the action
    await insertLog(adminUser, `Menghapus produk: ${name}`)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('API products DELETE error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
