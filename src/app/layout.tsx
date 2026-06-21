import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jbjean.com'),
  applicationName: 'JBJean',
  title: {
    default: 'JBJean - Premium Game & Account Marketplace Bogor, Cibinong & Cilebut',
    template: '%s | JBJean',
  },
  description:
    'JBJean adalah marketplace akun game premium terpercaya di Bogor, Cibinong, dan Cilebut. Layanan rental akun FF dan MLBB harian, rekber aman, dan jasa paid promote bergaransi resmi.',
  keywords: [
    'JBJean',
    'JBJean Bogor',
    'Marketplace Akun Game Bogor',
    'Jual Akun Game Cibinong',
    'Rental Akun FF Cibinong',
    'Rental Akun ML Cilebut',
    'Rekber Game Terpercaya Bogor',
    'Toko Akun MLBB Bogor',
    'Paid Promote Game Bogor',
    'Jasa Post Game Cibinong',
    'jbjean.com',
  ],
  authors: [{ name: 'JBJean' }],
  creator: 'JBJean',
  publisher: 'JBJean',
  verification: {
    google: '1HymgdCnuYLnmPmXD_oXWxWOY5wmCrV-s3YzPMKb970',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'JBJean - Premium Game Marketplace Bogor, Cibinong & Cilebut',
    description: 'Toko akun game premium, rental akun, dan layanan partner terpercaya di Bogor, Cibinong, dan Cilebut.',
    url: 'https://www.jbjean.com',
    siteName: 'JBJean',
    images: [
      {
        url: '/Logo.jpeg',
        width: 1200,
        height: 1200,
        alt: 'Logo JBJean',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JBJean - Premium Game Marketplace',
    description: 'Marketplace akun game premium, rental akun, rekber, dan layanan partner terpercaya.',
    images: ['/Logo.jpeg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/Logo.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        style={{ backgroundColor: '#07010f', color: '#fff' }}
      >
        {children}
      </body>
    </html>
  )
}
