import { query, getDbPool } from './db'

export type RequestLogContext = {
  ipAddress: string
  userAgent: string
  device: string
  location: string
  origin: string
  referer: string
  riskLevel: 'Low' | 'Medium' | 'High'
  riskFlags: string[]
}

let ensuredLogColumns = false

function firstHeader(req: Request, names: string[]): string {
  for (const name of names) {
    const value = req.headers.get(name)
    if (value) return value
  }
  return ''
}

export function getClientIp(req: Request): string {
  const forwarded = firstHeader(req, [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'true-client-ip',
  ])

  return forwarded.split(',')[0]?.trim() || 'Tidak diketahui'
}

function detectDevice(userAgent: string): string {
  if (!userAgent) return 'Tidak diketahui'

  const platform = /Windows/i.test(userAgent)
    ? 'Windows'
    : /Android/i.test(userAgent)
      ? 'Android'
      : /iPhone|iPad|iPod/i.test(userAgent)
        ? 'iOS'
        : /Mac OS X|Macintosh/i.test(userAgent)
          ? 'macOS'
          : /Linux/i.test(userAgent)
            ? 'Linux'
            : 'Unknown OS'

  const browser = /Edg\//i.test(userAgent)
    ? 'Edge'
    : /Chrome\//i.test(userAgent)
      ? 'Chrome'
      : /Firefox\//i.test(userAgent)
        ? 'Firefox'
        : /Safari\//i.test(userAgent)
          ? 'Safari'
          : 'Unknown Browser'

  const formFactor = /Mobile|Android|iPhone|iPod/i.test(userAgent)
    ? 'Mobile'
    : /iPad|Tablet/i.test(userAgent)
      ? 'Tablet'
      : 'Desktop'

  return `${formFactor} - ${platform} - ${browser}`
}

function buildLocation(req: Request): string {
  const city = firstHeader(req, ['x-vercel-ip-city', 'cf-ipcity'])
  const region = firstHeader(req, ['x-vercel-ip-country-region', 'cf-region'])
  const country = firstHeader(req, ['x-vercel-ip-country', 'cf-ipcountry'])
  const timezone = firstHeader(req, ['x-vercel-ip-timezone'])

  const parts = [city, region, country].filter(Boolean)
  const location = parts.length > 0 ? parts.join(', ') : 'Tidak tersedia'

  return timezone ? `${location} (${timezone})` : location
}

function assessRisk(req: Request, ipAddress: string, userAgent: string): Pick<RequestLogContext, 'riskLevel' | 'riskFlags'> {
  const flags: string[] = []
  const origin = req.headers.get('origin') || ''
  const referer = req.headers.get('referer') || ''
  const country = firstHeader(req, ['x-vercel-ip-country', 'cf-ipcountry'])

  if (!userAgent) flags.push('User-Agent kosong')
  if (/curl|wget|python|bot|crawler|spider|postman|insomnia/i.test(userAgent)) flags.push('User-Agent otomatis/tool')
  if (!referer && !origin) flags.push('Origin/Referer kosong')
  if (country && country !== 'ID') flags.push(`Akses dari luar ID: ${country}`)
  if (ipAddress === 'Tidak diketahui') flags.push('IP tidak tersedia')

  const riskLevel = flags.length >= 3 ? 'High' : flags.length >= 1 ? 'Medium' : 'Low'
  return { riskLevel, riskFlags: flags }
}

async function ensureActivityLogColumns() {
  if (ensuredLogColumns) return

  await query(`
    ALTER TABLE activity_logs
      ADD COLUMN IF NOT EXISTS ip_address TEXT,
      ADD COLUMN IF NOT EXISTS user_agent TEXT,
      ADD COLUMN IF NOT EXISTS device TEXT,
      ADD COLUMN IF NOT EXISTS location TEXT,
      ADD COLUMN IF NOT EXISTS origin TEXT,
      ADD COLUMN IF NOT EXISTS referer TEXT,
      ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'Low',
      ADD COLUMN IF NOT EXISTS risk_flags TEXT;
  `)
  ensuredLogColumns = true
}

export function getRequestLogContext(req: Request): RequestLogContext {
  const ipAddress = getClientIp(req)
  const userAgent = req.headers.get('user-agent') || ''
  const risk = assessRisk(req, ipAddress, userAgent)

  return {
    ipAddress,
    userAgent: userAgent || 'Tidak tersedia',
    device: detectDevice(userAgent),
    location: buildLocation(req),
    origin: req.headers.get('origin') || 'Tidak tersedia',
    referer: req.headers.get('referer') || 'Tidak tersedia',
    riskLevel: risk.riskLevel,
    riskFlags: risk.riskFlags,
  }
}

export async function insertLog(adminUser: string | null, action: string, context?: RequestLogContext) {
  const pool = getDbPool()
  if (!pool) return // Database not active
  
  try {
    await ensureActivityLogColumns()

    const actor = adminUser || 'System'
    await query(
      `INSERT INTO activity_logs
        (admin_user, action, ip_address, user_agent, device, location, origin, referer, risk_level, risk_flags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        actor,
        action,
        context?.ipAddress || null,
        context?.userAgent || null,
        context?.device || null,
        context?.location || null,
        context?.origin || null,
        context?.referer || null,
        context?.riskLevel || 'Low',
        context?.riskFlags.join(', ') || null,
      ]
    )
  } catch (error) {
    console.error('Failed to insert activity log:', error)
  }
}
