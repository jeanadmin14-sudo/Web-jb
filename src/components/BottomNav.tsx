"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Package, Briefcase, Send } from 'lucide-react'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/produk', label: 'Produk', icon: Package },
  { href: '/layanan', label: 'Layanan', icon: Briefcase },
  { href: '/#kontak', label: 'Kontak', icon: Send },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav
      className="bottom-nav"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: 'none',
        background: 'rgba(7, 1, 15, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(147,51,234,0.22)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => {
          const isKontak = item.href === '/#kontak'
          const isActive = isKontak ? false : pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (isKontak && pathname === '/') {
                  e.preventDefault()
                  document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                } else if (isKontak) {
                  e.preventDefault()
                  router.push('/#kontak')
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '9px 4px 8px',
                textDecoration: 'none',
                color: isActive ? '#c084fc' : 'rgba(255,255,255,0.5)',
                transition: 'color 0.2s ease',
              }}
            >
              <Icon
                style={{
                  width: '20px',
                  height: '20px',
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(168,85,247,0.7))' : 'none',
                }}
              />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 800 : 600 }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .bottom-nav {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  )
}
