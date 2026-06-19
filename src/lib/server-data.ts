import { query } from '@/lib/db'
import type { Partner, Product } from '@/lib/supabase'

type ProductRow = Omit<Product, 'price' | 'created_at'> & {
  price: number | string
  created_at: string | Date
}

type PartnerRow = Omit<Partner, 'created_at'> & {
  created_at: string | Date
}

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value
}

function normalizeProductRow(product: ProductRow): Product {
  return {
    ...product,
    price: Number(product.price),
    created_at: toIsoString(product.created_at),
  }
}

function normalizePartnerRow(partner: PartnerRow): Partner {
  return {
    ...partner,
    created_at: toIsoString(partner.created_at),
  }
}

export async function getServerProducts(): Promise<Product[] | null> {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY created_at DESC')
    return (rows as ProductRow[]).map(normalizeProductRow)
  } catch (error) {
    console.error('getServerProducts error:', error)
    return null
  }
}

export async function getServerPartners(): Promise<Partner[] | null> {
  try {
    const { rows } = await query('SELECT * FROM partners ORDER BY created_at ASC')
    return (rows as PartnerRow[]).map(normalizePartnerRow)
  } catch (error) {
    console.error('getServerPartners error:', error)
    return null
  }
}
