import { createServiceClient } from '@/lib/supabase/server'
import { MiniLineChart } from '@/components/admin/Chart'
import { RevenueRealtimeBar } from '@/components/admin/RevenueRealtimeBar'
import { formatRupiah } from '@/lib/utils'
import {
  DollarSign, Users, FileCheck, TrendingUp, Eye,
  Crown, Package, BadgeCheck, CircleDollarSign, Wallet,
  CalendarCheck, CalendarDays
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface SubRow {
  id: string
  user_id: string
  plan_type: string
  amount: number
  status: string
  paid_at: string | null
  created_at: string
  package_id: string | null
  bidang: string | null
}

interface UserLite { id: string; email: string; full_name: string | null; plan: string; created_at: string }

const PLAN_LABELS: Record<string, string> = {
  premium_monthly:      'Premium All Access 1 Bulan',
  premium_quarterly:    'Premium All Access 3 Bulan',
  package:              'Paket Soal',
  monthly:              'Paket Soal',
  yearly:               'Paket Soal Tahunan',
  astra_monthly:        'ASTRA Bulanan',
  bumn_t1_monthly:      'BUMN Tahap 1 Bulanan',
  bumn_t2_monthly:      'BUMN Tahap 2 Bulanan',
  antam_monthly:        'ANTAM Bulanan',
  pln_gat_monthly:      'PLN Tahap 1 GAT',
  pln_tahap2_monthly:   'PLN Tahap 2',
  pln_complete_monthly: 'PLN Complete',
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  paid:    { label: 'Lunas',       cls: 'bg-green-100 text-green-700' },
  pending: { label: 'Menunggu',    cls: 'bg-yellow-100 text-yellow-700' },
  failed:  { label: 'Gagal',       cls: 'bg-red-100 text-red-600' },
  expired: { label: 'Kedaluwarsa', cls: 'bg-gray-100 text-gray-500' },
}

/**
 * Format string tanggal atau objek Date ke format YYYY-MM-DD dalam zona waktu Indonesia Barat (WIB, Asia/Jakarta)
 */
function getWibDateKey(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function getWibTodayKey(): string {
  return getWibDateKey(new Date())
}

function getWibYesterdayKey(): string {
  const now = new Date()
  const todayKey = getWibDateKey(now)
  const [y, m, d] = todayKey.split('-').map(Number)
  const yest = new Date(Date.UTC(y, m - 1, d - 1, 12, 0, 0))
  return getWibDateKey(yest)
}

/**
 * Buat array 30 hari terakhir berdasarkan kalender WIB (Asia/Jakarta)
 */
function last30DaysWib(): { key: string; label: string; dateFormatted: string }[] {
  const out: { key: string; label: string; dateFormatted: string }[] = []
  const now = new Date()
  const todayKey = getWibDateKey(now)
  const [y, m, d] = todayKey.split('-').map(Number)

  for (let i = 29; i >= 0; i--) {
    const targetDate = new Date(Date.UTC(y, m - 1, d - i, 12, 0, 0))
    const key = getWibDateKey(targetDate)
    const [, km, kd] = key.split('-').map(Number)
    const label = `${kd}/${km}`
    const dateFormatted = targetDate.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    out.push({
      key,
      label,
      dateFormatted,
    })
  }
  return out
}

function fillSeries(days: { key: string; label: string; dateFormatted: string }[], map: Record<string, number>) {
  return days.map((d) => ({
    label: d.label,
    value: map[d.key] ?? 0,
    date: d.dateFormatted,
  }))
}

function planLabel(s: SubRow, packageNameMap: Record<string, string>): string {
  const base = PLAN_LABELS[s.plan_type] ?? s.plan_type
  if (s.plan_type === 'package') {
    const pkgName = s.package_id ? packageNameMap[s.package_id] : null
    return pkgName ? `Paket Soal · ${pkgName}` : 'Paket Soal'
  }
  if ((s.plan_type === 'pln_tahap2_monthly' || s.plan_type === 'pln_complete_monthly') && s.bidang) {
    const label = PLAN_LABELS[s.plan_type] ?? s.plan_type
    return `${label} · ${s.bidang}`
  }
  return base
}

export default async function AdminRevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tab?: string }>
}) {
  const { status, tab } = await searchParams
  const supabase = createServiceClient()

  // Cutoff 32 hari yang lalu untuk limit agregasi series
  const thirtyTwoDaysAgoUtc = new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()

  // ── Data Queries ───────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usersQuery = (supabase.from('users') as any)
    .select('id, email, full_name, plan, created_at')
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subsQuery = (supabase.from('subscriptions') as any)
    .select('id, user_id, plan_type, amount, status, paid_at, created_at, package_id, bidang')
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attemptsQuery = (supabase.from('attempts') as any)
    .select('started_at, status, score, package_id, user_id')
    .eq('status', 'finished')
    .gte('started_at', thirtyTwoDaysAgoUtc)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalAttemptsQuery = (supabase.from('attempts') as any)
    .select('*', { count: 'exact', head: true })
    .eq('status', 'finished')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewsQuery = (supabase.from('page_views') as any)
    .select('created_at')
    .gte('created_at', thirtyTwoDaysAgoUtc)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalViewsQuery = (supabase.from('page_views') as any)
    .select('*', { count: 'exact', head: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pkgQuery = (supabase.from('packages') as any).select('id, name')

  const [usersRes, subsRes, attemptsRes, totalAttemptsRes, viewsRes, totalViewsRes, pkgRes] = await Promise.all([
    usersQuery,
    subsQuery,
    attemptsQuery,
    totalAttemptsQuery,
    viewsQuery,
    totalViewsQuery,
    pkgQuery,
  ])

  const users = (usersRes.data ?? []) as UserLite[]
  const allSubs = (subsRes.data ?? []) as SubRow[]
  const attempts = (attemptsRes.data ?? []) as { started_at: string; status: string; score: number | null; package_id: string; user_id: string }[]
  const views = (viewsRes.data ?? []) as { created_at: string }[]
  const packageNameMap = Object.fromEntries(((pkgRes.data ?? []) as { id: string; name: string }[]).map((p) => [p.id, p.name]))

  const paidSubs = allSubs.filter((s) => s.status === 'paid')

  // ── Penyesuaian Kalender WIB (Asia/Jakarta) ─────────────────────────────────
  const todayKey = getWibTodayKey()
  const yesterdayKey = getWibYesterdayKey()
  const thisMonthKey = todayKey.slice(0, 7) // format "YYYY-MM"

  // Transaksi Hari Ini (WIB)
  const todayPaidSubs = paidSubs.filter((s) => s.paid_at && getWibDateKey(s.paid_at) === todayKey)
  const todayRevenue = todayPaidSubs.reduce((sum, s) => sum + s.amount, 0)

  // Transaksi Kemarin (WIB)
  const yesterdayPaidSubs = paidSubs.filter((s) => s.paid_at && getWibDateKey(s.paid_at) === yesterdayKey)
  const yesterdayRevenue = yesterdayPaidSubs.reduce((sum, s) => sum + s.amount, 0)

  // Transaksi Bulan Ini (WIB)
  const monthPaidSubs = paidSubs.filter((s) => s.paid_at && getWibDateKey(s.paid_at).startsWith(thisMonthKey))
  const monthRevenue = monthPaidSubs.reduce((sum, s) => sum + s.amount, 0)

  // ── KPI Ringkasan ──────────────────────────────────────────────────────────
  const totalRevenue = paidSubs.reduce((sum, s) => sum + s.amount, 0)
  const totalUsers = users.length
  const premiumUsers = users.filter((u) => u.plan === 'premium').length
  const finishedAttempts = totalAttemptsRes.count ?? attempts.length
  const totalVisits = totalViewsRes.count ?? views.length

  // ── Series 30 hari (WIB) ───────────────────────────────────────────────────
  const days = last30DaysWib()

  const revenueByDay: Record<string, number> = {}
  const usersByDay: Record<string, number> = {}
  const attemptsByDay: Record<string, number> = {}
  const viewsByDay: Record<string, number> = {}

  for (const s of paidSubs) {
    if (!s.paid_at) continue
    const k = getWibDateKey(s.paid_at)
    revenueByDay[k] = (revenueByDay[k] ?? 0) + s.amount
  }
  for (const u of users) {
    const k = getWibDateKey(u.created_at)
    usersByDay[k] = (usersByDay[k] ?? 0) + 1
  }
  for (const a of attempts) {
    const k = getWibDateKey(a.started_at)
    attemptsByDay[k] = (attemptsByDay[k] ?? 0) + 1
  }
  for (const v of views) {
    const k = getWibDateKey(v.created_at)
    viewsByDay[k] = (viewsByDay[k] ?? 0) + 1
  }

  const revenueSeries = fillSeries(days, revenueByDay)
  const usersSeries = fillSeries(days, usersByDay)
  const attemptsSeries = fillSeries(days, attemptsByDay)
  const viewsSeries = fillSeries(days, viewsByDay)

  const revenue30d = revenueSeries.reduce((sum, p) => sum + p.value, 0)
  const users30d = usersSeries.reduce((sum, p) => sum + p.value, 0)
  const attempts30d = attemptsSeries.reduce((sum, p) => sum + p.value, 0)
  const views30d = viewsSeries.reduce((sum, p) => sum + p.value, 0)

  // ── Top spender (pembayaran terbanyak) ─────────────────────────────────────
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]))
  const spendByUser: Record<string, { total: number; count: number }> = {}
  for (const s of paidSubs) {
    if (!spendByUser[s.user_id]) spendByUser[s.user_id] = { total: 0, count: 0 }
    spendByUser[s.user_id].total += s.amount
    spendByUser[s.user_id].count++
  }
  const topSpenders = Object.entries(spendByUser)
    .map(([userId, v]) => ({ userId, ...v, user: userMap[userId] }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  // ── Paket terlaris ─────────────────────────────────────────────────────────
  const packageSales: Record<string, { count: number; revenue: number }> = {}
  const premiumBreakdown: Record<string, number> = {}
  for (const s of paidSubs) {
    if (s.plan_type === 'package' && s.package_id) {
      if (!packageSales[s.package_id]) packageSales[s.package_id] = { count: 0, revenue: 0 }
      packageSales[s.package_id].count++
      packageSales[s.package_id].revenue += s.amount
    } else {
      const label = PLAN_LABELS[s.plan_type] ?? s.plan_type
      premiumBreakdown[label] = (premiumBreakdown[label] ?? 0) + 1
    }
  }
  const topPackages = Object.entries(packageSales)
    .map(([packageId, v]) => ({ packageId, name: packageNameMap[packageId] ?? 'Paket (dihapus)', ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // ── Transaksi (dengan filter status) ───────────────────────────────────────
  const activeTab = status && ['paid', 'pending', 'failed', 'expired'].includes(status) ? status : 'paid'
  const filteredSubs = allSubs
    .filter((s) => s.status === activeTab)
    .sort((a, b) => (b.paid_at ?? b.created_at).localeCompare(a.paid_at ?? a.created_at))
    .slice(0, 40)

  // ── Kartu Metrik Utama ─────────────────────────────────────────────────────
  const primaryKpis = [
    {
      label: 'Uang Masuk Hari Ini',
      value: formatRupiah(todayRevenue),
      sub: `${todayPaidSubs.length} transaksi lunas hari ini (WIB)`,
      Icon: CircleDollarSign,
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      badge: 'Hari Ini',
      badgeCls: 'bg-emerald-100 text-emerald-800',
    },
    {
      label: 'Uang Masuk Kemarin',
      value: formatRupiah(yesterdayRevenue),
      sub: `${yesterdayPaidSubs.length} transaksi lunas kemarin (WIB)`,
      Icon: CalendarDays,
      cls: 'bg-blue-50 text-blue-700 border-blue-200/80',
      badge: 'Kemarin',
      badgeCls: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Pendapatan Bulan Ini',
      value: formatRupiah(monthRevenue),
      sub: `${monthPaidSubs.length} transaksi lunas bulan ini`,
      Icon: CalendarCheck,
      cls: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      badge: 'Bulan Ini',
      badgeCls: 'bg-indigo-100 text-indigo-800',
    },
    {
      label: 'Total Revenue (All Time)',
      value: formatRupiah(totalRevenue),
      sub: `${paidSubs.length} total transaksi lunas`,
      Icon: DollarSign,
      cls: 'bg-slate-50 text-slate-700 border-slate-200/80',
      badge: 'Total',
      badgeCls: 'bg-slate-100 text-slate-800',
    },
  ]

  const secondaryKpis = [
    { label: 'Revenue 30 Hari', value: formatRupiah(revenue30d), sub: `${revenueSeries.reduce((s, p) => s + (p.value > 0 ? 1 : 0), 0)} hari bertransaksi`, Icon: TrendingUp, cls: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Users', value: String(totalUsers), sub: `+${users30d} dalam 30 hari`, Icon: Users, cls: 'bg-blue-50 text-blue-700' },
    { label: 'User Premium', value: String(premiumUsers), sub: `${Math.round((premiumUsers / Math.max(1, totalUsers)) * 100)}% dari total`, Icon: Crown, cls: 'bg-amber-50 text-amber-700' },
    { label: 'Ujian Selesai', value: String(finishedAttempts), sub: `+${attempts30d} dalam 30 hari`, Icon: FileCheck, cls: 'bg-purple-50 text-purple-700' },
    { label: 'Kunjungan 30 Hari', value: String(views30d), sub: `${totalVisits.toLocaleString('id-ID')} total tercatat`, Icon: Eye, cls: 'bg-cyan-50 text-cyan-700' },
  ]

  const chartTabs = [
    { key: 'revenue', label: 'Revenue', Icon: DollarSign },
    { key: 'pengunjung', label: 'Pengunjung', Icon: Eye },
    { key: 'user', label: 'User Baru', Icon: Users },
    { key: 'ujian', label: 'Ujian', Icon: FileCheck },
  ]

  const chartDataMap: Record<string, { label: string; value: number; date?: string }[]> = {
    revenue: revenueSeries,
    pengunjung: viewsSeries,
    user: usersSeries,
    ujian: attemptsSeries,
  }

  const activeChart = tab && chartTabs.some((t) => t.key === tab) ? tab : 'revenue'

  return (
    <div className="space-y-6">
      {/* ── Header & Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Revenue &amp; Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring arus kas masuk, pengguna, serta tren transaksi platform secara realtime (WIB).
          </p>
        </div>
      </div>

      {/* ── Realtime Bar & Refresh Controller ── */}
      <RevenueRealtimeBar />

      {/* ── KPI cards Utama (Hari Ini, Kemarin, Bulan Ini, Total) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {primaryKpis.map(({ label, value, sub, Icon, cls, badge, badgeCls }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 shadow-2xs flex flex-col justify-between ${cls}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeCls}`}>
                {badge}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{value}</p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{sub}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Secondary KPI Cards (Users, Ujian, Kunjungan) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {secondaryKpis.map(({ label, value, sub, Icon, cls }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${cls}`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-base font-bold text-slate-900 leading-tight">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
            <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Grafik ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Grafik utama (tab) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Tren 30 Hari Terakhir (WIB)</h2>
              <p className="text-[11px] text-slate-400">Data dikelompokkan berdasarkan zona waktu Indonesia Barat</p>
            </div>
            <div className="flex gap-1">
              {chartTabs.map((t) => (
                <a
                  key={t.key}
                  href={`/admin/revenue?tab=${t.key}${activeTab !== 'paid' ? `&status=${activeTab}` : ''}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                    activeChart === t.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <t.Icon className="w-3.5 h-3.5" />
                  {t.label}
                </a>
              ))}
            </div>
          </div>
          <MiniLineChart
            data={chartDataMap[activeChart]}
            color={activeChart === 'revenue' ? '#059669' : activeChart === 'pengunjung' ? '#0891b2' : activeChart === 'user' ? '#2563eb' : '#7c3aed'}
            chartType={activeChart}
            unit={activeChart === 'ujian' ? 'ujian' : activeChart === 'pengunjung' ? 'kunjungan' : activeChart === 'user' ? 'user' : ''}
          />
        </div>

        {/* Top spender */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-sm">Pembayaran Terbanyak</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {topSpenders.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-slate-400">Belum ada transaksi.</p>
            ) : (
              topSpenders.map((t, i) => (
                <div key={t.userId} className="px-5 py-3 flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{t.user?.full_name ?? '-'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{t.user?.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900 font-mono">{formatRupiah(t.total)}</p>
                    <p className="text-[10px] text-slate-400">{t.count} transaksi</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Paket terlaris + premium breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">Paket Terlaris</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {topPackages.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-slate-400">Belum ada pembelian paket.</p>
            ) : (
              topPackages.map((p, i) => (
                <div key={p.packageId} className="px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.count} terjual</p>
                  </div>
                  <p className="text-xs font-bold text-emerald-600 font-mono shrink-0">{formatRupiah(p.revenue)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-purple-600" />
            <h2 className="font-bold text-slate-900 text-sm">Breakdown Langganan Premium</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5">
            {Object.keys(premiumBreakdown).length === 0 ? (
              <p className="text-xs text-slate-400 col-span-full">Belum ada langganan premium.</p>
            ) : (
              Object.entries(premiumBreakdown).map(([label, count]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <p className="text-xl font-black text-slate-900 font-mono">{count}</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{label}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Transaksi Terbaru ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-sm">Rincian Transaksi Terbaru</h2>
            </div>
            <div className="flex gap-1">
              {[
                { key: 'paid', label: 'Lunas' },
                { key: 'pending', label: 'Menunggu' },
                { key: 'failed', label: 'Gagal' },
                { key: 'expired', label: 'Kedaluwarsa' },
              ].map((f) => (
                <a
                  key={f.key}
                  href={`/admin/revenue?status=${f.key}${activeChart !== 'revenue' ? `&tab=${activeChart}` : ''}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                    activeTab === f.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 bg-slate-50/80 border-b border-slate-100 font-semibold">
                <th className="px-5 py-3 font-semibold">Pembeli</th>
                <th className="px-5 py-3 font-semibold">Paket / Plan</th>
                <th className="px-5 py-3 font-semibold text-right">Nominal</th>
                <th className="px-5 py-3 font-semibold text-right">Tanggal &amp; Waktu (WIB)</th>
                <th className="px-5 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">Tidak ada transaksi.</td>
                </tr>
              ) : (
                filteredSubs.map((s) => {
                  const buyer = s.user_id ? userMap[s.user_id] : undefined
                  const st = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.paid
                  const transDateKey = getWibDateKey(s.paid_at ?? s.created_at)
                  const isToday = transDateKey === todayKey
                  const isYesterday = transDateKey === yesterdayKey

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900">{buyer?.full_name ?? '-'}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{buyer?.email ?? s.user_id}</p>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-700">{planLabel(s, packageNameMap)}</td>
                      <td className="px-5 py-3 text-right font-bold text-emerald-600 font-mono">{formatRupiah(s.amount)}</td>
                      <td className="px-5 py-3 text-right text-slate-500">
                        <div className="flex items-center justify-end gap-1.5">
                          {isToday && (
                            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Hari ini
                            </span>
                          )}
                          {isYesterday && (
                            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              Kemarin
                            </span>
                          )}
                          <span className="font-mono text-[11px]">
                            {new Date(s.paid_at ?? s.created_at).toLocaleString('id-ID', {
                              timeZone: 'Asia/Jakarta',
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })} WIB
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${st.cls}`}>{st.label}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
