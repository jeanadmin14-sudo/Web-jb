import { NextResponse, type NextRequest } from 'next/server'

function getRequestIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    ''
  )
}

function getBlockedIps(): Set<string> {
  return new Set(
    (process.env.BLOCKED_IPS || '')
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean)
  )
}

export function proxy(req: NextRequest) {
  const ipAddress = getRequestIp(req)
  if (ipAddress && getBlockedIps().has(ipAddress)) {
    return new NextResponse('Akses diblokir.', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
}

