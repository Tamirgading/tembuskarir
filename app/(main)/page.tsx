import Link from 'next/link'
import {
  CheckCircle2, Clock, FileText, ChevronRight, ArrowRight,
  TrendingUp, Award, CheckCircle, Package, ShoppingBag, CalendarDays,
  Briefcase, Zap, Sparkles,
} from 'lucide-react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getPremiumSubscriptionStatus, getPlnSubscriptionStatus } from '@/lib/access'
import { BIDANG_BY_SLUG } from '@/lib/bidang-config'
import { ASTRA_SUBTESTS, PLN_SUBTESTS } from '@/lib/exam-scoring'
import GuestLoginCta from '@/components/ui/GuestLoginCta'
import type { AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

// ── Tipe ────────────────────────────────────────────────────────────────────
type AttemptPreview = Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'finished_at' | 'package_id'> & {
  score_details?: Record<string, unknown> | null
}

interface SubRow {
  id: string; plan_type: string; amount: number; status: string
  paid_at: string | null; expires_at: string | null; created_at: string
}
interface UnlockRow { id: string; package_id: string; created_at: string }
interface CatStat { correct: number; wrong: number; empty: number; rawScore: number }

// ── Konstanta ────────────────────────────────────────────────────────────────
const PLAN_LABEL: Record<string, string> = {
  premium_monthly:  'Langganan Premium — 1 Bulan',
  premium_quarterly:'Langganan Premium — 3 Bulan',
  package:          'Paket Satuan',
}
const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  paid:    { label: 'Aktif',          cls: 'bg-green-100 text-green-700'  },
  pending: { label: 'Menunggu Bayar', cls: 'bg-yellow-100 text-yellow-700'},
  failed:  { label: 'Gagal',          cls: 'bg-red-100 text-red-600'      },
  expired: { label: 'Kedaluwarsa',    cls: 'bg-gray-100 text-gray-500'    },
}
const SUBTEST_FULL: Record<string, string> = Object.fromEntries([
  ...Object.entries(ASTRA_SUBTESTS).map(([k, v]) => [k, v.full]),
  ...Object.entries(PLN_SUBTESTS).map(([k, v]) => [k, v.full]),
])

function readinessLabel(p: number): string {
  if (p >= 80) return 'Kamu sudah siap! 🎯'
  if (p >= 60) return 'Tinggal sedikit lagi!'
  if (p >= 40) return 'Terus tingkatkan'
  return 'Baru mulai — semangat!'
}

