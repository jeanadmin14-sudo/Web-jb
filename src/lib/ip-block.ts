import { getDbPool, query } from './db'
import { getClientIp, getRequestLogContext, insertLog } from './db-log'

export type BlockedIp = {
  id: number
  ip_address: string
  reason: string | null
  blocked_by: string | null
  created_at: string
}

let ensuredBlockedIpTable = false

async function ensureBlockedIpTable() {
  if (ensuredBlockedIpTable) return

  await query(`
    CREATE TABLE IF NOT EXISTS blocked_ips (
      id SERIAL PRIMARY KEY,
      ip_address TEXT UNIQUE NOT NULL,
      reason TEXT,
      blocked_by TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `)

  ensuredBlockedIpTable = true
}

export function normalizeIpAddress(ipAddress: string | null | undefined): string {
  return (ipAddress || '').split(',')[0]?.trim()
}

export async function isRequestIpBlocked(req: Request): Promise<boolean> {
  if (!getDbPool()) return false

  const ipAddress = normalizeIpAddress(getClientIp(req))
  if (!ipAddress || ipAddress === 'Tidak diketahui') return false

  await ensureBlockedIpTable()
  const { rowCount } = await query('SELECT 1 FROM blocked_ips WHERE ip_address = $1', [ipAddress])

  if (rowCount && rowCount > 0) {
    await insertLog('System', `Akses diblokir dari IP suspended: ${ipAddress}`, {
      ...getRequestLogContext(req),
      riskLevel: 'High',
      riskFlags: ['IP ada di daftar suspend'],
    })
    return true
  }

  return false
}

export async function listBlockedIps(): Promise<BlockedIp[]> {
  await ensureBlockedIpTable()
  const { rows } = await query('SELECT * FROM blocked_ips ORDER BY created_at DESC')
  return rows as BlockedIp[]
}

export async function blockIp(ipAddress: string, reason: string, blockedBy: string | null) {
  const safeIp = normalizeIpAddress(ipAddress)
  if (!safeIp || safeIp === 'Tidak diketahui' || safeIp.length > 80) {
    throw new Error('IP address tidak valid.')
  }

  await ensureBlockedIpTable()
  await query(
    `INSERT INTO blocked_ips (ip_address, reason, blocked_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (ip_address) DO UPDATE SET
       reason = EXCLUDED.reason,
       blocked_by = EXCLUDED.blocked_by`,
    [safeIp, reason.slice(0, 500), blockedBy]
  )
}

export async function unblockIp(ipAddress: string) {
  const safeIp = normalizeIpAddress(ipAddress)
  if (!safeIp || safeIp.length > 80) {
    throw new Error('IP address tidak valid.')
  }

  await ensureBlockedIpTable()
  await query('DELETE FROM blocked_ips WHERE ip_address = $1', [safeIp])
}

export async function autoBlockAfterFailedLogin(req: Request, username: string) {
  if (!getDbPool()) return

  const ipAddress = normalizeIpAddress(getClientIp(req))
  if (!ipAddress || ipAddress === 'Tidak diketahui') return

  await ensureBlockedIpTable()

  const { rows } = await query(
    `SELECT count(*)::int AS total
     FROM activity_logs
     WHERE ip_address = $1
       AND action = 'Percobaan login gagal'
       AND created_at > NOW() - INTERVAL '15 minutes'`,
    [ipAddress]
  )
  const total = Number(rows[0]?.total || 0)

  if (total >= 5) {
    const reason = `Auto suspend: ${total} percobaan login gagal dalam 15 menit. Username terakhir: ${username}`
    await blockIp(ipAddress, reason, 'System')
    await insertLog('System', `Auto suspend IP: ${ipAddress} (${reason})`, {
      ...getRequestLogContext(req),
      riskLevel: 'High',
      riskFlags: ['Terlalu banyak login gagal'],
    })
  }
}
