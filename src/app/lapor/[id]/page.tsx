import LaporDetailContent from '@/components/LaporDetailContent'
import ContactSection from '@/components/ContactSection'

export const metadata = {
  title: 'Detail Lapor — JBJean',
  description: 'Informasi detail laporan penipuan atau pengguna bermasalah.',
}

export default function LaporDetailPage() {
  return (
    <>
      <LaporDetailContent />
      <ContactSection />
    </>
  )
}
