"use client"

import { useEffect, useState } from 'react'
import { getPartners } from '@/lib/storage'
import type { Partner } from '@/lib/supabase'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { ExternalLink, Crown, MessageSquare, Search, X } from 'lucide-react'

function getWhatsAppChatUrl(partner: Partner) {
  const number = partner.whatsapp_number?.replace(/\D/g, '')
  if (!number) return null
  const text = encodeURIComponent(`Halo, saya tertarik dengan layanan/partner ${partner.name}`)
  return `https://wa.me/${number}?text=${text}`
}

export default function PartnersPage({ initialPartners }: { initialPartners?: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners ?? [])
  const [loading, setLoading]   = useState(!initialPartners)
  const [mounted, setMounted] = useState(false)
  const [selectedPartnerImage, setSelectedPartnerImage] = useState<{
    src: string
    alt: string
  } | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (initialPartners) return

    async function fetchPartners() {
      setLoading(true)
      const data = await getPartners()
      const sorted = [...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      setPartners(sorted)
      setLoading(false)
    }
    fetchPartners()
  }, [initialPartners])

  return (
    <section
      className="partners-section"
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
        className="partners-container"
        style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Header */}
        <div className="partners-header" style={{ marginBottom: '28px' }}>
          <div
            className="partners-badge"
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
            Layanan
          </div>
          <h1
            className="partners-title"
            style={{
              fontWeight: 800,
              marginBottom: '8px',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            List partner resmi{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #ec4899, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              JBJean
            </span>
          </h1>
          <p className="partners-subtitle" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Daftar partner terpercaya dan layanan resmi.
          </p>
        </div>



        {/* Grid */}
        {loading ? (
          <div
            className="partners-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(12,4,20,0.8)',
                  border: '1px solid rgba(147,51,234,0.1)',
                }}
              >
                <div style={{ aspectRatio: '16/9', background: 'rgba(147,51,234,0.06)' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ height: '16px', borderRadius: '8px', width: '66%', background: 'rgba(147,51,234,0.08)', marginBottom: '12px' }} />
                  <div style={{ height: '12px', borderRadius: '8px', width: '100%', background: 'rgba(147,51,234,0.06)', marginBottom: '12px' }} />
                  <div style={{ height: '36px', borderRadius: '12px', background: 'rgba(147,51,234,0.08)', marginTop: '16px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : partners.length > 0 ? (
          <div
            className="partners-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
          >
            {partners.map((partner) => {
              const chatUrl = getWhatsAppChatUrl(partner)
              return (
              <div
                key={partner.id}
                className="card-dark card-shine"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                }}
              >
                {/* Image */}
                <div
                  className="partner-image"
                  style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    background: 'rgba(12,4,20,0.9)',
                  }}
                >
                  {partner.image_url ? (
                    <Image
                      src={partner.image_url}
                      alt={partner.name}
                      fill
                      style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
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
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '33%',
                      background: 'linear-gradient(to top, rgba(12,4,20,0.8), transparent)',
                      pointerEvents: 'none',
                    }}
                  />
                  {partner.image_url && (
                    <button
                      type="button"
                      className="partner-image-view-button"
                      aria-label={`Lihat detail gambar ${partner.name}`}
                      onClick={() => {
                        setSelectedPartnerImage({
                          src: partner.image_url || '/Logo.jpeg',
                          alt: partner.name,
                        })
                      }}
                    >
                      <Search style={{ width: '15px', height: '15px' }} />
                    </button>
                  )}
                  {/* Badges */}
                  <div className="partner-badge-left" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    <span
                      className="partner-official-badge"
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(147,51,234,0.85)',
                        color: '#fff',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(168,85,247,0.4)',
                      }}
                    >
                      Partner Resmi JBJean
                    </span>
                  </div>
                  <div className="partner-badge-right" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span
                      className="partner-status-badge"
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(34,197,94,0.15)',
                        color: '#4ade80',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(34,197,94,0.3)',
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                      {partner.status}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="partner-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 className="partner-name" style={{ fontWeight: 700, color: '#fff', fontSize: '16px', marginBottom: '8px' }}>{partner.name}</h3>
                  <p
                    className="partner-description"
                    style={{
                      fontSize: '14px',
                      marginBottom: '16px',
                      flex: 1,
                      color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.65,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {partner.description}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: partner.wa_channel_url && chatUrl ? '1fr 1fr' : '1fr', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    {partner.wa_channel_url && (
                      <a
                        className="partner-link"
                        href={partner.wa_channel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          transition: 'all 0.2s',
                          background: 'var(--bg-card, rgba(12, 4, 20, 0.65))',
                          border: '1px solid var(--border-card, rgba(147, 51, 234, 0.18))',
                          color: 'var(--text-title, #fff)',
                          boxShadow: 'none',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.transform = 'translateY(-1px)'
                          el.style.background = 'var(--bg-card-hover, rgba(13, 6, 32, 0.8))'
                          el.style.borderColor = 'var(--border-card-hover, rgba(168, 85, 247, 0.55))'
                          el.style.boxShadow = '0 4px 20px rgba(147, 51, 234, 0.15)'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.transform = 'translateY(0)'
                          el.style.background = 'var(--bg-card, rgba(12, 4, 20, 0.65))'
                          el.style.borderColor = 'var(--border-card, rgba(147, 51, 234, 0.18))'
                          el.style.boxShadow = 'none'
                        }}
                      >
                        <ExternalLink style={{ width: '16px', height: '16px' }} />
                        Saluran WA
                      </a>
                    )}
                    {chatUrl && (
                      <a
                        className="partner-link"
                        href={chatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          transition: 'all 0.2s',
                          background: 'linear-gradient(90deg, #ec4899, #d946ef)',
                          border: 'none',
                          color: '#fff',
                          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.transform = 'translateY(-1px)'
                          el.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.transform = 'translateY(0)'
                          el.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.2)'
                        }}
                      >
                        <MessageSquare style={{ width: '16px', height: '16px' }} />
                        Hubungi
                      </a>
                    )}
                  </div>
                </div>
              </div>
              )
            })}
          </div>
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
            <p style={{ fontSize: '18px', fontWeight: 500 }}>Belum ada partner terdaftar.</p>
          </div>
        )}
      </div>

      {selectedPartnerImage && mounted && createPortal(
        <div
          className="partner-image-viewer-backdrop"
          onClick={() => setSelectedPartnerImage(null)}
        >
          <div
            className="partner-image-viewer-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="partner-image-viewer-close"
              aria-label="Tutup detail gambar"
              onClick={() => setSelectedPartnerImage(null)}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div className="partner-image-viewer-media">
              <Image
                src={selectedPartnerImage.src}
                alt={selectedPartnerImage.alt}
                width={1200}
                height={800}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '16px',
                }}
                unoptimized
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Responsive */}
      <style jsx>{`
        .partner-image-view-button {
          position: absolute;
          right: 12px;
          bottom: 12px;
          z-index: 2;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(168, 85, 247, 0.35);
          border-radius: 999px;
          color: #c084fc;
          background: rgba(9, 4, 22, 0.86);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
          cursor: pointer;
          transition:
            transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            color 0.3s ease,
            background 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .partner-image-view-button:hover {
          color: #fff;
          background: linear-gradient(135deg, #ec4899, #a855f7);
          border-color: transparent;
          box-shadow: 0 0 18px rgba(168, 85, 247, 0.6);
          transform: scale(1.12) rotate(90deg);
        }

        .partner-image-viewer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(5, 1, 12, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .partner-image-viewer-card {
          width: 100%;
          max-width: 760px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 4px;
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          background: #0c0414;
          border: 1px solid rgba(147, 51, 234, 0.25);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }

        .partner-image-viewer-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 3;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.74);
          background: rgba(9, 4, 22, 0.86);
          border: 1px solid rgba(168, 85, 247, 0.25);
          cursor: pointer;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .partner-image-viewer-close:hover {
          color: #fff;
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
        }

        .partner-image-viewer-media {
          width: 100%;
        }

        :global(.light-mode) .partner-image-view-button {
          color: #be185d;
          background: rgba(255, 255, 255, 0.94);
          border-color: rgba(219, 39, 119, 0.24);
          box-shadow: 0 12px 26px rgba(76, 29, 149, 0.14);
        }

        :global(.light-mode) .partner-image-view-button:hover {
          color: #fff;
          background: linear-gradient(135deg, #db2777, #7c3aed);
          border-color: transparent;
        }

        :global(.light-mode) .partner-image-viewer-backdrop {
          background: rgba(19, 4, 38, 0.5);
        }

        :global(.light-mode) .partner-image-viewer-card {
          background: #ffffff;
          border-color: rgba(147, 51, 234, 0.22);
          box-shadow: 0 25px 50px rgba(76, 29, 149, 0.18);
        }

        :global(.light-mode) .partner-image-viewer-close {
          color: rgba(76, 29, 149, 0.72);
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(147, 51, 234, 0.2);
        }

        :global(.light-mode) .partner-image-viewer-close:hover {
          color: #fff;
          background: rgba(220, 38, 38, 0.82);
          border-color: rgba(220, 38, 38, 0.35);
        }

        @media (max-width: 768px) {
          .partners-section {
            padding-top: 94px !important;
            padding-bottom: 28px !important;
            min-height: auto !important;
          }
          .partners-container {
            padding: 0 14px !important;
          }
          .partners-header {
            text-align: center !important;
            margin-bottom: 22px !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .partners-badge {
            margin-bottom: 12px !important;
            font-size: 11px !important;
            padding: 6px 12px !important;
          }
          .partners-title {
            font-size: clamp(2rem, 10vw, 2.75rem) !important;
            line-height: 1.05 !important;
            letter-spacing: -0.04em !important;
            margin-bottom: 10px !important;
          }
          .partners-subtitle {
            max-width: 300px;
            font-size: 14px !important;
            line-height: 1.6 !important;
          }
          .partners-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .partners-grid :global(.card-dark) {
            border-radius: 18px !important;
            transform: none !important;
          }
          .partner-image {
            aspect-ratio: 4 / 3 !important;
          }
          .partner-badge-left,
          .partner-badge-right {
            top: 10px !important;
            left: 10px !important;
            right: auto !important;
            max-width: calc(100% - 20px);
          }
          .partner-badge-right {
            top: 42px !important;
          }
          .partner-official-badge,
          .partner-status-badge {
            max-width: 100%;
            min-height: 26px;
            font-size: 11px !important;
            line-height: 1.2 !important;
            padding: 5px 9px !important;
            white-space: nowrap;
          }
          .partner-body {
            padding: 16px !important;
          }
          .partner-name {
            font-size: 16px !important;
            line-height: 1.25 !important;
            margin-bottom: 8px !important;
          }
          .partner-description {
            font-size: 13px !important;
            line-height: 1.55 !important;
            margin-bottom: 14px !important;
            -webkit-line-clamp: 2 !important;
          }
          .partner-link {
            min-height: 44px;
            border-radius: 12px !important;
            font-size: 13px !important;
            padding: 11px 14px !important;
          }
          .partner-image-view-button {
            width: 40px;
            height: 40px;
            right: 10px;
            bottom: 10px;
          }
          .partner-image-viewer-backdrop {
            padding: 14px;
          }
          .partner-image-viewer-card {
            max-height: 86vh;
            border-radius: 20px;
          }
          .partner-body > div {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 380px) {
          .partners-container {
            padding: 0 12px !important;
          }
          .partner-official-badge,
          .partner-status-badge {
            font-size: 10px !important;
          }
          .partner-badge-right {
            top: 40px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .partners-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  )
}
