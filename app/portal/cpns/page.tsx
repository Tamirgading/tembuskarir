import Link from 'next/link'
import { Landmark, Package, Calendar, MapPin, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow } from '@/lib/utils'
import CpnsPackageCard from '@/components/portal/CpnsPackageCard'

// Passing grade SKD resmi 2024
const PASSING_GRADE = { TWK: 65, TIU: 80, TKP: 166, total: 311 }

const SKD_SUBTESTS = [
  { name: 'TWK', full: 'Tes Wawasan Kebangsaan', soal: 30, max: 150, color: 'blue' },
  { name: 'TIU', full: 'Tes Intelegensia Umum',  soal: 35, max: 175, color: 'purple' },
  { name: 'TKP', full: 'Tes Karakteristik Pribadi', soal: 45, max: 225, color: 'green' },
]

type ColorKey = 'blue' | 'purple' | 'green'
const COLOR_MAP: Record<ColorKey, { badge: string; bar: string; dot: string }> = {
  blue:   { badge: 'bg-blue-100 text-blue-700 border-blue-200',   bar: 'bg-blue-500',   dot: 'bg-blue-500' },
  purple: { badge: 'bg-purple-100 text-purple-700 border-purple-200', bar: 'bg-purple-500', dot: 'bg-purple-500' },
  green:  { badge: 'bg-green-100 text-green-700 border-green-200', bar: 'bg-green-500',  dot: 'bg-green-500' },
}

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-5">
        <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
        <span>›</span>
        <span className="text-gray-900 font-semibold">Portal CPNS</span>
      </nav>

      {/* ── Page header ── */}
      <div className="flex items-center gap-4 mb-7">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900">Portal CPNS</h1>
            <span className="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">2025</span>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">Simulasi Seleksi Kompetensi Dasar (SKD) · 110 soal · 90 menit</p>
        </div>
      </div>

      {/* ── 3-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_272px] gap-6 items-start">

        {/* ════════════════════ LEFT SIDEBAR ════════════════════ */}
        <aside className="space-y-4 sticky top-6">

          {/* Navigasi Tahapan */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600">
              <p className="text-xs font-bold text-blue-100 uppercase tracking-widest">Tahapan Seleksi CPNS</p>
            </div>

            <div className="px-4 py-5">
              <div className="relative">
                {/* Garis timeline vertikal */}
                <div className="absolute left-[19px] top-10 h-[calc(100%-40px)] w-0.5 bg-gray-200" />

                {/* SKD — Aktif (halaman ini) */}
                <div className="relative flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0 z-10 shadow-md shadow-blue-200 ring-4 ring-blue-100">
                    <span className="text-white text-xs font-black">01</span>
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-blue-700 text-sm leading-none">SKD</p>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
                        AKTIF
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-0.5">Seleksi Kompetensi Dasar</p>
                  </div>
                </div>

                {/* SKB — Segera, bisa diklik */}
                <Link href="/portal/skb" className="relative flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center shrink-0 z-10 group-hover:border-gray-400 transition-colors">
                    <span className="text-gray-400 text-xs font-black group-hover:text-gray-500 transition-colors">02</span>
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-gray-400 text-sm leading-none group-hover:text-gray-500 transition-colors">SKB</p>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full border border-gray-200">SEGERA</span>
                    </div>
                    <p className="text-gray-300 text-[11px] mt-0.5">Seleksi Kompetensi Bidang</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Info Sub-tes SKD */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Materi SKD</p>
            </div>
            <div className="p-3 space-y-2">
              {SKD_SUBTESTS.map((sub) => {
                const c = COLOR_MAP[sub.color as ColorKey]
                const pgVal = PASSING_GRADE[sub.name as keyof typeof PASSING_GRADE] as number
                return (
                  <div key={sub.name} className="rounded-xl border p-3" style={{}}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${c.badge}`}>{sub.name}</span>
                        <span className="text-xs text-gray-500 font-medium">{sub.soal} soal</span>
                      </div>
                      <span className="text-[10px] text-gray-400">max {sub.max}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-1.5 leading-relaxed">{sub.full}</p>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${(pgVal / sub.max) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Passing grade: <strong className="text-gray-600">{pgVal}</strong></p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Login prompt (guest only) */}
          {!isLoggedIn && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg shadow-blue-200">
              <p className="text-white font-bold text-sm mb-1">Mulai Latihan Gratis</p>
              <p className="text-blue-200 text-xs mb-4 leading-relaxed">Daftar sekarang dan akses soal SKD CPNS tanpa biaya</p>
              <Link
                href="/register"
                className="block w-full text-center py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
              >
                Daftar Gratis →
              </Link>
              <Link
                href="/login"
                className="block w-full text-center py-2 text-blue-200 text-xs hover:text-white transition-colors mt-2"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
          )}
        </aside>

        {/* ════════════════════ MAIN CONTENT ════════════════════ */}
        <main className="space-y-4 min-w-0">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-gray-900">Paket Simulasi SKD</h2>
              <p className="text-xs text-gray-400 mt-0.5">{packages.length} paket tersedia</p>
            </div>
            {userPlan !== 'premium' && isLoggedIn && (
              <Link
                href="/harga"
                className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
              >
                ✦ Upgrade Premium
              </Link>
            )}
          </div>

          {/* Package list — vertikal */}
          {packages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400">
              <div className="flex justify-center mb-3"><Package className="w-10 h-10 text-gray-300" /></div>
              <p className="font-medium">Belum ada paket soal tersedia</p>
              <p className="text-sm mt-1 text-gray-300">Pantau terus untuk update paket baru</p>
            </div>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg, i) => (
                <CpnsPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isLoggedIn={isLoggedIn}
                  userPlan={userPlan as 'free' | 'premium'}
                  index={i}
                />
              ))}
            </div>
          )}

        </main>

        {/* ════════════════════ RIGHT SIDEBAR ════════════════════ */}
        <aside className="space-y-4 sticky top-6">

          {/* Standar nilai — card utama */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600">
              <p className="text-xs font-bold text-white uppercase tracking-widest">Passing Grade SKD 2024</p>
              <p className="text-blue-200 text-[10px] mt-0.5">Sumber: BKN Resmi</p>
            </div>
            <div className="p-4 space-y-4">
              {SKD_SUBTESTS.map((item) => {
                const c = COLOR_MAP[item.color as ColorKey]
                const pgVal = PASSING_GRADE[item.name as keyof typeof PASSING_GRADE] as number
                const pct = (pgVal / item.max) * 100
                return (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${c.badge}`}>{item.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-gray-900">≥ {pgVal}</span>
                        <span className="text-gray-400 text-xs ml-1">/ {item.max}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              <div className="pt-3 mt-1 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500">Total minimum</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-gray-900">≥ {PASSING_GRADE.total}</span>
                  <span className="text-gray-400 text-sm ml-1">/ 550</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sistem penilaian */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sistem Penilaian</p>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="bg-blue-50 rounded-xl p-3 space-y-1.5">
                <p className="font-bold text-blue-700 text-[11px] uppercase tracking-wide mb-2">TWK & TIU</p>
                <div className="flex justify-between"><span className="text-gray-600">Benar</span><span className="font-bold text-green-600">+5</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Salah</span><span className="font-bold text-gray-400">0</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tidak dijawab</span><span className="font-bold text-gray-400">0</span></div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 space-y-1.5">
                <p className="font-bold text-green-700 text-[11px] uppercase tracking-wide mb-2">TKP</p>
                <div className="flex justify-between"><span className="text-gray-600">Nilai per opsi</span><span className="font-bold text-green-600">1 – 5</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tidak dijawab</span><span className="font-bold text-gray-400">0</span></div>
                <div className="mt-1 pt-1 border-t border-green-100">
                  <p className="text-[10px] text-green-600 font-semibold">Setiap opsi punya nilai berbeda (1–5). Selalu isi!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info jadwal */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Info CPNS 2025</p>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <p>Pantau pengumuman resmi di <span className="font-semibold text-blue-600">sscasn.bkn.go.id</span></p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <p>Formasi 2025 mencakup seluruh K/L Pusat & Daerah</p>
              </div>
              <div className="flex items-start gap-2">
                <Target className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <p>SKD diselenggarakan di seluruh wilayah Indonesia</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
