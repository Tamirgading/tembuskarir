import { createServiceClient } from '@/lib/supabase/server'
import { MiniLineChart } from '@/components/admin/Chart'
import { formatRupiah } from '@/lib/utils'
import {
  DollarSign, Users, FileCheck, TrendingUp, Eye,
  Crown, Package, BadgeCheck, CircleDollarSign, Wallet,
} from 'lucide-react'

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

function dayKey(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function last30Days(): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    out.push({ key: dayKey(d), label: `${d.getDate()}/${d.getMonth() + 1}` })
  }
  return out
}

function fillSeries(days: { key: string; label: string }[], map: Record<string, number>) {
  return days.map((d) => ({ label: d.label, value: map[d.key] ?? 0 }))
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

  // ── Data ───────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usersQuery = (supabase.from('users') as any).select('id, email, full_name, plan, created_at')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subsQuery = (supabase.from('subscriptions') as any).select('id, user_id, plan_type, amount, status, paid_at, created_at, package_id, bidang')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attemptsQuery = (supabase.from('attempts') as any)
    .select('started_at, status, score, package_id, user_id')
    .eq('status', 'finished')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewsQuery = (supabase.from('page_views') as any).select('created_at')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pkgQuery = (supabase.from('packages') as any).select('id, name')

  const [usersRes, subsRes, attemptsRes, viewsRes, pkgRes] = await Promise.all([
    usersQuery, subsQuery, attemptsQuery, viewsQuery, pkgQuery,
  ])

  const users = (usersRes.data ?? []) as UserLite[]
  const allSubs = (subsRes.data ?? []) as SubRow[]
  const attempts = (attemptsRes.data ?? []) as { started_at: string; status: string; score: number | null; package_id: string; user_id: string }[]
  const views = (viewsRes.data ?? []) as { created_at: string }[]
  const packageNameMap = Object.fromEntries(((pkgRes.data ?? []) as { id: string; name: string }[]).map((p) => [p.id, p.name]))

  const paidSubs = allSubs.filter((s) => s.status === 'paid')

  // ── KPI ─────────────────────────────────────────────────────────────────────
  const totalRevenue = paidSubs.reduce((sum, s) => sum + s.amount, 0)
  const totalUsers = users.length
  const premiumUsers = users.filter((u) => u.plan === 'premium').length
  const finishedAttempts = attempts.length
  const totalVisits = views.length

  // ── Series 30 hari ──────────────────────────────────────────────────────────
  const days = last30Days()

  const revenueByDay: Record<string, number> = {}
  const usersByDay: Record<string, number> = {}
  const attemptsByDay: Record<string, number> = {}
  const viewsByDay: Record<string, number> = {}

  for (const s of paidSubs) {
    if (!s.paid_at) continue
    const k = dayKey(s.paid_at)
    revenueByDay[k] = (revenueByDay[k] ?? 0) + s.amount
  }
  for (const u of users) {
    const k = dayKey(u.created_at)
    usersByDay[k] = (usersByDay[k] ?? 0) + 1
  }
  for (const a of attempts) {
    const k = dayKey(a.started_at)
    attemptsByDay[k] = (attemptsByDay[k] ?? 0) + 1
  }
  for (const v of views) {
    const k = dayKey(v.created_at)
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
    .slice(0, 30)

  const kpis = [
    { label: 'Total Revenue', value: formatRupiah(totalRevenue), sub: `${paidSubs.length} transaksi lunas`, Icon: DollarSign, cls: 'bg-green-50 text-green-700' },
    { label: 'Revenue 30 Hari', value: formatRupiah(revenue30d), sub: `${revenueSeries.reduce((s, p) => s + (p.value > 0 ? 1 : 0), 0)} hari bertransaksi`, Icon: TrendingUp, cls: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Users', value: String(totalUsers), sub: `+${users30d} dalam 30 hari`, Icon: Users, cls: 'bg-blue-50 text-blue-700' },
    { label: 'User Premium', value: String(premiumUsers), sub: `${Math.round((premiumUsers / Math.max(1, totalUsers)) * 100)}% dari total`, Icon: Crown, cls: 'bg-amber-50 text-amber-700' },
    { label: 'Ujian Selesai', value: String(finishedAttempts), sub: `+${attempts30d} dalam 30 hari`, Icon: FileCheck, cls: 'bg-purple-50 text-purple-700' },
    { label: 'Kunjungan 30 Hari', value: String(views30d), sub: `${totalVisits} total sejak tracking`, Icon: Eye, cls: 'bg-cyan-50 text-cyan-700' },
  ]

  const chartTabs = [
    { key: 'revenue', label: 'Revenue', Icon: DollarSign },
    { key: 'pengunjung', label: 'Pengunjung', Icon: Eye },
    { key: 'user', label: 'User Baru', Icon: Users },
    { key: 'ujian', label: 'Ujian', Icon: FileCheck },
  ]

  const chartDataMap: Record<string, { label: string; value: number }[]> = {
    revenue: revenueSeries,
    pengunjung: viewsSeries,
    user: usersSeries,
    ujian: attemptsSeries,
  }

  const activeChart = tab && chartTabs.some((t) => t.key === tab) ? tab : 'revenue'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue & Analytics</h1>
        <p className="text-gray-500 mt-1">Ringkasan pendapatan, pengunjung, dan transaksi platform</p>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(({ label, value, sub, Icon, cls }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${cls}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Grafik ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Grafik utama (tab) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-semibold text-gray-900">Tren 30 Hari</h2>
            <div className="flex gap-1">
              {chartTabs.map((t) => (
                <a
                  key={t.key}
                  href={`/admin/revenue?tab=${t.key}${activeTab !== 'paid' ? `&status=${activeTab}` : ''}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    activeChart === t.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
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
            formatValue={(v) => (activeChart === 'revenue' ? `${Math.round(v / 1000)}rb` : String(v))}
          />
        </div>

        {/* Top spender */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-600" />
            <h2 className="font-semibold text-gray-900">Pembayaran Terbanyak</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {topSpenders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Belum ada transaksi.</p>
            ) : (
              topSpenders.map((t, i) => (
                <div key={t.userId} className="px-5 py-3 flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{t.user?.full_name ?? '—'}</p>
                    <p className="text-xs text-gray-400 truncate">{t.user?.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatRupiah(t.total)}</p>
                    <p className="text-[10px] text-gray-400">{t.count} transaksi</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Paket terlaris + premium breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Paket Terlaris</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {topPackages.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Belum ada pembelian paket.</p>
            ) : (
              topPackages.map((p, i) => (
                <div key={p.packageId} className="px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.count} terjual</p>
                  </div>
                  <p className="text-sm font-bold text-green-600 shrink-0">{formatRupiah(p.revenue)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-purple-600" />
            <h2 className="font-semibold text-gray-900">Breakdown Langganan Premium</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5">
            {Object.keys(premiumBreakdown).length === 0 ? (
              <p className="text-sm text-gray-400 col-span-full">Belum ada langganan premium.</p>
            ) : (
              Object.entries(premiumBreakdown).map(([label, count]) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Transaksi Terbaru ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-green-600" />
              <h2 className="font-semibold text-gray-900">Transaksi</h2>
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
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    activeTab === f.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Pembeli</th>
              <th className="px-5 py-3 font-medium">Paket</th>
              <th className="px-5 py-3 font-medium text-right">Nominal</th>
              <th className="px-5 py-3 font-medium text-right">Tanggal</th>
              <th className="px-5 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">Tidak ada transaksi.</td>
              </tr>
            ) : (
              filteredSubs.map((s) => {
                const buyer = s.user_id ? userMap[s.user_id] : undefined
                const st = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.paid
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{buyer?.full_name ?? '—'}</p>
                      <p className="text-xs text-gray-400">{buyer?.email ?? s.user_id}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{planLabel(s, packageNameMap)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-green-600">{formatRupiah(s.amount)}</td>
                    <td className="px-5 py-3 text-right text-gray-400 text-xs">
                      {new Date(s.paid_at ?? s.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>{st.label}</span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
