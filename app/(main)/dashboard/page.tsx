import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2, Clock, FileText, ChevronRight,
  TrendingUp, Award, Target, CheckCircle, Package, ShoppingBag, CalendarDays,
} from 'lucide-react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getCpnsSubscriptionStatus } from '@/lib/access'
import type { AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import BackButton from '@/components/ui/BackButton'

// ── Tipe ────────────────────────────────────────────────────────────────────
type AttemptPreview = Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'finished_at' | 'package_id'>

interface SubRow {
  id: string; plan_type: string; amount: number; status: string
  paid_at: string | null; expires_at: string | null; created_at: string
}
interface UnlockRow { id: string; package_id: string; created_at: string }

// ── Konstanta ────────────────────────────────────────────────────────────────
const PLAN_LABEL: Record<string, string> = {
  cpns_monthly:  'Langganan CPNS — 1 Bulan',
  cpns_quarterly:'Langganan CPNS — 3 Bulan',
  package:       'Paket Satuan',
}
const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  paid:    { label: 'Aktif',             cls: 'bg-green-100 text-green-700'  },
  pending: { label: 'Menunggu Bayar',    cls: 'bg-yellow-100 text-yellow-700'},
  failed:  { label: 'Gagal',             cls: 'bg-red-100 text-red-600'      },
  expired: { label: 'Kedaluwarsa',       cls: 'bg-gray-100 text-gray-500'    },
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; tab?: string }>
}) {
  const { payment, tab } = await searchParams
  const activeTab = tab === 'pembelian' ? 'pembelian' : 'beranda'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profileData } = await supabase
    .from('users').select('full_name').eq('id', user.id).single()
  const name = (profileData as { full_name: string | null } | null)?.full_name
    ?? user.email?.split('@')[0] ?? 'Pengguna'

  const cpnsSub = await getCpnsSubscriptionStatus(user.id)
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  const fmtTime = (d: string) =>
    new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const fmtLong = (d: string | null) => d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'
  const fmtAmount = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

  // ── Data: Beranda ──────────────────────────────────────────────────────────
  let attempts: AttemptPreview[] = []
  const packageMap: Record<string, { name: string; category: string }> = {}
  let totalCount = 0, avgScore: number | null = null, highestScore: number | null = null, cpnsCount = 0, astraCount = 0

  if (activeTab === 'beranda') {
    const { data: attemptsData } = await supabase
      .from('attempts')
      .select('id, score, started_at, finished_at, package_id')
      .eq('user_id', user.id)
      .eq('status', 'finished')
      .order('started_at', { ascending: false })
      .limit(10)
    attempts = (attemptsData ?? []) as AttemptPreview[]

    const packageIds = Array.from(new Set(attempts.map((a) => a.package_id).filter(Boolean)))
    const { data: pkgsData } = packageIds.length > 0
      ? await supabase.from('packages').select('id, name, category').in('id', packageIds)
      : { data: [] }
    for (const p of (pkgsData ?? [])) {
      const pkg = p as { id: string; name: string; category: string }
      packageMap[pkg.id] = { name: pkg.name, category: pkg.category }
    }

    totalCount = attempts.length
    avgScore = totalCount > 0
      ? Math.round(attempts.reduce((s, a) => s + (a.score ?? 0), 0) / totalCount) : null
    highestScore = totalCount > 0 ? Math.max(...attempts.map((a) => a.score ?? 0)) : null
    cpnsCount = attempts.filter((a) => packageMap[a.package_id]?.category === 'CPNS').length
    astraCount = attempts.filter((a) => packageMap[a.package_id]?.category === 'ASTRA').length
  }

  // ── Data: Pembelian ────────────────────────────────────────────────────────
  let subs: SubRow[] = []
  let unlocks: UnlockRow[] = []
  const unlockPkgMap: Record<string, string> = {}
  let activeSubs: SubRow[] = []

  if (activeTab === 'pembelian') {
    const serviceClient = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subsData } = await (serviceClient.from('subscriptions') as any)
      .select('id, plan_type, amount, status, paid_at, expires_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    subs = (subsData ?? []) as SubRow[]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: unlocksData } = await (serviceClient.from('unlocked_packages') as any)
      .select('id, package_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    unlocks = (unlocksData ?? []) as UnlockRow[]

    const pkgIds = unlocks.map((u) => u.package_id)
    const { data: pkgsData } = pkgIds.length > 0
      ? await supabase.from('packages').select('id, name').in('id', pkgIds)
      : { data: [] }
    for (const p of (pkgsData ?? [])) {
      const pkg = p as { id: string; name: string }
      unlockPkgMap[pkg.id] = pkg.name
    }

    const now = new Date()
    activeSubs = subs.filter(
      (s) => s.status === 'paid' && s.expires_at && new Date(s.expires_at) > now
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Tombol kembali */}
      <BackButton fallbackHref="/" label="Kembali" />

      {/* Payment banners */}
      {payment === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Pembayaran berhasil!</p>
            <p className="text-xs text-green-600 mt-0.5">Akses kamu sudah aktif. Selamat berlatih!</p>
          </div>
        </div>
      )}
      {payment === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
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

      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { id: 'beranda',   label: 'Beranda'    },
          { id: 'pembelian', label: 'Pembelian'  },
        ].map((t) => (
          <Link
            key={t.id}
            href={t.id === 'beranda' ? '/dashboard' : `/dashboard?tab=${t.id}`}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* ── TAB: BERANDA ──────────────────────────────────────────────────── */}
      {activeTab === 'beranda' && (
        <>
          {/* Portal shortcuts */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Pilih Seleksi</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/portal/cpns"
                className="group bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all p-5 flex items-center gap-4"
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

              <Link
                href="/portal/astra"
                className="group bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:border-orange-400 hover:shadow-md transition-all p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">Psikotes ASTRA</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {astraCount > 0 ? `${astraCount}× simulasi dikerjakan` : 'Mulai simulasi pertamamu'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors shrink-0" />
              </Link>
            </div>
          </div>

          {/* Statistik — hanya jika ada attempt */}
          {totalCount > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Statistik Keseluruhan</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <TrendingUp className="w-4 h-4 text-blue-500" />,   value: totalCount,         label: 'Simulasi'   },
                  { icon: <Target     className="w-4 h-4 text-purple-500" />, value: avgScore ?? '-',    label: 'Rata-rata'  },
                  { icon: <Award      className="w-4 h-4 text-amber-500" />,  value: highestScore ?? '-',label: 'Tertinggi'  },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
                    <div className="flex justify-center mb-1.5">{s.icon}</div>
                    <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
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
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p className="font-semibold text-gray-700 text-sm">Belum ada simulasi</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">Kerjakan simulasi pertamamu sekarang!</p>
                <Link href="/portal/cpns" className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors">
                  Ke Portal CPNS →
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50 overflow-hidden">
                {attempts.map((attempt) => {
                  const pkg = packageMap[attempt.package_id]
                  const score = attempt.score ?? 0
                  const isCpns = pkg?.category === 'CPNS'
                  const isPassing = isCpns && score >= 311
                  return (
                    <Link key={attempt.id} href={`/hasil/${attempt.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                        isCpns
                          ? isPassing ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-800 truncate">{pkg?.name ?? 'Paket'}</p>
                          {pkg?.category && (
                            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                              {pkg.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(attempt.started_at)}
                          {' · '}
                          {fmtTime(attempt.started_at)}
                          {attempt.finished_at && ` – ${fmtTime(attempt.finished_at)}`}
                        </p>
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
        </>
      )}

      {/* ── TAB: PEMBELIAN ────────────────────────────────────────────────── */}
      {activeTab === 'pembelian' && (
        <div className="space-y-6">

          {/* Langganan aktif */}
          {activeSubs.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Langganan Aktif</p>
              {activeSubs.map((sub) => (
                <div key={sub.id} className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-amber-900 text-sm">{PLAN_LABEL[sub.plan_type] ?? sub.plan_type}</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Berlaku hingga <strong>{fmtLong(sub.expires_at)}</strong>
                    </p>
                    <p className="text-xs text-amber-500 mt-1">{fmtAmount(sub.amount)} · Dibeli {fmtLong(sub.paid_at)}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Aktif</span>
                </div>
              ))}
            </div>
          )}

          {/* Paket satuan dimiliki */}
          {unlocks.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paket Satuan Dimiliki</p>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50 overflow-hidden">
                {unlocks.map((unlock) => (
                  <div key={unlock.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {unlockPkgMap[unlock.package_id] ?? 'Paket'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Dibeli {fmtLong(unlock.created_at)} · Akses selamanya</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Dimiliki</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Semua transaksi */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Semua Transaksi</p>
            {subs.length === 0 && unlocks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
                <p className="font-semibold text-gray-700 text-sm">Belum ada pembelian</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">Mulai dengan memilih paket di portal seleksi.</p>
                <Link href="/portal/cpns" className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors">
                  Ke Portal CPNS →
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50 overflow-hidden">
                {subs.map((sub) => {
                  const cfg = STATUS_CONFIG[sub.status] ?? { label: sub.status, cls: 'bg-gray-100 text-gray-500' }
                  return (
                    <div key={sub.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {PLAN_LABEL[sub.plan_type] ?? sub.plan_type}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {fmtAmount(sub.amount)} · {fmtLong(sub.created_at)}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <p className="text-xs text-center text-gray-400 pb-2">
            Ada pertanyaan soal pembayaran? Hubungi{' '}
            <a href="mailto:support@tembuskarir.id" className="underline hover:text-gray-600">support@tembuskarir.id</a>
          </p>
        </div>
      )}

    </div>
  )
}
