import type { Metadata } from 'next'
import PartnersPage from '@/components/PartnersPage'
import ContactSection from '@/components/ContactSection'
import { getServerPartners } from '@/lib/server-data'

export const revalidate = 3600
export const preferredRegion = 'sin1'

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

export default async function Layanan() {
  const partners = await getServerPartners()

  return (
    <>
      <PartnersPage initialPartners={partners ?? undefined} />
      <ContactSection />
    </>
  )
}
