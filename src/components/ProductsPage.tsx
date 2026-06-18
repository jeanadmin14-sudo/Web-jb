"use client"

import { useEffect, useState } from 'react'
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
  {
    id: 'm5',
    name: 'Akun Free Fire Cobra Max + Evo Gun',
    description: 'Bundle Cobra, Evo Gun level 7, AK Dragon level 6, akun aman.',
    price: 850000,
    category: 'Free Fire',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-08T00:00:00Z',
  },
  {
    id: 'm6',
    name: 'Akun Mobile Legends Legend Skin Alucard',
    description: 'Skin Obsidian Blade Alucard, 120 skin, all hero unlocked.',
    price: 1100000,
    category: 'Mobile Legends',
    status: 'Sold Out',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-07T00:00:00Z',
  },
  {
    id: 'm7',
    name: 'Rental Akun MLBB Granger Starfall Knight',
    description: 'Rental 24 jam akun skin Legend Granger, full emblem max.',
    price: 45000,
    category: 'Rental',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-06T00:00:00Z',
  },
  {
    id: 'm8',
    name: 'Paid Promote Story WhatsApp',
    description: 'Promosi produk game ke story WA views 2k+ aktif harian.',
    price: 25000,
    category: 'JasaPost',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-05T00:00:00Z',
  },
  {
    id: 'm9',
    name: 'Akun FF Letda Hyper Clone',
    description: 'Bundle Letda Hyper, M1887 Rapper Underworld, MP40 Cobra.',
    price: 1200000,
    category: 'Free Fire',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-04T00:00:00Z',
  },
  {
    id: 'm10',
    name: 'Akun Mobile Legends KOF Chou + Iori',
    description: 'Skin KOF Chou, Skin Hero Bruno, Skin Collector Wanwan.',
    price: 3500000,
    category: 'Mobile Legends',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-03T00:00:00Z',
  },
  {
    id: 'm11',
    name: 'Rental Akun Steam Black Myth Wukong',
    description: 'Rental akun Steam offline mode game Black Myth Wukong harian.',
    price: 20000,
    category: 'Rental',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-02T00:00:00Z',
  },
  {
    id: 'm12',
    name: 'Jasa Post Feeds Partner Resmi',
    description: 'Post feeds partner resmi JBJean di Instagram & TikTok.',
    price: 150000,
    category: 'JasaPost',
    status: 'Ready',
    image_url: '/Logo.jpeg',
    created_at: '2026-06-01T00:00:00Z',
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('Semua')
  const [sort, setSort]       = useState('newest')
  const [status, setStatus]   = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      let data = await getProducts()

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

      setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [category, sort])

  useEffect(() => {
    setCurrentPage(1)
  }, [category, search, status, sort])

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
        padding: '40px 0',
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
              onChange={(e) => setSearch(e.target.value)}
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
              onChange={(e) => setSort(e.target.value)}
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
                onClick={() => setCategory(cat)}
                style={{
                  ...pillBase,
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                        color: '#fff',
                        boxShadow: '0 0 14px rgba(147,51,234,0.4)',
                      }
                    : {
                        background: 'rgba(12,4,20,0.8)',
                        border: '1px solid rgba(147,51,234,0.2)',
                        color: 'rgba(255,255,255,0.5)',
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
                onClick={() => setStatus(s)}
                style={{
                  ...pillBase,
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                        color: '#fff',
                        boxShadow: '0 0 14px rgba(147,51,234,0.4)',
                      }
                    : {
                        background: 'rgba(12,4,20,0.6)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.4)',
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
            padding: 24px 0 !important;
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
