import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/profil', '/ujian/', '/hasil/'],
      },
    ],
    sitemap: 'https://tembuskarir.id/sitemap.xml',
  }
}
