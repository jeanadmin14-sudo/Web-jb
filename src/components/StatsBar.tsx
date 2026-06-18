"use client"

import Link from 'next/link'
import { Gamepad2, Briefcase, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Gamepad2,
    title: 'Katalog Produk',
    description: 'Cek stock akun Free Fire, Mobile Legends, Rental Akun dan lainnya secara realtime.',
    href: '/produk',
    linkText: 'Lihat Katalog',
    color: '#ec4899',
  },
  {
    icon: Briefcase,
    title: 'Layanan Kami',
    description: 'Paid promote, dan gabung partner resmi JBJean.',
    href: '/layanan',
    linkText: 'Jelajahi Layanan',
    color: '#ec4899',
  },
]

export default function StatsBar() {
  return (
    <section
      className="stats-section"
      style={{
        position: 'relative',
        padding: '40px 0',
        background: '#07010f',
      }}
    >
      {/* Subtle background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent, rgba(147, 51, 234, 0.03), transparent)',
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
        <div
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {features.map((item) => (
            <div
              key={item.title}
              className="stats-card-item"
              style={{
                position: 'relative',
                padding: '24px',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                backdropFilter: 'blur(16px)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-card-hover)'
                el.style.boxShadow = '0 10px 30px -10px rgba(236, 72, 153, 0.2)'
                el.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-card)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  background: 'rgba(7, 1, 15, 0.8)',
                  border: '1px solid rgba(147, 51, 234, 0.25)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <item.icon style={{ width: '24px', height: '24px', color: item.color }} />
              </div>

              {/* Title & Desc */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-title)',
                  marginBottom: '8px',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.7,
                  marginBottom: '16px',
                  color: 'var(--text-desc)',
                }}
              >
                {item.description}
              </p>

              {/* Link CTA */}
              <Link
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: item.color,
                  textDecoration: 'none',
                  transition: 'gap 0.2s ease',
                }}
              >
                {item.linkText}
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive override for mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          .stats-section {
            padding: 24px 0 !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .stats-card-item {
            padding: 20px !important;
          }
        }
      `}</style>
    </section>
  )
}
