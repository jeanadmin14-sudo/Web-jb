"use client"

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')

  if (isLogin || isAdmin) {
    return <main>{children}</main>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
