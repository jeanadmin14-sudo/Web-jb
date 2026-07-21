"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Flame, MessageCircle, ShieldCheck, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section
      id="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#07010f',
        paddingTop: '7.5rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Cyberpunk grid */}
      <div
        className="bg-grid"
        style={{ position: 'absolute', inset: 0, opacity: 0.7, pointerEvents: 'none' }}
      />

      {/* Center glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '-8%',
          transform: 'translateX(-50%)',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto', padding: '0 20px' }}>
        {/* Banner image */}
        <div
          style={{
            maxWidth: '620px',
            margin: '0 auto',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.8)',
            boxShadow: '0 0 34px -6px rgba(255,255,255,0.3)',
          }}
        >
          <Image
            src="/Logo.jpeg"
            alt="JBJean — Premium Game Marketplace"
            width={1200}
            height={675}
            style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }}
            priority
          />
        </div>

        {/* Dots */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ height: '6px', width: '16px', borderRadius: '999px', background: '#a855f7' }} />
          <span style={{ height: '6px', width: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ height: '6px', width: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)' }} />
        </div>

        <div style={{ marginTop: '2.25rem', textAlign: 'center' }}>
          {/* Badge */}
          <span
            className="badge-purple animate-electric"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <ShieldCheck style={{ width: '14px', height: '14px' }} />
            Jual Beli Akun Game Terpercaya
          </span>

          {/* Headline */}
          <h1
            style={{
              marginTop: '20px',
              fontSize: 'clamp(1.9rem, 7vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#fff',
            }}
          >
            Selamat datang di
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-brand-display)',
                fontWeight: 400,
                background: 'linear-gradient(120deg, #e9d5ff, #a855f7 65%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              JBJean Store
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              marginTop: '14px',
              maxWidth: '460px',
              marginLeft: 'auto',
              marginRight: 'auto',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.92rem',
              lineHeight: 1.65,
            }}
          >
            Temukan stock Free Fire, Mobile Legends, rental akun, dan layanan
            partner dalam satu pengalaman web yang cepat, jelas, dan nyaman
            dipakai dari mobile.
          </p>

          {/* CTA Buttons */}
          <div style={{ marginTop: '26px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Link
              href="/produk"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                padding: '13px 26px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#fff',
                boxShadow: '0 0 30px -8px rgba(147,51,234,0.8)',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-2px) scale(1.02)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0) scale(1)'
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
                gap: '8px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '13px 26px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
                transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.3)'
                el.style.background = 'rgba(255,255,255,0.05)'
                el.style.transform = 'translateY(-2px) scale(1.02)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.15)'
                el.style.background = 'transparent'
                el.style.transform = 'translateY(0) scale(1)'
              }}
            >
              <MessageCircle style={{ width: '16px', height: '16px' }} />
              Chat WhatsApp
            </Link>
          </div>

          {/* Promo / Hot banner */}
          <Link
            href="/layanan"
            style={{
              marginTop: '20px',
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '420px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: '16px',
              background: 'linear-gradient(90deg, rgba(249,115,22,0.15), rgba(239,68,68,0.1))',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '14px 20px',
              textDecoration: 'none',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(-1px)'
              el.style.borderColor = 'rgba(249,115,22,0.4)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(0)'
              el.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
                borderRadius: '999px',
                background: '#f97316',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#fff',
                textTransform: 'uppercase',
              }}
            >
              <Flame style={{ width: '12px', height: '12px' }} />
              Hot
            </span>
            <span style={{ flex: 1, textAlign: 'left', fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              Cek Daftar Blacklist Partner
            </span>
            <Zap style={{ width: '20px', height: '20px', color: '#fb923c', flexShrink: 0 }} />
          </Link>
        </div>
      </div>
    </section>
  )
}
