import type { Metadata } from 'next'
import LaporContent from '@/components/LaporContent'
import ContactSection from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Lapor',
  description: 'Laporkan penipuan, suspect ID game, atau nomor WhatsApp bermasalah melalui halaman laporan publik JBJean.',
  alternates: {
    canonical: '/lapor',
  },
  openGraph: {
    title: 'Lapor JBJean',
    description: 'Laporkan penipuan, suspect ID game, atau nomor WhatsApp bermasalah.',
    url: '/lapor',
  },
}

export default function Lapor() {
  return (
    <>
      <LaporContent />
      <ContactSection />
    </>
  )
}
