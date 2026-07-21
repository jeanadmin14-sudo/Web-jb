"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProducts } from '@/lib/storage'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Crown } from 'lucide-react'
import type { Product } from '@/lib/supabase'

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'Akun Free Fire Old Season 1',
    description: 'Set Sakura, Hip Hop, bundle langka lengkap, vault melimpah.',
    price: 1500000,
    category: 'Free Fire',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-12T00:00:00Z',
  },
  {
    id: 'm2',
    name: 'Akun Mobile Legends Mythical Glory',
    description: 'Skins Collector Granger, Lightborn, KOF Gusion & Chou, winrate 72%.',
    price: 2200000,
    category: 'Mobile Legends',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-11T00:00:00Z',
  },
  {
    id: 'm3',
    name: 'Rental Akun FF Max Skin Full',
    description: 'Rental harian akun Free Fire full skin senjata Evo max level.',
    price: 35000,
    category: 'Rental',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-10T00:00:00Z',
  },
  {
    id: 'm4',
    name: 'Jasa Post Paid Promote Instagram',
    description: 'Paid promote ke 50k followers gaming target Indonesia.',
    price: 50000,
    category: 'JasaPost',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-09T00:00:00Z',
  },
]

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadFeatured() {
      const data = await getProducts()
      const sorted = [...data]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4)
      setProducts(sorted)
    }
    loadFeatured()
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '48px 0',
        background: '#07010f',
      }}
    >
      {/* Purple glow center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '900px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      {/* Divider top */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.4), transparent)',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px 24px 0',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '28px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '999px',
                padding: '4px 14px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '16px',
                background: 'rgba(147,51,234,0.15)',
                border: '1px solid rgba(147,51,234,0.35)',
                color: '#c084fc',
              }}
            >
              <Crown style={{ width: '12px', height: '12px', color: '#eab308' }} />
              Premium Game Marketplace
            </div>
            <h2
              style={{
                fontWeight: 800,
                lineHeight: 1.2,
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              Akun game premium, rental aman,{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #9333ea, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                transaksi cepat.
              </span>
            </h2>
            <p
              style={{
                marginTop: '12px',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.75,
              }}
            >
              Temukan stock Free Fire, Mobile Legends, rental akun, dan layanan partner
              dalam satu pengalaman web yang cepat, jelas, dan nyaman dipakai dari mobile.
            </p>
          </div>
          <Link
            href="/produk"
            className="hidden sm:inline-flex"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s',
              borderRadius: '999px',
              padding: '8px 16px',
              color: '#9333ea',
              border: '1px solid rgba(147,51,234,0.25)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(147,51,234,0.1)'
              el.style.color = '#a855f7'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.color = '#9333ea'
            }}
          >
            Lihat Semua <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div
            className="products-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              borderRadius: '16px',
              background: 'rgba(147,51,234,0.05)',
              border: '1px solid rgba(147,51,234,0.12)',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 500 }}>Belum ada produk tersedia.</p>
          </div>
        )}

        {/* Mobile see all */}
        <div className="sm:hidden" style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link
            href="/produk"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#9333ea',
              textDecoration: 'none',
            }}
          >
            Lihat Semua Produk <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>
      </div>

      {/* Responsive override */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 24px 0 !important;
          }
          section > div:last-of-type {
            padding-top: 12px !important;
          }
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  )
}
