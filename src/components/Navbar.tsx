"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [visible, setVisible] = useState(true)
  const [navHovered, setNavHovered] = useState(false)

  useEffect(() => {
    let currentLastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)

      // On mobile viewports, keep it sticky (always visible) so it follows the scroll
      if (window.innerWidth < 768) {
        setVisible(true)
        currentLastScrollY = currentScrollY
        return
      }

      // If mouse is hovered, keep it visible
      if (navHovered) {
        setVisible(true)
        currentLastScrollY = currentScrollY
        return
      }

      // Scroll logic: scroll down hides, scroll up shows
      if (currentScrollY > currentLastScrollY && currentScrollY > 80) {
        setVisible(false) // auto-hide
      } else {
        setVisible(true)  // auto-show
      }
      currentLastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Sync theme on mount
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode')
      } else {
        document.documentElement.classList.remove('light-mode')
      }
    } else {
      localStorage.setItem('theme', 'dark')
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [navHovered])

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
        transform: visible ? 'translateY(0)' : 'translateY(-150%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: scrolled ? '8px 12px' : '12px 16px',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: scrolled ? '0 16px' : '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled
            ? 'var(--bg-navbar-pill, rgba(7, 1, 15, 0.96))'
            : 'var(--bg-navbar-pill, rgba(12, 4, 28, 0.85))',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '999px',
          border: '1px solid var(--border-navbar-pill, rgba(147, 51, 234, 0.25))',
          boxShadow: scrolled
            ? '0 10px 30px rgba(0, 0, 0, 0.6)'
            : 'var(--box-shadow-navbar-pill, 0 4px 20px rgba(0, 0, 0, 0.3))',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          width: '100%',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
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
              background: 'rgba(12,4,20,0.6)',
              border: '1px solid rgba(147, 51, 234, 0.35)',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Floating card card style right below the pill) */}
      {open && (
        <div
          className="md:hidden flex flex-col"
          style={{
            position: 'absolute',
            top: scrolled ? '70px' : '76px',
            left: '16px',
            right: '16px',
            padding: '16px',
            gap: '8px',
            borderRadius: '20px',
            border: '1px solid var(--border-navbar-pill, rgba(147, 51, 234, 0.25))',
            background: 'var(--bg-navbar-pill, rgba(7, 1, 15, 0.98))',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            transition: 'all 0.3s ease',
          }}
        >
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith('#')
            const isActive = isAnchor ? false : pathname === link.href

            if (isAnchor) {
              return (
                <button
                  key={link.href}
                  onClick={() => { setOpen(false); scrollToKontak() }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    color: 'rgba(255,255,255,0.65)',
                    background: 'transparent',
                    border: 'none',
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
                onClick={() => setOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  ...(isActive
                    ? { background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff' }
                    : { color: 'rgba(255,255,255,0.65)' }),
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/produk"
            onClick={() => setOpen(false)}
            style={{
              marginTop: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '12px',
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
    </header>
  )
}
