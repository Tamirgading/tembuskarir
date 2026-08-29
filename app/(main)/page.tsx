import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle2, Clock, FileText, ChevronRight, ArrowRight,
  TrendingUp, Trophy, Package, ShoppingBag, CalendarDays,
  Briefcase, Zap, Sparkles, CheckCircle, Target, Mountain, BarChart3,
} from 'lucide-react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getPremiumSubscriptionStatus, getPlnSubscriptionStatus } from '@/lib/access'
import { getEffectiveFeatureFlags } from '@/lib/site-settings'
import { BIDANG_BY_SLUG } from '@/lib/bidang-config'
import { ASTRA_SUBTESTS, PLN_SUBTESTS } from '@/lib/exam-scoring'
import GuestLoginCta from '@/components/ui/GuestLoginCta'
import { ExamIllustration } from '@/components/illustrations/ExamIllustration'
import { SummitIllustration } from '@/components/illustrations/SummitIllustration'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

type AttemptPreview = Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'finished_at' | 'package_id'> & {
  score_details?: Record<string, unknown> | null
}

interface SubRow {
  id: string; plan_type: string; amount: number; status: string
  paid_at: string | null; expires_at: string | null; created_at: string
}
interface UnlockRow { id: string; package_id: string; created_at: string }
interface CatStat { correct: number; wrong: number; empty: number; rawScore: number }

const PLAN_LABEL: Record<string, string> = {
  premium_monthly:   'Langganan Premium: 1 Bulan',
  premium_quarterly: 'Langganan Premium: 3 Bulan',
  package:           'Paket Satuan',
}
const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  paid:    { label: 'Aktif',          cls: 'bg-green-100 text-green-700'   },
  pending: { label: 'Menunggu Bayar', cls: 'bg-yellow-100 text-yellow-700' },
  failed:  { label: 'Gagal',          cls: 'bg-red-100 text-red-600'       },
  expired: { label: 'Kedaluwarsa',    cls: 'bg-gray-100 text-gray-500'     },
}
const SUBTEST_FULL: Record<string, string> = Object.fromEntries([
  ...Object.entries(ASTRA_SUBTESTS).map(([k, v]) => [k, v.full]),
  ...Object.entries(PLN_SUBTESTS).map(([k, v]) => [k, v.full]),
])

function masteryLabel(pct: number): { text: string; cls: string; barColor: string } {
  if (pct >= 70) return { text: 'Sangat Kuat',        cls: 'bg-green-100 text-green-700',   barColor: '#22C55E' }
  if (pct >= 40) return { text: 'Sedang',              cls: 'bg-yellow-100 text-yellow-700', barColor: '#EAB308' }
  if (pct >= 20) return { text: 'Perlu Ditingkatkan',  cls: 'bg-orange-100 text-orange-700', barColor: '#F97316' }
  return               { text: 'Sangat Lemah',         cls: 'bg-red-100 text-red-700',       barColor: '#EF4444' }
}

