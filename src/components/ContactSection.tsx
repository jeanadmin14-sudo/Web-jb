"use client"

import { MessageCircle, Send } from 'lucide-react'

export default function ContactSection() {
  const waLinks = [
    { label: 'Wa Khusus Stock', href: 'https://wa.me/6287832017296' },
    { label: 'Wa Khusus Rental', href: 'https://wa.me/6287832017296' },
    { label: 'Wa Khusus Join PP/PT', href: 'https://wa.me/6287720826802' },
  ]

  return (
    <section
      id="kontak"
      className="contact-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '48px 0',
        background: '#07010f',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(147,51,234,0.1) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px',
        }}
      >
        {/* Card container */}
        <div
          className="contact-card"
          style={{
            padding: '32px',
            borderRadius: '24px',
            background: 'linear-gradient(180deg, rgba(12, 4, 20, 0.8) 0%, rgba(7, 1, 15, 0.95) 100%)',
            border: '1px solid rgba(147, 51, 234, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            className="contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            {/* ── LEFT: Content ── */}
            <div>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '999px',
                  padding: '4px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  background: 'rgba(147,51,234,0.15)',
                  border: '1px solid rgba(147,51,234,0.35)',
                  color: '#c084fc',
                }}
              >
                <Send style={{ width: '12px', height: '12px', color: '#eab308' }} />
                KONTAK
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                }}
              >
                Siap order atau<br />
                butuh rekomendasi?
              </h2>

              <p
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.95rem',
                  lineHeight: 1.75,
                  maxWidth: '420px',
                }}
              >
                Hubungi admin untuk cek stock, rental, partner, atau layanan
                promosi. Semua CTA tetap mengarah ke channel yang sudah
                dikonfigurasi admin.
              </p>
            </div>

            {/* ── RIGHT: Stacked Buttons ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* WA Buttons (pink gradient) */}
              {waLinks.map((wa) => (
                <a
                  key={wa.label}
                  href={wa.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    padding: '14px 24px',
                    borderRadius: '999px',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    width: '100%',
                    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
                    textDecoration: 'none',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translateY(-2px)'
                    el.style.boxShadow = '0 6px 28px rgba(236, 72, 153, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = '0 4px 20px rgba(236, 72, 153, 0.3)'
                  }}
                >
                  <MessageCircle style={{ width: '18px', height: '18px' }} />
                  {wa.label}
                </a>
              ))}

              {/* Instagram & TikTok side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <a
                  href="https://www.instagram.com/jean_cruel23?igsh=MW5iYXk4amFzNThsdw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '12px 16px',
                    borderRadius: '999px',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(147, 51, 234, 0.25)',
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.08)'
                    el.style.borderColor = 'rgba(236, 72, 153, 0.45)'
                    el.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255, 255, 255, 0.04)'
                    el.style.borderColor = 'rgba(147, 51, 234, 0.25)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  Instagram
                </a>

                <a
                  href="https://www.tiktok.com/@jeancruell23?_r=1&_t=ZS-978iPy4vI6S"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '12px 16px',
                    borderRadius: '999px',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(147, 51, 234, 0.25)',
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.08)'
                    el.style.borderColor = 'rgba(236, 72, 153, 0.45)'
                    el.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255, 255, 255, 0.04)'
                    el.style.borderColor = 'rgba(147, 51, 234, 0.25)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                  </svg>
                  TikTok
                </a>
              </div>

              {/* Saluran WA */}
              <a
                href="https://whatsapp.com/channel/0029VbBqyVG0AgWAXwVIu73m"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '14px 24px',
                  borderRadius: '999px',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  width: '100%',
                  background: 'rgba(147, 51, 234, 0.05)',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  color: '#fff',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(147, 51, 234, 0.12)'
                  el.style.borderColor = 'rgba(236, 72, 153, 0.5)'
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(147, 51, 234, 0.05)'
                  el.style.borderColor = 'rgba(147, 51, 234, 0.2)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <Send style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                Saluran WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive override for mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          .contact-section {
            padding: 24px 0 !important;
          }
          .contact-card {
            padding: 24px 16px !important;
            border-radius: 20px !important;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .contact-grid > div:first-child {
            text-align: center !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .contact-grid > div:first-child p {
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
      `}</style>
    </section>
  )
}
