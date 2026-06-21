import type { Metadata } from 'next'
import ProductsPage from '@/components/ProductsPage'
import ContactSection from '@/components/ContactSection'
import { getServerProducts } from '@/lib/server-data'

export const revalidate = 300
export const preferredRegion = 'sin1'

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

export default async function Produk() {
  const products = await getServerProducts()

  return (
    <>
      <ProductsPage initialProducts={products ?? undefined} />
      <ContactSection />
    </>
  )
}
