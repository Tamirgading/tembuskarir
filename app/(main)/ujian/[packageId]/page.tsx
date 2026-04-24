'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Bookmark, Flag, CheckCircle2, AlertTriangle } from 'lucide-react'
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

type Answers = Record<string, string>

// ─── Komponen Timer ─────────────────────────────────────────────────────────
function Timer({ secondsLeft, isUrgent }: { secondsLeft: number; isUrgent: boolean }) {
  const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const s = (secondsLeft % 60).toString().padStart(2, '0')
  return (
    <span className={`font-mono text-lg font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
      {m}:{s}
    </span>
  )
}

// ─── Halaman Ujian ──────────────────────────────────────────────────────────
export default function UjianPage() {
  const router = useRouter()
  const params = useParams()
  const packageId = params.packageId as string

  const [pkg, setPkg] = useState<Pick<PackageRow, 'name' | 'duration_minutes' | 'total_questions'> | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answers>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoSubmitRef = useRef(false)

  // ─── Submit Handler ──────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (finalAnswers: Answers) => {
    if (!attemptId || isSubmitting || autoSubmitRef.current) return
    autoSubmitRef.current = true
    setIsSubmitting(true)
    setShowConfirm(false)
    if (timerRef.current) clearInterval(timerRef.current)

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, answers: finalAnswers }),
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

        // Fetch package
        const { data: pkgData, error: pkgErr } = await supabase
          .from('packages')
          .select('name, duration_minutes, total_questions, is_free, category')
          .eq('id', packageId)
          .single()

        if (pkgErr || !pkgData) {
          setLoadError('Paket tidak ditemukan.')
          setIsLoading(false)
          return
        }

        const pkgTyped = pkgData as { name: string; duration_minutes: number; total_questions: number; is_free: boolean; category: string }

        // Redirect ASTRA ke halaman ujian khusus ASTRA
        if (pkgTyped.category === 'ASTRA') {
          router.replace(`/ujian/astra/${packageId}`)
          return
        }

        // Redirect PLN ke halaman ujian khusus PLN (per-subtest flow)
        if (pkgTyped.category === 'PLN') {
          router.replace(`/ujian/pln/${packageId}`)
          return
        }

        // Cek akses paket (subscription atau unlock satuan)
        if (!pkgTyped.is_free) {
          try {
            const accessRes = await fetch(`/api/access?packageId=${packageId}`)
            if (!accessRes.ok) throw new Error(`HTTP ${accessRes.status}`)
            const accessJson = await accessRes.json() as { canAccess?: boolean; category?: string }
            if (!accessJson.canAccess) {
              setIsLoading(false)
              const cat = accessJson.category ?? ''
              if (cat === 'ASTRA') router.push('/portal/astra')
              else if (cat === 'PLN') router.push('/portal/pln')
              else if (cat === 'CPNS') router.push('/portal/cpns')
              else router.push('/paket')
              return
            }
          } catch {
            // Jika cek akses gagal, izinkan lanjut — persiapan page sudah guard server-side
          }
        }

        setPkg(pkgTyped)

        // Fetch soal — TANPA correct_answer
        const { data: questionsData, error: qErr } = await supabase
          .from('questions')
          .select('id, content, options, order_index, category, image_url')
          .eq('package_id', packageId)
          .order('order_index', { ascending: true })

        if (qErr || !questionsData) {
          setLoadError('Gagal memuat soal.')
          setIsLoading(false)
          return
        }

        // Urutkan soal SKD: TWK → TIU → TKP, lalu order_index dalam tiap kategori
        // (order_index dihitung per-kategori sehingga tidak bisa hanya sort by order_index global)
        const SKD_ORDER: Record<string, number> = { TWK: 0, TIU: 1, TKP: 2 }
        const typedQuestions = (questionsData as Question[]).sort((a, b) => {
          const ao = SKD_ORDER[a.category ?? ''] ?? 99
          const bo = SKD_ORDER[b.category ?? ''] ?? 99
          if (ao !== bo) return ao - bo
          return a.order_index - b.order_index
        })
        setQuestions(typedQuestions)

        // Cek attempt ongoing
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
          // Lanjutkan attempt yang ada
          currentAttemptId = ongoing.id
          savedAnswers = (ongoing.answers as Answers) ?? {}

          // Hitung sisa waktu dari started_at
          const startedAt = new Date(ongoing.started_at).getTime()
          const durationMs = pkgTyped.duration_minutes * 60 * 1000
          const elapsed = Date.now() - startedAt
          const remaining = Math.max(0, Math.floor((durationMs - elapsed) / 1000))

          if (remaining === 0) {
            // Waktu habis saat loading — langsung submit
            setAttemptId(currentAttemptId)
            setIsLoading(false)
            await handleSubmit(savedAnswers)
            return
          }
          setTimeLeft(remaining)
        } else {
          // Buat attempt baru — gunakan type casting karena version mismatch @supabase/ssr vs supabase-js
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

          const typedAttempt = newAttempt as { id: string }
          currentAttemptId = typedAttempt.id
          setTimeLeft(pkgTyped.duration_minutes * 60)
        }

        setAttemptId(currentAttemptId)
        setAnswers(savedAnswers)

        // Restore dari localStorage sebagai fallback
        const lsKey = `attempt_${currentAttemptId}`
        const lsData = localStorage.getItem(lsKey)
        if (lsData && Object.keys(savedAnswers).length === 0) {
          try { setAnswers(JSON.parse(lsData) as Answers) } catch { /* ignore */ }
        }

        setIsLoading(false)
      } catch (err) {
        // Tangkap semua error yang tidak terduga agar loading tidak abadi
        console.error('[UjianPage] load error:', err)
        const msg = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.'
        setLoadError(msg)
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
          // Auto-submit saat waktu habis
          handleSubmit(answers)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, attemptId])

  // ─── Simpan jawaban ──────────────────────────────────────────────────────
  function selectAnswer(questionId: string, key: string) {
    const updated = { ...answers, [questionId]: key }
    setAnswers(updated)
    if (attemptId) {
      localStorage.setItem(`attempt_${attemptId}`, JSON.stringify(updated))
    }
  }

  function toggleBookmark(questionId: string) {
    setBookmarked((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      return next
    })
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount
  const isUrgent = timeLeft > 0 && timeLeft <= 300 // 5 menit
  const isLastQuestion = currentIndex === questions.length - 1

  // ─── Loading / Error State ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">Memuat soal ujian...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-medium">{loadError}</p>
          <button onClick={() => router.push('/paket')} className="text-blue-600 hover:underline text-sm">
            ← Kembali ke Paket
          </button>
        </div>
      </div>
    )
  }

  if (!pkg || questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500 font-medium">Soal untuk paket ini belum tersedia.</p>
          <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm">
            ← Kembali
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* ── Header ── */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Sedang Mengerjakan</p>
          <h1 className="font-semibold text-gray-900 text-sm">{pkg.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-400">Soal</p>
            <p className="text-sm font-semibold text-gray-700">{currentIndex + 1} / {questions.length}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 ${isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
            <p className="text-xs text-gray-400 text-center">Waktu</p>
            <Timer secondsLeft={timeLeft} isUrgent={isUrgent} />
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Selesai & Submit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
        {/* ── Card Soal ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Nomor + kategori + bookmark */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {currentIndex + 1}
            </span>
            {currentQuestion.category && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                {currentQuestion.category}
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleBookmark(currentQuestion.id)}
              title={bookmarked.has(currentQuestion.id) ? 'Hapus tanda' : 'Tandai soal ini'}
              className={`ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                bookmarked.has(currentQuestion.id)
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : 'bg-white border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-500'
              }`}
            >
              {bookmarked.has(currentQuestion.id)
                ? <Bookmark className="w-3.5 h-3.5 fill-current" />
                : <Flag className="w-3.5 h-3.5" />
              }
              <span>{bookmarked.has(currentQuestion.id) ? 'Ditandai' : 'Tandai'}</span>
            </button>
          </div>

          {/* Konten soal */}
          <div className="text-gray-900 leading-relaxed">
            <LatexContent content={currentQuestion.content} />
          </div>

          {/* Gambar soal (jika ada) */}
          {currentQuestion.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentQuestion.image_url}
              alt="Gambar soal"
              className="max-h-72 object-contain rounded-lg border border-gray-200 mx-auto block"
            />
          )}

          {/* Pilihan jawaban */}
          <div className="space-y-2.5">
            {(Array.isArray(currentQuestion.options) ? currentQuestion.options : []).map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer(currentQuestion.id, opt.key)}
                  disabled={isSubmitting}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-gray-800'
                  } disabled:cursor-not-allowed`}
                >
                  <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-500'
                  }`}>
                    {opt.key}
                  </span>
                  <span className="leading-relaxed"><LatexContent content={opt.text} /></span>
                </button>
              )
            })}
          </div>

          {/* Navigasi prev/next */}
          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0 || isSubmitting}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Sebelumnya
            </button>
            {isLastQuestion ? (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isSubmitting}
                className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Selesaikan Soal ✓
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={isSubmitting}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Berikutnya →
              </button>
            )}
          </div>
        </div>

        {/* ── Panel Navigasi Soal ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 h-fit">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Navigasi Soal</p>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id]
              const isCurrent = idx === currentIndex
              const isMarked = bookmarked.has(q.id)
              let cls = 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              if (isAnswered) cls = 'bg-green-100 text-green-700 hover:bg-green-200'
              if (isMarked && !isAnswered) cls = 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              if (isMarked && isAnswered) cls = 'bg-green-100 text-green-700 ring-2 ring-amber-400'
              if (isCurrent) cls = 'bg-blue-600 text-white ring-2 ring-blue-300'

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  disabled={isSubmitting}
                  title={`Soal ${idx + 1}${isAnswered ? ' (dijawab)' : ''}${isMarked ? ' 🔖' : ''}`}
                  className={`relative w-full aspect-square rounded-md text-xs font-semibold transition-all ${cls} disabled:cursor-not-allowed`}
                >
                  {idx + 1}
                  {isMarked && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="space-y-1 pt-1 border-t border-gray-100">
            {[
              { color: 'bg-green-100', label: `Dijawab (${answeredCount})` },
              { color: 'bg-gray-100', label: `Belum (${unansweredCount})` },
              { color: 'bg-amber-100', label: `Ditandai (${bookmarked.size})` },
              { color: 'bg-blue-600', label: 'Soal aktif' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-3.5 h-3.5 rounded-sm shrink-0 ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={isSubmitting}
            className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Selesai & Submit
          </button>
        </div>
      </div>

      {/* ── Modal Konfirmasi Submit ── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Konfirmasi Submit</h2>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <p>Dijawab: <strong className="text-green-600">{answeredCount} soal</strong></p>
              </div>
              {unansweredCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <p>Belum dijawab: <strong className="text-amber-600">{unansweredCount} soal</strong></p>
                </div>
              )}
              <p className="pt-1 text-gray-500">
                Setelah di-submit, jawaban tidak bisa diubah.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleSubmit(answers)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Ya, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Overlay submitting ── */}
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
