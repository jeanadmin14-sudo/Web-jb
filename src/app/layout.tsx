import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JBJean — Premium Game Marketplace',
  description:
    'Stock Free Fire, Mobile Legends, rental akun, dan layanan partner dalam satu pengalaman web yang cepat, jelas, dan aman.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='id' suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        style={{ backgroundColor: '#07010f', color: '#fff' }}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
