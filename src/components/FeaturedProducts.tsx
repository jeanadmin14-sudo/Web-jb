"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProducts } from '@/lib/storage'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/supabase'

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
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontWeight: 800,
              fontSize: '20px',
              color: '#fff',
              margin: 0,
            }}
          >
            Produk Terbaru
          </h2>
          <Link
            href="/produk"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              fontWeight: 700,
              transition: 'gap 0.2s',
              color: '#a855f7',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.gap = '8px'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.gap = '4px'
            }}
          >
            Lihat <ArrowRight style={{ width: '15px', height: '15px' }} />
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
