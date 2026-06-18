"use client"

import { useEffect, useState } from 'react'
import { getPartners } from '@/lib/storage'
import type { Partner } from '@/lib/supabase'
import Image from 'next/image'
import { ExternalLink, Crown } from 'lucide-react'

const MOCK_PARTNERS: Partner[] = []

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function fetchPartners() {
      setLoading(true)
      const data = await getPartners()
      const sorted = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setPartners(sorted)
      setLoading(false)
    }
    fetchPartners()
  }, [])

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
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
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
            Layanan
          </div>
          <h1
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
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>
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
            {partners.map((partner) => (
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
                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    <span
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
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span
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
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '16px', marginBottom: '8px' }}>{partner.name}</h3>
                  <p
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
                  {partner.wa_channel_url && (
                    <a
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
                </div>
              </div>
            ))}
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

      {/* Responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding-top: 88px !important;
            padding-bottom: 24px !important;
          }
          .partners-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
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
