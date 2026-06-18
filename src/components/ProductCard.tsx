"use client"

import Image from 'next/image'
import type { Product } from '@/lib/supabase'
import { Search, MessageSquare, Info, ShoppingCart, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
  Ready:         { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', dot: '#22c55e' },
  'Not Ready':   { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', dot: '#ef4444' },
  'Sold Out':    { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', dot: '#ef4444' },
  default:       { bg: 'rgba(234,179,8,0.12)',  color: '#fde047', dot: '#eab308' },
}

export default function ProductCard({ product }: { product: Product }) {
  const statusStyle = STATUS_COLORS[product.status] ?? STATUS_COLORS.default
  const [hovered, setHovered] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  const waText = encodeURIComponent(`Halo, saya tertarik dengan produk: ${product.name}`)
  const waUrl = `https://wa.me/6287832017296?text=${waText}`

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: hovered ? '1px solid var(--border-card-hover)' : '1px solid var(--border-card)',
        borderRadius: '28px',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered 
          ? '0 25px 50px -12px rgba(147, 51, 234, 0.35), 0 0 20px 0 rgba(147, 51, 234, 0.15)' 
          : '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Premium subtle light reflection on hover */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Visual Header / Image Box (Portrait ratio 3/4) */}
      <div
        className="product-card-image"
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(7, 2, 15, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
        }}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            unoptimized
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 500,
              background: 'linear-gradient(135deg, rgba(76,29,149,0.3), rgba(12,4,20,0.8))',
              color: 'rgba(255,255,255,0.2)',
            }}
          >
            No Image
          </div>
        )}

        {/* Magnifier Glass overlay at bottom-right */}
        <div
          onClick={() => setIsDetailOpen(true)}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: hovered ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(9, 4, 22, 0.85)',
            border: hovered ? 'none' : '1px solid rgba(168, 85, 247, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hovered ? '#fff' : '#c084fc',
            transform: hovered ? 'scale(1.15) rotate(90deg)' : 'scale(1) rotate(0deg)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: hovered ? '0 0 15px rgba(168, 85, 247, 0.6)' : 'none',
            cursor: 'pointer',
          }}
        >
          <Search style={{ width: '15px', height: '15px' }} />
        </div>
      </div>

      {/* Badges Area */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Category Badge */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '5px 14px',
            borderRadius: '999px',
            background: 'rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            color: '#f472b6',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.3s ease',
          }}
        >
          {product.category}
        </span>

        {/* Status Badge */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '5px 14px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.dot}35`,
            color: statusStyle.color,
            transition: 'all 0.3s ease',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: statusStyle.dot,
              boxShadow: `0 0 8px ${statusStyle.dot}`,
            }}
          />
          {product.status}
        </span>

        {/* Rental Expiry Badge */}
        {product.category === 'Rental' && product.rent_end_date && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(147, 51, 234, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#c084fc',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Sewa s/d {new Date(product.rent_end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Info Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <h3
          style={{
            fontWeight: 800,
            color: 'var(--text-title)',
            fontSize: '18px',
            lineHeight: 1.25,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            transition: 'color 0.3s ease',
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-desc)',
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            transition: 'color 0.3s ease',
          }}
        >
          {product.description}
        </p>
      </div>

      {/* Action Buttons Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
        <div className="product-card-actions-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* Hubungi */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #ec4899, #d946ef)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: hovered ? '0 6px 20px rgba(236,72,153,0.45)' : 'none',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <MessageSquare style={{ width: '14px', height: '14px' }} />
            Hubungi
          </a>

          {/* Detail */}
          <button
            onClick={() => setIsDetailOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 800,
              background: hovered ? 'var(--bg-btn-outline-hover)' : 'var(--bg-btn-outline)',
              border: hovered ? '1px solid var(--border-btn-outline-hover)' : '1px solid var(--border-btn-outline)',
              color: hovered ? 'var(--text-btn-outline-hover)' : 'var(--text-btn-outline)',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Info style={{ width: '14px', height: '14px' }} />
            Detail
          </button>
        </div>

        {/* Full-width Order & Price Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 800,
            background: hovered ? 'var(--bg-btn-outline-hover)' : 'var(--bg-btn-full)',
            border: hovered ? '1px solid var(--border-btn-outline-hover)' : '1px solid var(--bg-btn-full)',
            color: hovered ? '#fff' : 'var(--text-btn-full)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <ShoppingCart style={{ width: '14px', height: '14px' }} />
          Beli Sekarang — {formatRupiah(product.price)}
        </a>
      </div>

      {isDetailOpen && mounted && createPortal(
        <div
          onClick={() => setIsDetailOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 1, 12, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Global Keyframes & Animations */}
          <style>{`
            @keyframes modalScaleIn {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(10px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
            @media (max-width: 640px) {
              .modal-content-wrapper {
                flex-direction: column !important;
                padding: 24px 16px !important;
                gap: 16px !important;
              }
              .modal-image-col {
                width: 100% !important;
                max-width: 100% !important;
                aspect-ratio: 16/9 !important;
                height: 180px !important;
              }
              .modal-info-col {
                width: 100% !important;
              }
            }
          `}</style>

          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-box-container"
            style={{
              width: '100%',
              maxWidth: '680px',
              borderRadius: '32px',
              position: 'relative',
              overflow: 'hidden',
              animation: 'modalScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsDetailOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)'
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            {/* Inner Wrapper */}
            <div
              className="modal-content-wrapper"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '28px',
                padding: '32px',
                alignItems: 'stretch',
              }}
            >
              {/* Left Column (Image) */}
              <div
                className="modal-image-col"
                style={{
                  position: 'relative',
                  width: '42%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: 'rgba(7, 2, 15, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
                  flexShrink: 0,
                }}
              >
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: 'linear-gradient(135deg, rgba(76,29,149,0.3), rgba(12,4,20,0.8))',
                      color: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* Right Column (Info) */}
              <div
                className="modal-info-col"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                {/* Product Name & Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(236, 72, 153, 0.1)',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        color: '#f472b6',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {product.category}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: statusStyle.bg,
                        border: `1px solid ${statusStyle.dot}35`,
                        color: statusStyle.color,
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: statusStyle.dot,
                        }}
                      />
                      {product.status}
                    </span>

                    {/* Rental Expiry Badge */}
                    {product.category === 'Rental' && product.rent_end_date && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: 'rgba(147, 51, 234, 0.15)',
                          border: '1px solid rgba(168, 85, 247, 0.35)',
                          color: '#c084fc',
                        }}
                      >
                        Sewa s/d {new Date(product.rent_end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontWeight: 900,
                      color: '#fff',
                      fontSize: '22px',
                      lineHeight: 1.2,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {product.name}
                  </h2>
                </div>

                {/* Product Price */}
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Harga</span>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      background: 'linear-gradient(90deg, #ec4899, #c084fc)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {formatRupiah(product.price)}
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deskripsi</span>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.65,
                      margin: '4px 0 0 0',
                      maxHeight: '150px',
                      overflowY: 'auto',
                      paddingRight: '8px',
                    }}
                  >
                    {product.description}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      borderRadius: '999px',
                      fontSize: '14px',
                      fontWeight: 800,
                      background: 'linear-gradient(90deg, #ec4899, #d946ef)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 4px 15px rgba(236,72,153,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,72,153,0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(236,72,153,0.3)'
                    }}
                  >
                    <MessageSquare style={{ width: '16px', height: '16px' }} />
                    Tanyakan via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      <style jsx>{`
        @media (max-width: 768px) {
          .product-card {
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.36) !important;
          }
          .product-card-image {
            aspect-ratio: 16 / 10 !important;
            border-radius: 16px !important;
          }
          .product-card-actions-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
        }
        @media (max-width: 380px) {
          .product-card-actions-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
