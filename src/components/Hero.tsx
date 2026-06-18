"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section
      id="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(88,28,220,0.28) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(147,51,234,0.18) 0%, transparent 60%), #07010f',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '7.5rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Background glow blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-5%',
          left: '-10%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '0%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(192,38,211,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Dot grid */}
      <div
        className="bg-dots"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      {/* Main container */}
      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '64px',
          }}
        >

          {/* ── LEFT: Text content ── */}
          <div style={{ flex: '1 1 0%', maxWidth: '580px' }}>

            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '12px',
                background: 'rgba(147,51,234,0.15)',
                border: '1px solid rgba(168,85,247,0.35)',
                color: '#c084fc',
                letterSpacing: '0.08em',
              }}
            >
              <Sparkles style={{ width: '12px', height: '12px', color: '#eab308' }} />
              PREMIUM GAME MARKETPLACE
            </div>

            {/* BIG Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              Akun game premium, rental aman, transaksi cepat.
            </h1>

            {/* Description */}
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                marginBottom: '1.25rem',
                maxWidth: '480px',
              }}
            >
              Temukan stock Free Fire, Mobile Legends, rental akun, dan layanan
              partner dalam satu pengalaman web yang cepat, jelas, dan nyaman
              dipakai dari mobile.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              <Link
                href="/produk"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  padding: '14px 32px',
                  borderRadius: '999px',
                  transition: 'all 0.2s ease',
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 24px rgba(236,72,153,0.45)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = '0 6px 32px rgba(236,72,153,0.7)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = '0 4px 24px rgba(236,72,153,0.45)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                Lihat Produk
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </Link>

              <Link
                href="/layanan"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  padding: '14px 28px',
                  borderRadius: '999px',
                  transition: 'all 0.2s ease',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(147,51,234,0.35)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(168,85,247,0.6)'
                  el.style.background = 'rgba(147,51,234,0.12)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(147,51,234,0.35)'
                  el.style.background = 'rgba(255,255,255,0.06)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                Cek Keaslian PT/PP JBJean
                <ArrowRight style={{ width: '14px', height: '14px', opacity: 0.5 }} />
              </Link>
            </div>

            {/* Stats — inline in hero */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[
                { value: '5K+', label: 'Transaksi' },
                { value: '98%', label: 'Kepuasan' },
                { value: '24/7', label: 'Support' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '14px 28px',
                    borderRadius: '14px',
                    transition: 'all 0.2s ease',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-card)',
                    minWidth: '110px',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border-card-hover)'
                    el.style.boxShadow = '0 0 20px rgba(147,51,234,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border-card)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      background: 'var(--stats-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      marginTop: '2px',
                      color: 'var(--text-desc)',
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Logo image ── */}
          <div
            style={{
              flex: '1 1 0%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <div
              className="animate-float"
              style={{
                position: 'relative',
                width: '480px',
                maxWidth: '45vw',
              }}
            >
              {/* Outer glow */}
              <div
                className="animate-pulse-glow"
                style={{
                  position: 'absolute',
                  inset: '-30px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(147,51,234,0.15) 40%, transparent 70%)',
                  filter: 'blur(25px)',
                  pointerEvents: 'none',
                }}
              />
              {/* Logo Image */}
              <Image
                src="/Logo.jpeg"
                alt="JBJean — Premium Game Marketplace"
                width={480}
                height={480}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 10,
                  borderRadius: '20px',
                  filter: 'drop-shadow(0 0 40px rgba(147,51,234,0.3)) drop-shadow(0 0 80px rgba(236,72,153,0.15))',
                }}
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* Responsive styles for mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding-top: 5.5rem !important;
            padding-bottom: 2.5rem !important;
            min-height: auto !important;
          }
          section > div {
            padding: 0 20px !important;
          }
          section > div > div {
            flex-direction: column !important;
            gap: 24px !important;
          }
          section > div > div > div:first-child {
            text-align: center !important;
            max-width: 100% !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          section > div > div > div:first-child p {
            max-width: 100% !important;
          }
          section > div > div > div:first-child div[style*="display: flex"] {
            justify-content: center !important;
          }
          section > div > div > div:last-child {
            justify-content: center !important;
          }
          section > div > div > div:last-child > div {
            max-width: 65vw !important;
            width: 240px !important;
          }
        }
      `}</style>
    </section>
  )
}
