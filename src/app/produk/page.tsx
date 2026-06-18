import type { Metadata } from 'next'
import ProductsPage from '@/components/ProductsPage'
import ContactSection from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Produk',
  description: 'Stock dan rental akun game premium JBJean untuk Free Fire, Mobile Legends, dan layanan game lainnya.',
  alternates: {
    canonical: '/produk',
  },
  openGraph: {
    title: 'Produk JBJean',
    description: 'Stock dan rental akun game premium JBJean.',
    url: '/produk',
  },
}

export default function Produk() {
  return (
    <>
      <ProductsPage />
      <ContactSection />
    </>
  )
}
