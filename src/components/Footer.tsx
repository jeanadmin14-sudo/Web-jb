"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Crown } from 'lucide-react'
import { getSettings, DEFAULT_SETTINGS, type SiteSettings } from '@/lib/storage'

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  return (
    <footer
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(4, 0, 10, 0.98)',
        borderTop: '1px solid rgba(147,51,234,0.2)',
      }}
    >
      {/* Top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '100px',
          background: 'radial-gradient(ellipse, rgba(147,51,234,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '56px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                  border: '1px solid rgba(168,85,247,0.4)',
                  boxShadow: '0 0 16px rgba(147,51,234,0.4)',
                }}
              >
                <Image
                  src="/Logo.jpeg"
                  alt="JBJean"
                  width={36}
                  height={36}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
              <div>
                <p style={{ fontWeight: 900, color: '#fff', fontSize: '16px', lineHeight: 1 }}>
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
                </p>
                <p
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                    color: 'rgba(168,85,247,0.5)',
                  }}
                >
                  Premium Marketplace
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.75 }}>
              Platform jual beli akun game premium terpercaya. Stock Free Fire,
              Mobile Legends, dan layanan partner resmi.
            </p>

            {/* Feature tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {[
                { label: 'Cepat', color: '#eab308' },
                { label: '100% Aman', color: '#ec4899' },
                { label: '24/7', color: '#06b6d4' },
              ].map((f) => (
                <span
                  key={f.label}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: `${f.color}12`,
                    border: `1px solid ${f.color}30`,
                    color: f.color,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: f.color,
                    }}
                  />
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>

            <div>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  marginBottom: '16px',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Sosial Media
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <li>
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgba(255,255,255,0.35)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ec4899' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={settings.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgba(255,255,255,0.35)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ec4899' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                    </svg>
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href={settings.wa_channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgba(255,255,255,0.35)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ec4899' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    Saluran WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: '48px',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '12px',
            borderTop: '1px solid rgba(147,51,234,0.12)',
            color: 'rgba(255,255,255,0.2)',
            flexWrap: 'wrap',
          }}
        >
    <p>&copy; 2026 OzinVoidWalker. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Crown style={{ width: '12px', height: '12px', color: 'rgba(234,179,8,0.4)' }} />
            <span>Premium Game Marketplace</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
