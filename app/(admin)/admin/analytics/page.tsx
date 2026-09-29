export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { BarChart3, ArrowRight } from 'lucide-react'

export default async function AdminAnalyticsHubPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    redirect('/')
  }

  const service = createServiceClient()

  interface PackageItem {
    id: string
    name: string
    category: string
    total_questions: number
    duration_minutes: number
    is_published: boolean
    is_free: boolean
    slug: string
  }

  // Ambil semua paket yang ada
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkgs } = await (service.from('packages') as any)
    .select('id, name, category, total_questions, duration_minutes, is_published, is_free, slug')
    .order('created_at', { ascending: false })

  const allPackages = (pkgs ?? []) as PackageItem[]

  // Hitung jumlah attempt per paket
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: attemptsData } = await (service.from('attempts') as any)
    .select('package_id, score, status, attempt_number')
    .eq('status', 'finished')

  const attemptsByPackage: Record<string, { total: number; firstScores: number[] }> = {}
  for (const a of (attemptsData ?? []) as { package_id: string; score: number | null; attempt_number?: number }[]) {
    if (!attemptsByPackage[a.package_id]) {
      attemptsByPackage[a.package_id] = { total: 0, firstScores: [] }
    }
    attemptsByPackage[a.package_id].total++
    if ((a.attempt_number === 1 || !a.attempt_number) && a.score !== null && a.score > 0) {
      attemptsByPackage[a.package_id].firstScores.push(a.score)
    }
  }

  // Filter Kategori jika dipilih
  const selectedCategory = category && category !== 'all' ? category.toUpperCase() : 'ALL'
  const filteredPackages = selectedCategory === 'ALL'
    ? allPackages
    : allPackages.filter((p) => p.category === selectedCategory)

  const categories = ['ALL', ...Array.from(new Set(allPackages.map((p) => p.category))).sort()]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Item Response &amp; Psychometrics
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analitik Paket &amp; Kesukaran Soal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih paket soal untuk melihat sebaran nilai peserta, butir soal yang terlalu mudah (&gt;85%), atau butir soal yang terlalu sulit (&lt;30%).
          </p>
        </div>
      </div>

      {/* Filter Kategori Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/admin/analytics?category=${cat.toLowerCase()}`}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'Semua Kategori' : cat}
          </Link>
        ))}
      </div>

      {/* Daftar Paket */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.map((pkg) => {
          const stats = attemptsByPackage[pkg.id] ?? { total: 0, firstScores: [] }
          const avgFirst =
            stats.firstScores.length > 0
              ? Math.round(
                  (stats.firstScores.reduce((a, b) => a + b, 0) / stats.firstScores.length) * 10
                ) / 10
              : null

          let avgBadge = <span className="text-slate-400 text-xs">Belum ada data</span>
          if (avgFirst !== null) {
            if (avgFirst >= 85) {
              avgBadge = (
                <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                  Rata-rata: {avgFirst} (Terlalu Mudah)
                </span>
              )
            } else if (avgFirst < 50) {
              avgBadge = (
                <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold">
                  Rata-rata: {avgFirst} (Cukup Sulit)
                </span>
              )
            } else {
              avgBadge = (
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                  Rata-rata: {avgFirst} (Ideal)
                </span>
              )
            }
          }

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    {pkg.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {pkg.total_questions} Soal · {pkg.duration_minutes} Mnt
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {pkg.name}
                </h3>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Selesai Dikerjakan:</span>
                    <strong className="text-slate-900 font-mono">{stats.total} sesi</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Skor Percobaan 1:</span>
                    {avgBadge}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <Link
                  href={`/admin/packages/${pkg.id}/analytics`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition shadow-xs"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Buka Analisis Soal &amp; Sebaran Nilai
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        })}

        {filteredPackages.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Tidak ada paket soal di kategori ini.
          </div>
        )}
      </div>
    </div>
  )
}
