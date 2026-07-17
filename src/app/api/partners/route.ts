import { NextResponse } from 'next/server'
import { query, getDbPool } from '@/lib/db'
import { getRequestLogContext, insertLog } from '@/lib/db-log'
import { getAuthSession } from '@/lib/auth-server'
import { revalidateTag } from 'next/cache'
import {
  assertSafeId,
  assertText,
  jsonError,
  optionalImageSource,
  optionalPhone,
  optionalSafeUrl,
  PublicInputError,
  serverError,
} from '@/lib/security'
import { isRequestIpBlocked } from '@/lib/ip-block'

export const preferredRegion = 'sin1'

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM partners ORDER BY created_at ASC')
    return NextResponse.json(rows, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return serverError('API partners GET error:', err)
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
    const { id, name, description, wa_channel_url, whatsapp_number, image_url, status, category, created_at } = body
    const safePartner = {
      id: assertSafeId(id),
      name: assertText(name, 'Nama partner', 120),
      description: assertText(description, 'Deskripsi', 2000, false),
      wa_channel_url: optionalSafeUrl(wa_channel_url, 'URL channel WhatsApp', ['whatsapp.com']) || null,
      whatsapp_number: optionalPhone(whatsapp_number),
      image_url: optionalImageSource(image_url, 'URL gambar') || '/Logo.jpeg',
      status: assertText(status || 'Online', 'Status', 40),
      category: assertText(category || 'Partner Resmi', 'Kategori', 40),
      created_at: typeof created_at === 'string' && created_at ? created_at : new Date().toISOString(),
    }

    // Check if partner exists to determine if we are adding or editing
    const checkExist = await query('SELECT 1 FROM partners WHERE id = $1', [safePartner.id])
    const isNew = checkExist.rowCount === 0

    await query(
      `INSERT INTO partners (id, name, description, wa_channel_url, whatsapp_number, image_url, status, category, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         wa_channel_url = EXCLUDED.wa_channel_url,
         whatsapp_number = EXCLUDED.whatsapp_number,
         image_url = EXCLUDED.image_url,
         status = EXCLUDED.status,
         category = EXCLUDED.category,
         created_at = EXCLUDED.created_at`,
      [
        safePartner.id,
        safePartner.name,
        safePartner.description,
        safePartner.wa_channel_url,
        safePartner.whatsapp_number,
        safePartner.image_url,
        safePartner.status,
        safePartner.category,
        safePartner.created_at,
      ]
    )

    // Log the action
    const actionText = `${isNew ? 'Menambahkan' : 'Mengubah'} partner: ${safePartner.name} (Status: ${safePartner.status})`
    await insertLog(adminUser, actionText, logContext)
    revalidateTag('partners', 'max')

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError) {
      return jsonError(err.message, 400)
    }
    return serverError('API partners POST error:', err)
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
    const checkPartner = await query('SELECT name FROM partners WHERE id = $1', [safeId])
    const name = checkPartner.rows[0]?.name || safeId

    await query('DELETE FROM partners WHERE id = $1', [safeId])

    // Log the action
    await insertLog(adminUser, `Menghapus partner: ${name}`, logContext)
    revalidateTag('partners', 'max')

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError) {
      return jsonError(err.message, 400)
    }
    return serverError('API partners DELETE error:', err)
  }
}
