import Link from 'next/link'
import { Briefcase, Package, History } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import AstraPackageCard from '@/components/portal/AstraPackageCard'
import PortalLoginCard from '@/components/portal/PortalLoginCard'
import { getUnlockedPackageIds } from '@/lib/access'
import { ASTRA_SUBTESTS } from '@/lib/exam-scoring'

export default async function AstraPortalPage() {
  let packages: PackageRow[] = []
  let isLoggedIn = false
  let unlockedPackageIds: string[] = []
  let recentAttempts: Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user

    const { data: pkgData } = await supabase
      .from('packages')
      .select('*')
      .eq('category', 'ASTRA')
      .eq('is_published', true)
      .order('is_free', { ascending: false })
      .order('created_at', { ascending: true })
    packages = (pkgData ?? []) as PackageRow[]

    if (user) {
      unlockedPackageIds = await getUnlockedPackageIds(user.id)

      const astraPkgIds = packages.map((p) => p.id)
      if (astraPkgIds.length > 0) {
        const { data: attemptsData } = await supabase
          .from('attempts')
          .select('id, score, started_at, package_id')
          .eq('user_id', user.id)
          .eq('status', 'finished')
          .in('package_id', astraPkgIds)
          .order('started_at', { ascending: false })
          .limit(5)
        recentAttempts = (attemptsData ?? []) as Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[]
      }
    }
  } catch { /* Supabase not configured */ }

  const packageNameMap = Object.fromEntries(packages.map((p) => [p.id, p.name]))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-5">
        <Link href="/" className="hover:text-orange-600 transition-colors">Beranda</Link>
        <span>›</span>
        <span className="text-gray-900 font-semibold">Portal ASTRA</span>
      </nav>

      {/* Page header */}
      <div className="flex items-center gap-4 mb-7">
        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-gray-900">Portal ASTRA</h1>
            <span className="px-2.5 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">Psikotes</span>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">Simulasi Tes Psikologi Rekrutmen PT Astra International · 80 soal · 7 sub-tes</p>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_272px] gap-6 items-start">

        {/* ══ LEFT SIDEBAR ══ */}
        <aside className="space-y-4 sticky top-6">

          {/* Sub-tes overview */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500">
              <p className="text-xs font-bold text-white uppercase tracking-widest">Sub-tes Psikotes ASTRA</p>
            </div>
            <div className="p-3 space-y-1.5">
              {Object.entries(ASTRA_SUBTESTS).map(([key, sub]) => (
                <div key={key} className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors">
                  <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 min-w-[36px] text-center">
                    {key}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{sub.full}</p>
                    <p className="text-[10px] text-gray-400">{sub.soal} soal · {sub.minutes} mnt</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Riwayat */}
          {isLoggedIn && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Riwayat ASTRA</p>
              </div>
              {recentAttempts.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-400">Belum ada simulasi</p>
                  <p className="text-[10px] text-gray-300 mt-1">Mulai ujian pertamamu!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentAttempts.map((a) => (
                    <Link key={a.id} href={`/hasil/${a.id}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-gray-700 truncate">
                          {packageNameMap[a.package_id] ?? 'Paket ASTRA'}
                        </p>
                        <p className="text-[10px] text-gray-400">{formatDate(a.started_at)}</p>
                      </div>
                      <span className="text-sm font-extrabold ml-2 shrink-0 text-orange-600">
                        {a.score ?? '–'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Login card (guest) */}
          {!isLoggedIn && <PortalLoginCard />}
        </aside>

        {/* ══ MAIN CONTENT ══ */}
        <main className="space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-gray-900">Paket Simulasi Psikotes</h2>
              <p className="text-xs text-gray-400 mt-0.5">{packages.length} paket tersedia</p>
            </div>
          </div>

          {packages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400">
              <div className="flex justify-center mb-3"><Package className="w-10 h-10 text-gray-300" /></div>
              <p className="font-medium">Belum ada paket soal tersedia</p>
              <p className="text-sm mt-1 text-gray-300">Pantau terus untuk update paket baru</p>
            </div>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg, i) => (
                <AstraPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isLoggedIn={isLoggedIn}
                  isUnlocked={unlockedPackageIds.includes(pkg.id)}
                  index={i}
                />
              ))}
            </div>
          )}
        </main>

        {/* ══ RIGHT SIDEBAR ══ */}
        <aside className="space-y-4 sticky top-6">

          {/* Sistem penilaian */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500">
              <p className="text-xs font-bold text-white uppercase tracking-widest">Sistem Penilaian</p>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="bg-orange-50 rounded-xl p-3 space-y-1.5">
                <p className="font-bold text-orange-700 text-[11px] uppercase tracking-wide mb-2">Semua Sub-tes</p>
                <div className="flex justify-between"><span className="text-gray-600">Benar</span><span className="font-bold text-green-600">+1</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Salah</span><span className="font-bold text-gray-400">0</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tidak dijawab</span><span className="font-bold text-gray-400">0</span></div>
                <div className="mt-1.5 pt-1.5 border-t border-orange-100">
                  <p className="text-[10px] text-orange-600 font-semibold">Tidak ada penalti — jawab semua soal!</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-gray-600 text-[11px] uppercase tracking-wide mb-1.5">Skor Total</p>
                <p className="text-2xl font-extrabold text-gray-900">80</p>
                <p className="text-[10px] text-gray-400">poin maksimum</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tips Sukses</p>
            <div className="space-y-2.5 text-xs text-gray-600">
              {[
                { icon: '⚡', text: 'Perceptual Speed: 30 soal dalam 2 menit — latih kecepatan membaca karakter' },
                { icon: '🧠', text: 'Working Memory: latih hafalan pasangan kata-angka sebelum tes' },
                { icon: '📐', text: 'Visualization & Inductive: pelajari pola rotasi dan jaring-jaring kubus' },
                { icon: '📖', text: 'Reading Comprehension: baca teks sekali dengan fokus, jawab tanpa kembali' },
              ].map((tip) => (
                <div key={tip.text} className="flex items-start gap-2">
                  <span className="shrink-0 text-sm">{tip.icon}</span>
                  <p className="leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
