'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getStreamBySlug } from '@/lib/antam-config'
import { LatexContent } from '@/components/ui/LatexContent'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Question {
  id: string
  content: string
  options: { key: string; text: string }[]
  order_index: number
  category: string | null
  image_url: string | null
}

type Answers = Record<string, string>

// ─── Timer display ──────────────────────────────────────────────────────────────
function TimerDisplay({ seconds, isUrgent }: { seconds: number; isUrgent: boolean }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return (
    <span className={`font-mono font-bold text-sm tracking-wider ${isUrgent ? 'text-red-300 animate-pulse' : 'text-white'}`}>
      {m}:{s}
    </span>
  )
}

// ─── Question content renderer ──────────────────────────────────────────────────
function QuestionContent({ content }: { content: string }) {
  const lines = content.split('\n').filter(l => l.trim() !== '')
  if (lines.length <= 1) return <LatexContent content={content} />
  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <p key={i} className="leading-relaxed"><LatexContent content={line} /></p>
      ))}
    </div>
  )
}

// ─── Confirm Dialog ─────────────────────────────────────────────────────────────
function ConfirmDialog({
  answeredCount,
  totalCount,
  raguCount,
  onConfirm,
  onCancel,
  isSubmitting,
}: {
  answeredCount: number
  totalCount: number
  raguCount: number
  onConfirm: () => void
  onCancel: () => void
  isSubmitting: boolean
}) {
  const unanswered = totalCount - answeredCount
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-6 space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900">Kumpulkan Jawaban?</h3>
          <p className="text-sm text-slate-500">Pastikan kamu sudah memeriksa semua soal sebelum mengumpulkan.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-emerald-50 rounded-xl p-3">
            <p className="text-xl font-extrabold text-emerald-700">{answeredCount}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">Terjawab</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xl font-extrabold text-slate-700">{unanswered}</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Belum</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-xl font-extrabold text-amber-700">{raguCount}</p>
            <p className="text-xs text-amber-600 font-semibold mt-0.5">Ditandai</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50"
          >
            Kembali
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(to right,#00315f,#16487e)' }}
          >
            {isSubmitting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Mengumpulkan...</>
            ) : 'Ya, Kumpulkan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function AntamUjianPage() {
  const router    = useRouter()
  const params    = useParams()
  const packageId = params.packageId as string

  const [pkg, setPkg]             = useState<{ name: string; slug: string; duration_minutes: number; total_questions: number } | null>(null)
  const [streamName, setStreamName] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers]     = useState<Answers>({})
  const [raguRagu, setRaguRagu]   = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft]   = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoSubmitRef = useRef(false)
  const answersRef    = useRef<Answers>({})

  useEffect(() => { answersRef.current = answers }, [answers])

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (finalAnswers: Answers) => {
    if (!attemptId || isSubmitting || autoSubmitRef.current) return
    autoSubmitRef.current = true
    setIsSubmitting(true)
    setShowConfirm(false)
    if (timerRef.current) clearInterval(timerRef.current)

    try {
      const res  = await fetch('/api/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ attemptId, answers: finalAnswers }),
      })
      const json = await res.json() as { data?: { attemptId: string }; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Gagal submit')
      router.push(`/hasil/${json.data?.attemptId ?? attemptId}`)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Gagal submit jawaban')
      setIsSubmitting(false)
      autoSubmitRef.current = false
    }
  }, [attemptId, isSubmitting, router])

  // ─── Load Data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/'); return }

        const { data: pkgData, error: pkgErr } = await supabase
          .from('packages')
          .select('name, slug, duration_minutes, total_questions, is_free, category')
          .eq('id', packageId)
          .single()

        if (pkgErr || !pkgData) { setLoadError('Paket tidak ditemukan.'); setIsLoading(false); return }

        const pkgTyped = pkgData as { name: string; slug: string; duration_minutes: number; total_questions: number; is_free: boolean; category: string }

        // Hanya untuk paket ANTAM
        if (pkgTyped.category !== 'ANTAM') {
          router.replace(`/ujian/${packageId}`)
          return
        }

        setPkg(pkgTyped)

        // Ambil info stream dari slug
        const stream = getStreamBySlug(pkgTyped.slug)
        if (stream) {
          setStreamName(stream.name)
        }

        // Cek akses
        if (!pkgTyped.is_free) {
          try {
            const accessRes  = await fetch(`/api/access?packageId=${packageId}`)
            const accessJson = await accessRes.json() as { canAccess?: boolean }
            if (!accessJson.canAccess) { router.push('/harga'); return }
          } catch { /* sudah dicek di persiapan */ }
        }

        // Load soal
        const { data: questionsData, error: qErr } = await supabase
          .from('questions')
          .select('id, content, options, order_index, category, image_url')
          .eq('package_id', packageId)
          .order('order_index', { ascending: true })

        if (qErr || !questionsData) { setLoadError('Gagal memuat soal.'); setIsLoading(false); return }

        const typed = (questionsData as Question[]).sort((a, b) => a.order_index - b.order_index)
        setQuestions(typed)

        // Attempt
        const { data: ongoingData } = await supabase
          .from('attempts')
          .select('id, answers, started_at')
          .eq('user_id', user.id)
          .eq('package_id', packageId)
          .eq('status', 'ongoing')
          .maybeSingle()

        const ongoing = ongoingData as { id: string; answers: Answers; started_at: string } | null
        let currentAttemptId: string
        let savedAnswers: Answers = {}

        if (ongoing) {
          currentAttemptId = ongoing.id
          savedAnswers     = (ongoing.answers as Answers) ?? {}

          const startedAt  = new Date(ongoing.started_at).getTime()
          const durationMs = pkgTyped.duration_minutes * 60 * 1000
          const elapsed    = Date.now() - startedAt
          const remaining  = Math.max(0, Math.floor((durationMs - elapsed) / 1000))

          if (remaining === 0) {
            setAttemptId(currentAttemptId)
            setIsLoading(false)
            await handleSubmit(savedAnswers)
            return
          }
          setTimeLeft(remaining)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: newAttempt, error: attemptErr } = await (supabase.from('attempts') as any)
            .insert({ user_id: user.id, package_id: packageId })
            .select('id')
            .single()

          if (attemptErr || !newAttempt) {
            setLoadError(`Gagal membuat sesi ujian. ${attemptErr?.message ?? ''}`)
            setIsLoading(false)
            return
          }
          currentAttemptId = (newAttempt as { id: string }).id
          setTimeLeft(pkgTyped.duration_minutes * 60)
        }

        setAttemptId(currentAttemptId)
        setAnswers(savedAnswers)

        // Sync dari localStorage jika DB kosong
        const lsKey  = `attempt_${currentAttemptId}`
        const lsData = localStorage.getItem(lsKey)
        if (lsData && Object.keys(savedAnswers).length === 0) {
          try { setAnswers(JSON.parse(lsData) as Answers) } catch { /* ignore */ }
        }

        setIsLoading(false)
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.')
        setIsLoading(false)
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId])

  // ─── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || timeLeft <= 0 || !attemptId) return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit(answersRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, attemptId])

  // ─── Handlers ───────────────────────────────────────────────────────────────
  function selectAnswer(questionId: string, key: string) {
    const updated = { ...answers, [questionId]: key }
    setAnswers(updated)
    if (attemptId) localStorage.setItem(`attempt_${attemptId}`, JSON.stringify(updated))
  }

  function toggleRaguRagu(questionId: string) {
    setRaguRagu((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) { next.delete(questionId) } else { next.add(questionId) }
      return next
    })
  }

  function goTo(idx: number) {
    if (idx >= 0 && idx < questions.length) setCurrentIndex(idx)
  }

  // ─── Derived state ───────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex]
  const answeredCount   = Object.keys(answers).length
  const raguCount       = raguRagu.size
  const isUrgent        = timeLeft > 0 && timeLeft <= 300
  const progressPct     = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  const currentTopicLabel = currentQuestion?.category ?? null

  // ─── Nav grid button class ───────────────────────────────────────────────────
  function getNavCls(q: Question, idx: number): string {
    const isAnswered = !!answers[q.id]
    const isRagu     = raguRagu.has(q.id)
    const isCurrent  = idx === currentIndex
    if (isCurrent)  return 'bg-[#e89923] text-white font-bold shadow-sm'
    if (isRagu)     return 'bg-yellow-300 text-yellow-900 font-bold'
    if (isAnswered) return 'bg-[#1b7340] text-white font-semibold'
    return 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-600 hover:text-emerald-700'
  }

  // ─── Loading / Error ─────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#16487e] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Memuat soal ujian...</p>
      </div>
    </div>
  )

  if (loadError) return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
      <div className="text-center space-y-4 px-4">
        <p className="text-red-600 font-medium">{loadError}</p>
        <button onClick={() => router.push('/')} className="text-[#16487e] hover:underline text-sm">← Kembali ke Beranda</button>
      </div>
    </div>
  )

  if (!pkg || questions.length === 0 || !currentQuestion) return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
      <div className="text-center space-y-4 px-4">
        <p className="text-slate-600 font-medium">Soal untuk paket ini belum tersedia.</p>
        <button onClick={() => router.back()} className="text-[#16487e] hover:underline text-sm">← Kembali</button>
      </div>
    </div>
  )

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex flex-col antialiased selection:bg-[#16487e] selection:text-white">

      {/* ══ HEADER ════════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 shadow-sm"
        style={{ background: 'linear-gradient(135deg,#0c2544 0%,#16487e 100%)', borderBottom: '1px solid #1c3d69' }}
      >
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo + Judul */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-white rounded-lg px-2.5 py-1 flex items-center justify-center shadow-sm h-9 w-9">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/iconlogo.png" alt="TembusKarir" className="h-6 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="text-white font-bold text-sm sm:text-[15px] tracking-wide whitespace-nowrap">
                ANTAM IMPACT 2026{streamName ? ` — ${streamName}` : ''}
              </div>
              <div className="text-[11px] text-blue-200/80 font-medium">Simulasi CBT Tes Kompetensi Bidang</div>
            </div>
          </div>

          {/* Progress bar — hanya desktop */}
          <div className="hidden md:flex flex-1 items-center max-w-2xl mx-6 gap-3">
            <span className="text-xs text-blue-200/90 font-medium whitespace-nowrap">Progres</span>
            <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#389ADD] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-white font-mono tracking-wider font-semibold whitespace-nowrap">
              {answeredCount} / {questions.length}
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-4 shrink-0">
            <div className={`border px-3 py-1.5 rounded-lg flex items-center gap-2 text-white shadow-inner transition-colors ${isUrgent ? 'bg-red-600/80 border-red-400/40 animate-pulse' : 'bg-white/10 border-white/20'}`}>
              <svg className="w-4 h-4 text-[#9BE1FD] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col items-start">
                <span className="text-[9px] uppercase tracking-wider text-blue-200 font-semibold leading-none">Sisa Waktu</span>
                <TimerDisplay seconds={timeLeft} isUrgent={isUrgent} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══ MAIN WORKSPACE ════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">

        {/* ── LEFT SIDEBAR — Navigator ──────────────────────────────────────── */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col sticky top-24">

            <h2 className="text-sm font-bold text-slate-800 mb-3">Navigasi Soal</h2>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-slate-500 pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1b7340]" />
                <span>Dijawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span>Belum</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e89923]" />
                <span>Aktif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <span>Ditandai</span>
              </div>
            </div>

            {/* Grid nomor soal */}
            <div className="max-h-[400px] overflow-y-auto pr-1 custom-scroll">
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => goTo(idx)}
                    type="button"
                    className={`h-9 rounded-lg flex items-center justify-center transition ${getNavCls(q, idx)}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center pt-4 mt-4 border-t border-slate-100">
              <div>
                <div className="text-emerald-600 font-bold text-sm">{answeredCount}</div>
                <div className="text-[11px] text-slate-500 font-medium">Terisi</div>
              </div>
              <div>
                <div className="text-slate-800 font-bold text-sm">{questions.length - answeredCount}</div>
                <div className="text-[11px] text-slate-500 font-medium">Belum</div>
              </div>
              <div>
                <div className="text-amber-600 font-bold text-sm">{raguCount}</div>
                <div className="text-[11px] text-slate-500 font-medium">Ditandai</div>
              </div>
            </div>

            {/* Selesai & Kumpulkan */}
            <div className="mt-5 pt-1">
              <button
                onClick={() => setShowConfirm(true)}
                type="button"
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition shadow-sm flex items-center justify-center tracking-wide hover:opacity-90"
                style={{ background: 'linear-gradient(to right,#00315f,#16487e)' }}
              >
                Selesai &amp; Kumpulkan
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT CONTENT — Question Card ──────────────────────────────────── */}
        <section className="flex-1 flex flex-col">
          <article className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between min-h-[600px]">
            <div>
              {/* Question header */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center flex-wrap gap-2">
                  <span
                    className="px-3.5 py-1 rounded-md text-xs font-bold text-white tracking-wide shadow-sm"
                    style={{ backgroundColor: '#16487e' }}
                  >
                    Soal {currentIndex + 1}
                  </span>
                  {currentTopicLabel && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#16487E] border border-blue-200/80">
                      {currentTopicLabel}
                    </span>
                  )}
                </div>
                {/* Ragu-Ragu flag */}
                <button
                  onClick={() => toggleRaguRagu(currentQuestion.id)}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
                    raguRagu.has(currentQuestion.id)
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-600 hover:text-amber-700'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{raguRagu.has(currentQuestion.id) ? 'Ditandai' : 'Ragu-Ragu'}</span>
                </button>
              </div>

              {/* Question image */}
              {currentQuestion.image_url && (
                <div className="mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentQuestion.image_url}
                    alt="Gambar soal"
                    className="max-w-full max-h-64 object-contain rounded-lg border border-slate-200"
                  />
                </div>
              )}

              {/* Question stem */}
              <div className="mb-7">
                <div className="text-[15px] sm:text-base text-slate-800 leading-relaxed">
                  <QuestionContent content={currentQuestion.content} />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.key
                  return (
                    <label
                      key={opt.key}
                      className={`group relative flex items-center p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'border-[#16487e] bg-[#16487e]/5'
                          : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${currentQuestion.id}`}
                        value={opt.key}
                        checked={isSelected}
                        onChange={() => selectAnswer(currentQuestion.id, opt.key)}
                        className="sr-only"
                      />
                      {/* Circle indicator */}
                      <div
                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs mr-3.5 shrink-0 font-semibold transition-colors ${
                          isSelected
                            ? 'bg-[#16487e] text-white border-[#16487e]'
                            : 'border-slate-300 text-slate-600 group-hover:border-slate-400'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className={`text-sm leading-relaxed ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
                        <LatexContent content={opt.text} />
                      </span>
                      {/* Ring overlay when selected */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-xl ring-2 ring-[#16487e] pointer-events-none" />
                      )}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Bottom navigation */}
            <div className="mt-10 pt-6 flex items-center justify-between gap-4 border-t border-slate-100">
              <button
                onClick={() => goTo(currentIndex - 1)}
                disabled={currentIndex === 0}
                type="button"
                className="px-5 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>←</span>
                <span>Sebelumnya</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => goTo(currentIndex + 1)}
                  type="button"
                  className="px-6 py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm hover:opacity-90"
                  style={{ background: 'linear-gradient(to right,#00315f,#16487e)' }}
                >
                  <span>Selanjutnya</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  type="button"
                  className="px-6 py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm hover:opacity-90"
                  style={{ background: 'linear-gradient(to right,#10b981,#059669)' }}
                >
                  <span>Selesai &amp; Kumpulkan</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </article>
        </section>
      </main>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 TembusKarir Indonesia • Sistem Simulasi Seleksi Masuk BUMN &amp; Kedinasan.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-500 font-medium">Koneksi Server Stabil</span>
          </p>
        </div>
      </footer>

      {/* ══ CONFIRM DIALOG ═══════════════════════════════════════════════════ */}
      {showConfirm && (
        <ConfirmDialog
          answeredCount={answeredCount}
          totalCount={questions.length}
          raguCount={raguCount}
          onConfirm={() => handleSubmit(answersRef.current)}
          onCancel={() => setShowConfirm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Custom scrollbar style */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
    </div>
  )
}
