'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  SlidersHorizontal,
} from 'lucide-react'
import {
  calculatePackageAnalytics,
  type AttemptItem,
  type QuestionItem,
  type AnalyticsFilterOptions,
} from '@/lib/item-analysis'
import { LatexContent } from '@/components/ui/LatexContent'

interface PackageAnalyticsViewProps {
  pkg: {
    id: string
    name: string
    category: string
    total_questions: number
    duration_minutes: number
    slug: string
  }
  rawAttempts: AttemptItem[]
  questions: QuestionItem[]
}

function formatDuration(seconds: number) {
  if (!seconds) return '0 mnt'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs} dtk`
  return `${mins} mnt ${secs > 0 ? `${secs} dtk` : ''}`.trim()
}

export function PackageAnalyticsView({ pkg, rawAttempts, questions }: PackageAnalyticsViewProps) {
  // ── State Filter ──────────────────────────────────────────────────────────
  const [attemptMode, setAttemptMode] = useState<'first' | 'all' | 'best'>('first')
  const [excludeZero, setExcludeZero] = useState(true)
  const [minDurationMinutes, setMinDurationMinutes] = useState(0)
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '7d'>('all')

  // ── State Tampilan Tabel ──────────────────────────────────────────────────
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'too_easy' | 'ideal' | 'too_hard'>('all')
  const [selectedSubtest, setSelectedSubtest] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'order' | 'difficulty_desc' | 'difficulty_asc'>('difficulty_desc')
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)

  // ── Hitung Daftar Kategori / Sub-tes yang ada ─────────────────────────────
  const availableSubtests = useMemo(() => {
    const set = new Set<string>()
    questions.forEach((q) => {
      if (q.category) set.add(q.category)
    })
    return Array.from(set).sort()
  }, [questions])

  // ── Kalkulasi Analitik Paket Berdasarkan Filter ───────────────────────────
  const analyticsSummary = useMemo(() => {
    const filterOpts: AnalyticsFilterOptions = {
      attemptMode,
      excludeZeroScore: excludeZero,
      minDurationSeconds: minDurationMinutes * 60,
      timeRange,
    }
    return calculatePackageAnalytics(rawAttempts, questions, filterOpts, pkg)
  }, [rawAttempts, questions, attemptMode, excludeZero, minDurationMinutes, timeRange, pkg])

  // ── Filter & Sort Pertanyaan untuk Tabel ──────────────────────────────────
  const filteredQuestions = useMemo(() => {
    let list = [...analyticsSummary.questions]

    // Filter Tingkat Kesulitan
    if (difficultyFilter !== 'all') {
      list = list.filter((q) => q.difficultyLevel === difficultyFilter)
    }

    // Filter Sub-tes
    if (selectedSubtest !== 'all') {
      list = list.filter((q) => (q.category ?? '') === selectedSubtest)
    }

    // Filter Pencarian Teks
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase().trim()
      list = list.filter(
        (q) =>
          q.content.toLowerCase().includes(qLower) ||
          (q.category ?? '').toLowerCase().includes(qLower) ||
          String(q.order_index).includes(qLower)
      )
    }

    // Sort
    if (sortBy === 'difficulty_desc') {
      // Paling mudah duluan (P tertinggi ke terendah)
      list.sort((a, b) => b.difficultyIndex - a.difficultyIndex)
    } else if (sortBy === 'difficulty_asc') {
      // Paling sulit duluan (P terendah ke tertinggi)
      list.sort((a, b) => a.difficultyIndex - b.difficultyIndex)
    } else {
      // Urutan nomor asli
      list.sort((a, b) => a.order_index - b.order_index)
    }

    return list
  }, [analyticsSummary.questions, difficultyFilter, selectedSubtest, searchQuery, sortBy])

  function handleResetFilters() {
    setAttemptMode('first')
    setExcludeZero(true)
    setMinDurationMinutes(0)
    setTimeRange('all')
    setDifficultyFilter('all')
    setSelectedSubtest('all')
    setSearchQuery('')
    setSortBy('difficulty_desc')
  }

  // Interpretasi Rata-rata Skor (berdasarkan persentase terhadap skala nilai paket)
  const avgPct = analyticsSummary.averageScorePercent
  let avgStatusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200'
  let avgStatusText = 'Tingkat Kesulitan Seimbang'
  if (avgPct >= 85) {
    avgStatusColor = 'text-amber-700 bg-amber-50 border-amber-200'
    avgStatusText = 'Cenderung Terlalu Mudah'
  } else if (avgPct < 50 && analyticsSummary.totalFilteredAttempts > 0) {
    avgStatusColor = 'text-rose-700 bg-rose-50 border-rose-200'
    avgStatusText = 'Cenderung Sangat Sulit'
  }

  return (
    <div className="space-y-6">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {pkg.category}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {pkg.total_questions} Soal · {pkg.duration_minutes} Menit
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{pkg.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis item kesukaran butir soal, daya pembeda, dan sebaran skor pengerjaan peserta.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`/admin/packages/${pkg.id}/questions`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            Kelola Butir Soal
          </Link>
          <Link
            href={`/admin/packages`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            ← Kembali ke Paket
          </Link>
        </div>
      </div>

      {/* ── PANEL FILTER & DATA CLEANING ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Filter Data Pengerjaan (Data Cleaning)
            </span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Filter Percobaan */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1.5">
              Percobaan Sesi
            </label>
            <select
              value={attemptMode}
              onChange={(e) => setAttemptMode(e.target.value as 'first' | 'all' | 'best')}
              className="w-full rounded-xl border-slate-200 bg-slate-50/50 text-slate-800 text-xs py-2 px-3 font-medium focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="first">Hanya Percobaan ke-1 (Rekomendasi Psikometri)</option>
              <option value="all">Semua Percobaan (Termasuk Retake)</option>
              <option value="best">Skor Tertinggi Tiap User</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              {attemptMode === 'first' ? '✓ Menghindari bias kunci bocor di pengerjaan ke-2+' : 'Bisa bias karena peserta sudah tahu kunci.'}
            </p>
          </div>

          {/* Toggle Kecualikan Nilai 0 */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1.5">
              Pembersihan Nilai Nol
            </label>
            <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/70 transition">
              <input
                type="checkbox"
                checked={excludeZero}
                onChange={(e) => setExcludeZero(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-800 font-medium select-none">
                Abaikan Skor 0 / Kosong
              </span>
            </label>
            <p className="text-[11px] text-slate-400 mt-1">
              Kecualikan user yang cuma klik tes tanpa menjawab.
            </p>
          </div>

          {/* Filter Durasi Minimal */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1.5">
              Durasi Pengerjaan Minimal
            </label>
            <select
              value={minDurationMinutes}
              onChange={(e) => setMinDurationMinutes(Number(e.target.value))}
              className="w-full rounded-xl border-slate-200 bg-slate-50/50 text-slate-800 text-xs py-2 px-3 font-medium focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={0}>Semua Durasi</option>
              <option value={1}>Minimal &gt; 1 Menit</option>
              <option value={3}>Minimal &gt; 3 Menit</option>
              <option value={5}>Minimal &gt; 5 Menit</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Mengeliminasi peserta yang asal submit instan.
            </p>
          </div>

          {/* Filter Rentang Tanggal */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1.5">
              Rentang Waktu
            </label>
            <div className="flex items-center gap-1.5">
              {(['all', '30d', '7d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`flex-1 py-2 px-2 text-xs font-semibold rounded-xl border transition ${
                    timeRange === r
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r === 'all' ? 'Semua' : r === '30d' ? '30 Hari' : '7 Hari'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Filter tanggal pengerjaan peserta.
            </p>
          </div>
        </div>
      </div>

      {/* ── KARTU METRIK RINGKASAN ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Sample Size (N) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sample Size (N)</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {analyticsSummary.totalFilteredAttempts}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">sesi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            dari {analyticsSummary.totalRawAttempts} total pengerjaan
          </p>
        </div>

        {/* Rata-rata Skor (Mean) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rata-rata Skor</span>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {analyticsSummary.averageScore}
            </span>
            <span className="text-xs text-slate-400 ml-1">/ {analyticsSummary.maxScore}</span>
            <span className="text-xs font-semibold text-slate-500 ml-1.5">
              ({analyticsSummary.averageScorePercent}%)
            </span>
          </div>
          <div className="mt-1">
            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${avgStatusColor}`}>
              {avgStatusText}
            </span>
          </div>
        </div>

        {/* Median & Range */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Median &amp; Rentang</span>
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {analyticsSummary.medianScore}
            </span>
            <span className="text-xs text-slate-400 ml-1">/ {analyticsSummary.maxScore}</span>
            <span className="text-xs text-slate-400 ml-1 font-medium">
              ({analyticsSummary.medianScorePercent}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Min: {analyticsSummary.lowestScore} · Max: {analyticsSummary.highestScore}
          </p>
        </div>

        {/* Soal Terlalu Mudah */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Terlalu Mudah (&gt;85%)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-900 font-mono">
              {analyticsSummary.counts.tooEasy}
            </span>
            <span className="text-xs text-amber-800 ml-1.5">butir</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">
            Perlu ditingkatkan kesulitannya
          </p>
        </div>

        {/* Soal Terlalu Sulit */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Terlalu Sulit (&lt;30%)</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-900 font-mono">
              {analyticsSummary.counts.tooHard}
            </span>
            <span className="text-xs text-rose-800 ml-1.5">butir</span>
          </div>
          <p className="text-[11px] text-rose-700 mt-1 font-medium">
            Cek kejelasan / kunci jawaban
          </p>
        </div>
      </div>

      {/* ── HISTOGRAM DISTRIBUSI NILAI ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Sebaran / Distribusi Nilai Peserta (Histogram)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Grafik rentang skor peserta (skala 0 - {analyticsSummary.maxScore}). Kurva ideal umumnya terdistribusi di tengah ({Math.round(analyticsSummary.maxScore * 0.4)} - {Math.round(analyticsSummary.maxScore * 0.8)}).
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Rerata Durasi: <strong>{formatDuration(analyticsSummary.averageDurationSeconds)}</strong></span>
          </div>
        </div>

        {analyticsSummary.totalFilteredAttempts === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Belum ada data pengerjaan yang memenuhi kriteria filter di atas. Coba longgarkan filter.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end h-40 pt-4 border-b border-slate-100 pb-2">
              {analyticsSummary.distributionBins.map((bin, idx) => {
                const maxPct = Math.max(...analyticsSummary.distributionBins.map((b) => b.percent), 1)
                const heightPct = Math.max(8, Math.round((bin.percent / maxPct) * 100))

                let barColor = 'bg-blue-500 hover:bg-blue-600'
                if (idx === 4) barColor = 'bg-amber-500 hover:bg-amber-600'
                else if (idx === 3) barColor = 'bg-emerald-500 hover:bg-emerald-600'
                else if (idx <= 1) barColor = 'bg-rose-400 hover:bg-rose-500'

                return (
                  <div key={bin.range} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[11px] font-bold text-slate-800 font-mono mb-1">
                      {bin.count} <span className="text-slate-400 text-[10px]">({bin.percent}%)</span>
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-lg h-full max-h-[110px] flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${barColor}`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <div className="flex flex-col items-center mt-2">
                      <span className="text-[11px] font-bold text-slate-700 text-center whitespace-nowrap">
                        {bin.range}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {bin.labelPct}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              <span>← Skor Rendah (0 - {Math.round(analyticsSummary.maxScore * 0.4)})</span>
              <span>Skor Tinggi ({Math.round(analyticsSummary.maxScore * 0.8)} - {analyticsSummary.maxScore}) →</span>
            </div>
          </div>
        )}
      </div>

      {/* ── TABEL ANALISIS BUTIR SOAL ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header & Controls Tabel */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Analisis Butir Soal &amp; Indeks Kesukaran
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi butir soal per butir. Klik baris soal untuk melihat rincian sebaran jawaban opsi A/B/C/D/E.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'order' | 'difficulty_desc' | 'difficulty_asc')}
                className="rounded-xl border-slate-200 bg-slate-50 text-slate-800 text-xs py-1.5 px-2.5 font-medium focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="difficulty_desc">Paling Mudah (% Benar Tinggi)</option>
                <option value="difficulty_asc">Paling Sulit (% Benar Rendah)</option>
                <option value="order">Nomor Soal Asli (#1, #2, ...)</option>
              </select>
            </div>
          </div>

          {/* Filter Bar: Tabs & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            {/* Difficulty Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setDifficultyFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  difficultyFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Butir ({questions.length})
              </button>
              <button
                onClick={() => setDifficultyFilter('too_easy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  difficultyFilter === 'too_easy'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>⚠️ Terlalu Mudah (&gt;85%)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/40 font-bold">
                  {analyticsSummary.counts.tooEasy}
                </span>
              </button>
              <button
                onClick={() => setDifficultyFilter('ideal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  difficultyFilter === 'ideal'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>✓ Ideal (30-85%)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/40 font-bold">
                  {analyticsSummary.counts.ideal}
                </span>
              </button>
              <button
                onClick={() => setDifficultyFilter('too_hard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  difficultyFilter === 'too_hard'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>⛔ Terlalu Sulit (&lt;30%)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/40 font-bold">
                  {analyticsSummary.counts.tooHard}
                </span>
              </button>
            </div>

            {/* Subtest filter + Search Box */}
            <div className="flex items-center gap-2">
              {availableSubtests.length > 0 && (
                <select
                  value={selectedSubtest}
                  onChange={(e) => setSelectedSubtest(e.target.value)}
                  className="rounded-xl border-slate-200 bg-slate-50 text-slate-800 text-xs py-1.5 px-2.5 font-medium focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Semua Sub-tes</option>
                  {availableSubtests.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              )}

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari teks soal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 w-44 sm:w-56 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Soal */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
                <th className="py-3 px-4 w-14 text-center">#</th>
                <th className="py-3 px-4">Konten Soal &amp; Sub-tes</th>
                <th className="py-3 px-4 w-28 text-center">Kunci</th>
                <th className="py-3 px-4 w-44">Tingkat Kesukaran (P%)</th>
                <th className="py-3 px-4 w-48">Distribusi Pilihan Peserta</th>
                <th className="py-3 px-4 w-20 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Tidak ada butir soal yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => {
                  const isExpanded = expandedQuestionId === q.id
                  const p = q.difficultyIndex

                  // Status badge & bar color
                  let badge = (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Ideal ({p}%)
                    </span>
                  )
                  let barColor = 'bg-emerald-500'

                  if (q.difficultyLevel === 'too_easy') {
                    badge = (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Terlalu Mudah ({p}%)
                      </span>
                    )
                    barColor = 'bg-amber-500'
                  } else if (q.difficultyLevel === 'too_hard') {
                    badge = (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Terlalu Sulit ({p}%)
                      </span>
                    )
                    barColor = 'bg-rose-500'
                  }

                  return (
                    <>
                      <tr
                        key={q.id}
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        {/* Nomor */}
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 font-mono">
                          {q.order_index}
                        </td>

                        {/* Konten */}
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {q.category && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {q.category}
                              </span>
                            )}
                          </div>
                          <div className="font-medium text-slate-900 line-clamp-2 leading-relaxed">
                            <LatexContent content={q.content} />
                          </div>
                        </td>

                        {/* Kunci Jawaban */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="w-7 h-7 rounded-lg inline-flex items-center justify-center font-black text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {q.correct_answer}
                          </span>
                        </td>

                        {/* Tingkat Kesukaran (P%) */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              {badge}
                              <span className="text-[11px] text-slate-500 font-mono">
                                {q.correctCount}/{q.totalRespondents}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                                style={{ width: `${Math.min(100, Math.max(0, p))}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Mini Distractor Preview */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1">
                            {q.optionsBreakdown.map((opt) => (
                              <div
                                key={opt.key}
                                className={`px-1.5 py-1 rounded text-[10px] font-mono font-semibold flex items-center justify-center min-w-[28px] ${
                                  opt.isCorrect
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                                    : opt.percent > 20
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                                title={`Pilihan ${opt.key}: ${opt.count} orang (${opt.percent}%)`}
                              >
                                {opt.key}:{opt.percent}%
                              </div>
                            ))}
                            {q.emptyCount > 0 && (
                              <div
                                className="px-1.5 py-1 rounded text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100"
                                title={`Kosong: ${q.emptyCount} orang (${q.emptyPercent}%)`}
                              >
                                ∅:{q.emptyPercent}%
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Toggle expand */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Detail Soal & Analisis Pilihan (Expanded) */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-y border-slate-200">
                          <td colSpan={6} className="p-5">
                            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
                              {/* Header Soal */}
                              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                      Soal #{q.order_index}
                                    </span>
                                    {q.category && (
                                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                        Sub-tes: {q.category}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm font-semibold text-slate-900 mt-2 leading-relaxed">
                                    <LatexContent content={q.content} />
                                  </div>
                                </div>
                                <Link
                                  href={`/admin/packages/${pkg.id}/questions`}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shrink-0 transition"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Edit di Kelola Soal
                                </Link>
                              </div>

                              {/* Gambar Soal Jika Ada */}
                              {q.image_url && (
                                <div className="p-2 border border-slate-200 rounded-lg max-w-sm">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={q.image_url}
                                    alt="Gambar Soal"
                                    className="max-h-48 object-contain rounded"
                                  />
                                </div>
                              )}

                              {/* Sebaran Opsi Jawaban (Distractor Analysis) */}
                              <div>
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                                  Rincian Pilihan Jawaban Peserta
                                </h4>
                                <div className="space-y-2">
                                  {q.optionsBreakdown.map((opt) => (
                                    <div
                                      key={opt.key}
                                      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                                        opt.isCorrect
                                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                                          : opt.percent > 20
                                          ? 'bg-rose-50/40 border-rose-200 text-slate-800'
                                          : 'bg-slate-50 border-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                        <span
                                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                                            opt.isCorrect
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-white border border-slate-300 text-slate-700'
                                          }`}
                                        >
                                          {opt.key}
                                        </span>
                                        <span className="truncate">
                                          <LatexContent content={opt.text} />
                                        </span>
                                        {opt.isCorrect && (
                                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 shrink-0">
                                            Kunci Jawaban
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-24 sm:w-36 h-2 bg-slate-200 rounded-full overflow-hidden">
                                          <div
                                            className={`h-full rounded-full ${
                                              opt.isCorrect ? 'bg-emerald-500' : 'bg-slate-400'
                                            }`}
                                            style={{ width: `${opt.percent}%` }}
                                          />
                                        </div>
                                        <span className="w-12 text-right font-mono font-bold">
                                          {opt.percent}%
                                        </span>
                                        <span className="text-slate-400 text-[11px] w-14 text-right">
                                          ({opt.count} orang)
                                        </span>
                                      </div>
                                    </div>
                                  ))}

                                  {/* Baris Kosong */}
                                  <div className="p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-xs flex items-center justify-between text-slate-500">
                                    <span>Tidak Menjawab / Kosong</span>
                                    <span className="font-mono font-semibold">
                                      {q.emptyPercent}% ({q.emptyCount} orang)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Catatan / Rekomendasi untuk Admin */}
                              {q.difficultyLevel === 'too_easy' && (
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-bold">Rekomendasi Perbaikan:</p>
                                    <p className="mt-0.5 text-amber-800">
                                      {q.difficultyIndex}% peserta menjawab benar. Butir soal ini tergolong sangat mudah dan kurang membedakan peserta kompeten vs kurang siap. Pertimbangkan menaikkan bobot kerumitan pertanyaan atau membuat opsi pengecoh yang lebih mirip.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {q.difficultyLevel === 'too_hard' && (
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-bold">Peringatan Soal Terlalu Sulit:</p>
                                    <p className="mt-0.5 text-rose-800">
                                      Hanya {q.difficultyIndex}% peserta yang menjawab benar. Pastikan kunci jawaban tidak salah set ({q.correct_answer}). Jika kunci sudah tepat, periksa apakah materi ini terlalu spesifik atau redaksi kalimat membingungkan.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Pembahasan Soal */}
                              {q.explanation && (
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                                  <span className="font-bold text-slate-900 block mb-1">
                                    Pembahasan Kunci Jawaban:
                                  </span>
                                  <div className="leading-relaxed text-slate-800">
                                    <LatexContent content={q.explanation} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
