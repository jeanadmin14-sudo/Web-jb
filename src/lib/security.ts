import { NextResponse } from 'next/server'

const UUID_OR_LOCAL_ID = /^[a-zA-Z0-9_-]{1,80}$/
const USERNAME = /^[a-zA-Z0-9_.-]{3,40}$/
const PHONE = /^[0-9]{8,20}$/

export class PublicInputError extends Error {}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function serverError(context: string, error: unknown) {
  console.error(context, error)
  return jsonError('Terjadi kesalahan server.', 500)
}

export function assertSafeId(id: unknown, field = 'ID'): string {
  if (typeof id !== 'string' || !UUID_OR_LOCAL_ID.test(id.trim())) {
    throw new PublicInputError(`${field} tidak valid.`)
  }
  return id.trim()
}

export function assertUsername(username: unknown): string {
  if (typeof username !== 'string' || !USERNAME.test(username.trim())) {
    throw new PublicInputError('Username hanya boleh berisi huruf, angka, titik, garis bawah, atau strip.')
  }
  return username.trim()
}

export function assertText(value: unknown, field: string, maxLength: number, required = true): string {
  if (typeof value !== 'string') {
    if (!required) return ''
    throw new PublicInputError(`${field} wajib diisi.`)
  }

  const trimmed = value.trim()
  if (required && !trimmed) {
    throw new PublicInputError(`${field} wajib diisi.`)
  }
  if (trimmed.length > maxLength) {
    throw new PublicInputError(`${field} terlalu panjang.`)
  }
  return trimmed
}

export function assertNumber(value: unknown, field: string, min = 0, max = 1_000_000_000): number {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue) || numberValue < min || numberValue > max) {
    throw new PublicInputError(`${field} tidak valid.`)
  }
  return numberValue
}

export function optionalDate(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    throw new PublicInputError('Tanggal tidak valid.')
  }
  return value.slice(0, 10)
}

export function optionalSafeUrl(value: unknown, field: string, allowedHosts?: string[]): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') throw new PublicInputError(`${field} tidak valid.`)

  const trimmed = value.trim()
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) return trimmed

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    throw new PublicInputError(`${field} tidak valid.`)
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new PublicInputError(`${field} harus memakai http atau https.`)
  }

  if (allowedHosts && !allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) {
    throw new PublicInputError(`${field} tidak sesuai domain yang diizinkan.`)
  }

  return url.toString()
}

export function optionalPhone(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') throw new PublicInputError('Nomor WhatsApp tidak valid.')
  const normalized = value.replace(/[^\d]/g, '')
  if (!PHONE.test(normalized)) throw new PublicInputError('Nomor WhatsApp tidak valid.')
  return normalized
}
