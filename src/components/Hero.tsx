"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useRef, type PointerEvent } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const logoRef = useRef<HTMLDivElement | null>(null)

  const handleLogoMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = logoRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * 14
    const rotateX = (0.5 - y) * 12

    el.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`)
    el.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`)
    el.style.setProperty('--glow-x', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--glow-y', `${(y * 100).toFixed(1)}%`)
  }

  const handleLogoLeave = () => {
    const el = logoRef.current
    if (!el) return

    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    el.style.setProperty('--glow-x', '50%')
    el.style.setProperty('--glow-y', '50%')
  }

  return (
    <section
      id="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(88,28,220,0.28) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(147,51,234,0.18) 0%, transparent 60%), #07010f',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '8rem',
        paddingBottom: '4rem',
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

      {/* Cyberpunk grid */}
      <div
        className="bg-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.7,
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
            gap: '72px',
          }}
        >

          {/* ── LEFT: Text content ── */}
          <div style={{ flex: '1 1 0%', maxWidth: '640px' }}>

            {/* Badge */}
            <div
              className="badge-cyan animate-electric"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 14px',
                fontSize: '11px',
                fontWeight: 800,
                marginBottom: '16px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles style={{ width: '12px', height: '12px', color: '#eab308' }} />
              PREMIUM GAME MARKETPLACE
            </div>

            {/* BIG Headline */}
            <h1
              style={{
                fontSize: 'clamp(1.05rem, 1.9vw, 1.65rem)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '0.7rem',
                whiteSpace: 'nowrap',
              }}
            >
              Akun game premium, <span className="text-glow" style={{ color: '#e9d5ff' }}>rental aman</span>, transaksi cepat.
            </h1>

            {/* Description */}
            <p
              style={{
                color: 'rgba(255,255,255,0.62)',
                fontSize: '0.85rem',
                lineHeight: 1.55,
                marginBottom: '1.25rem',
                maxWidth: '480px',
              }}
            >
              Temukan stock Free Fire, Mobile Legends, rental akun, dan layanan
              partner dalam satu pengalaman web yang cepat, jelas, dan nyaman
              dipakai dari mobile.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
              <Link
                href="/produk"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  minHeight: '50px',
                  padding: '14px 28px',
                  borderRadius: '14px',
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
                  minHeight: '50px',
                  padding: '14px 24px',
                  borderRadius: '14px',
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
            <div className="hero-inline-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
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
                    borderRadius: '16px',
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
              ref={logoRef}
              className="hero-logo-motion"
              onPointerMove={handleLogoMove}
              onPointerLeave={handleLogoLeave}
              style={{
                position: 'relative',
                width: '500px',
                maxWidth: '42vw',
              }}
            >
              <div className="hero-mobile-logo-card" aria-hidden="true">
                <span className="hero-mobile-logo-badge">JBJEAN STORE</span>
              </div>
              <div className="hero-logo-orbit hero-logo-orbit-one" />
              <div className="hero-logo-orbit hero-logo-orbit-two" />
              {/* Outer glow */}
              <div
                className="hero-logo-glow"
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
                className="hero-logo-image"
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
                  borderRadius: '28px',
                  filter: 'drop-shadow(0 0 40px rgba(147,51,234,0.3)) drop-shadow(0 0 80px rgba(236,72,153,0.15))',
                }}
                priority
              />
              <div className="hero-mobile-stats" aria-hidden="true">
                {[
                  { value: '5K+', label: 'Transaksi' },
                  { value: '98%', label: 'Kepuasan' },
                  { value: '24/7', label: 'Support' },
                ].map((s) => (
                  <div key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Responsive styles for mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding-top: 6rem !important;
            padding-bottom: 2.5rem !important;
            min-height: auto !important;
          }
          section > div {
            padding: 0 18px !important;
          }
          section > div > div {
            flex-direction: column !important;
            gap: 28px !important;
          }
          section > div > div > div:first-child {
            text-align: center !important;
            max-width: 100% !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          section > div > div > div:first-child h1 {
            white-space: normal !important;
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
            max-width: 58vw !important;
            width: 220px !important;
          }
        }
        @media (max-width: 480px) {
          section {
            padding-top: 5rem !important;
            padding-bottom: 1.75rem !important;
          }
          section > div > div > div:first-child > div[style*="border-radius: 999px"] {
            padding: 5px 11px !important;
            font-size: 9px !important;
            margin-bottom: 10px !important;
          }
          section > div > div > div:last-child {
            display: flex !important;
            order: -1 !important;
            width: 100% !important;
            margin-top: 6px !important;
          }
          section > div > div > div:last-child > div {
            width: min(100%, 358px) !important;
            max-width: 100% !important;
          }
          section > div > div {
            gap: 22px !important;
          }
          section > div > div > div:first-child {
            margin-top: 0 !important;
          }
          section > div > div > div:first-child > div:first-child {
            display: none !important;
          }
          section > div > div > div:first-child h1 {
            font-size: clamp(0.92rem, 4.3vw, 1.15rem) !important;
            line-height: 1.25 !important;
            white-space: normal !important;
            margin-bottom: 0.5rem !important;
          }
          section > div > div > div:first-child p {
            font-size: 0.76rem !important;
            line-height: 1.5 !important;
            margin-bottom: 0.9rem !important;
          }
          .hero-inline-stats {
            display: none !important;
          }
        }
        .hero-logo-motion {
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          --glow-x: 50%;
          --glow-y: 50%;
          isolation: isolate;
          transform-style: preserve-3d;
          animation:
            heroLogoEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) both,
            heroLogoFloat 7s ease-in-out 0.9s infinite;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .hero-mobile-logo-card,
        .hero-mobile-stats {
          display: none;
        }
        .hero-logo-motion:hover {
          animation-play-state: paused;
          transform: translate3d(0, -18px, 0) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale(1.035);
        }
        .hero-logo-motion::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 30px;
          background: linear-gradient(110deg, transparent 16%, rgba(255,255,255,0.24) 45%, transparent 62%);
          transform: translateX(-125%) skewX(-14deg);
          animation: heroLogoShine 5.5s ease-in-out 1.3s infinite;
          pointer-events: none;
          z-index: 20;
        }
        .hero-logo-glow {
          opacity: 0.86;
          transform: translateZ(-40px);
          animation: heroLogoGlow 4.8s ease-in-out infinite;
          z-index: 0;
        }
        .hero-logo-motion:hover .hero-logo-glow {
          background:
            radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(255, 255, 255, 0.22), transparent 18%),
            radial-gradient(circle, rgba(236,72,153,0.32) 0%, rgba(147,51,234,0.24) 42%, transparent 72%) !important;
          opacity: 1;
          filter: blur(32px) saturate(1.18);
        }
        .hero-logo-image {
          overflow: hidden;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.035)),
            rgba(10, 3, 22, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.42),
            0 0 70px rgba(168, 85, 247, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.16);
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease;
          will-change: transform;
        }
        .hero-logo-motion:hover .hero-logo-image {
          transform: translateZ(58px) scale(1.018);
          box-shadow:
            0 44px 110px rgba(0, 0, 0, 0.52),
            0 0 96px rgba(236, 72, 153, 0.32),
            0 0 34px rgba(168, 85, 247, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .hero-logo-motion:hover .hero-logo-orbit-one {
          animation-duration: 5.8s;
          border-color: rgba(216, 180, 254, 0.36);
        }
        .hero-logo-motion:hover .hero-logo-orbit-two {
          animation-duration: 6.2s;
          border-color: rgba(236, 72, 153, 0.3);
        }
        .hero-logo-orbit {
          position: absolute;
          inset: -18px;
          border-radius: 34px;
          border: 1px solid rgba(216, 180, 254, 0.22);
          transform: rotate(-6deg);
          pointer-events: none;
          z-index: 1;
        }
        .hero-logo-orbit-one {
          animation: heroOrbitDrift 9s ease-in-out infinite;
        }
        .hero-logo-orbit-two {
          inset: 18px -28px -20px 26px;
          border-color: rgba(236, 72, 153, 0.18);
          transform: rotate(8deg);
          animation: heroOrbitDriftAlt 10s ease-in-out infinite;
        }
        @keyframes heroLogoEnter {
          from {
            opacity: 0;
            transform: translate3d(32px, 28px, 0) rotateX(8deg) rotateY(-12deg) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1);
          }
        }
        @keyframes heroLogoFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translate3d(0, -18px, 0) rotateX(2.5deg) rotateY(-3.5deg);
          }
        }
        @keyframes heroLogoGlow {
          0%, 100% {
            opacity: 0.62;
            transform: translateZ(-40px) scale(0.98);
          }
          50% {
            opacity: 0.95;
            transform: translateZ(-40px) scale(1.06);
          }
        }
        @keyframes heroLogoShine {
          0%, 54% {
            transform: translateX(-125%) skewX(-14deg);
          }
          74%, 100% {
            transform: translateX(135%) skewX(-14deg);
          }
        }
        @keyframes heroOrbitDrift {
          0%, 100% {
            transform: rotate(-6deg) scale(1);
          }
          50% {
            transform: rotate(-1deg) scale(1.025);
          }
        }
        @keyframes heroOrbitDriftAlt {
          0%, 100% {
            transform: rotate(8deg) scale(1);
          }
          50% {
            transform: rotate(3deg) scale(1.035);
          }
        }
        @media (max-width: 480px) {
          .hero-logo-motion {
            padding: 16px;
            border-radius: 28px;
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.025)),
              rgba(16, 17, 60, 0.86);
            border: 1px solid rgba(148, 163, 255, 0.2);
            box-shadow:
              0 22px 60px rgba(0, 0, 0, 0.38),
              0 0 0 1px rgba(236, 72, 153, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            animation:
              heroLogoEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) both,
              heroLogoFloat 7s ease-in-out 0.9s infinite;
          }
          .hero-logo-motion::after,
          .hero-logo-glow,
          .hero-logo-orbit {
            display: none;
          }
          .hero-mobile-logo-card {
            display: block;
            position: absolute;
            inset: 16px 16px auto 16px;
            height: calc(100% - 98px);
            min-height: 222px;
            border-radius: 22px;
            background: #10143c;
            border: 1px solid rgba(148, 163, 255, 0.08);
            pointer-events: none;
            z-index: 1;
          }
          .hero-mobile-logo-badge {
            position: absolute;
            top: 16px;
            left: 16px;
            display: inline-flex;
            align-items: center;
            min-height: 24px;
            padding: 4px 12px;
            border-radius: 999px;
            color: #ff5bbd;
            background: rgba(6, 8, 31, 0.72);
            border: 1px solid rgba(255, 91, 189, 0.42);
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.04em;
          }
          .hero-logo-image {
            display: block;
            width: min(72%, 218px) !important;
            margin: 28px auto 28px !important;
            border-radius: 0 !important;
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;
            filter: drop-shadow(0 16px 22px rgba(0, 0, 0, 0.38)) !important;
          }
          .hero-mobile-stats {
            position: relative;
            z-index: 12;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            overflow: hidden;
            border-radius: 18px;
            border: 1px solid rgba(148, 163, 255, 0.24);
            background: rgba(11, 14, 48, 0.76);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }
          .hero-mobile-stats div {
            min-height: 68px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
          }
          .hero-mobile-stats div + div {
            border-left: 1px solid rgba(148, 163, 255, 0.18);
          }
          .hero-mobile-stats strong {
            color: #ff4fb6;
            font-size: 1.18rem;
            line-height: 1;
            font-weight: 950;
          }
          .hero-mobile-stats span {
            color: rgba(255, 255, 255, 0.74);
            font-size: 10px;
            font-weight: 800;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-logo-motion,
          .hero-logo-motion::after,
          .hero-logo-glow,
          .hero-logo-orbit {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
