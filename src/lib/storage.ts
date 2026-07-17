import { createSupabaseClient } from './supabase'
import type { Product, Partner } from './supabase'

export type AdminAccount = {
  username: string
  passwordHash: string // Simple string comparison for demo/local storage persistence
}

export type ActivityLog = {
  id: string | number
  admin_user: string
  action: string
  ip_address?: string | null
  user_agent?: string | null
  device?: string | null
  location?: string | null
  origin?: string | null
  referer?: string | null
  risk_level?: 'Low' | 'Medium' | 'High' | string | null
  risk_flags?: string | null
  created_at: string
}

export type BlockedIp = {
  id: number
  ip_address: string
  reason: string | null
  blocked_by: string | null
  created_at: string
}

export type SiteSettings = {
  wa_stock_url: string
  wa_rental_url: string
  wa_partner_url: string
  instagram_url: string
  tiktok_url: string
  wa_channel_url: string
}

export const DEFAULT_SETTINGS: SiteSettings = {
  wa_stock_url: 'https://wa.me/6287832017296',
  wa_rental_url: 'https://wa.me/6287832017296',
  wa_partner_url: 'https://wa.me/6287720826802',
  instagram_url: 'https://www.instagram.com/jean_cruel23?igsh=MW5iYXk4amFzNThsdw==',
  tiktok_url: 'https://www.tiktok.com/@jeancruell23?_r=1&_t=ZS-978iPy4vI6S',
  wa_channel_url: 'https://whatsapp.com/channel/0029VbBqyVG0AgWAXwVIu73m',
}

const DEFAULT_RENTAL_GALLERY = JSON.stringify(['/Logo.jpeg', '/Logo.jpeg', '/Logo.jpeg', '/Logo.jpeg', '/Logo.jpeg', '/Logo.jpeg'])
const DEFAULT_RENTAL_PACKAGES = JSON.stringify([
  { name: '6 Jam', price: 80000 },
  { name: '12 Jam', price: 140000 },
  { name: '24 Jam', price: 220000 },
  { name: 'Permanen', price: 8000000 },
])

function makeDefaultRentalGallery(imageUrl: string | null): string {
  const image = imageUrl || '/Logo.jpeg'
  return JSON.stringify([image, image, image, image, image, image])
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'Akun Free Fire Old Season 1',
    description: 'Set Sakura, Hip Hop, bundle langka lengkap, vault melimpah.',
    price: 1500000,
    category: 'Free Fire',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-12T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm2',
    name: 'Akun Mobile Legends Mythical Glory',
    description: 'Skins Collector Granger, Lightborn, KOF Gusion & Chou, winrate 72%.',
    price: 2200000,
    category: 'Mobile Legends',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-11T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm3',
    name: 'Rental Akun FF Max Skin Full',
    description: 'Rental harian akun Free Fire full skin senjata Evo max level.',
    price: 35000,
    category: 'Rental',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    gallery: DEFAULT_RENTAL_GALLERY,
    rental_packages: DEFAULT_RENTAL_PACKAGES,
    created_at: '2026-06-10T00:00:00Z',
    rent_end_date: '2026-06-25',
  },
  {
    id: 'm4',
    name: 'Jasa Post Paid Promote Instagram',
    description: 'Paid promote ke 50k followers gaming target Indonesia.',
    price: 50000,
    category: 'JasaPost',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-09T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm5',
    name: 'Akun Free Fire Cobra Max + Evo Gun',
    description: 'Bundle Cobra, Evo Gun level 7, AK Dragon level 6, akun aman.',
    price: 850000,
    category: 'Free Fire',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-08T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm6',
    name: 'Akun Mobile Legends Legend Skin Alucard',
    description: 'Skin Obsidian Blade Alucard, 120 skin, all hero unlocked.',
    price: 1100000,
    category: 'Mobile Legends',
    status: 'Sold Out',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-07T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm7',
    name: 'Rental Akun MLBB Granger Starfall Knight',
    description: 'Rental 24 jam akun skin Legend Granger, full emblem max.',
    price: 45000,
    category: 'Rental',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    gallery: DEFAULT_RENTAL_GALLERY,
    rental_packages: DEFAULT_RENTAL_PACKAGES,
    created_at: '2026-06-06T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm8',
    name: 'Paid Promote Story WhatsApp',
    description: 'Promosi produk game ke story WA views 2k+ aktif harian.',
    price: 25000,
    category: 'JasaPost',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-05T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm9',
    name: 'Akun FF Letda Hyper Clone',
    description: 'Bundle Letda Hyper, M1887 Rapper Underworld, MP40 Cobra.',
    price: 1200000,
    category: 'Free Fire',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-04T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm10',
    name: 'Akun Mobile Legends KOF Chou + Iori',
    description: 'Skin KOF Chou, Skin Hero Bruno, Skin Collector Wanwan.',
    price: 3500000,
    category: 'Mobile Legends',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-03T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm11',
    name: 'Rental Akun Steam Black Myth Wukong',
    description: 'Rental akun Steam offline mode game Black Myth Wukong harian.',
    price: 20000,
    category: 'Rental',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    gallery: DEFAULT_RENTAL_GALLERY,
    rental_packages: DEFAULT_RENTAL_PACKAGES,
    created_at: '2026-06-02T00:00:00Z',
    rent_end_date: null,
  },
  {
    id: 'm12',
    name: 'Jasa Post Feeds Partner Resmi',
    description: 'Post feeds partner resmi JBJean di Instagram & TikTok.',
    price: 150000,
    category: 'JasaPost',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-01T00:00:00Z',
    rent_end_date: null,
  },
]

