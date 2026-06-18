"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react'


export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const session = localStorage.getItem('jbjean_session')
    if (session) {
      router.push('/admin')
    }
    
    // Check saved remember me
    const savedUser = localStorage.getItem('jbjean_remembered_user')
    if (savedUser) {
      setUsername(savedUser)
      setRememberMe(true)
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (res.ok) {
        const data = await res.json()
        // Logged in successfully
        localStorage.setItem('jbjean_session', data.username)
        localStorage.setItem('jbjean_session_token', data.token)
        if (rememberMe) {
          localStorage.setItem('jbjean_remembered_user', data.username)
        } else {
          localStorage.removeItem('jbjean_remembered_user')
        }
        router.push('/admin')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Username atau password salah.')
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(88,28,220,0.2) 0%, transparent 70%), #07010f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background neon blobs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(15, 6, 32, 0.75)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '28px',
          padding: '40px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(147, 51, 234, 0.1)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.45)',
            textDecoration: 'none',
            marginBottom: '28px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)' }}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          Kembali ke Beranda
        </Link>

        {/* Brand/Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
              border: '1px solid rgba(168,85,247,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: '16px',
              boxShadow: '0 0 20px rgba(147,51,234,0.4)',
            }}
          >
            <Image
              src="/Logo.jpeg"
              alt="JBJean"
              width={48}
              height={48}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            JB<span style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Jean</span> Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
            Masuk untuk mengelola produk & layanan
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>USERNAME</label>
            <div style={{ position: 'relative' }}>
              <User
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: 'rgba(168, 85, 247, 0.5)',
                }}
              />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                style={{
                  padding: '12px 16px 12px 42px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  color: '#fff',
                  outline: 'none',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(147,51,234,0.18)',
                  width: '100%',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.5)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.18)' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <Lock
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: 'rgba(168, 85, 247, 0.5)',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                style={{
                  padding: '12px 42px 12px 42px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  color: '#fff',
                  outline: 'none',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(147,51,234,0.18)',
                  width: '100%',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.5)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.18)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(168, 85, 247, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: '#a855f7',
                cursor: 'pointer',
                width: '15px',
                height: '15px',
              }}
            />
            <label htmlFor="remember" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', userSelect: 'none' }}>
              Ingatkan Saya
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 800,
              color: '#fff',
              background: 'linear-gradient(135deg, #ec4899, #a855f7)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
              transition: 'all 0.2s',
              marginTop: '10px',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.5)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