// Ambil penguasaan sub-tes dari attempt terakhir yang punya score_details
function extractMastery(attempts: AttemptPreview[]): { code: string; pct: number }[] {
  for (const a of attempts) {
    const sd = a.score_details as { categories?: Record<string, CatStat> } | null | undefined
    if (sd && sd.categories && Object.keys(sd.categories).length > 0) {
      return Object.entries(sd.categories).map(([code, s]) => {
        const total = (s.correct ?? 0) + (s.wrong ?? 0) + (s.empty ?? 0)
        const pct = total > 0 ? Math.round(((s.correct ?? 0) / total) * 100) : 0
        return { code, pct }
      }).sort((x, y) => y.pct - x.pct)
    }
  }
  return []
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; tab?: string }>
}) {
  const { payment, tab } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Tab pembelian hanya relevan untuk user login
  const activeTab = user && tab === 'pembelian' ? 'pembelian' : 'beranda'

  // ── Guest view ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 fade-up">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-ink">Selamat datang di TembusKarir 👋</h1>
          <p className="text-ink-muted text-sm mt-1">
            Simulasi tes rekrutmen PLN, ASTRA, dan BUMN dengan format persis seperti tes aslinya.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-hairline shadow-soft p-8 text-center">
          <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-brand" />
          </div>
          <h2 className="text-lg font-heading font-bold text-ink">Mulai simulasi pertamamu</h2>
          <p className="text-ink-muted text-sm mt-1 mb-5 max-w-md mx-auto">
            Daftar gratis, kerjakan satu simulasi, dan lihat peta kesiapanmu per sub-tes.
          </p>
          <GuestLoginCta />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/portal/astra"
            className="bg-white rounded-2xl border border-hairline shadow-soft p-5 hover:border-brand/30 card-hover">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5 text-brand" />
            </div>
            <p className="font-heading font-bold text-ink">Psikotes ASTRA</p>
            <p className="text-xs text-ink-muted mt-1">80 soal · 7 sub-tes · 41 menit — lihat paketnya tanpa login.</p>
          </Link>
          <Link href="/portal/pln"
            className="bg-white rounded-2xl border border-hairline shadow-soft p-5 hover:border-brand/30 card-hover">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-brand" />
            </div>
            <p className="font-heading font-bold text-ink">Rekrutmen PLN</p>
            <p className="text-xs text-ink-muted mt-1">GAT + Tahap 2 Akademik — format per sub-tes seperti aslinya.</p>
          </Link>
        </div>
      </div>
    )
  }

  const { data: profileData } = await supabase
    .from('users').select('full_name').eq('id', user.id).single()
  const name = (profileData as { full_name: string | null } | null)?.full_name
    ?? user.email?.split('@')[0] ?? 'Pengguna'

  const premiumSub = await getPremiumSubscriptionStatus(user.id)
  const plnSub = await getPlnSubscriptionStatus(user.id)
  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const fmtLong = (d: string | null) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
  const fmtAmount = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

  // ── Data: Beranda ──────────────────────────────────────────────────────────
  let attempts: AttemptPreview[] = []
  const packageMap: Record<string, { name: string; category: string }> = {}
  let totalCount = 0, avgScore = 0, highestScore = 0
  let mastery: { code: string; pct: number }[] = []

  if (activeTab === 'beranda') {
    const { data: attemptsData } = await supabase
      .from('attempts')
      .select('id, score, started_at, finished_at, package_id, score_details')
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
    avgScore = totalCount > 0 ? Math.round(attempts.reduce((s, a) => s + (a.score ?? 0), 0) / totalCount) : 0
    highestScore = totalCount > 0 ? Math.max(...attempts.map((a) => a.score ?? 0)) : 0
    mastery = extractMastery(attempts)
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
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
    subs = (subsData ?? []) as SubRow[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: unlocksData } = await (serviceClient.from('unlocked_packages') as any)
      .select('id, package_id, created_at').eq('user_id', user.id).order('created_at', { ascending: false })
    unlocks = (unlocksData ?? []) as UnlockRow[]
    const pkgIds = unlocks.map((u) => u.package_id)
    const { data: pkgsData } = pkgIds.length > 0
      ? await supabase.from('packages').select('id, name').in('id', pkgIds) : { data: [] }
    for (const p of (pkgsData ?? [])) {
      const pkg = p as { id: string; name: string }
      unlockPkgMap[pkg.id] = pkg.name
    }
    const now = new Date()
    activeSubs = subs.filter((s) => s.status === 'paid' && s.expires_at && new Date(s.expires_at) > now)
  }

  // Ring geometry
  const R = 54, C = 2 * Math.PI * R
  const offset = C * (1 - Math.min(100, Math.max(0, avgScore)) / 100)
  const weakest = mastery.length > 0 ? mastery[mastery.length - 1] : null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6 fade-up">

      {/* Payment banners */}
      {payment === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div><p className="font-semibold text-green-800 text-sm">Pembayaran berhasil!</p><p className="text-xs text-green-600 mt-0.5">Akses kamu sudah aktif. Selamat berlatih!</p></div>
        </div>
      )}
      {payment === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
          <div><p className="font-semibold text-yellow-800 text-sm">Pembayaran sedang diproses</p><p className="text-xs text-yellow-600 mt-0.5">Akun diperbarui otomatis setelah dikonfirmasi.</p></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-ink">Halo, {name} 👋</h1>
          <p className="text-ink-muted text-sm mt-1">Selamat datang kembali. Yuk lanjutkan persiapanmu.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {premiumSub.active && premiumSub.expiresAt && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand-700 font-semibold text-xs rounded-full whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" /> Premium s/d {fmt(premiumSub.expiresAt)}
            </span>
          )}
          {plnSub.active && plnSub.expiresAt && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 font-semibold text-xs rounded-full whitespace-nowrap">
              <Zap className="w-3.5 h-3.5" />
              PLN{plnSub.bidang && BIDANG_BY_SLUG[plnSub.bidang] ? ` · ${BIDANG_BY_SLUG[plnSub.bidang].short}` : ''} s/d {fmt(plnSub.expiresAt)}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-paper-soft rounded-xl p-1 w-fit border border-hairline">
        {[{ id: 'beranda', label: 'Beranda' }, { id: 'pembelian', label: 'Pembelian' }].map((t) => (
          <Link key={t.id} href={t.id === 'beranda' ? '/' : `/?tab=${t.id}`}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === t.id ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* ── TAB: BERANDA ──────────────────────────────────────────────────── */}
      {activeTab === 'beranda' && (
        <>
          {totalCount === 0 ? (
            /* Empty / onboarding state */
            <div className="bg-white rounded-2xl border border-hairline shadow-soft p-8 text-center">
              <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Briefcase className="w-7 h-7 text-brand" /></div>
              <h2 className="text-lg font-heading font-bold text-ink">Mulai simulasi pertamamu</h2>
              <p className="text-ink-muted text-sm mt-1 mb-5 max-w-md mx-auto">Kerjakan satu simulasi untuk melihat peta kesiapanmu dan kelemahan yang perlu dilatih.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/portal/astra" className="inline-flex items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"><Briefcase className="w-4 h-4" /> Psikotes ASTRA</Link>
                <Link href="/portal/pln" className="inline-flex items-center gap-2 bg-white border border-hairline text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-paper-soft transition-colors"><Zap className="w-4 h-4" /> Rekrutmen PLN</Link>
              </div>
            </div>
          ) : (
            <>
              {/* Readiness + Next step */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-5 items-stretch">
                {/* Readiness */}
                <div className="bg-white rounded-2xl border border-hairline shadow-soft p-6">
                  <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-4">Kesiapan kamu</p>
                  <div className="flex items-center gap-6">
                    <div className="relative w-[130px] h-[130px] shrink-0">
                      <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
                        <circle cx="65" cy="65" r={R} fill="none" stroke="#E7E4DC" strokeWidth="11" />
                        <circle cx="65" cy="65" r={R} fill="none" stroke="#0E9F6E" strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-num font-bold text-[32px] text-ink leading-none">{avgScore}</span>
                        <span className="text-[11px] text-ink-muted font-semibold">rata-rata</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-heading font-bold text-ink mb-1">{readinessLabel(avgScore)}</h2>
                      <p className="text-ink-muted text-sm mb-3">Berdasarkan {totalCount} simulasi terakhirmu.</p>
                      {weakest && (
                        <div className="inline-flex items-center gap-2 bg-paper-soft rounded-lg px-3 py-1.5 text-xs font-semibold mb-4">
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> Kelemahan: {SUBTEST_FULL[weakest.code] ?? weakest.code} · {weakest.pct}%
                        </div>
                      )}
                      <div className="flex gap-2.5">
                        <Link href="/portal/astra" className="inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"><CheckCircle className="w-4 h-4" /> Lanjut latihan</Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next step */}
                <div className="rounded-2xl p-6 text-white flex flex-col" style={{ background: 'linear-gradient(180deg,#0F2C44,#0a1f30)' }}>
                  <p className="text-[11px] uppercase tracking-wider text-white/55 font-bold mb-2">Langkah berikutmu</p>
                  <h3 className="text-lg font-heading font-bold mb-1">Simulasi Psikotes ASTRA</h3>
                  <p className="text-white/65 text-sm mb-4">Latih kondisi tes sesungguhnya — 7 sub-tes, skor langsung dianalisis.</p>
                  <div className="flex gap-4 text-xs text-white/80 mb-5">
                    <span>📋 <b className="font-num">80</b> soal</span>
                    <span>⏱ <b className="font-num">~41</b> menit</span>
                  </div>
                  <Link href="/portal/astra" className="mt-auto inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-700 transition-colors w-fit">
                    Mulai simulasi <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Tiles */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <FileText className="w-4 h-4 text-brand" />, value: totalCount, label: 'Simulasi selesai' },
                  { icon: <TrendingUp className="w-4 h-4 text-brand" />, value: avgScore, label: 'Rata-rata skor' },
                  { icon: <Award className="w-4 h-4 text-brand" />, value: highestScore, label: 'Skor tertinggi' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
                    <div className="w-9 h-9 rounded-xl bg-brand/10 grid place-items-center mb-3">{s.icon}</div>
                    <p className="font-num font-bold text-[26px] text-ink leading-none">{s.value}</p>
                    <p className="text-ink-muted text-xs mt-1.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Mastery + History */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                {/* Mastery */}
                {mastery.length > 0 && (
                  <div className="bg-white rounded-2xl border border-hairline shadow-soft p-6">
                    <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1">Penguasaan sub-tes</p>
                    <p className="text-xs text-ink-muted mb-3">Dari simulasi terakhirmu</p>
                    {mastery.map((m) => (
                      <div key={m.code} className="flex items-center gap-3 py-2.5 border-b border-hairline last:border-0">
                        <span className="w-11 text-[11px] font-bold text-center text-ink bg-paper-soft rounded-md py-1">{m.code}</span>
                        <span className="flex-1 text-[13.5px] text-ink-soft truncate">{SUBTEST_FULL[m.code] ?? m.code}</span>
                        <span className="w-28 h-[7px] bg-hairline rounded-full overflow-hidden shrink-0">
                          <span className="block h-full rounded-full" style={{ width: `${m.pct}%`, background: m.pct < 60 ? '#F4B400' : '#0E9F6E' }} />
                        </span>
                        <span className="w-9 text-right font-num font-semibold text-[13px] text-ink">{m.pct}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* History */}
                <div className="bg-white rounded-2xl border border-hairline shadow-soft p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Riwayat terakhir</p>
                    <Link href="/portal/astra" className="text-xs text-brand font-semibold hover:text-brand-700">+ Simulasi baru</Link>
                  </div>
                  <div className="divide-y divide-hairline">
                    {attempts.slice(0, 6).map((a) => {
                      const pkg = packageMap[a.package_id]
                      return (
                        <Link key={a.id} href={`/hasil/${a.id}`} className="flex items-center gap-3 py-3 hover:opacity-80 transition-opacity">
                          <span className="w-11 h-11 rounded-xl bg-brand/10 grid place-items-center font-num font-bold text-brand">{a.score ?? '–'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13.5px] font-semibold text-ink truncate">{pkg?.name ?? 'Paket'}</p>
                            <p className="text-[11.5px] text-ink-muted mt-0.5">{formatDate(a.started_at)} · {fmtTime(a.started_at)}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── TAB: PEMBELIAN ────────────────────────────────────────────────── */}
      {activeTab === 'pembelian' && (
        <div className="space-y-6">
          {activeSubs.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Langganan Aktif</p>
              {activeSubs.map((sub) => (
                <div key={sub.id} className="bg-amber-50 border border-amber-200 rounded-2xl shadow-soft p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0"><CheckCircle className="w-5 h-5 text-amber-600" /></div>
                  <div className="flex-1">
                    <p className="font-bold text-amber-900 text-sm">{PLAN_LABEL[sub.plan_type] ?? sub.plan_type}</p>
                    <p className="text-xs text-amber-600 mt-0.5">Berlaku hingga <strong>{fmtLong(sub.expires_at)}</strong></p>
                    <p className="text-xs text-amber-500 mt-1">{fmtAmount(sub.amount)} · Dibeli {fmtLong(sub.paid_at)}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Aktif</span>
                </div>
              ))}
            </div>
          )}

          {unlocks.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Paket Satuan Dimiliki</p>
              <div className="bg-white rounded-2xl border border-hairline shadow-soft divide-y divide-hairline overflow-hidden">
                {unlocks.map((unlock) => (
                  <div key={unlock.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-brand" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{unlockPkgMap[unlock.package_id] ?? 'Paket'}</p>
                      <p className="text-xs text-ink-muted mt-0.5">Dibeli {fmtLong(unlock.created_at)} · Akses selamanya</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand-700">Dimiliki</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Semua Transaksi</p>
            {subs.length === 0 && unlocks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-hairline shadow-soft p-10 text-center">
                <div className="w-12 h-12 bg-paper-soft rounded-2xl flex items-center justify-center mx-auto mb-3"><ShoppingBag className="w-6 h-6 text-ink-muted" /></div>
                <p className="font-semibold text-ink text-sm">Belum ada pembelian</p>
                <p className="text-xs text-ink-muted mt-1 mb-4">Mulai dengan memilih paket di portal seleksi.</p>
                <Link href="/portal/astra" className="inline-flex items-center gap-1 text-xs font-bold text-white bg-brand hover:bg-brand-700 px-4 py-2 rounded-xl transition-colors">Mulai Simulasi →</Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-hairline shadow-soft divide-y divide-hairline overflow-hidden">
                {subs.map((sub) => {
                  const cfg = STATUS_CONFIG[sub.status] ?? { label: sub.status, cls: 'bg-gray-100 text-gray-500' }
                  return (
                    <div key={sub.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-8 h-8 bg-paper-soft rounded-lg flex items-center justify-center shrink-0"><CalendarDays className="w-4 h-4 text-ink-muted" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{PLAN_LABEL[sub.plan_type] ?? sub.plan_type}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{fmtAmount(sub.amount)} · {fmtLong(sub.created_at)}</p>
                      </div>
                      <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <p className="text-xs text-center text-ink-muted pb-2">
            Ada pertanyaan soal pembayaran? Hubungi <a href="mailto:support@tembuskarir.id" className="underline hover:text-ink">support@tembuskarir.id</a>
          </p>
        </div>
      )}
    </div>
  )
}
