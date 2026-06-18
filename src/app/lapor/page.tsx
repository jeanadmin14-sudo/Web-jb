import LaporContent from '@/components/LaporContent'
import ContactSection from '@/components/ContactSection'

export const metadata = {
  title: 'Lapor — JBJean',
  description: 'Laporkan penipuan, suspect ID game, atau nomor WhatsApp bermasalah.',
}

export default function Lapor() {
  return (
    <>
      <LaporContent />
      <ContactSection />
    </>
  )
}
