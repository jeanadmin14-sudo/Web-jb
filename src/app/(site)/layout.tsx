import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="site-shell-with-bottom-nav">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BottomNav />
      <style>{`
        @media (max-width: 768px) {
          .site-shell-with-bottom-nav {
            padding-bottom: 62px;
          }
        }
      `}</style>
    </div>
  )
}