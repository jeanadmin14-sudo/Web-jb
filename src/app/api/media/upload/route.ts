import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth-server'
import { getRequestLogContext, insertLog } from '@/lib/db-log'
import { isRequestIpBlocked } from '@/lib/ip-block'
import { jsonError, serverError } from '@/lib/security'

const IMAGE_BUCKET = 'jbjean-images'
const ALLOWED_FOLDERS = new Set(['products', 'partners', 'gallery'])
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

export const preferredRegion = 'sin1'

function makeStoragePath(fileName: string, folder: string): string {
  const safeName = fileName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image'

  return `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}.webp`
}

function createStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase Storage belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function POST(req: Request) {
  try {
    if (await isRequestIpBlocked(req)) {
      return jsonError('Akses dari IP ini diblokir.', 403)
    }

    if (!getAuthSession(req)) {
      return jsonError('Unauthorized: Sesi tidak sah.', 401)
    }

    const formData = await req.formData()
    const file = formData.get('file')
    const folder = String(formData.get('folder') || '')

    if (!(file instanceof File)) {
      return jsonError('File gambar wajib diunggah.', 400)
    }
    if (!ALLOWED_FOLDERS.has(folder)) {
      return jsonError('Folder upload tidak valid.', 400)
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return jsonError('Ukuran gambar maksimal 4 MB setelah kompres.', 400)
    }

    const arrayBuffer = await file.arrayBuffer()
    const path = makeStoragePath(file.name, folder)
    const supabase = createStorageClient()
    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, Buffer.from(arrayBuffer), {
        cacheControl: '31536000',
        contentType: 'image/webp',
        upsert: false,
      })

    if (error) {
      return jsonError(`Gagal upload ke Supabase Storage: ${error.message}`, 500)
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
    await insertLog(req.headers.get('x-admin-user'), `Upload gambar ke Supabase Storage: ${path}`, getRequestLogContext(req))

    return NextResponse.json({ url: data.publicUrl, path })
  } catch (err) {
    return serverError('API media upload POST error:', err)
  }
}

