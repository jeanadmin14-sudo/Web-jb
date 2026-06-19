"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react'

type LocalAdmin = {
  username: string
  password?: string
  passwordHash?: string
}

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
      window.setTimeout(() => {
        setUsername(savedUser)
        setRememberMe(true)
      }, 0)
    }
  }, [router])

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(() => router.prefetch('/admin'), {
        timeout: 1200,
      })
      return () => idleWindow.cancelIdleCallback?.(idleId)
    }

    const timeout = window.setTimeout(() => router.prefetch('/admin'), 500)
    return () => window.clearTimeout(timeout)
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Always try server-side auth first. If DATABASE_URL is configured on hosting,
      // this returns a shared server session token for admin API writes.
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
    } catch {
      // Fallback local localStorage authentication check for offline/local demo mode.
      const localAdminsStr = localStorage.getItem('jbjean_admins')
      const localAdmins: LocalAdmin[] = localAdminsStr
        ? JSON.parse(localAdminsStr)
        : [{ username: 'admin', passwordHash: 'admin123' }]

      const admin = localAdmins.find(
        (a) =>
          a.username === username.trim() &&
          (a.passwordHash === password || a.password === password)
      )

      if (admin) {
        localStorage.setItem('jbjean_session', admin.username)
        localStorage.setItem('jbjean_session_token', 'local-mock-token')
        if (rememberMe) {
          localStorage.setItem('jbjean_remembered_user', admin.username)
        } else {
          localStorage.removeItem('jbjean_remembered_user')
        }
        router.push('/admin')
      } else {
        setError('Username atau password salah.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-visual" aria-hidden="true">
        <div className="login-visual-card">
          <Image src="/Logo.jpeg" alt="" width={220} height={220} />
        </div>
        <div className="login-visual-copy">
          <span>Admin Area</span>
          <h2>Kelola katalog JBJean dengan tampilan yang bersih dan cepat.</h2>
          <p>Dashboard untuk produk, rental, dan layanan partner.</p>
        </div>
      </div>

      <section className="login-panel" aria-labelledby="login-title">
        <Link href="/" className="login-back">
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>

        <div className="login-brand">
          <div className="login-logo">
            <Image src="/Logo.jpeg" alt="JBJean" width={52} height={52} />
          </div>
          <div>
            <p className="login-eyebrow">
              <ShieldCheck size={14} />
              Secure Dashboard
            </p>
            <h1 id="login-title">
              JB<span>Jean</span> Dashboard
            </h1>
            <p>Masuk untuk mengelola produk dan layanan.</p>
          </div>
        </div>

        {error && <div className="login-alert">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <label className="login-field">
            <span>Username</span>
            <div className="login-input-wrap">
              <User size={18} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="login-input-wrap">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="login-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Ingat saya di perangkat ini</span>
          </label>

          <button type="submit" disabled={loading} className="login-submit">
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>
      </section>
    </div>
  )
}