function extractMastery(attempts: AttemptPreview[]): { code: string; pct: number }[] {
  const agg: Record<string, { c: number; t: number }> = {}
  for (const a of attempts) {
    const sd = a.score_details as { categories?: Record<string, CatStat> } | null | undefined
    if (!sd?.categories) continue
    for (const [code, s] of Object.entries(sd.categories)) {
      if (!agg[code]) agg[code] = { c: 0, t: 0 }
      agg[code].c += s.correct ?? 0
      agg[code].t += (s.correct ?? 0) + (s.wrong ?? 0) + (s.empty ?? 0)
    }
  }
  return Object.entries(agg)
    .map(([code, { c, t }]) => ({ code, pct: t > 0 ? Math.round((c / t) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct)
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; tab?: string }>
}) {
  const { payment, tab } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const featureFlags = await getEffectiveFeatureFlags(user?.email)
  const activeTab = user && tab === 'pembelian' ? 'pembelian' : 'beranda'

  // ── Guest view ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 fade-up">
        {/* ── Hero ── */}
        <div className="relative rounded-3xl overflow-hidden text-white p-8 sm:p-10"
          style={{ background: 'linear-gradient(135deg,#0F2C44 0%,#0a1f30 55%,#0B3D30 100%)' }}>
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
              Simulasi tes rekrutmen PLN · ASTRA · BUMN · ANTAM
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold leading-tight">
              Tembus seleksi kerja dengan <span className="text-brand-300">latihan yang tepat</span>
            </h1>
            <p className="text-white/65 text-sm sm:text-base mt-3 max-w-md leading-relaxed">
              Kerjakan simulasi dengan format &amp; timer persis tes aslinya, lalu lihat peta kesiapanmu per sub-tes.
              Mulai gratis, tanpa kartu kredit.
            </p>
            <div className="mt-6">
              <GuestLoginCta />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-300" /> 80+ soal gratis</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-300" /> Analisis per sub-tes</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-300" /> Timer realistis</span>
            </div>
          </div>
          <ExamIllustration className="absolute -right-6 bottom-0 w-56 sm:w-72 lg:w-80 opacity-90 pointer-events-none select-none hidden sm:block" />
        </div>

        {/* ── 3 value props ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-brand" />
            </div>
            <p className="font-heading font-bold text-ink">Format Persis Aslinya</p>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">Sub-tes, timer, dan passing grade mengikuti tes rekrutmen sungguhan.</p>
          </div>
          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-brand" />
            </div>
            <p className="font-heading font-bold text-ink">Peta Kesiapanmu</p>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">Tahu sub-tes mana yang kuat dan mana yang perlu dilatih.</p>
          </div>
          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-brand" />
            </div>
            <p className="font-heading font-bold text-ink">Progress Terukur</p>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">Pantau peningkatan skor dari waktu ke waktu di Rapor Belajar.</p>
          </div>
        </div>

        {/* ── CTA utama ── */}
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

        {/* ── Katalog portal ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/portal/astra"
            className="bg-white rounded-2xl border border-hairline shadow-soft p-5 hover:border-brand/30 card-hover">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5 text-brand" />
            </div>
            <p className="font-heading font-bold text-ink">Psikotes ASTRA</p>
            <p className="text-xs text-ink-muted mt-1">80 soal · 7 sub-tes · 41 menit. Lihat paketnya tanpa login.</p>
          </Link>
          {featureFlags.feature_portal_pln && (
          <Link href="/portal/pln"
            className="bg-white rounded-2xl border border-hairline shadow-soft p-5 hover:border-brand/30 card-hover">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-brand" />
            </div>
            <p className="font-heading font-bold text-ink">Rekrutmen PLN</p>
            <p className="text-xs text-ink-muted mt-1">GAT + Tahap 2 Akademik, format per sub-tes seperti aslinya.</p>
          </Link>
          )}
          {featureFlags.feature_portal_antam && (
          <Link href="/portal/antam"
            className="bg-white rounded-2xl border border-hairline shadow-soft p-5 hover:border-brand/30 card-hover">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <Mountain className="w-5 h-5 text-brand" />
            </div>
            <p className="font-heading font-bold text-ink">ANTAM IMPACT 2026</p>
            <p className="text-xs text-ink-muted mt-1">14 job stream · 40 soal · 50 menit per stream.</p>
          </Link>
          )}
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
  const fmt      = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  const fmtTime  = (d: string) => new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const fmtLong  = (d: string | null) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
  const fmtAmount= (n: number) => 'Rp ' + n.toLocaleString('id-ID')

  // ── Data: Beranda ──────────────────────────────────────────────────────────
  let attempts: AttemptPreview[] = []
  const packageMap: Record<string, { name: string; category: string }> = {}
  let totalCount = 0, avgScore = 0, highestScore = 0
  let mastery: { code: string; pct: number }[] = []
  let deltaCount = 0, deltaAvg = 0, avgScorePctChange: number | null = null

  if (activeTab === 'beranda') {
    const { data: attemptsData } = await supabase
      .from('attempts')
      .select('id, score, started_at, finished_at, package_id, score_details')
      .eq('user_id', user.id)
      .eq('status', 'finished')
      .order('started_at', { ascending: false })
      .limit(20)
    attempts = (attemptsData ?? []) as AttemptPreview[]

    const packageIds = Array.from(new Set(attempts.map((a) => a.package_id).filter(Boolean)))
    const { data: pkgsData } = packageIds.length > 0
      ? await supabase.from('packages').select('id, name, category').in('id', packageIds)
      : { data: [] }
    for (const p of (pkgsData ?? [])) {
      const pkg = p as { id: string; name: string; category: string }
      packageMap[pkg.id] = { name: pkg.name, category: pkg.category }
    }

    totalCount   = attempts.length
    avgScore     = totalCount > 0 ? Math.round(attempts.reduce((s, a) => s + (a.score ?? 0), 0) / totalCount) : 0
    highestScore = totalCount > 0 ? Math.max(...attempts.map((a) => a.score ?? 0)) : 0
    mastery      = extractMastery(attempts)

    // Week-over-week trend
    const now = Date.now()
    const weekMs = 7 * 24 * 60 * 60 * 1000
    const thisWeek = attempts.filter((a) => now - new Date(a.started_at).getTime() <= weekMs)
    const lastWeek = attempts.filter((a) => {
      const age = now - new Date(a.started_at).getTime()
      return age > weekMs && age <= 2 * weekMs
    })
    const thisAvg = thisWeek.length > 0 ? Math.round(thisWeek.reduce((s, a) => s + (a.score ?? 0), 0) / thisWeek.length) : null
    const prevAvg = lastWeek.length > 0 ? Math.round(lastWeek.reduce((s, a) => s + (a.score ?? 0), 0) / lastWeek.length) : null
    deltaCount = thisWeek.length - lastWeek.length
    deltaAvg   = (thisAvg ?? 0) - (prevAvg ?? 0)
    if (thisAvg !== null && prevAvg !== null && prevAvg > 0) {
      avgScorePctChange = Math.round(((thisAvg - prevAvg) / prevAvg) * 100)
    }
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

  // Ring geometry (hero)
  const R = 50, C = 2 * Math.PI * R
  const offset = C * (1 - Math.min(100, Math.max(0, avgScore)) / 100)
  const weakest = mastery.length > 0 ? mastery[mastery.length - 1] : null

  return (
    <div className="max-w-5xl mx-auto space-y-5 fade-up">

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

      {/* ── TAB: BERANDA ──────────────────────────────────────────────────── */}
      {activeTab === 'beranda' && (
        <>
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-ink">Halo, {name} 👋</h1>
            <p className="text-ink-muted text-sm mt-0.5">Terus belajar, raih skor terbaikmu!</p>
          </div>

          {/* Premium badge */}
          {(premiumSub.active || plnSub.active) && (
            <div className="flex flex-wrap gap-2">
              {premiumSub.active && premiumSub.expiresAt && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand-700 font-semibold text-xs rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> Premium s/d {fmt(premiumSub.expiresAt)}
                </span>
              )}
              {plnSub.active && plnSub.expiresAt && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 font-semibold text-xs rounded-full">
                  <Zap className="w-3.5 h-3.5" />
                  PLN{plnSub.bidang && BIDANG_BY_SLUG[plnSub.bidang] ? ` · ${BIDANG_BY_SLUG[plnSub.bidang].short}` : ''} s/d {fmt(plnSub.expiresAt)}
                </span>
              )}
            </div>
          )}

          {totalCount === 0 ? (
            /* Empty / onboarding state */
            <div className="bg-white rounded-2xl border border-hairline shadow-soft p-8 text-center">
              <SummitIllustration className="w-40 h-32 mx-auto mb-2 pointer-events-none select-none" />
              <h2 className="text-lg font-heading font-bold text-ink">Mulai simulasi pertamamu</h2>
              <p className="text-ink-muted text-sm mt-1 mb-5 max-w-md mx-auto">
                Kerjakan satu simulasi untuk melihat peta kesiapanmu dan kelemahan yang perlu dilatih.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/portal/astra" className="inline-flex items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
                  <Briefcase className="w-4 h-4" /> Psikotes ASTRA
                </Link>
                {featureFlags.feature_portal_pln && (
                <Link href="/portal/pln" className="inline-flex items-center gap-2 bg-white border border-hairline text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-paper-soft transition-colors">
                  <Zap className="w-4 h-4" /> Rekrutmen PLN
                </Link>
                )}
                {featureFlags.feature_portal_antam && (
                <Link href="/portal/antam" className="inline-flex items-center gap-2 bg-white border border-hairline text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-paper-soft transition-colors">
                  <Mountain className="w-4 h-4" /> ANTAM IMPACT
                </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* ── Row 1: Hero 2-col ── */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-4 items-stretch">

                {/* Left hero card — rata-rata skor + mountain */}
                <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#0F2C44 0%,#0a1f30 100%)', minHeight: 220 }}>
                  {/* Mountain SVG background */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" fill="none">
                    <circle cx="490" cy="38" r="1.5" fill="white" fillOpacity="0.35"/>
                    <circle cx="525" cy="18" r="1"   fill="white" fillOpacity="0.25"/>
                    <circle cx="548" cy="55" r="1.5" fill="white" fillOpacity="0.3"/>
                    <circle cx="510" cy="70" r="1"   fill="white" fillOpacity="0.2"/>
                    <path d="M300 260 L390 110 L480 260Z" fill="white" fillOpacity="0.04"/>
                    <path d="M360 260 L450 70 L545 260Z" fill="white" fillOpacity="0.05"/>
                    <path d="M395 260 L490 35 L585 260Z" fill="white" fillOpacity="0.07"/>
                    <line x1="490" y1="35" x2="490" y2="10" stroke="white" strokeWidth="2" strokeOpacity="0.65"/>
                    <polygon points="490,10 512,19 490,28" fill="white" fillOpacity="0.8"/>
                    <path d="M160 220 Q280 170 390 120 Q440 95 490 35" stroke="white" strokeWidth="1.5" strokeDasharray="5 5" strokeOpacity="0.2" fill="none"/>
                  </svg>

                  <div className="relative z-10 p-6 sm:p-7">
                    <p className="text-[10px] uppercase tracking-widest text-white/45 font-bold mb-4">Rata-rata Skor</p>

                    <div className="flex items-start gap-5">
                      {/* Ring */}
                      <div className="relative w-[116px] h-[116px] shrink-0">
                        <svg width="116" height="116" viewBox="0 0 116 116" className="-rotate-90">
                          <circle cx="58" cy="58" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10"/>
                          <circle cx="58" cy="58" r={R} fill="none" stroke="#34D399" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset}/>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-num font-bold text-[34px] text-white leading-none">{avgScore}</span>
                          <span className="text-[11px] text-white/45 mt-0.5">/100</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-1 pt-0.5">
                        {/* Trend */}
                        {avgScorePctChange !== null && (
                          <span className={`inline-flex items-center gap-1 text-xs font-bold mb-3 ${avgScorePctChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {avgScorePctChange >= 0 ? '↑' : '↓'} {Math.abs(avgScorePctChange)}% dari minggu lalu
                          </span>
                        )}

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-5">
                          <div>
                            <p className="text-white/40 text-[10px]">Simulasi Selesai</p>
                            <p className="font-num font-bold text-[26px] text-white leading-tight">{totalCount}</p>
                            <p className="text-white/35 text-[10px]">Total simulasi</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-[10px]">Skor Tertinggi</p>
                            <p className="font-num font-bold text-[26px] text-white leading-tight">{highestScore}</p>
                            <p className="text-white/35 text-[10px]">Pencapaian terbaikmu</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link href="/portal/astra"
                            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors border border-white/15">
                            Lanjut Latihan <ArrowRight className="w-3.5 h-3.5"/>
                          </Link>
                          <Link href="/rapor"
                            className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors">
                            Lihat Rapor
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right card — next step */}
                <div className="rounded-3xl p-6 text-white flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#132d45,#0e2035)' }}>
                  <p className="text-[10px] uppercase tracking-widest text-white/45 font-bold mb-3">Langkah Berikutnya</p>
                  <h3 className="text-[17px] font-heading font-bold text-white mb-1.5 leading-snug">
                    Simulasi Psikotes ASTRA
                  </h3>
                  <p className="text-white/55 text-sm mb-4 leading-relaxed">
                    Latih kondisi tes sesungguhnya dengan 7 sub-tes dan analisis skor langsung.
                  </p>
                  <div className="flex gap-4 text-xs text-white/60 mb-5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-white/40"/> Estimasi waktu
                      <b className="text-white/80 font-num">±41 menit</b>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60 mb-6">
                    <FileText className="w-3.5 h-3.5 text-white/40"/> Jumlah soal
                    <b className="text-white/80 font-num">80 soal</b>
                  </div>
                  <Link href="/portal/astra"
                    className="mt-auto inline-flex items-center gap-2 bg-brand hover:bg-brand-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors w-fit">
                    Mulai Sekarang <ArrowRight className="w-4 h-4"/>
                  </Link>
                  <Image
                    src="/checkbox.png"
                    alt=""
                    aria-hidden="true"
                    width={140}
                    height={140}
                    className="absolute bottom-0 right-0 w-28 sm:w-32 md:w-40 h-auto object-contain pointer-events-none select-none"
                  />
                </div>
              </div>

              {/* ── Row 2: Stat tiles ── */}
              <div className="grid grid-cols-3 gap-4">
                {/* Total Simulasi */}
                <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 grid place-items-center mb-3">
                    <FileText className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <p className="text-ink-muted text-xs mb-1">Total Simulasi</p>
                  <p className="font-num font-bold text-[28px] text-ink leading-none">{totalCount}</p>
                  {deltaCount !== 0 && (
                    <p className={`text-[11px] mt-1.5 font-semibold ${deltaCount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {deltaCount > 0 ? '↑' : '↓'} {Math.abs(deltaCount)} dari minggu lalu
                    </p>
                  )}
                </div>

                {/* Rata-rata Skor */}
                <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 grid place-items-center mb-3">
                    <TrendingUp className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <p className="text-ink-muted text-xs mb-1">Rata-rata Skor</p>
                  <p className="font-num font-bold text-[28px] text-ink leading-none">{avgScore}</p>
                  {deltaAvg !== 0 && (
                    <p className={`text-[11px] mt-1.5 font-semibold ${deltaAvg > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {deltaAvg > 0 ? '↑' : '↓'} {Math.abs(deltaAvg)} dari minggu lalu
                    </p>
                  )}
                </div>

                {/* Skor Tertinggi */}
                <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 grid place-items-center mb-3">
                    <Trophy className="w-4.5 h-4.5 text-amber-500" />
                  </div>
                  <p className="text-ink-muted text-xs mb-1">Skor Tertinggi</p>
                  <p className="font-num font-bold text-[28px] text-ink leading-none">{highestScore}</p>
                  <p className="text-[11px] mt-1.5 text-ink-muted">dari semua simulasimu</p>
                </div>
              </div>

              {/* ── Row 3: Mastery + History ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

                {/* Penguasaan Sub-tes */}
                {mastery.length > 0 && (
                  <div className="bg-white rounded-2xl border border-hairline shadow-soft p-6">
                    <div className="mb-4">
                      <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Penguasaan Sub-tes</p>
                      <p className="text-xs text-ink-muted mt-0.5">Dari {totalCount} simulasi terakhirmu</p>
                    </div>
                    <div className="space-y-3">
                      {mastery.map((m) => {
                        const ml = masteryLabel(m.pct)
                        return (
                          <div key={m.code} className="flex items-center gap-2.5">
                            <span className="w-10 text-[10px] font-bold text-center text-ink bg-paper-soft rounded-md py-1 shrink-0">{m.code}</span>
                            <span className="w-[120px] text-[12px] text-ink-soft truncate shrink-0">{SUBTEST_FULL[m.code] ?? m.code}</span>
                            <div className="flex-1 h-[7px] bg-hairline rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: ml.barColor }} />
                            </div>
                            <span className="w-8 text-right font-num text-[12px] text-ink font-semibold shrink-0">{m.pct}%</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ml.cls}`}>{ml.text}</span>
                          </div>
                        )
                      })}
                    </div>
                    {weakest && (
                      <Link href="/rapor"
                        className="mt-4 flex items-center justify-between w-full px-4 py-2.5 bg-paper-soft hover:bg-hairline rounded-xl transition-colors text-sm font-semibold text-brand">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Fokus Latihan Area Lemah
                        </div>
                        <ChevronRight className="w-4 h-4 text-ink-muted" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Riwayat Terakhir */}
                <div className="bg-white rounded-2xl border border-hairline shadow-soft p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Riwayat Terakhir</p>
                    <Link href="/riwayat" className="text-xs text-brand font-semibold hover:text-brand-700">Lihat Semua</Link>
                  </div>
                  <div className="space-y-1">
                    {attempts.slice(0, 6).map((a, i) => {
                      const pkg = packageMap[a.package_id]
                      const d = new Date(a.started_at)
                      const day = d.getDate()
                      const mon = d.toLocaleDateString('id-ID', { month: 'short' }).replace('.', '').toUpperCase()
                      // Bandingkan dengan attempt LEBIH LAMA pada PAKET YANG SAMA saja
                      // (jangan bandingkan antar paket/stream yang berbeda)
                      let prevScore: number | null = null
                      for (let j = i + 1; j < attempts.length; j++) {
                        if (attempts[j].package_id === a.package_id && attempts[j].score != null) {
                          prevScore = attempts[j].score
                          break
                        }
                      }
                      const delta = prevScore !== null ? (a.score ?? 0) - prevScore : null
                      return (
                        <Link key={a.id} href={`/hasil/${a.id}`}
                          className="flex items-center gap-3 py-2.5 px-1 hover:bg-paper-soft rounded-xl transition-colors group">
                          {/* Date box */}
                          <div className="w-11 h-11 rounded-xl bg-paper-soft flex flex-col items-center justify-center shrink-0">
                            <span className="font-num font-bold text-[15px] text-ink leading-none">{day}</span>
                            <span className="text-[9px] text-ink-muted font-semibold">{mon}</span>
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-ink truncate">{pkg?.name ?? 'Paket'}</p>
                            <p className="text-[11px] text-ink-muted mt-0.5">
                              {formatDate(a.started_at)} · {fmtTime(a.started_at)}
                            </p>
                          </div>
                          {/* Score */}
                          <div className="flex flex-col items-end shrink-0">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-ink-muted">Skor</span>
                              <span className="font-num font-bold text-[15px] text-ink">{a.score ?? '–'}</span>
                            </div>
                            {delta !== null && delta !== 0 && (
                              <span className={`text-[10px] font-bold ${delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {delta > 0 ? `↑ ${delta}` : `↓ ${Math.abs(delta)}`}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-ink-muted shrink-0 group-hover:text-ink transition-colors" />
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
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-ink">Pembelian</h1>
            <p className="text-ink-muted text-sm mt-0.5">Riwayat transaksi dan paket yang kamu miliki.</p>
          </div>

          {activeSubs.length > 0 && (
            <div className="space-y-3">
              <SectionLabel>Langganan Aktif</SectionLabel>
              {activeSubs.map((sub) => (
                <div key={sub.id} className="bg-amber-50 border border-amber-200 rounded-2xl shadow-soft p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                  </div>
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
              <SectionLabel>Paket Satuan Dimiliki</SectionLabel>
              <div className="bg-white rounded-2xl border border-hairline shadow-soft divide-y divide-hairline overflow-hidden">
                {unlocks.map((unlock) => (
                  <div key={unlock.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-brand" />
                    </div>
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
            <SectionLabel>Semua Transaksi</SectionLabel>
            {subs.length === 0 && unlocks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-hairline shadow-soft p-10 text-center">
                <div className="w-12 h-12 bg-paper-soft rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6 text-ink-muted" />
                </div>
                <p className="font-semibold text-ink text-sm">Belum ada pembelian</p>
                <p className="text-xs text-ink-muted mt-1 mb-4">Mulai dengan memilih paket di portal seleksi.</p>
                <Link href="/portal/astra" className="inline-flex items-center gap-1 text-xs font-bold text-white bg-brand hover:bg-brand-700 px-4 py-2 rounded-xl transition-colors">
                  Mulai Simulasi →
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-hairline shadow-soft divide-y divide-hairline overflow-hidden">
                {subs.map((sub) => {
                  const cfg = STATUS_CONFIG[sub.status] ?? { label: sub.status, cls: 'bg-gray-100 text-gray-500' }
                  return (
                    <div key={sub.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-8 h-8 bg-paper-soft rounded-lg flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4 text-ink-muted" />
                      </div>
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
            Ada pertanyaan soal pembayaran? Hubungi{' '}
            <a href="mailto:support@tembuskarir.id" className="underline hover:text-ink">support@tembuskarir.id</a>
          </p>
        </div>
      )}
    </div>
  )
}