const DEFAULT_ADMINS: AdminAccount[] = [
  { username: 'admin', passwordHash: 'admin123' },
]

const DEFAULT_PARTNER_WHATSAPP = '6287832017296'

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Jean Store Official',
    description: 'Partner resmi top-up, rekber, dan rental aman bergaransi.',
    wa_channel_url: 'https://whatsapp.com/channel/0029VbBqyVG0AgWAXwVIu73m',
    whatsapp_number: DEFAULT_PARTNER_WHATSAPP,
    image_url: '/Logo.jpeg',
    status: 'Ready',
    created_at: '2026-06-12T00:00:00Z',
  }
]

// Local storage keys
const KEY_PRODUCTS = 'jbjean_products'
const KEY_PARTNERS = 'jbjean_partners'
const KEY_ADMINS = 'jbjean_admins'
const KEY_LOGS = 'jbjean_logs'

function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal
  const item = localStorage.getItem(key)
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultVal))
    return defaultVal
  }
  try {
    return JSON.parse(item) as T
  } catch {
    return defaultVal
  }
}

function setLocal<T>(key: string, val: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(val))
}

async function fetchFromApi<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (typeof window === 'undefined') return null

  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 6000)
    const res = await fetch(path, {
      ...init,
      signal: controller.signal,
    })
    window.clearTimeout(timeout)
    if (!res.ok) return null
    return await res.json() as T
  } catch {
    return null
  }
}

async function writeToApi(path: string, init: RequestInit): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 6000)
    const res = await fetch(path, {
      ...init,
      signal: controller.signal,
    })
    window.clearTimeout(timeout)
    if (res.ok) {
      return true
    }
    if (res.status === 401 || res.status === 403) {
      const data = await res.json().catch(() => null) as { error?: string } | null
      throw new Error(data?.error || 'Sesi admin tidak sah. Silakan login ulang.')
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Sesi admin')) {
      throw error
    }
  }
  return false
}

function getSessionUser(): string {
  if (typeof window === 'undefined') return 'System'
  return localStorage.getItem('jbjean_session') || 'System'
}

function normalizePartner(partner: Partner): Partner {
  return {
    ...partner,
    whatsapp_number: partner.whatsapp_number || DEFAULT_PARTNER_WHATSAPP,
  }
}

function normalizeProduct(product: Product): Product {
  if (product.category !== 'Rental') return product
  return {
    ...product,
    gallery: product.gallery || makeDefaultRentalGallery(product.image_url),
    rental_packages: product.rental_packages || DEFAULT_RENTAL_PACKAGES,
  }
}

export async function getProducts(): Promise<Product[]> {
  const apiProducts = await fetchFromApi<Product[]>('/api/products')
  if (apiProducts) {
    return apiProducts.map(normalizeProduct)
  }

  const supabase = createSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    return ((data as Product[]) ?? []).map(normalizeProduct)
  }
  const localProducts = getLocal<Product[]>(KEY_PRODUCTS, DEFAULT_PRODUCTS)
  const normalized = localProducts.map(normalizeProduct)
  if (JSON.stringify(localProducts) !== JSON.stringify(normalized)) {
    setLocal(KEY_PRODUCTS, normalized)
  }
  return normalized
}

function getSessionTokenHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('jbjean_session_token') || ''
  const user = localStorage.getItem('jbjean_session') || ''
  return {
    'x-admin-user': user,
    'x-admin-token': token
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const isNew = !product.created_at || getLocal<Product[]>(KEY_PRODUCTS, DEFAULT_PRODUCTS).findIndex(p => p.id === product.id) === -1

  if (await writeToApi('/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getSessionTokenHeader()
      },
      body: JSON.stringify(product),
    })) return

  const supabase = createSupabaseClient()
  if (supabase) {
    await supabase.from('products').upsert(product)
    return
  }
  const list = getLocal<Product[]>(KEY_PRODUCTS, DEFAULT_PRODUCTS)
  const idx = list.findIndex(p => p.id === product.id)
  if (idx > -1) {
    list[idx] = product
  } else {
    list.unshift(product) // Add to front of mock list
  }
  setLocal(KEY_PRODUCTS, list)
  await saveActivityLog(`${isNew ? 'Menambahkan' : 'Mengubah'} produk (local): ${product.name}`)
}

export async function deleteProduct(id: string): Promise<void> {
  console.log("deleteProduct called with id:", id)
  if (await writeToApi(`/api/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getSessionTokenHeader()
    })) return

  const supabase = createSupabaseClient()
  if (supabase) {
    console.log("Supabase client found, deleting from Supabase...")
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error("Error deleting product from Supabase:", error)
      alert("Gagal menghapus produk dari database Supabase: " + error.message)
      throw error
    }
    return
  }
  console.log("No Supabase client, deleting from LocalStorage...")
  let list = getLocal<Product[]>(KEY_PRODUCTS, DEFAULT_PRODUCTS)
  const checkProd = list.find(p => p.id === id)
  const name = checkProd ? checkProd.name : id

  const initialLength = list.length
  list = list.filter(p => p.id !== id)
  console.log(`Filtered local list. Removed: ${initialLength - list.length} items. New length: ${list.length}`)
  setLocal(KEY_PRODUCTS, list)
  await saveActivityLog(`Menghapus produk (local): ${name}`)
}

export async function getPartners(): Promise<Partner[]> {
  const apiPartners = await fetchFromApi<Partner[]>('/api/partners')
  if (apiPartners) {
    return apiPartners.map(normalizePartner)
  }

  const supabase = createSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: true })
    return ((data as Partner[]) ?? []).map(normalizePartner)
  }
  const localPartners = getLocal<Partner[]>(KEY_PARTNERS, DEFAULT_PARTNERS)
  const normalized = localPartners.map(normalizePartner)
  if (JSON.stringify(localPartners) !== JSON.stringify(normalized)) {
    setLocal(KEY_PARTNERS, normalized)
  }
  return normalized
}

export async function savePartner(partner: Partner): Promise<void> {
  const isNew = !partner.created_at || getLocal<Partner[]>(KEY_PARTNERS, DEFAULT_PARTNERS).findIndex(p => p.id === partner.id) === -1

  if (await writeToApi('/api/partners', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getSessionTokenHeader()
      },
      body: JSON.stringify(partner),
    })) return

  const supabase = createSupabaseClient()
  if (supabase) {
    await supabase.from('partners').upsert(partner)
    return
  }
  const list = getLocal<Partner[]>(KEY_PARTNERS, DEFAULT_PARTNERS)
  const idx = list.findIndex(p => p.id === partner.id)
  if (idx > -1) {
    list[idx] = partner
  } else {
    list.unshift(partner)
  }
  setLocal(KEY_PARTNERS, list)
  await saveActivityLog(`${isNew ? 'Menambahkan' : 'Mengubah'} partner (local): ${partner.name}`)
}

export async function deletePartner(id: string): Promise<void> {
  console.log("deletePartner called with id:", id)
  if (await writeToApi(`/api/partners?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getSessionTokenHeader()
    })) return

  const supabase = createSupabaseClient()
  if (supabase) {
    console.log("Supabase client found, deleting partner from Supabase...")
    const { error } = await supabase.from('partners').delete().eq('id', id)
    if (error) {
      console.error("Error deleting partner from Supabase:", error)
      alert("Gagal menghapus partner dari database Supabase: " + error.message)
      throw error
    }
    return
  }
  console.log("No Supabase client, deleting partner from LocalStorage...")
  let list = getLocal<Partner[]>(KEY_PARTNERS, DEFAULT_PARTNERS)
  const checkPart = list.find(p => p.id === id)
  const name = checkPart ? checkPart.name : id

  const initialLength = list.length
  list = list.filter(p => p.id !== id)
  console.log(`Filtered local partners. Removed: ${initialLength - list.length} items. New length: ${list.length}`)
  setLocal(KEY_PARTNERS, list)
  await saveActivityLog(`Menghapus partner (local): ${name}`)
}

