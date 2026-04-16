import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Clock, FileText, ChevronRight, TrendingUp, Award, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getCpnsSubscriptionStatus } from '@/lib/access'
import type { AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>
}) {
  const { payment } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profileData } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const fullName = (profileData as { full_name: string | null } | null)?.full_name ?? null
  const name = fullName ?? user.email?.split('@')[0] ?? 'Pengguna'

  // Status langganan CPNS untuk badge header
  const cpnsSub = await getCpnsSubscriptionStatus(user.id)

  // 10 attempt terakhir — semua seleksi
  const { data: attemptsData } = await supabase
    .from('attempts')
    .select('id, score, started_at, package_id')
    .eq('user_id', user.id)
    .eq('status', 'finished')
    .order('started_at', { ascending: false })
    .limit(10)

  type AttemptPreview = Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>
  const attempts = (attemptsData ?? []) as AttemptPreview[]

  // Nama & kategori paket
  const packageIds = Array.from(new Set(attempts.map((a) => a.package_id).filter(Boolean)))
  const { data: packagesData } = packageIds.length > 0
    ? await supabase.from('packages').select('id, name, category').in('id', packageIds)
    : { data: [] }

  const packageMap: Record<string, { name: string; category: string }> = {}
  for (const pkg of (packagesData ?? [])) {
    const p = pkg as { id: string; name: string; category: string }
    packageMap[p.id] = { name: p.name, category: p.category }
  }

  // Statistik umum semua seleksi
  const totalCount = attempts.length
  const avgScore = totalCount > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / totalCount)
    : null
  const highestScore = totalCount > 0
    ? Math.max(...attempts.map((a) => a.score ?? 0))
    : null

  const cpnsCount = attempts.filter((a) => packageMap[a.package_id]?.category === 'CPNS').length

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Payment banners */}
      {payment === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Pembayaran berhasil!</p>
            <p className="text-xs text-green-600 mt-0.5">Akses kamu sudah aktif. Selamat berlatih!</p>
          </div>
        </div>
      )}
      {payment === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
          <div>
            <p className="font-semibold text-yellow-800 text-sm">Pembayaran sedang diproses</p>
            <p className="text-xs text-yellow-600 mt-0.5">Akun akan diperbarui otomatis setelah dikonfirmasi.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Halo, {name}!</h1>
          <p className="text-gray-500 text-sm mt-1">Selamat datang di dashboard persiapanmu.</p>
        </div>
        {cpnsSub.active && cpnsSub.expiresAt && (
          <span className="shrink-0 inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-700 font-semibold text-xs rounded-full whitespace-nowrap">
            ✦ CPNS aktif s/d {fmt(cpnsSub.expiresAt)}
          </span>
        )}
      </div>

      {/* Portal shortcuts */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Pilih Seleksi</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CPNS */}
          <Link
            href="/portal/cpns"
            className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">SKD CPNS</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {cpnsCount > 0 ? `${cpnsCount}× simulasi dikerjakan` : 'Mulai simulasi pertamamu'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
          </Link>

          {/* Coming soon */}
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-5 flex items-center gap-4 opacity-60 cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-500 text-sm">SKB & Lainnya</p>
              <p className="text-xs text-gray-400 mt-0.5">Segera hadir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik umum — hanya jika ada attempt */}
      {totalCount > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Statistik Keseluruhan</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="flex justify-center mb-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{totalCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">Simulasi</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="flex justify-center mb-1.5">
                <Target className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{avgScore ?? '-'}</p>
              <p className="text-xs text-gray-400 mt-0.5">Rata-rata</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="flex justify-center mb-1.5">
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{highestScore ?? '-'}</p>
              <p className="text-xs text-gray-400 mt-0.5">Tertinggi</p>
            </div>
          </div>
        </div>
      )}

      {/* Riwayat ujian */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Riwayat Ujian</p>
          <Link href="/portal/cpns" className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            + Simulasi baru →
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700 text-sm">Belum ada simulasi</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Kerjakan simulasi pertamamu sekarang!</p>
            <Link
              href="/portal/cpns"
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors"
            >
              Ke Portal CPNS →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-50 overflow-hidden">
            {attempts.map((attempt) => {
              const pkg = packageMap[attempt.package_id]
              const score = attempt.score ?? 0
              const isCpns = pkg?.category === 'CPNS'
              const isPassing = isCpns && score >= 311

              return (
                <Link
                  key={attempt.id}
                  href={`/hasil/${attempt.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  {/* Skor bulat */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                    isCpns
                      ? isPassing ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {score}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{pkg?.name ?? 'Paket'}</p>
                      {pkg?.category && (
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {pkg.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(attempt.started_at)}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isCpns && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPassing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isPassing ? 'LULUS' : 'Belum Lulus'}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
