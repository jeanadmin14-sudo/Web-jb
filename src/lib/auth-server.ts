import crypto from 'crypto'

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET

  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is required in production.')
  }

  return secret || 'jbjean-local-development-secret'
}

export function generateSessionToken(username: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(username).digest('hex')
}

export function verifySession(username: string | null, token: string | null): boolean {
  if (!username || !token) return false
  const expected = generateSessionToken(username)
  if (expected.length !== token.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token))
}

export function getAuthSession(req: Request): boolean {
  const username = req.headers.get('x-admin-user')
  const token = req.headers.get('x-admin-token')
  return verifySession(username, token)
}
