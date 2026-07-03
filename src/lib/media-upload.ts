type UploadOptions = {
  folder: 'products' | 'partners' | 'gallery'
  maxSize?: number
  quality?: number
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function compressImageFile(file: File, maxSize = 1400, quality = 0.8): Promise<Blob> {
  const source = await fileToDataUrl(file)
  const img = await loadImageElement(source)
  const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight))
  const width = Math.max(1, Math.round(img.naturalWidth * scale))
  const height = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.drawImage(img, 0, 0, width, height)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob || file), 'image/webp', quality)
  })
}

export async function uploadImageFile(file: File, options: UploadOptions): Promise<string> {
  const compressed = await compressImageFile(file, options.maxSize, options.quality)
  const formData = new FormData()
  formData.set('file', compressed, `${file.name.replace(/\.[^.]+$/, '') || 'image'}.webp`)
  formData.set('folder', options.folder)

  const token = localStorage.getItem('jbjean_session_token') || ''
  const user = localStorage.getItem('jbjean_session') || ''
  const res = await fetch('/api/media/upload', {
    method: 'POST',
    headers: {
      'x-admin-user': user,
      'x-admin-token': token,
    },
    body: formData,
  })

  const data = await res.json().catch(() => null) as { url?: string; error?: string } | null
  if (!res.ok || !data?.url) {
    throw new Error(data?.error || 'Gagal upload gambar ke Supabase Storage.')
  }

  return data.url
}
