import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow } from '@/lib/utils'
import CpnsPackageCard from '@/components/portal/CpnsPackageCard'

// Passing grade SKD resmi 2024
const PASSING_GRADE = { TWK: 65, TIU: 80, TKP: 166, total: 311 }

export default async function CpnsPortalPage() {
  let packages: PackageRow[] = []
  let isLoggedIn = false
  let userPlan: string = 'free'

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user

    if (user) {
      const { data: profileData } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single()
      userPlan = (profileData as { plan: string } | null)?.plan ?? 'free'
    }

    const { data: pkgData } = await supabase
      .from('packages')
      .select('*')
      .eq('category', 'CPNS')
      .eq('is_published', true)
      .order('is_free', { ascending: false })
      .order('created_at', { ascending: true })
    packages = (pkgData ?? []) as PackageRow[]
  } catch { /* Supabase not configured */ }

  const skdPackages = packages // semua CPNS = SKD untuk sekarang

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Beranda</Link>
        <span>›</span>
        <Link href="/" className="hover:text-blue-600">Seleksi</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">CPNS</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🏛️</span>
          <h1 className="text-2xl font-bold text-gray-900">Portal CPNS</h1>
          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">2025</span>
        </div>
        <p className="text-gray-500 text-sm ml-12">Calon Pegawai Negeri Sipil — Simulasi SKD & SKB Resmi</p>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6">

        {/* ── LEFT SIDEBAR ────────────────────────────────── */}
        <aside className="space-y-4">
          {/* Tahapan seleksi */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tahapan Seleksi</p>
            </div>
            <div className="p-2 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0"></span>
                SKD
                <span className="ml-auto text-xs bg-blue-100 px-2 py-0.5 rounded-full">Aktif</span>
              </button>
              <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 rounded-lg text-sm cursor-not-allowed">
                <span className="w-2 h-2 bg-gray-300 rounded-full shrink-0"></span>
                SKB
                <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Segera</span>
              </div>
            </div>
          </div>

          {/* Sub-tes SKD info */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sub-tes SKD</p>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: 'TWK', full: 'Tes Wawasan Kebangsaan', soal: 30, color: 'bg-blue-100 text-blue-700' },
                { name: 'TIU', full: 'Tes Intelegensia Umum', soal: 35, color: 'bg-purple-100 text-purple-700' },
                { name: 'TKP', full: 'Tes Karakteristik Pribadi', soal: 45, color: 'bg-green-100 text-green-700' },
              ].map((sub) => (
                <div key={sub.name} className="flex items-start gap-2.5">
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 ${sub.color}`}>
                    {sub.name}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{sub.full}</p>
                    <p className="text-xs text-gray-400">{sub.soal} soal</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
                Total: <strong>110 soal</strong> · <strong>90 menit</strong>
              </div>
            </div>
          </div>

          {/* Login prompt jika belum login */}
          {!isLoggedIn && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-1">Mulai Berlatih</p>
              <p className="text-xs text-blue-600 mb-3">Daftar gratis untuk akses soal SKD CPNS</p>
              <Link
                href="/register"
                className="block w-full text-center py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="/login"
                className="block w-full text-center py-1.5 text-blue-600 text-xs hover:underline mt-1"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <main className="space-y-4">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Paket Simulasi SKD</h2>
              <p className="text-xs text-gray-500 mt-0.5">{skdPackages.length} paket tersedia</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-medium">Semua</span>
            </div>
          </div>

          {/* Package grid */}
          {skdPackages.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              <p className="text-3xl mb-3">📦</p>
              <p>Belum ada paket soal tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skdPackages.map((pkg) => (
                <CpnsPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isLoggedIn={isLoggedIn}
                  userPlan={userPlan as 'free' | 'premium'}
                />
              ))}
            </div>
          )}

          {/* SKB coming soon */}
          <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-6 text-center">
            <p className="text-2xl mb-2">🔒</p>
            <p className="font-medium text-gray-700 text-sm">Paket SKB — Segera Hadir</p>
            <p className="text-xs text-gray-400 mt-1">Seleksi Kompetensi Bidang akan tersedia setelah SKD selesai</p>
          </div>
        </main>

        {/* ── RIGHT SIDEBAR ───────────────────────────────── */}
        <aside className="space-y-4">
          {/* Standar nilai */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-blue-600">
              <p className="text-xs font-semibold text-white uppercase tracking-wide">Passing Grade SKD 2024</p>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'TWK', min: PASSING_GRADE.TWK, max: 150, color: 'bg-blue-100 text-blue-700' },
                { label: 'TIU', min: PASSING_GRADE.TIU, max: 175, color: 'bg-purple-100 text-purple-700' },
                { label: 'TKP', min: PASSING_GRADE.TKP, max: 225, color: 'bg-green-100 text-green-700' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.color}`}>{item.label}</span>
                    <span className="text-xs font-semibold text-gray-700">≥ {item.min} <span className="text-gray-400 font-normal">/ {item.max}</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${(item.min / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">Total minimum</span>
                <span className="text-sm font-bold text-gray-900">≥ {PASSING_GRADE.total} <span className="text-xs text-gray-400 font-normal">/ 550</span></span>
              </div>
            </div>
          </div>

          {/* Sistem penilaian */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sistem Penilaian</p>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">TWK & TIU — Benar</span>
                <span className="font-bold text-green-600">+5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TWK & TIU — Salah</span>
                <span className="font-bold text-red-500">−1,67</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TWK & TIU — Kosong</span>
                <span className="font-bold text-gray-400">0</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">TKP — Benar</span>
                  <span className="font-bold text-green-600">+5</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">TKP — Salah / Kosong</span>
                  <span className="font-bold text-gray-400">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-800 mb-2">💡 Tips Sukses SKD</p>
            <ul className="space-y-1.5 text-xs text-amber-700">
              <li>✓ Prioritaskan TKP — tidak ada penalti salah</li>
              <li>✓ Kalau ragu soal TWK/TIU, lebih baik lewati</li>
              <li>✓ Kerjakan soal yang yakin dulu</li>
              <li>✓ Latihan rutin meningkatkan kecepatan</li>
            </ul>
          </div>

          {/* Info jadwal */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Info CPNS 2025</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 shrink-0 mt-0.5">📅</span>
                <p>Pantau terus pengumuman resmi di <span className="font-medium">sscasn.bkn.go.id</span></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500 shrink-0 mt-0.5">📌</span>
                <p>Formasi CPNS 2025 mencakup seluruh K/L Pusat dan Daerah</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}
