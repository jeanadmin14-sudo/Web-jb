import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { getRequestLogContext, insertLog } from '@/lib/db-log'
import { getAuthSession } from '@/lib/auth-server'
import { revalidateTag } from 'next/cache'
import {
  assertNumber,
  assertSafeId,
  assertText,
  jsonError,
  optionalDate,
  optionalSafeUrl,
  PublicInputError,
  serverError,
} from '@/lib/security'
import { isRequestIpBlocked } from '@/lib/ip-block'

export const preferredRegion = 'sin1'

type ProductRow = {
  price: string | number
  [key: string]: unknown
}

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY created_at DESC')
    
    // Postgres returns numeric types as strings, parse them to match frontend expectations
    const formatted = (rows as ProductRow[]).map((p) => ({
      ...p,
      price: Number(p.price),
    }))
    
    return NextResponse.json(formatted, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    return serverError('API products GET error:', err)
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
    const { id, name, description, price, category, status, image_url, created_at, rent_end_date, gallery, rental_packages } = body
    const safeProduct = {
      id: assertSafeId(id),
      name: assertText(name, 'Nama produk', 120),
      description: assertText(description, 'Deskripsi', 2000, false),
      price: assertNumber(price, 'Harga'),
      category: assertText(category, 'Kategori', 40),
      status: assertText(status, 'Status', 40),
      image_url: optionalSafeUrl(image_url, 'URL gambar') || '/Logo.jpeg',
      created_at: typeof created_at === 'string' && created_at ? created_at : new Date().toISOString(),
      rent_end_date: optionalDate(rent_end_date),
      gallery: assertText(gallery, 'Galeri', 100000, false) || null,
      rental_packages: assertText(rental_packages, 'Paket rental', 20000, false) || null,
    }

    // Check if product exists to determine if we are adding or editing
    const checkExist = await query('SELECT 1 FROM products WHERE id = $1', [safeProduct.id])
    const isNew = checkExist.rowCount === 0

    await query(
      `INSERT INTO products (id, name, description, price, category, status, image_url, created_at, rent_end_date, gallery, rental_packages)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         price = EXCLUDED.price,
         category = EXCLUDED.category,
         status = EXCLUDED.status,
         image_url = EXCLUDED.image_url,
         created_at = EXCLUDED.created_at,
         rent_end_date = EXCLUDED.rent_end_date,
         gallery = EXCLUDED.gallery,
         rental_packages = EXCLUDED.rental_packages`,
      [
        safeProduct.id,
        safeProduct.name,
        safeProduct.description,
        safeProduct.price,
        safeProduct.category,
        safeProduct.status,
        safeProduct.image_url,
        safeProduct.created_at,
        safeProduct.rent_end_date,
        safeProduct.gallery,
        safeProduct.rental_packages,
      ]
    )

    // Log the action
    const actionText = `${isNew ? 'Menambahkan' : 'Mengubah'} produk: ${safeProduct.name} (Kategori: ${safeProduct.category}, Status: ${safeProduct.status})`
    await insertLog(adminUser, actionText, logContext)
    revalidateTag('products', 'max')

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError) {
      return jsonError(err.message, 400)
    }
    return serverError('API products POST error:', err)
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
    const id = searchParams.get('id')

    const safeId = assertSafeId(id)

    // Get name before deletion for log
    const checkProduct = await query('SELECT name FROM products WHERE id = $1', [safeId])
    const name = checkProduct.rows[0]?.name || safeId

    await query('DELETE FROM products WHERE id = $1', [safeId])

    // Log the action
    await insertLog(adminUser, `Menghapus produk: ${name}`, logContext)
    revalidateTag('products', 'max')

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError) {
      return jsonError(err.message, 400)
    }
    return serverError('API products DELETE error:', err)
  }
}
