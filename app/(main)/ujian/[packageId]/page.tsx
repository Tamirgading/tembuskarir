'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { CheckCircle2, AlertTriangle, Clock, Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { PackageRow } from '@/lib/utils'
import { LatexContent } from '@/components/ui/LatexContent'

// ─── Types ─────────────────────────────────────────────────────────────────
interface QuestionOption {
  key: string
  text: string
}

interface Question {
  id: string
  content: string
  options: QuestionOption[]
  order_index: number
  category: string | null
  image_url: string | null
}

type Answers    = Record<string, string>
type RaguRaguSet = Set<string>


// ─── Timer ──────────────────────────────────────────────────────────────────
function Timer({ secondsLeft, isUrgent }: { secondsLeft: number; isUrgent: boolean }) {
  const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const s = (secondsLeft % 60).toString().padStart(2, '0')
  return (
    <span className={`font-mono text-2xl font-bold tracking-wider ${isUrgent ? 'text-red-300 animate-pulse' : 'text-white'}`}>
      {m}:{s}
    </span>
  )
}

// ─── Halaman Ujian ──────────────────────────────────────────────────────────
export default function UjianPage() {
  const router   = useRouter()
  const params   = useParams()
  const packageId = params.packageId as string

  const [pkg, setPkg]             = useState<Pick<PackageRow, 'name' | 'duration_minutes' | 'total_questions'> | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers]     = useState<Answers>({})
  const [raguRagu, setRaguRagu]   = useState<RaguRaguSet>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft]   = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loadError, setLoadError]       = useState('')
  const [isLoading, setIsLoading]       = useState(true)

  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoSubmitRef   = useRef(false)
  const answersRef      = useRef<Answers>({})
  const numberStripRef  = useRef<HTMLDivElement>(null)
  const activeNumberRef = useRef<HTMLButtonElement | null>(null)

  // Selalu sinkronkan ref agar timer tidak stale
  useEffect(() => { answersRef.current = answers }, [answers])

  // Auto-scroll nomor aktif ke tengah strip (mobile)
  useEffect(() => {
    activeNumberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [currentIndex])

  // ─── Submit Handler ──────────────────────────────────────────────────────
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
      const message = err instanceof Error ? err.message : 'Gagal submit jawaban'
      setLoadError(message)
      setIsSubmitting(false)
      autoSubmitRef.current = false
    }
  }, [attemptId, isSubmitting, router])

  // ─── Load Data ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/'); return }

        const { data: pkgData, error: pkgErr } = await supabase
          .from('packages')
          .select('name, duration_minutes, total_questions, is_free, category')
          .eq('id', packageId)
          .single()

        if (pkgErr || !pkgData) { setLoadError('Paket tidak ditemukan.'); setIsLoading(false); return }

        const pkgTyped = pkgData as { name: string; duration_minutes: number; total_questions: number; is_free: boolean; category: string }

        if (pkgTyped.category === 'ASTRA') { router.replace(`/ujian/astra/${packageId}`); return }
        if (pkgTyped.category === 'PLN')   { router.replace(`/ujian/pln/${packageId}`);   return }

        if (!pkgTyped.is_free) {
          try {
            const accessRes  = await fetch(`/api/access?packageId=${packageId}`)
            const accessJson = await accessRes.json() as { canAccess?: boolean; category?: string }
            if (!accessJson.canAccess) {
              setIsLoading(false)
              router.push('/portal/cpns')
              return
            }
          } catch { /* guard sudah di persiapan page */ }
        }

        setPkg(pkgTyped)

        const { data: questionsData, error: qErr } = await supabase
          .from('questions')
          .select('id, content, options, order_index, category, image_url')
          .eq('package_id', packageId)
          .order('order_index', { ascending: true })

        if (qErr || !questionsData) { setLoadError('Gagal memuat soal.'); setIsLoading(false); return }

        // Urutkan: TWK → TIU → TKP, lalu order_index dalam tiap kategori
        const SKD_ORDER: Record<string, number> = { TWK: 0, TIU: 1, TKP: 2 }
        const typed = (questionsData as Question[]).sort((a, b) => {
          const ao = SKD_ORDER[a.category ?? ''] ?? 99
          const bo = SKD_ORDER[b.category ?? ''] ?? 99
          if (ao !== bo) return ao - bo
          return a.order_index - b.order_index
        })
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
          savedAnswers      = (ongoing.answers as Answers) ?? {}

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

        const lsKey  = `attempt_${currentAttemptId}`
        const lsData = localStorage.getItem(lsKey)
        if (lsData && Object.keys(savedAnswers).length === 0) {
          try { setAnswers(JSON.parse(lsData) as Answers) } catch { /* ignore */ }
        }

        setIsLoading(false)
      } catch (err) {
        console.error('[UjianPage] load error:', err)
        setLoadError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.')
        setIsLoading(false)
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId])

  // ─── Timer ───────────────────────────────────────────────────────────────
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

  // ─── Handlers ────────────────────────────────────────────────────────────
  function selectAnswer(questionId: string, key: string) {
    const updated = { ...answers, [questionId]: key }
    setAnswers(updated)
    if (attemptId) localStorage.setItem(`attempt_${attemptId}`, JSON.stringify(updated))
  }

  function toggleRaguRagu(questionId: string) {
    setRaguRagu((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      return next
    })
  }

  // ─── Derived state ────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex]
  const answeredCount   = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount
  const raguCount       = raguRagu.size
  const isUrgent        = timeLeft > 0 && timeLeft <= 300
  const isLastQuestion  = currentIndex === questions.length - 1

  const currentCat = currentQuestion?.category ?? ''

  // ─── Loading / Error ──────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500">Memuat soal ujian...</p>
      </div>
    </div>
  )

  if (loadError) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-red-600 font-medium">{loadError}</p>
        <button onClick={() => router.push('/paket')} className="text-blue-600 hover:underline text-sm">
          ← Kembali ke Paket
        </button>
      </div>
    </div>
  )

  if (!pkg || questions.length === 0) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-gray-500 font-medium">Soal untuk paket ini belum tersedia.</p>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm">← Kembali</button>
      </div>
    </div>
  )

  if (!currentQuestion) return null

  // ─── Helper warna nomor soal (dipakai di sidebar & mobile strip) ─────────
  function getNumberCls(q: Question, idx: number) {
    const isAnswered = !!answers[q.id]
    const isRagu     = raguRagu.has(q.id)
    const isCurrent  = idx === currentIndex
    if (isCurrent)            return 'bg-blue-800 border-blue-800 text-white ring-2 ring-blue-400 ring-offset-1'
    if (isRagu)               return 'bg-yellow-400 border-yellow-400 text-yellow-900 hover:bg-yellow-300'
    if (isAnswered)           return 'bg-green-500 border-green-500 text-white hover:bg-green-600'
    return 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ══ STICKY HEADER ══════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-2 sm:gap-4">

            {/* Logo + Nama Paket */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Mobile: icon saja */}
              <Image
                src="/iconlogo.png"
                alt="TembusKarir"
                width={36} height={36}
                className="sm:hidden h-8 w-8 object-contain brightness-0 invert"
              />
              {/* Desktop: logo penuh */}
              <Image
                src="/logotk.png"
                alt="TembusKarir"
                width={110} height={32}
                className="hidden sm:block h-8 w-auto object-contain brightness-0 invert"
              />
              {/* Nama paket — desktop */}
              <div className="hidden sm:block border-l border-blue-600 pl-3">
                <p className="text-sm font-bold leading-tight tracking-wide">{pkg?.name ?? 'SKD CPNS'}</p>
              </div>
            </div>

            {/* Sub-Tes + Nomor — hanya desktop */}
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-blue-300 text-[10px] uppercase tracking-wide">Sub-Tes</p>
                <p className="font-semibold">{currentCat || '—'}</p>
              </div>
              <div className="text-center">
                <p className="text-blue-300 text-[10px] uppercase tracking-wide">Nomor Soal</p>
                <p className="font-semibold">{currentIndex + 1} / {questions.length}</p>
              </div>
            </div>

            {/* Nomor soal — mobile/tablet saja */}
            <p className="lg:hidden text-blue-200 text-xs font-medium">
              {currentIndex + 1}<span className="text-blue-400"> / {questions.length}</span>
            </p>

            {/* Timer + Submit */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg ${isUrgent ? 'bg-red-600/80' : 'bg-blue-700'}`}>
                <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-300 shrink-0" />
                <Timer secondsLeft={timeLeft} isUrgent={isUrgent} />
              </div>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Akhiri Ujian</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE NUMBER STRIP (hanya < lg) ══════════════════════════════ */}
      <div className="lg:hidden sticky top-14 z-30 bg-white border-b border-gray-200 shadow-sm">
        {/* Legenda ringkas */}
        <div className="flex items-center gap-3 px-3 pt-2 pb-1 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" />Dijawab</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" />Ragu</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-gray-300 inline-block" />Belum</span>
          <span className="ml-auto text-gray-400">{answeredCount}/{questions.length} dijawab</span>
        </div>
        {/* Scrollable number row */}
        <div
          ref={numberStripRef}
          className="flex gap-1.5 overflow-x-auto px-3 pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {questions.map((q, idx) => (
            <button
              key={q.id}
              ref={idx === currentIndex ? activeNumberRef : null}
              onClick={() => setCurrentIndex(idx)}
              disabled={isSubmitting}
              className={`shrink-0 w-9 h-9 rounded-lg text-xs font-bold transition-all border ${getNumberCls(q, idx)} disabled:cursor-not-allowed`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ══ BODY ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex gap-4 pt-3 lg:pt-4 pb-8 items-start">

          {/* ── SIDEBAR KIRI: hanya desktop (lg+) ────────────────────────── */}
          <aside className="hidden lg:flex w-56 shrink-0 sticky top-[68px] flex-col gap-3">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
              <div className="bg-blue-700 px-3 py-2">
                <p className="text-xs font-bold text-white tracking-wide uppercase">Daftar Soal</p>
              </div>
              {/* Legenda */}
              <div className="px-3 py-2 border-b border-gray-100 space-y-1">
                {[
                  { cls: 'bg-green-500 border-green-500',  label: 'Sudah Dijawab' },
                  { cls: 'bg-white border-gray-400',        label: 'Belum Dijawab' },
                  { cls: 'bg-yellow-400 border-yellow-400', label: 'Ragu - Ragu' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-[11px] text-gray-600">
                    <span className={`w-4 h-4 rounded border shrink-0 ${item.cls}`} />
                    {item.label}
                  </div>
                ))}
              </div>
              {/* Grid nomor */}
              <div className="px-2 py-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                <div className="grid grid-cols-6 gap-1">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      disabled={isSubmitting}
                      title={`Soal ${idx + 1}${!!answers[q.id] ? ' ✓' : ''}${raguRagu.has(q.id) ? ' (ragu)' : ''}`}
                      className={`w-full aspect-square rounded text-[10px] font-bold transition-all border ${getNumberCls(q, idx)} disabled:cursor-not-allowed`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── KONTEN SOAL (full-width mobile, flex-1 desktop) ───────────── */}
          <div className="flex-1 min-w-0 space-y-0">

            {/* Wrapper shadow untuk seluruh kartu soal */}
            <div className="shadow-md rounded-xl">

            {/* Card soal */}
            <div className="bg-white rounded-t-xl border border-gray-200 px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
              <div className="text-gray-900 leading-relaxed text-sm">
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 min-w-[1.75rem] h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm mt-0.5">
                    {currentIndex + 1}
                  </span>
                  <div className="flex-1"><LatexContent content={currentQuestion.content} /></div>
                </div>
              </div>

              {currentQuestion.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentQuestion.image_url}
                  alt="Gambar soal"
                  className="max-h-64 sm:max-h-72 object-contain rounded-lg border border-gray-200 mx-auto block"
                />
              )}

              <div className="space-y-2">
                {(Array.isArray(currentQuestion.options) ? currentQuestion.options : []).map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => selectAnswer(currentQuestion.id, opt.key)}
                      disabled={isSubmitting}
                      className={`w-full flex items-start gap-3 px-3 sm:px-4 py-3 rounded-lg border text-left text-sm transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 text-gray-800'
                      } disabled:cursor-not-allowed`}
                    >
                      <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5 ${
                        isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-400 text-gray-500'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="leading-relaxed flex-1">
                        <LatexContent content={opt.text} />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer navigasi */}
            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 flex justify-between items-center gap-2">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0 || isSubmitting}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
              >
                <span>←</span>
                <span className="hidden sm:inline">Soal Sebelumnya</span>
                <span className="sm:hidden">Prev</span>
              </button>

              {/* Tombol Ragu-Ragu — tengah footer */}
              <button
                type="button"
                onClick={() => toggleRaguRagu(currentQuestion.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-semibold transition-colors ${
                  raguRagu.has(currentQuestion.id)
                    ? 'bg-yellow-400 border-yellow-500 text-yellow-900 hover:bg-yellow-300'
                    : 'bg-white border-gray-300 text-gray-500 hover:border-yellow-400 hover:text-yellow-600'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{raguRagu.has(currentQuestion.id) ? 'Ragu-Ragu ✓' : 'Ragu-Ragu'}</span>
                <span className="sm:hidden">{raguRagu.has(currentQuestion.id) ? '✓' : 'Ragu'}</span>
              </button>

              {isLastQuestion ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isSubmitting}
                  className="px-3 sm:px-5 py-2 bg-blue-700 text-white font-semibold rounded-lg text-sm hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Selesaikan Soal ✓</span>
                  <span className="sm:hidden">Selesai ✓</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 bg-blue-700 text-white font-semibold rounded-lg text-sm hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Soal Selanjutnya</span>
                  <span className="sm:hidden">Next</span>
                  <span>→</span>
                </button>
              )}
            </div>

            </div>{/* end shadow wrapper */}

          </div>{/* end konten soal */}
        </div>{/* end flex body */}
      </div>{/* end container */}

      {/* ══ MODAL KONFIRMASI SUBMIT ════════════════════════════════════════ */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Akhiri Ujian?</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <p>Dijawab: <strong className="text-blue-600">{answeredCount} soal</strong></p>
              </div>
              {raguCount > 0 && (
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-yellow-500 shrink-0" />
                  <p>Ragu-ragu: <strong className="text-yellow-600">{raguCount} soal</strong></p>
                </div>
              )}
              {unansweredCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <p>Belum dijawab: <strong className="text-red-600">{unansweredCount} soal</strong></p>
                </div>
              )}
              <p className="pt-1 text-gray-400 text-xs">Setelah diakhiri, jawaban tidak bisa diubah.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={() => handleSubmit(answers)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Ya, Akhiri'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ OVERLAY SUBMITTING ═════════════════════════════════════════════ */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-700 font-medium">Menyimpan jawaban...</p>
          </div>
        </div>
      )}

    </div>
  )
}
