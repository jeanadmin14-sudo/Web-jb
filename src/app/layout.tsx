import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppShell from '@/components/AppShell'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JBJean — Premium Game & Account Marketplace Bogor, Cibinong & Cilebut',
  description:
    'JBJean (Jean Store Official) adalah marketplace akun game premium terpercaya di Bogor, Cibinong, dan Cilebut. Layanan rental akun FF & MLBB harian, Rekber aman, dan jasa paid promote bergaransi resmi.',
  keywords: [
    'JBJean',
    'Jean Store Bogor',
    'Marketplace Akun Game Bogor',
    'Jual Akun Game Cibinong',
    'Rental Akun FF Cibinong',
    'Rental Akun ML Cilebut',
    'Rekber Game Terpercaya Bogor',
    'Toko Akun MLBB Bogor',
    'Paid Promote Game Bogor',
    'Jasa Post Game Cibinong'
  ],
  openGraph: {
    title: 'JBJean — Premium Game Marketplace Bogor, Cibinong & Cilebut',
    description: 'Toko akun game premium, rental akun, dan layanan partner terpercaya di Bogor, Cibinong, dan Cilebut.',
    url: 'https://jbjean.vercel.app',
    siteName: 'JBJean Store',
    locale: 'id_ID',
    type: 'website',
  }
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
