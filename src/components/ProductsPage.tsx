"use client"

import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '@/lib/storage'
import type { Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Search, SlidersHorizontal, Package } from 'lucide-react'

const CATEGORIES = ['Semua', 'Free Fire', 'Mobile Legends', 'Rental', 'JasaPost']
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Terbaru' },
  { value: 'price_asc',  label: 'Harga: Murah ke Mahal' },
  { value: 'price_desc', label: 'Harga: Mahal ke Murah' },
]
const STATUS_FILTERS = ['All Status', 'Ready Only', 'Sold Out']

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('Semua')
  const [sort, setSort]       = useState('newest')
  const [status, setStatus]   = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const data = await getProducts()
      setAllProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const products = useMemo(() => {
    let data = [...allProducts]
    if (category !== 'Semua') {
      data = data.filter(p => p.category === category)
    }
    if (sort === 'price_asc') {
      data.sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      data.sort((a, b) => b.price - a.price)
    } else {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return data
  }, [allProducts, category, sort])

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description?.toLowerCase() ?? '').includes(q)
    const matchStatus =
      status === 'All Status' ||
      (status === 'Ready Only' && p.status === 'Ready') ||
      (status === 'Sold Out' && p.status === 'Sold Out')
    return matchSearch && matchStatus
  })

  const PRODUCTS_PER_PAGE = 8
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  const inputStyle: React.CSSProperties = {
    background: 'rgba(12,4,20,0.8)',
    border: '1px solid rgba(147,51,234,0.2)',
    color: '#fff',
    borderRadius: '12px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontSize: '14px',
    width: '100%',
  }

  const pillBase: React.CSSProperties = {
    padding: '6px 16px',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  }

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '120px 0 40px',
        position: 'relative',
        background: '#07010f',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '999px',
              padding: '4px 14px',
              fontSize: '11px',
              fontWeight: 800,
              marginBottom: '16px',
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              color: '#ec4899',
              letterSpacing: '0.05em',
            }}
          >
            <Package style={{ width: '12px', height: '12px', color: '#ec4899' }} />
            PRODUK
          </div>
          <h1
            style={{
              fontWeight: 800,
              marginBottom: '12px',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            Stock dan rental <br />
            tersedia.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>
            Filter, urutkan, dan cari akun yang kamu butuhkan secara realtime.
          </p>
        </div>

        {/* Search + sort row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                pointerEvents: 'none',
                color: 'rgba(168,85,247,0.5)',
              }}
            />
            <input
              type="text"
              placeholder="Cari nama atau game..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(147,51,234,0.5)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(147,51,234,0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <SlidersHorizontal
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                pointerEvents: 'none',
                color: 'rgba(168,85,247,0.5)',
              }}
            />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setCurrentPage(1)
              }}
              style={{
                ...inputStyle,
                paddingLeft: '40px',
                paddingRight: '40px',
                paddingTop: '10px',
                paddingBottom: '10px',
                appearance: 'none' as const,
                cursor: 'pointer',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {CATEGORIES.map((cat) => {
            const isActive = category === cat
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setCurrentPage(1)
                }}
                style={{
                  ...pillBase,
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                        color: '#fff',
                        boxShadow: '0 0 14px rgba(147,51,234,0.4)',
                      }
                    : {
                        background: 'var(--bg-btn-outline)',
                        border: '1px solid var(--border-btn-outline)',
                        color: 'var(--text-btn-outline)',
                      }),
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {STATUS_FILTERS.map((s) => {
            const isActive = status === s
            return (
              <button
                key={s}
                onClick={() => {
                  setStatus(s)
                  setCurrentPage(1)
                }}
                style={{
                  ...pillBase,
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                        color: '#fff',
                        boxShadow: '0 0 14px rgba(147,51,234,0.4)',
                      }
                    : {
                        background: 'var(--bg-btn-outline)',
                        border: '1px solid var(--border-btn-outline)',
                        color: 'var(--text-btn-outline)',
                      }),
                }}
              >
                {s}
              </button>
            )
          })}
        </div>

        {/* Product grid */}
        {loading ? (
          <div
            className="products-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(12,4,20,0.8)',
                  border: '1px solid rgba(147,51,234,0.1)',
                }}
              >
                <div style={{ aspectRatio: '3/4', background: 'rgba(147,51,234,0.06)' }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '16px', borderRadius: '8px', width: '75%', background: 'rgba(147,51,234,0.08)', marginBottom: '10px' }} />
                  <div style={{ height: '12px', borderRadius: '8px', width: '50%', background: 'rgba(147,51,234,0.06)', marginBottom: '10px' }} />
                  <div style={{ height: '16px', borderRadius: '8px', width: '33%', background: 'rgba(147,51,234,0.08)', marginTop: '16px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <>
            <div
              className="products-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}
            >
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '40px',
                }}
              >
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(12,4,20,0.8)',
                    border: '1px solid rgba(147,51,234,0.15)',
                    color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  Sebelumnya
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1
                  const isPageActive = currentPage === pageNum
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isPageActive ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(12,4,20,0.8)',
                        border: isPageActive ? 'none' : '1px solid rgba(147,51,234,0.15)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 700,
                        boxShadow: isPageActive ? '0 0 12px rgba(236,72,153,0.3)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: currentPage === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(12,4,20,0.8)',
                    border: '1px solid rgba(147,51,234,0.15)',
                    color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : '#fff',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '96px 20px',
              borderRadius: '16px',
              background: 'rgba(147,51,234,0.04)',
              border: '1px solid rgba(147,51,234,0.1)',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 500 }}>Tidak ada produk ditemukan.</p>
            <p style={{ fontSize: '14px', marginTop: '4px', opacity: 0.7 }}>Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        )}
      </div>

      {/* Responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding-top: 88px !important;
            padding-bottom: 24px !important;
          }
          section > div {
            padding: 0 14px !important;
          }
          .products-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
            max-width: 430px;
            margin-left: auto;
            margin-right: auto;
          }
          .products-grid :global(> div) {
            width: 100%;
          }
        }
        @media (min-width: 560px) and (max-width: 768px) {
          .products-grid {
            max-width: 480px;
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
