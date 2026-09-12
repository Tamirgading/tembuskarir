export const dynamic = 'force-dynamic'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createServiceClient } from '@/lib/supabase/server'
import { SessionRowExpand, type SessionData } from '@/components/admin/SessionRowExpand'
import {
  Activity, CheckCircle2, Clock, Search, RotateCcw,
  ChevronLeft, ChevronRight, Layers, FileText
} from 'lucide-react'

const PAGE_SIZE = 25

export default async function AdminSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; page?: string }>
}) {
  const { q, status, category, page } = await searchParams
  const supabase = createServiceClient()

  const currentPage = Math.max(1, Number(page) || 1)
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // ── Hitung Statistik Ringkasan ──────────────────────────────────────────────
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [totalRes, ongoingRes, finishedRes, todayRes] = await Promise.all([
    (supabase.from('attempts') as any).select('*', { count: 'exact', head: true }),
    (supabase.from('attempts') as any).select('*', { count: 'exact', head: true }).eq('status', 'ongoing'),
    (supabase.from('attempts') as any).select('*', { count: 'exact', head: true }).eq('status', 'finished'),
    (supabase.from('attempts') as any).select('*', { count: 'exact', head: true }).gte('started_at', todayStart),
  ])

  const totalCount = totalRes.count ?? 0
  const ongoingCount = ongoingRes.count ?? 0
  const finishedCount = finishedRes.count ?? 0
  const todayCount = todayRes.count ?? 0

  // ── Penanganan Search Query ────────────────────────────────────────────────
  let matchedUserIds: string[] | null = null
  let matchedPkgIds: string[] | null = null
  let isSearchEmpty = false

  if (q?.trim()) {
    const term = q.trim().toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [userSearchRes, pkgSearchRes] = await Promise.all([
      (supabase.from('users') as any)
        .select('id')
        .or(`email.ilike.%${term}%,full_name.ilike.%${term}%`),
      (supabase.from('packages') as any)
        .select('id')
        .ilike('name', `%${term}%`),
    ])

    const uIds: string[] = (userSearchRes.data ?? []).map((u: { id: string }) => u.id)
    const pIds: string[] = (pkgSearchRes.data ?? []).map((p: { id: string }) => p.id)
    matchedUserIds = uIds
    matchedPkgIds = pIds

    if (uIds.length === 0 && pIds.length === 0) {
      isSearchEmpty = true
    }
  }

  // ── Filter Kategori Paket ──────────────────────────────────────────────────
  let categoryPkgIds: string[] | null = null
  if (category && category !== 'all') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: catPkgs } = await (supabase.from('packages') as any)
      .select('id')
      .eq('category', category.toUpperCase())
    categoryPkgIds = (catPkgs ?? []).map((p: { id: string }) => p.id)
  }

  // ── Query Utama Tabel Attempts ─────────────────────────────────────────────
  let sessions: SessionData[] = []
  let filteredCount = 0

  if (!isSearchEmpty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from('attempts') as any)
      .select(`
        id,
        status,
        started_at,
        finished_at,
        score,
        correct_count,
        wrong_count,
        empty_count,
        duration_seconds,
        answers,
        score_details,
        user:users(id, email, full_name, plan),
        package:packages(id, name, category, total_questions, duration_minutes, slug)
      `, { count: 'exact' })
      .order('started_at', { ascending: false })

    // Filter Status
    if (status === 'ongoing') query = query.eq('status', 'ongoing')
    else if (status === 'finished') query = query.eq('status', 'finished')

    // Filter Kategori
    if (categoryPkgIds !== null) {
      if (categoryPkgIds.length > 0) {
        query = query.in('package_id', categoryPkgIds)
      } else {
        query = query.eq('package_id', '00000000-0000-0000-0000-000000000000')
      }
    }

    // Filter Pencarian (gabungan user dan paket)
    if (matchedUserIds !== null || matchedPkgIds !== null) {
      const orClauses: string[] = []
      if (matchedUserIds && matchedUserIds.length > 0) {
        orClauses.push(`user_id.in.(${matchedUserIds.join(',')})`)
      }
      if (matchedPkgIds && matchedPkgIds.length > 0) {
        orClauses.push(`package_id.in.(${matchedPkgIds.join(',')})`)
      }
      if (orClauses.length > 0) {
        query = query.or(orClauses.join(','))
      }
    }

    query = query.range(from, to)

    const { data, count } = await query
    filteredCount = count ?? 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sessions = (data ?? []).map((row: any) => {
      const answersObj = row.answers && typeof row.answers === 'object' ? row.answers : {}
      const answersCount = Object.keys(answersObj).length
      return {
        id: row.id,
        status: row.status,
        started_at: row.started_at,
        finished_at: row.finished_at,
        score: row.score,
        correct_count: row.correct_count,
        wrong_count: row.wrong_count,
        empty_count: row.empty_count,
        duration_seconds: row.duration_seconds,
        score_details: row.score_details,
        answers_count: answersCount,
        user: row.user,
        package: row.package,
      }
    })
  }

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE))

  // Helper untuk membangun URL filter
  const buildHref = (overrides: { q?: string; status?: string; category?: string; page?: number }) => {
    const params = new URLSearchParams()
    const targetQ = overrides.q !== undefined ? overrides.q : q ?? ''
    const targetStatus = overrides.status !== undefined ? overrides.status : status ?? ''
    const targetCategory = overrides.category !== undefined ? overrides.category : category ?? ''
    const targetPage = overrides.page !== undefined ? overrides.page : 1

    if (targetQ) params.set('q', targetQ)
    if (targetStatus && targetStatus !== 'all') params.set('status', targetStatus)
    if (targetCategory && targetCategory !== 'all') params.set('category', targetCategory)
    if (targetPage > 1) params.set('page', String(targetPage))

    const qs = params.toString()
    return `/admin/sessions${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sesi Ujian Peserta
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau seluruh aktivitas pengerjaan tes, baik yang sedang berjalan (ongoing) maupun yang sudah selesai secara realtime.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href={buildHref({})}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Segarkan Data</span>
          </a>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Sesi Ujian</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5 tabular-nums">{totalCount.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Sedang Mengerjakan</p>
            <p className="text-xl font-bold text-blue-600 mt-0.5 tabular-nums">{ongoingCount.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Selesai Dikerjakan</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5 tabular-nums">{finishedCount.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Sesi Hari Ini</p>
            <p className="text-xl font-bold text-amber-700 mt-0.5 tabular-nums">{todayCount.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Form */}
          <form method="GET" action="/admin/sessions" className="flex-1 max-w-md relative">
            {status && status !== 'all' && <input type="hidden" name="status" value={status} />}
            {category && category !== 'all' && <input type="hidden" name="category" value={category} />}
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Cari nama peserta, email, atau nama paket..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </form>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { label: 'Semua Status', val: 'all' },
              { label: 'Sedang Ujian', val: 'ongoing' },
              { label: 'Selesai', val: 'finished' },
            ].map((tab) => {
              const isActive = (status ?? 'all') === tab.val
              return (
                <a
                  key={tab.val}
                  href={buildHref({ status: tab.val, page: 1 })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition border shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </a>
              )
            })}
          </div>
        </div>

        {/* Kategori Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 flex-wrap text-xs">
          <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mr-1">
            Kategori:
          </span>
          {[
            { label: 'Semua Kategori', val: 'all' },
            { label: 'ANTAM', val: 'ANTAM' },
            { label: 'ASTRA', val: 'ASTRA' },
            { label: 'PLN', val: 'PLN' },
            { label: 'BUMN', val: 'BUMN' },
          ].map((c) => {
            const isActive = (category ?? 'all').toUpperCase() === c.val.toUpperCase()
            return (
              <a
                key={c.val}
                href={buildHref({ category: c.val, page: 1 })}
                className={`px-2.5 py-1 rounded-lg text-xs transition border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'
                }`}
              >
                {c.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* Table Sesi Ujian */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Peserta</th>
                <th className="px-4 py-3">Paket Ujian</th>
                <th className="px-4 py-3">Status Sesi</th>
                <th className="px-4 py-3">Waktu &amp; Durasi</th>
                <th className="px-4 py-3">Hasil / Nilai</th>
                <th className="px-4 py-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                      <Layers className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">Tidak ada sesi ujian ditemukan</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      {q || status || category
                        ? 'Coba ubah kata kunci pencarian atau reset filter untuk melihat sesi lainnya.'
                        : 'Belum ada peserta yang memulai pengerjaan tes.'}
                    </p>
                    {(q || status || category) && (
                      <a
                        href="/admin/sessions"
                        className="inline-block mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
                      >
                        Reset Filter
                      </a>
                    )}
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <SessionRowExpand key={session.id} session={session} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredCount > 0 && (
          <div className="px-4 py-3.5 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              Menampilkan <span className="font-semibold text-gray-900">{from + 1}</span> -{' '}
              <span className="font-semibold text-gray-900">{Math.min(to + 1, filteredCount)}</span> dari{' '}
              <span className="font-semibold text-gray-900">{filteredCount.toLocaleString('id-ID')}</span> total sesi
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <a
                  href={buildHref({ page: Math.max(1, currentPage - 1) })}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                    currentPage <= 1
                      ? 'bg-gray-100 text-gray-400 border-gray-200 pointer-events-none'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
                </a>

                <span className="px-3 py-1.5 font-semibold text-gray-700 text-xs">
                  {currentPage} / {totalPages}
                </span>

                <a
                  href={buildHref({ page: Math.min(totalPages, currentPage + 1) })}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                    currentPage >= totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-200 pointer-events-none'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
