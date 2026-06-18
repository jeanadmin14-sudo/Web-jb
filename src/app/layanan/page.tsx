import type { Metadata } from 'next'
import PartnersPage from '@/components/PartnersPage'
import ContactSection from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Layanan',
  description: 'Daftar partner terpercaya, rekber, paid promote, dan layanan resmi JBJean.',
  alternates: {
    canonical: '/layanan',
  },
  openGraph: {
    title: 'Layanan JBJean',
    description: 'Partner terpercaya, rekber, paid promote, dan layanan resmi JBJean.',
    url: '/layanan',
  },
}

export default function Layanan() {
  return (
    <>
      <PartnersPage />
      <ContactSection />
    </>
  )
}
