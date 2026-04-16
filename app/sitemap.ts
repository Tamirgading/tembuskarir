import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tembuskarir.id'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/paket`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/harga`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Dynamic: published packages leaderboard pages
  let packagePages: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('packages')
      .select('id, created_at')
      .eq('is_published', true)

    const packages = (data ?? []) as Pick<PackageRow, 'id' | 'created_at'>[]
    packagePages = packages.map((pkg) => ({
      url: `${baseUrl}/paket/${pkg.id}/leaderboard`,
      lastModified: new Date(pkg.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch {
    // Supabase mungkin tidak tersedia saat build
  }

  return [...staticPages, ...packagePages]
}
