import { query, getDbPool } from './db'

export async function insertLog(adminUser: string | null, action: string) {
  const pool = getDbPool()
  if (!pool) return // Database not active
  
  try {
    const actor = adminUser || 'System'
    await query(
      'INSERT INTO activity_logs (admin_user, action) VALUES ($1, $2)',
      [actor, action]
    )
  } catch (error) {
    console.error('Failed to insert activity log:', error)
  }
}
