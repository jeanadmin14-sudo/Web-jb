import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import ContactSection from '@/components/ContactSection'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.jbjean.com/#organization',
      name: 'JBJean',
      url: 'https://www.jbjean.com',
      logo: 'https://www.jbjean.com/Logo.jpeg',
      areaServed: ['Bogor', 'Cibinong', 'Cilebut', 'Indonesia'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.jbjean.com/#website',
      url: 'https://www.jbjean.com',
      name: 'JBJean',
      publisher: {
        '@id': 'https://www.jbjean.com/#organization',
      },
      inLanguage: 'id-ID',
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <FeaturedProducts />
      <ContactSection />
    </>
  )
}