export async function getAdmins(): Promise<AdminAccount[]> {
  const apiAdmins = await fetchFromApi<AdminAccount[]>('/api/admins', {
      headers: getSessionTokenHeader()
    })
  if (apiAdmins) return apiAdmins

  return getLocal<AdminAccount[]>(KEY_ADMINS, DEFAULT_ADMINS)
}

export async function saveAdmin(admin: AdminAccount): Promise<void> {
  const isNew = getLocal<AdminAccount[]>(KEY_ADMINS, DEFAULT_ADMINS).findIndex(a => a.username === admin.username) === -1

  if (await writeToApi('/api/admins', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getSessionTokenHeader()
      },
      body: JSON.stringify(admin),
    })) return

  const list = getLocal<AdminAccount[]>(KEY_ADMINS, DEFAULT_ADMINS)
  const idx = list.findIndex(a => a.username === admin.username)
  if (idx > -1) {
    list[idx] = admin
  } else {
    list.push(admin)
  }
  setLocal(KEY_ADMINS, list)
  await saveActivityLog(`${isNew ? 'Mendaftarkan' : 'Mengubah password'} akun admin (local): ${admin.username}`)
}

export async function deleteAdmin(username: string): Promise<void> {
  console.log("deleteAdmin called for username:", username)
  if (await writeToApi(`/api/admins?username=${encodeURIComponent(username)}`, {
      method: 'DELETE',
      headers: getSessionTokenHeader()
    })) return

  let list = getLocal<AdminAccount[]>(KEY_ADMINS, DEFAULT_ADMINS)
  const initialLength = list.length
  list = list.filter(a => a.username !== username)
  console.log(`Filtered local admins. Removed: ${initialLength - list.length} items. New length: ${list.length}`)
  setLocal(KEY_ADMINS, list)
  await saveActivityLog(`Menghapus akun admin (local): ${username}`)
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const apiLogs = await fetchFromApi<ActivityLog[]>('/api/logs', {
      headers: getSessionTokenHeader()
    })
  if (apiLogs) return apiLogs

  return getLocal<ActivityLog[]>(KEY_LOGS, [])
}

export async function getBlockedIps(): Promise<BlockedIp[]> {
  const apiBlockedIps = await fetchFromApi<BlockedIp[]>('/api/blocked-ips', {
      headers: getSessionTokenHeader()
    })
  return apiBlockedIps || []
}

export async function suspendIp(ipAddress: string, reason: string): Promise<boolean> {
  return writeToApi('/api/blocked-ips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getSessionTokenHeader()
    },
    body: JSON.stringify({ ipAddress, reason }),
  })
}

export async function unsuspendIp(ipAddress: string): Promise<boolean> {
  return writeToApi(`/api/blocked-ips?ip=${encodeURIComponent(ipAddress)}`, {
    method: 'DELETE',
    headers: getSessionTokenHeader()
  })
}

export async function getSettings(): Promise<SiteSettings> {
  const apiSettings = await fetchFromApi<Partial<SiteSettings>>('/api/settings')
  return { ...DEFAULT_SETTINGS, ...(apiSettings || {}) }
}

export async function saveSettings(settings: SiteSettings): Promise<boolean> {
  return writeToApi('/api/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getSessionTokenHeader()
    },
    body: JSON.stringify(settings),
  })
}

export async function saveActivityLog(action: string): Promise<void> {
  const actor = getSessionUser()
  const list = getLocal<ActivityLog[]>(KEY_LOGS, [])
  const newLog: ActivityLog = {
    id: 'log_' + Date.now(),
    admin_user: actor,
    action,
    ip_address: 'LocalStorage',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    device: typeof navigator !== 'undefined' ? navigator.platform : null,
    location: 'Mode lokal',
    origin: typeof window !== 'undefined' ? window.location.origin : null,
    referer: typeof document !== 'undefined' ? document.referrer : null,
    risk_level: 'Low',
    risk_flags: null,
    created_at: new Date().toISOString()
  }
  list.unshift(newLog)
  setLocal(KEY_LOGS, list)
}
