import PartnersPage from '@/components/PartnersPage'
import ContactSection from '@/components/ContactSection'

export const metadata = {
  title: 'Layanan — JBJean',
  description: 'Daftar partner terpercaya dan layanan resmi JBJean.',
}

export default function Layanan() {
  return (
    <>
      <PartnersPage />
      <ContactSection />
    </>
  )
}
