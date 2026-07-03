import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth-server'
import { getRequestLogContext, insertLog } from '@/lib/db-log'
import { blockIp, listBlockedIps, unblockIp } from '@/lib/ip-block'
import { assertText, jsonError, PublicInputError, serverError } from '@/lib/security'

export const preferredRegion = 'sin1'

function requireAuth(req: Request) {
  if (!getAuthSession(req)) {
    return jsonError('Unauthorized: Sesi tidak sah.', 401)
  }

  return null
}

export async function GET(req: Request) {
  try {
    const authError = requireAuth(req)
    if (authError) return authError

    return NextResponse.json(await listBlockedIps())
  } catch (err) {
    return serverError('API blocked-ips GET error:', err)
  }
}

export async function POST(req: Request) {
  try {
    const authError = requireAuth(req)
    if (authError) return authError

    const adminUser = req.headers.get('x-admin-user')
    const body = await req.json()
    const ipAddress = assertText(body.ipAddress, 'IP address', 80)
    const reason = assertText(body.reason || 'Suspicious activity from admin log', 'Alasan', 500)

    await blockIp(ipAddress, reason, adminUser)
    await insertLog(adminUser, `Suspend IP: ${ipAddress} (${reason})`, {
      ...getRequestLogContext(req),
      riskLevel: 'High',
      riskFlags: ['Admin melakukan suspend IP'],
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError || err instanceof Error) {
      return jsonError(err.message, 400)
    }
    return serverError('API blocked-ips POST error:', err)
  }
}

export async function DELETE(req: Request) {
  try {
    const authError = requireAuth(req)
    if (authError) return authError

    const adminUser = req.headers.get('x-admin-user')
    const { searchParams } = new URL(req.url)
    const ipAddress = assertText(searchParams.get('ip'), 'IP address', 80)

    await unblockIp(ipAddress)
    await insertLog(adminUser, `Membuka suspend IP: ${ipAddress}`, getRequestLogContext(req))

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof PublicInputError || err instanceof Error) {
      return jsonError(err.message, 400)
    }
    return serverError('API blocked-ips DELETE error:', err)
  }
}

