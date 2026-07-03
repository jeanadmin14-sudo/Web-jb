import { query } from '@/lib/db'
import type { Partner, Product } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'

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
    image_url: stripInlineImage(product.image_url),
    gallery: stripInlineGallery(product.gallery),
    created_at: toIsoString(product.created_at),
  }
}

function stripInlineImage(value: string | null): string | null {
  return value?.startsWith('data:image/') ? '/Logo.jpeg' : value
}

function stripInlineGallery(value: string | null | undefined): string | null | undefined {
  if (!value) return value
  try {
    const gallery = JSON.parse(value)
    if (!Array.isArray(gallery)) return value
    return JSON.stringify(gallery.map((image) => typeof image === 'string' && image.startsWith('data:image/') ? '/Logo.jpeg' : image))
  } catch {
    return value.startsWith('data:image/') ? null : value
  }
}

function normalizePartnerRow(partner: PartnerRow): Partner {
  return {
    ...partner,
    created_at: toIsoString(partner.created_at),
  }
}

async function fetchServerProducts(): Promise<Product[] | null> {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY created_at DESC')
    return (rows as ProductRow[]).map(normalizeProductRow)
  } catch (error) {
    console.error('getServerProducts error:', error)
    return null
  }
}

async function fetchServerPartners(): Promise<Partner[] | null> {
  try {
    const { rows } = await query('SELECT * FROM partners ORDER BY created_at ASC')
    return (rows as PartnerRow[]).map(normalizePartnerRow)
  } catch (error) {
    console.error('getServerPartners error:', error)
    return null
  }
}

export const getServerProducts = unstable_cache(fetchServerProducts, ['server-products'], {
  revalidate: 3600,
  tags: ['products'],
})

export const getServerPartners = unstable_cache(fetchServerPartners, ['server-partners'], {
  revalidate: 3600,
  tags: ['partners'],
})
