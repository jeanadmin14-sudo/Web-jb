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
  },
  {
    icon: Briefcase,
    title: 'Layanan Kami',
    description: 'Paid promote, dan gabung partner resmi JBJean.',
    href: '/layanan',
    linkText: 'Jelajahi Layanan',
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
        className="bg-grid"
        style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }}
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
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Icon Container */}
              <div className="stats-icon">
                <item.icon />
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
                  textDecoration: 'none',
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
        .stats-card-item {
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            background 0.3s ease;
        }

        .stats-card-item:hover {
          border-color: var(--border-card-hover) !important;
          box-shadow: 0 10px 30px -10px rgba(147,51,234, 0.2);
          transform: translateY(-4px);
        }

        .stats-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #9333ea;
          background: rgba(7, 1, 15, 0.8);
          border: 1px solid rgba(147, 51, 234, 0.25);
          transition:
            transform 0.3s ease,
            color 0.3s ease,
            background 0.3s ease,
            border-color 0.3s ease;
        }

        .stats-icon :global(svg) {
          width: 24px;
          height: 24px;
        }

        .stats-card-item:hover .stats-icon {
          transform: translateY(-1px);
        }

        .stats-card-item :global(a) {
          color: #9333ea;
          transition:
            gap 0.2s ease,
            color 0.2s ease;
        }

        .stats-card-item :global(a:hover) {
          gap: 10px;
          color: #a855f7;
        }

        :global(.light-mode) .stats-card-item {
          background: linear-gradient(180deg, #ffffff, #fffafd) !important;
          border-color: rgba(147, 51, 234, 0.18) !important;
          box-shadow: 0 14px 34px rgba(76, 29, 149, 0.06);
        }

        :global(.light-mode) .stats-card-item:hover {
          border-color: rgba(219, 39, 119, 0.34) !important;
          box-shadow: 0 18px 42px rgba(190, 24, 93, 0.12);
        }

        :global(.light-mode) .stats-icon {
          color: #6d28d9;
          background: linear-gradient(135deg, #fdf2f8, #f5f3ff);
          border-color: rgba(219, 39, 119, 0.2);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        :global(.light-mode) .stats-card-item :global(a) {
          color: #6d28d9 !important;
        }

        :global(.light-mode) .stats-card-item :global(a:hover) {
          color: #9d174d !important;
        }

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
