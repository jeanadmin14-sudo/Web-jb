"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Moon, Sun, Zap } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/produk', label: 'Produk' },
  { href: '/layanan', label: 'Layanan' },
  { href: '#kontak', label: 'Kontak' },
]

function scrollToKontak() {
  const el = document.getElementById('kontak')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [visible, setVisible] = useState(true)
  const [navHovered, setNavHovered] = useState(false)
  const lastScrollY = useRef(0)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)

      if (window.innerWidth < 768) {
        if (open) {
          setVisible(true)
          lastScrollY.current = currentScrollY
          return
        }

        if (currentScrollY <= 24 || currentScrollY < lastScrollY.current) {
          setVisible(true)
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 96) {
          setVisible(false)
        }

        lastScrollY.current = currentScrollY
        return
      }

      // If mouse is hovered, keep it visible
      if (navHovered) {
        setVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      // Scroll logic: scroll down hides, scroll up shows
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setVisible(false) // auto-hide
      } else {
        setVisible(true)  // auto-show
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [navHovered, open])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      window.setTimeout(() => setTheme(savedTheme), 0)
      document.documentElement.classList.toggle('light-mode', savedTheme === 'light')
    } else {
      localStorage.setItem('theme', 'dark')
    }
  }, [])

  useEffect(() => {
    const prefetchRoutes = () => {
      router.prefetch('/')
      router.prefetch('/produk')
      router.prefetch('/layanan')
      router.prefetch('/login')
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(prefetchRoutes, { timeout: 1500 })
      return () => idleWindow.cancelIdleCallback?.(idleId)
    }

    const timeout = globalThis.setTimeout(prefetchRoutes, 700)
    return () => globalThis.clearTimeout(timeout)
  }, [router])

  const prefetchRoute = (href: string) => {
    if (!href.startsWith('#')) {
      router.prefetch(href)
    }
  }

  useEffect(() => {
    if (open) {
      const showTimer = window.setTimeout(() => setVisible(true), 0)
      if (hideTimer.current) {
        clearTimeout(hideTimer.current)
      }
      return () => clearTimeout(showTimer)
    }

    if (window.innerWidth < 768 && window.scrollY > 96) {
      hideTimer.current = setTimeout(() => setVisible(false), 1400)
    }

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current)
      }
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (closeMenuTimer.current) {
        clearTimeout(closeMenuTimer.current)
      }
    }
  }, [])

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-mode')
    } else {
      document.documentElement.classList.remove('light-mode')
    }
  }

  const closeMenu = () => {
    if (!open || menuClosing) return

    setMenuClosing(true)
    if (closeMenuTimer.current) {
      clearTimeout(closeMenuTimer.current)
    }
    closeMenuTimer.current = setTimeout(() => {
      setOpen(false)
      setMenuMounted(false)
      setMenuClosing(false)
    }, 240)
  }

  const handleToggleMenu = () => {
    setVisible(true)

    if (open) {
      closeMenu()
      return
    }

    if (closeMenuTimer.current) {
      clearTimeout(closeMenuTimer.current)
    }
    setMenuMounted(true)
    setMenuClosing(false)
    setOpen(true)
  }

  return (
    <header
      onMouseEnter={() => setNavHovered(true)}
      onMouseLeave={() => setNavHovered(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: open ? 'none' : visible ? 'translateY(0)' : 'translateY(-150%)',
        transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), padding 0.25s ease',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: scrolled ? '8px 12px' : '12px 16px',
        width: '100%',
      }}
    >
      <div
        className="navbar-pill"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: scrolled ? '0 16px' : '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled
            ? 'linear-gradient(135deg, rgba(8, 3, 18, 0.98), rgba(20, 8, 38, 0.96))'
            : 'linear-gradient(135deg, rgba(10, 4, 24, 0.96), rgba(26, 9, 48, 0.92))',
          backdropFilter: 'blur(30px) saturate(1.45)',
          WebkitBackdropFilter: 'blur(30px) saturate(1.45)',
          borderRadius: open ? '22px' : '999px',
          border: open
            ? '1px solid rgba(216, 180, 254, 0.32)'
            : '1px solid var(--border-navbar-pill, rgba(147, 51, 234, 0.25))',
          boxShadow: scrolled
            ? '0 14px 36px rgba(0, 0, 0, 0.66), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 10px 28px rgba(0, 0, 0, 0.46), inset 0 1px 0 rgba(255,255,255,0.08)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          width: '100%',
        }}
      >
        {/* Logo */}
        <Link href="/" prefetch onPointerEnter={() => prefetchRoute('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
              border: '1px solid rgba(168,85,247,0.4)',
              boxShadow: '0 0 12px rgba(147,51,234,0.4)',
            }}
          >
            <Image
              src="/Logo.jpeg"
              alt="JBJean"
              width={32}
              height={32}
              style={{ objectFit: 'cover', borderRadius: '6px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span
              style={{
                fontWeight: 900,
                fontSize: '14px',
                letterSpacing: '-0.02em',
                color: '#fff',
              }}
            >
              JB
              <span
                style={{
                  background: 'linear-gradient(90deg, #ec4899, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Jean
              </span>
            </span>
            <span
              style={{
                fontSize: '8px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'rgba(168,85,247,0.6)',
              }}
            >
              Premium Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            alignItems: 'center',
            padding: '3px',
            gap: '2px',
            borderRadius: '999px',
            background: 'rgba(12,4,20,0.8)',
            border: '1px solid rgba(147,51,234,0.18)',
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith('#')
            const isActive = isAnchor ? false : pathname === link.href

            if (isAnchor) {
              return (
                <button
                  key={link.href}
                  onClick={scrollToKontak}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    color: 'rgba(255,255,255,0.6)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(147,51,234,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {link.label}
                </button>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                onPointerEnter={() => prefetchRoute(link.href)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                        color: '#fff',
                        boxShadow: '0 0 12px rgba(236,72,153,0.5)',
                      }
                    : { color: 'rgba(255,255,255,0.6)' }),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(147,51,234,0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side Actions (Desktop) */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '10px' }}>
          {/* Dark mode toggle */}
          <button
            onClick={handleToggleTheme}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              background: 'rgba(12,4,20,0.8)',
              border: '1px solid rgba(147,51,234,0.2)',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)'
              ;(e.currentTarget as HTMLElement).style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(147,51,234,0.2)'
              ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
            }}
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? (
              <Moon style={{ width: '14px', height: '14px' }} />
            ) : (
              <Sun style={{ width: '14px', height: '14px', color: '#eab308' }} />
            )}
          </button>

          <Link
            href="/produk"
            prefetch
            onPointerEnter={() => prefetchRoute('/produk')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 700,
              transition: 'all 0.2s ease',
              background: 'linear-gradient(135deg, #ec4899, #a855f7)',
              color: '#fff',
              boxShadow: '0 0 12px rgba(236,72,153,0.4)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(236,72,153,0.65)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(236,72,153,0.4)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            Order
          </Link>
        </div>

        {/* Mobile Actions (Theme toggle + Hamburger menu in outline circles, side by side!) */}
        <div className="flex md:hidden" style={{ alignItems: 'center', gap: '8px' }}>
          {/* Mobile Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(12,4,20,0.6)',
              border: '1px solid rgba(147, 51, 234, 0.35)',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon style={{ width: '16px', height: '16px' }} />
            ) : (
              <Sun style={{ width: '16px', height: '16px', color: '#eab308' }} />
            )}
          </button>

          {/* Mobile Hamburger menu */}
          <button
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: open ? 'rgba(255,255,255,0.12)' : 'rgba(12,4,20,0.74)',
              border: '1px solid rgba(147, 51, 234, 0.35)',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={handleToggleMenu}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
          </button>
        </div>
      </div>

      {menuMounted && (
        <button
          className={`mobile-nav-scrim md:hidden ${menuClosing ? 'is-closing' : ''}`}
          aria-label="Tutup menu"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu (Floating card card style right below the pill) */}
      {menuMounted && (
        <div
          className={`mobile-nav-menu md:hidden flex flex-col ${menuClosing ? 'is-closing' : ''}`}
          style={{
            position: 'absolute',
            top: scrolled ? '70px' : '76px',
            left: '16px',
            right: '16px',
            height: 'auto',
            padding: '14px',
            gap: '8px',
            borderRadius: '22px',
            border: '1px solid rgba(216, 180, 254, 0.34)',
            background: 'linear-gradient(180deg, rgba(13, 6, 30, 0.985), rgba(7, 2, 18, 0.97))',
            backdropFilter: 'blur(34px) saturate(1.35)',
            WebkitBackdropFilter: 'blur(34px) saturate(1.35)',
            boxShadow: '0 26px 70px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.05) inset, inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith('#')
            const isActive = isAnchor ? false : pathname === link.href

            if (isAnchor) {
              return (
                <button
                  key={link.href}
                  onClick={() => { closeMenu(); scrollToKontak() }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    fontSize: '14px',
                    fontWeight: 700,
                    transition: 'all 0.2s',
                    color: 'rgba(255,255,255,0.84)',
                    background: 'rgba(255,255,255,0.055)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {link.label}
                </button>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                onPointerEnter={() => prefetchRoute(link.href)}
                onClick={closeMenu}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  fontSize: '14px',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg,#ec4899,#a855f7)',
                        color: '#fff',
                        boxShadow: '0 10px 24px rgba(236,72,153,0.28)',
                      }
                    : {
                        color: 'rgba(255,255,255,0.84)',
                        background: 'rgba(255,255,255,0.055)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }),
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/produk"
            prefetch
            onPointerEnter={() => prefetchRoute('/produk')}
            onClick={closeMenu}
            style={{
              marginTop: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg,#ec4899,#a855f7)',
              textDecoration: 'none',
            }}
          >
            <Zap style={{ width: '14px', height: '14px', color: '#eab308' }} />
            Order Sekarang
          </Link>
        </div>
      )}
      <style jsx>{`
        .mobile-nav-scrim {
          position: fixed;
          inset: 0;
          z-index: 1;
          border: 0;
          background:
            radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.16), transparent 36%),
            rgba(4, 1, 10, 0.48);
          backdrop-filter: blur(12px) saturate(1.18);
          -webkit-backdrop-filter: blur(12px) saturate(1.18);
          animation: navScrimIn 0.22s ease both;
        }

        .mobile-nav-scrim.is-closing {
          pointer-events: none;
          animation: navScrimOut 0.2s ease both;
        }

        .mobile-nav-menu a,
        .mobile-nav-menu button {
          min-height: 44px;
        }

        .navbar-pill {
          position: relative;
          z-index: 3;
        }

        .mobile-nav-menu {
          z-index: 4;
          overflow: hidden;
          height: auto !important;
          min-height: 0 !important;
          transform-origin: top center;
          animation: mobileMenuIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: opacity, transform, filter;
        }

        .mobile-nav-menu.is-closing {
          pointer-events: none;
          animation: mobileMenuOut 0.22s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .mobile-nav-menu::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.1), transparent 34%),
            rgba(7, 2, 18, 0.96);
        }

        .mobile-nav-menu::after {
          content: '';
          position: absolute;
          left: 14px;
          right: 14px;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.36), transparent);
          pointer-events: none;
        }

        @keyframes navScrimIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes navScrimOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes mobileMenuIn {
          from {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(-10px) scale(0.97);
          }
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes mobileMenuOut {
          from {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(-10px) scale(0.97);
          }
        }

        @media (max-width: 767px) {
          .navbar-pill {
            background: linear-gradient(135deg, rgba(8, 3, 18, 0.98), rgba(22, 8, 42, 0.96)) !important;
            border-color: rgba(216, 180, 254, 0.26) !important;
          }
          .mobile-nav-menu {
            left: 10px !important;
            right: 10px !important;
            height: auto !important;
            border-radius: 20px !important;
            padding: 12px !important;
            background: linear-gradient(180deg, rgba(13, 6, 30, 0.99), rgba(7, 2, 18, 0.98)) !important;
          }
          .mobile-nav-menu a,
          .mobile-nav-menu button {
            justify-content: flex-start !important;
          }
          .mobile-nav-menu a:last-child {
            justify-content: center !important;
          }
        }
      `}</style>
    </header>
  )
}
