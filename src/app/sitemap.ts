import type { MetadataRoute } from 'next'

const siteUrl = 'https://www.jbjean.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/produk`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/layanan`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
