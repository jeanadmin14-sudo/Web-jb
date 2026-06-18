import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && /^https?:\/\//.test(url))
}

export function createSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  status: string
  image_url: string | null
  created_at: string
  rent_end_date?: string | null
}

export type Partner = {
  id: string
  name: string
  description: string
  wa_channel_url: string
  image_url: string | null
  status: string
  created_at: string
}

export type SiteConfig = {
  id: string
  key: string
  value: string
}
