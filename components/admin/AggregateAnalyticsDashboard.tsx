'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  ArrowUpDown,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react'
import { getPackageMaxScore } from '@/lib/item-analysis'

export interface RawPackage {
  id: string
  name: string
  category: string
  total_questions: number
  duration_minutes: number
  is_published: boolean
  is_free: boolean
  slug: string
}

export interface RawAttempt {
  id: string
  package_id: string
  user_id: string
  score: number | null
  status: string
  duration_seconds: number | null
  started_at: string
  attempt_number?: number | null
}

interface AggregateAnalyticsDashboardProps {
  packages: RawPackage[]
  attempts: RawAttempt[]
  initialCategory?: string
}

function formatDuration(seconds: number) {
  if (!seconds) return '0 mnt'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs} dtk`
  return `${mins} mnt ${secs > 0 ? `${secs} dtk` : ''}`.trim()
}

export function AggregateAnalyticsDashboard({
  packages,
  attempts,
  initialCategory = 'ALL',
}: AggregateAnalyticsDashboardProps) {
  // ── States ────────────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ? initialCategory.toUpperCase() : 'ALL'
  )
  const [attemptMode, setAttemptMode] = useState<'first' | 'all' | 'best'>('first')
  const [minAttemptsFilter, setMinAttemptsFilter] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'charts' | 'table' | 'cards'>('charts')
  const [sortBy, setSortBy] = useState<
    'participants_desc' | 'score_desc' | 'score_asc' | 'completion_desc' | 'name_asc'
  >('participants_desc')

  // ── Kategori Unik yang Tersedia ───────────────────────────────────────────
  const categories = useMemo(() => {
    const set = new Set<string>()
    packages.forEach((p) => {
      if (p.category) set.add(p.category.toUpperCase())
    })
    return ['ALL', ...Array.from(set).sort()]
  }, [packages])

  // ── Olah & Agregasikan Data per Paket ──────────────────────────────────────
  const packageAggregates = useMemo(() => {
    // 1. Inisialisasi struktur map per paket
    const statsMap = new Map<
      string,
      {
        pkg: RawPackage
        totalStarted: number
        totalFinished: number
        uniqueUsers: Set<string>
        firstScores: number[]
        allScores: number[]
        bestScoresByUser: Map<string, number>
        durations: number[]
      }
    >()

    packages.forEach((p) => {
      statsMap.set(p.id, {
        pkg: p,
        totalStarted: 0,
        totalFinished: 0,
        uniqueUsers: new Set(),
        firstScores: [],
        allScores: [],
        bestScoresByUser: new Map(),
        durations: [],
      })
    })

    // 2. Kelompokkan seluruh attempt berdasarkan paket
    // Urutkan asc berdasarkan waktu mulai untuk deteksi first attempt yang akurat
    const sortedAttempts = [...attempts].sort(
      (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
    )

    const userFirstAttemptPerPkg = new Set<string>() // key: `${userId}_${pkgId}`

    sortedAttempts.forEach((a) => {
      const stat = statsMap.get(a.package_id)
      if (!stat) return

      stat.totalStarted++
      stat.uniqueUsers.add(a.user_id)

      if (a.status === 'finished') {
        stat.totalFinished++
        const score = a.score ?? 0
        stat.allScores.push(score)

        // Deteksi attempt ke-1
        const userPkgKey = `${a.user_id}_${a.package_id}`
        if (!userFirstAttemptPerPkg.has(userPkgKey)) {
          userFirstAttemptPerPkg.add(userPkgKey)
          stat.firstScores.push(score)
        } else if (a.attempt_number === 1) {
          // Fallback jika flag attempt_number sudah ada
          if (!stat.firstScores.includes(score)) {
            stat.firstScores.push(score)
          }
        }

        // Skor terbaik per user
        const prevBest = stat.bestScoresByUser.get(a.user_id)
        if (prevBest === undefined || score > prevBest) {
          stat.bestScoresByUser.set(a.user_id, score)
        }

        if (a.duration_seconds && a.duration_seconds > 0) {
          stat.durations.push(a.duration_seconds)
        }
      }
    })

    // 3. Kalkulasi metrik rata-rata & skala skor
    return packages.map((p) => {
      const s = statsMap.get(p.id)!
      const maxScore = getPackageMaxScore(p, [], s.allScores)

      // Hitung skor berdasarkan mode yang dipilih
      let activeScores: number[] = []
      if (attemptMode === 'first') {
        activeScores = s.firstScores
      } else if (attemptMode === 'best') {
        activeScores = Array.from(s.bestScoresByUser.values())
      } else {
        activeScores = s.allScores
      }

      const countScores = activeScores.length
      const avgScore =
        countScores > 0
          ? Math.round((activeScores.reduce((a, b) => a + b, 0) / countScores) * 10) / 10
          : 0

      const avgScorePct =
        maxScore > 0 && countScores > 0
          ? Math.round((avgScore / maxScore) * 1000) / 10
          : 0

      const completionRate =
        s.totalStarted > 0
          ? Math.round((s.totalFinished / s.totalStarted) * 100)
          : 0

      const avgDuration =
        s.durations.length > 0
          ? Math.round(s.durations.reduce((a, b) => a + b, 0) / s.durations.length)
          : 0

      let difficultyLevel: 'too_easy' | 'ideal' | 'too_hard' = 'ideal'
      if (avgScorePct >= 85) {
        difficultyLevel = 'too_easy'
      } else if (avgScorePct < 50 && countScores > 0) {
        difficultyLevel = 'too_hard'
      }

      return {
        pkg: p,
        totalStarted: s.totalStarted,
        totalFinished: s.totalFinished,
        uniqueUsersCount: s.uniqueUsers.size,
        completionRate,
        maxScore,
        avgScore,
        avgScorePct,
        difficultyLevel,
        avgDuration,
        sampleCount: countScores,
      }
    })
  }, [packages, attempts, attemptMode])

  // ── Global KPI Ringkasan Agregat ──────────────────────────────────────────
  const globalSummary = useMemo(() => {
    const finishedAttempts = attempts.filter((a) => a.status === 'finished')
    const ongoingAttempts = attempts.filter((a) => a.status === 'ongoing')
    const uniqueParticipants = new Set(attempts.map((a) => a.user_id)).size

    // Paket dengan pengerjaan aktif
    const activePackages = packageAggregates.filter((p) => p.totalFinished > 0)

    // Paket terpopuler
    const mostPopular = [...packageAggregates].sort(
      (a, b) => b.totalFinished - a.totalFinished
    )[0]

    // Paket termudah (skor % tertinggi, min 2 pengerjaan jika ada)
    const candidatesWithData = activePackages.filter((p) => p.totalFinished >= 2)
    const scoreBase = candidatesWithData.length > 0 ? candidatesWithData : activePackages

    const easiest = [...scoreBase].sort((a, b) => b.avgScorePct - a.avgScorePct)[0]
    const hardest = [...scoreBase].sort((a, b) => a.avgScorePct - b.avgScorePct)[0]

    // Rata-rata persentase skor platform
    const avgScorePctPlatform =
      activePackages.length > 0
        ? Math.round(
            (activePackages.reduce((acc, p) => acc + p.avgScorePct, 0) / activePackages.length) * 10
          ) / 10
        : 0

    return {
      totalFinished: finishedAttempts.length,
      totalOngoing: ongoingAttempts.length,
      uniqueParticipants,
      avgScorePctPlatform,
      mostPopular,
      easiest,
      hardest,
      totalPackagesWithAttempts: activePackages.length,
    }
  }, [attempts, packageAggregates])

  // ── Filter & Sort Data untuk Grafik & Tabel ────────────────────────────────
  const filteredAndSorted = useMemo(() => {
    let list = [...packageAggregates]

    // 1. Filter Kategori
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.pkg.category.toUpperCase() === selectedCategory)
    }

    // 2. Filter Minimal Selesai
    if (minAttemptsFilter > 0) {
      list = list.filter((p) => p.totalFinished >= minAttemptsFilter)
    }

    // 3. Filter Pencarian Nama
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.pkg.name.toLowerCase().includes(q) ||
          p.pkg.category.toLowerCase().includes(q)
      )
    }

    // 4. Sorting
    if (sortBy === 'participants_desc') {
      list.sort((a, b) => b.totalFinished - a.totalFinished)
    } else if (sortBy === 'score_desc') {
      list.sort((a, b) => b.avgScorePct - a.avgScorePct)
    } else if (sortBy === 'score_asc') {
      list.sort((a, b) => a.avgScorePct - b.avgScorePct)
    } else if (sortBy === 'completion_desc') {
      list.sort((a, b) => b.completionRate - a.completionRate)
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => a.pkg.name.localeCompare(b.pkg.name))
    }

    return list
  }, [packageAggregates, selectedCategory, minAttemptsFilter, searchQuery, sortBy])

  // Nilai maksimum untuk skala visual bar chart
  const maxFinishedInView = useMemo(() => {
    return Math.max(1, ...filteredAndSorted.map((p) => p.totalFinished))
  }, [filteredAndSorted])

  return (
    <div className="space-y-6">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Item Response &amp; Aggregate Analytics
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analitik Agregat &amp; Komparasi Paket Soal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau gambaran umum seluruh paket: paket yang paling banyak diminati, perbandingan rata-rata skor antar paket, serta deteksi soal yang terlalu mudah vs terlalu sulit.
          </p>
        </div>
      </div>

      {/* ── KARTU METRIK RINGKASAN AGREGAT ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* Total Sesi Selesai */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Ujian Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {globalSummary.totalFinished}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">sesi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            +{globalSummary.totalOngoing} sedang berlangsung
          </p>
        </div>

        {/* Peserta Unik */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Peserta Unik</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {globalSummary.uniqueParticipants}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">user</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            di {globalSummary.totalPackagesWithAttempts} paket aktif
          </p>
        </div>

        {/* Rata-rata Skor Platform */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rerata Skor Platform</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {globalSummary.avgScorePctPlatform}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Skala normalisasi 0 - 100%
          </p>
        </div>

        {/* Paket Terpopuler */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Paling Diminati</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-slate-900 line-clamp-1">
              {globalSummary.mostPopular?.pkg.name ?? '-'}
            </p>
            <p className="text-lg font-black text-blue-700 font-mono mt-0.5">
              {globalSummary.mostPopular?.totalFinished ?? 0}{' '}
              <span className="text-[11px] font-normal text-slate-500">sesi selesai</span>
            </p>
          </div>
          <p className="text-[10px] text-blue-600 mt-1 font-semibold">
            {globalSummary.mostPopular?.uniqueUsersCount ?? 0} peserta unik
          </p>
        </div>

        {/* Paket Termudah */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Skor Tertinggi</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-slate-900 line-clamp-1">
              {globalSummary.easiest?.pkg.name ?? '-'}
            </p>
            <p className="text-lg font-black text-amber-900 font-mono mt-0.5">
              {globalSummary.easiest?.avgScorePct ?? 0}%{' '}
              <span className="text-[11px] font-normal text-slate-500">
                ({globalSummary.easiest?.avgScore} / {globalSummary.easiest?.maxScore})
              </span>
            </p>
          </div>
          <p className="text-[10px] text-amber-700 mt-1 font-semibold">
            Cenderung Terlalu Mudah
          </p>
        </div>

        {/* Paket Tersulit */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Skor Terendah</span>
            <TrendingUp className="w-4 h-4 text-rose-600 rotate-180" />
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-slate-900 line-clamp-1">
              {globalSummary.hardest?.pkg.name ?? '-'}
            </p>
            <p className="text-lg font-black text-rose-900 font-mono mt-0.5">
              {globalSummary.hardest?.avgScorePct ?? 0}%{' '}
              <span className="text-[11px] font-normal text-slate-500">
                ({globalSummary.hardest?.avgScore} / {globalSummary.hardest?.maxScore})
              </span>
            </p>
          </div>
          <p className="text-[10px] text-rose-700 mt-1 font-semibold">
            Paling Sulit / Menantang
          </p>
        </div>
      </div>

      {/* ── KONTROL FILTER & NAVIGASI TAB TAMPILAN ───────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Baris 1: Filter Kategori */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* Toggle Tampilan (Grafik vs Tabel vs Kartu) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'charts'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Grafik Komparasi</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel Peringkat</span>
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'cards'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Daftar Kartu</span>
            </button>
          </div>
        </div>

        {/* Baris 2: Mode Percobaan & Sorting & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Mode Percobaan */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Mode Skor:
            </span>
            <div className="flex items-center gap-1">
              {[
                { key: 'first', label: 'Percobaan #1 (Murni)' },
                { key: 'all', label: 'Semua Percobaan' },
                { key: 'best', label: 'Skor Terbaik' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setAttemptMode(m.key as 'first' | 'all' | 'best')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                    attemptMode === m.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Search */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Filter Minimal Selesai */}
            <select
              value={minAttemptsFilter}
              onChange={(e) => setMinAttemptsFilter(Number(e.target.value))}
              className="rounded-xl border-slate-200 bg-slate-50 text-slate-800 text-xs py-1.5 px-2.5 font-medium focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={0}>Semua Paket ({packageAggregates.length})</option>
              <option value={1}>Ada Pengerjaan (≥ 1 Sesi)</option>
              <option value={5}>Pengerjaan Ramai (≥ 5 Sesi)</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-xl border-slate-200 bg-slate-50 text-slate-800 text-xs py-1.5 px-2.5 font-medium focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="participants_desc">Peserta Terbanyak</option>
                <option value="score_desc">Rata-rata Skor Tertinggi</option>
                <option value="score_asc">Rata-rata Skor Terendah (Tersulit)</option>
                <option value="completion_desc">Completion Rate Tertinggi</option>
                <option value="name_asc">Nama Paket (A-Z)</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama paket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 w-44 sm:w-52 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── TAMPILAN 1: GRAFIK KOMPARASI BAR CHART ─────────────────────────── */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── GRAFIK 1: JUMLAH PESERTA & SESI PER PAKET ── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Jumlah Peserta &amp; Selesai per Paket Soal
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Perbandingan banyak peserta yang telah menyelesaikan tiap paket ujian.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                {filteredAndSorted.length} Paket
              </span>
            </div>

            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                Tidak ada paket soal yang memenuhi kriteria filter.
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                {filteredAndSorted.map((item, idx) => {
                  const widthPct = Math.max(
                    3,
                    Math.round((item.totalFinished / maxFinishedInView) * 100)
                  )
                  return (
                    <div key={item.pkg.id} className="group">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="font-mono font-bold text-slate-400 text-[11px] w-5 text-right shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                            {item.pkg.category}
                          </span>
                          <Link
                            href={`/admin/packages/${item.pkg.id}/analytics`}
                            className="font-semibold text-slate-900 hover:text-blue-600 truncate transition flex items-center gap-1"
                            title={item.pkg.name}
                          >
                            <span>{item.pkg.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
                          </Link>
                        </div>
                        <div className="text-right shrink-0 font-mono text-xs">
                          <strong className="text-slate-900">{item.totalFinished}</strong>
                          <span className="text-slate-400 text-[10px] ml-1">
                            ({item.uniqueUsersCount} user)
                          </span>
                        </div>
                      </div>

                      {/* Bar Horizontal */}
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex items-center">
                        <div
                          className="bg-blue-600 group-hover:bg-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5 px-0.5">
                        <span>Penyelesaian: {item.completionRate}%</span>
                        <span>{item.sampleCount} sampel skor</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── GRAFIK 2: RATA-RATA NILAI PER PAKET (% & SKOR ASLI) ── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Rata-rata Skor Setiap Paket Soal (% Normalisasi)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Skala diseragamkan (0-100%) untuk mendeteksi soal terlalu mudah (&gt;85%) vs terlalu sulit (&lt;50%).
                </p>
              </div>

              {/* Legend Ringkas */}
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  &gt;85%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  50-84%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  &lt;50%
                </span>
              </div>
            </div>

            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                Tidak ada paket soal yang memenuhi kriteria filter.
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                {filteredAndSorted.map((item, idx) => {
                  let barColor = 'bg-blue-600 group-hover:bg-blue-500'
                  let badgeText = 'Ideal'
                  let badgeCls = 'text-blue-700 bg-blue-50 border-blue-200'

                  if (item.difficultyLevel === 'too_easy') {
                    barColor = 'bg-amber-500 group-hover:bg-amber-400'
                    badgeText = 'Terlalu Mudah'
                    badgeCls = 'text-amber-800 bg-amber-50 border-amber-200'
                  } else if (item.difficultyLevel === 'too_hard') {
                    barColor = 'bg-rose-500 group-hover:bg-rose-400'
                    badgeText = 'Sangat Sulit'
                    badgeCls = 'text-rose-700 bg-rose-50 border-rose-200'
                  }

                  const widthPct = Math.min(100, Math.max(3, item.avgScorePct))

                  return (
                    <div key={item.pkg.id} className="group">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="font-mono font-bold text-slate-400 text-[11px] w-5 text-right shrink-0">
                            #{idx + 1}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${badgeCls}`}>
                            {badgeText}
                          </span>
                          <Link
                            href={`/admin/packages/${item.pkg.id}/analytics`}
                            className="font-semibold text-slate-900 hover:text-blue-600 truncate transition flex items-center gap-1"
                            title={item.pkg.name}
                          >
                            <span>{item.pkg.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
                          </Link>
                        </div>
                        <div className="text-right shrink-0 font-mono text-xs">
                          <strong className="text-slate-900">{item.avgScorePct}%</strong>
                          <span className="text-slate-400 text-[10px] ml-1">
                            ({item.avgScore} / {item.maxScore})
                          </span>
                        </div>
                      </div>

                      {/* Bar Horizontal dengan Garis Benchmark 50% & 85% */}
                      <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden flex items-center">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5 px-0.5">
                        <span>Skor Mentah: {item.avgScore} dari {item.maxScore}</span>
                        <span>{item.totalFinished} sesi dinilai</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAMPILAN 2: TABEL PERINGKAT AGREGAT KOMPARATIF ───────────────────── */}
      {activeTab === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-blue-600" />
                Tabel Peringkat &amp; Evaluasi Seluruh Paket Soal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rangkuman lengkap metrik psikometri, jumlah peserta, dan tingkat kesulitan per paket.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total {filteredAndSorted.length} Paket
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Paket Soal &amp; Kategori</th>
                  <th className="py-3 px-4 text-right">Peserta Selesai</th>
                  <th className="py-3 px-4 text-right">Peserta Unik</th>
                  <th className="py-3 px-4 text-right">Penyelesaian</th>
                  <th className="py-3 px-4 text-right">Rata-rata Skor</th>
                  <th className="py-3 px-4 text-center">Evaluasi Kesulitan</th>
                  <th className="py-3 px-4 text-right">Rerata Durasi</th>
                  <th className="py-3 px-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSorted.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-slate-400">
                      Tidak ada paket soal yang sesuai kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredAndSorted.map((item, idx) => {
                    let badge = (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Ideal ({item.avgScorePct}%)
                      </span>
                    )
                    if (item.difficultyLevel === 'too_easy') {
                      badge = (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          ⚠️ Terlalu Mudah ({item.avgScorePct}%)
                        </span>
                      )
                    } else if (item.difficultyLevel === 'too_hard') {
                      badge = (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          ⛔ Sangat Sulit ({item.avgScorePct}%)
                        </span>
                      )
                    }

                    return (
                      <tr key={item.pkg.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider shrink-0">
                              {item.pkg.category}
                            </span>
                            <span className="font-semibold text-slate-900 line-clamp-1">
                              {item.pkg.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.pkg.total_questions} Soal · {item.pkg.duration_minutes} Menit
                          </p>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {item.totalFinished} sesi
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600">
                          {item.uniqueUsersCount} user
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          <span className="font-bold text-slate-800">{item.completionRate}%</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          <strong className="text-slate-900">{item.avgScorePct}%</strong>
                          <div className="text-[10px] text-slate-400">
                            {item.avgScore} / {item.maxScore}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {badge}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          {formatDuration(item.avgDuration)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            href={`/admin/packages/${item.pkg.id}/analytics`}
                            className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold hover:bg-blue-600 transition shadow-2xs"
                          >
                            <span>Analisis Soal</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAMPILAN 3: KARTU GRID DETAIL PAKET ─────────────────────────────── */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSorted.map((item) => {
            let avgBadge = <span className="text-slate-400 text-xs">Belum ada data</span>
            if (item.totalFinished > 0) {
              if (item.difficultyLevel === 'too_easy') {
                avgBadge = (
                  <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                    {item.avgScore} / {item.maxScore} ({item.avgScorePct}%) · Terlalu Mudah
                  </span>
                )
              } else if (item.difficultyLevel === 'too_hard') {
                avgBadge = (
                  <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold">
                    {item.avgScore} / {item.maxScore} ({item.avgScorePct}%) · Cukup Sulit
                  </span>
                )
              } else {
                avgBadge = (
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                    {item.avgScore} / {item.maxScore} ({item.avgScorePct}%) · Ideal
                  </span>
                )
              }
            }

            return (
              <div
                key={item.pkg.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                      {item.pkg.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.pkg.total_questions} Soal · {item.pkg.duration_minutes} Mnt
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.pkg.name}
                  </h3>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Selesai Dikerjakan:</span>
                      <strong className="text-slate-900 font-mono">
                        {item.totalFinished} sesi ({item.uniqueUsersCount} user)
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Tingkat Penyelesaian:</span>
                      <strong className="text-slate-800 font-mono">
                        {item.completionRate}%
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Skor Rerata:</span>
                      {avgBadge}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <Link
                    href={`/admin/packages/${item.pkg.id}/analytics`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition shadow-2xs"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Buka Analisis Soal &amp; Sebaran Nilai
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}

          {filteredAndSorted.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Tidak ada paket soal yang memenuhi kriteria filter di atas.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
