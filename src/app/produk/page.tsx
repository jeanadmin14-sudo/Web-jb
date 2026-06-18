import ProductsPage from '@/components/ProductsPage'
import ContactSection from '@/components/ContactSection'

export const metadata = {
  title: 'Produk — JBJean',
  description: 'Stock dan rental akun game tersedia.',
}

export default function Produk() {
  return (
    <>
      <ProductsPage />
      <ContactSection />
    </>
  )
}
