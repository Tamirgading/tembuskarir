'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AlertTriangle, Play, ChevronLeft, ChevronRight, Clock, Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LatexContent } from '@/components/ui/LatexContent'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { fetchStageSections, type StageSection } from '@/lib/stage-config'

// ─── Types ──────────────────────────────────────────────────────────────────────
interface Question {
  id: string
  content: string
  options: { key: string; text: string }[]
  order_index: number
  category: string | null
  image_url: string | null
}

type Answers = Record<string, string>
type Phase = 'loading' | 'overview' | 'section-intro' | 'in-progress' | 'submitting'

// ─── Timer display ──────────────────────────────────────────────────────────────
function TimerDisplay({ seconds, isUrgent }: { seconds: number; isUrgent: boolean }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return (
    <span className={`font-num text-lg font-bold ${isUrgent ? 'text-red-300 animate-pulse' : 'text-white'}`}>
      {m}:{s}
    </span>
  )
}

function QuestionContent({ content }: { content: string }) {
  const lines = content.split('\n').filter((l) => l.trim() !== '')
  if (lines.length <= 1) return <LatexContent content={content} />
  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <p key={i} className="leading-relaxed">
          <LatexContent content={line} />
        </p>
      ))}
    </div>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function timerLabel(sec: StageSection): string {
  if (sec.timer_mode === 'per_question') {
    return sec.timer_seconds >= 60
      ? `${Math.round(sec.timer_seconds / 60)} mnt/soal`
      : `${sec.timer_seconds} dtk/soal`
  }
  return sec.timer_seconds >= 60
    ? `${Math.round(sec.timer_seconds / 60)} mnt`
    : `${sec.timer_seconds} dtk`
}

// ─── Halaman Ujian Tahap ────────────────────────────────────────────────────────
export default function StageUjianPage() {
  const router = useRouter()
  const params = useParams()
  const packageId = params.packageId as string

  const [phase, setPhase] = useState<Phase>('loading')
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [pkgName, setPkgName] = useState('')
  const [sections, setSections] = useState<StageSection[]>([])
  const [questionsByKode, setQuestionsByKode] = useState<Record<string, Question[]>>({})
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [attemptId, setAttemptId] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const answersRef = useRef<Answers>({})
  const sectionsRef = useRef<StageSection[]>([])
  const questionsByKodeRef = useRef<Record<string, Question[]>>({})
  const currentSectionIdxRef = useRef(0)
  const currentQIdxRef = useRef(0)
  const attemptIdRef = useRef<string | null>(null)
  const isSubmittingRef = useRef(false)

  answersRef.current = answers
  sectionsRef.current = sections
  questionsByKodeRef.current = questionsByKode
  currentSectionIdxRef.current = currentSectionIdx
  currentQIdxRef.current = currentQIdx
  attemptIdRef.current = attemptId
  isSubmittingRef.current = isSubmitting

  // ─── Submit ──────────────────────────────────────────────────────────────────
  async function doSubmit(finalAnswers: Answers) {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsSubmitting(true)
    setPhase('submitting')
    if (timerRef.current) clearInterval(timerRef.current)

    try {
      const presented = Object.values(questionsByKodeRef.current)
        .flat()
        .map((q) => q.id)

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attemptIdRef.current,
          answers: finalAnswers,
          presentedQuestionIds: presented,
        }),
      })
      const json = await res.json() as { data?: { attemptId: string }; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Gagal submit')
      router.push(`/hasil/${json.data?.attemptId ?? attemptIdRef.current}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Gagal mengirim jawaban.')
      isSubmittingRef.current = false
      setIsSubmitting(false)
      setPhase('in-progress')
    }
  }

  function advanceToNext(currentAnswers: Answers) {
    if (timerRef.current) clearInterval(timerRef.current)
    const nextIdx = currentSectionIdxRef.current + 1
    if (nextIdx >= sectionsRef.current.length) {
      doSubmit(currentAnswers)
    } else {
      setCurrentSectionIdx(nextIdx)
      setCurrentQIdx(0)
      setPhase('section-intro')
    }
  }

  function handleQuestionTimeout() {
    const sec = sectionsRef.current[currentSectionIdxRef.current]
    const qs = questionsByKodeRef.current[sec.kode] ?? []
    if (currentQIdxRef.current < qs.length - 1) {
      setCurrentQIdx(currentQIdxRef.current + 1)
    } else {
      advanceToNext(answersRef.current)
    }
  }

  function handleSectionTimeout() {
    advanceToNext(answersRef.current)
  }

  // ─── Timer: mode seksi (per seksi) ───────────────────────────────────────────
  useEffect(() => {
    const sec = sectionsRef.current[currentSectionIdxRef.current]
    if (phase !== 'in-progress' || !sec || sec.timer_mode !== 'section') return
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(sec.timer_seconds)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSectionTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentSectionIdx])

  // ─── Timer: mode per soal (reset tiap pindah soal) ──────────────────────────
  useEffect(() => {
    const sec = sectionsRef.current[currentSectionIdxRef.current]
    if (phase !== 'in-progress' || !sec || sec.timer_mode !== 'per_question') return
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(sec.timer_seconds)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleQuestionTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentSectionIdx, currentQIdx])

  // ─── Load data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/'); return }

        const { data: pkgData } = await supabase
          .from('packages')
          .select('name, slug, duration_minutes, is_free, category')
          .eq('id', packageId)
          .single()

        if (!pkgData) { setLoadError('Paket tidak ditemukan.'); return }
        const pkgTyped = pkgData as { name: string; slug: string; duration_minutes: number; is_free: boolean; category: string }
        setPkgName(pkgTyped.name)

        // Cek konfigurasi tahap; fallback ke runner generik jika tidak ada seksi
        const secs = await fetchStageSections(supabase, packageId)
        if (secs.length === 0) {
          router.replace(`/ujian/${packageId}`)
          return
        }
        setSections(secs)

        // Ambil semua soal inline, lalu kelompokkan berdasarkan kategori (kode seksi)
        const { data: qData } = await supabase
          .from('questions')
          .select('id, content, options, order_index, category, image_url')
          .eq('package_id', packageId)
          .order('order_index', { ascending: true })

        const allQs = ((qData ?? []) as Question[]).sort((a, b) => a.order_index - b.order_index)
        const byKode: Record<string, Question[]> = {}
        for (const sec of secs) {
          let list = allQs.filter((q) => (q.category ?? '').toUpperCase() === sec.kode.toUpperCase())
          if (sec.random_select && sec.question_count && sec.question_count < list.length) {
            list = shuffle(list).slice(0, sec.question_count)
          }
          byKode[sec.kode] = list.sort((a, b) => a.order_index - b.order_index)
        }
        setQuestionsByKode(byKode)

        if (!pkgTyped.is_free) {
          try {
            const accessRes = await fetch(`/api/access?packageId=${packageId}`)
            const accessJson = await accessRes.json() as { canAccess?: boolean }
            if (!accessJson.canAccess) { router.push('/harga'); return }
          } catch { /* guard di persiapan */ }
        }

        // Attempt: lanjutkan atau buat baru
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
          savedAnswers = (ongoing.answers as Answers) ?? {}
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: newAttempt, error: attemptErr } = await (supabase.from('attempts') as any)
            .insert({ user_id: user.id, package_id: packageId })
            .select('id')
            .single()
          if (attemptErr || !newAttempt) {
            setLoadError(`Gagal membuat sesi ujian. ${attemptErr?.message ?? ''}`)
            return
          }
          currentAttemptId = (newAttempt as { id: string }).id
        }

        setAttemptId(currentAttemptId)
        setAnswers(savedAnswers)

        const lsKey = `stage_${currentAttemptId}`
        const lsData = localStorage.getItem(lsKey)
        if (lsData && Object.keys(savedAnswers).length === 0) {
          try { setAnswers(JSON.parse(lsData) as Answers) } catch { /* ignore */ }
        }

        setPhase('overview')
      } catch (err) {
        console.error('[StageUjian] load error:', err)
        setLoadError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.')
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId])

  function selectAnswer(questionId: string, key: string) {
    const updated = { ...answers, [questionId]: key }
    setAnswers(updated)
    if (attemptId) {
      localStorage.setItem(`stage_${attemptId}`, JSON.stringify(updated))
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void (supabase.from('attempts') as any).update({ answers: updated }).eq('id', attemptId)
    }
  }

  function goToFirstSection() {
    setCurrentSectionIdx(0)
    setCurrentQIdx(0)
    setPhase('section-intro')
  }

  function handleStartSection() {
    setCurrentQIdx(0)
    setPhase('in-progress')
  }

  const currentSec = sections[currentSectionIdx]
  const currentQs = currentSec ? (questionsByKode[currentSec.kode] ?? []) : []
  const currentQ = currentQs[currentQIdx]
  const totalSoal = Object.values(questionsByKode).reduce((s, qs) => s + qs.length, 0)

  // ─── Render: loading ──────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-ink-muted">Memuat soal ujian...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-red-600 font-medium">{loadError}</p>
          <button onClick={() => router.back()} className="text-yellow-600 hover:underline text-sm">← Kembali</button>
        </div>
      </div>
    )
  }

  // ─── Render: overview ─────────────────────────────────────────────────────────
  if (phase === 'overview') {
    const totalMenit = sections.reduce((s, sec) => s + sec.timer_seconds, 0) / 60
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl border border-hairline shadow-soft overflow-hidden">
          <div className="px-7 py-8 text-white" style={{ background: 'linear-gradient(135deg,#4C1D95,#1e1b4b)' }}>
            <p className="text-white/55 text-sm font-semibold mb-1">Simulasi Tahap</p>
            <h1 className="text-2xl font-heading font-extrabold text-white">{pkgName}</h1>
            <div className="flex gap-3 mt-4">
              {[
                { label: 'soal total', value: totalSoal },
                { label: 'seksi', value: sections.length },
                { label: 'menit total', value: Math.round(totalMenit) },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <p className="text-white font-num font-bold">{s.value}</p>
                  <p className="text-white/55 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <SectionLabel>Urutan Seksi</SectionLabel>
            <div className="space-y-2">
              {sections.map((sec, i) => {
                const qs = questionsByKode[sec.kode] ?? []
                return (
                  <div key={sec.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-hairline bg-paper-soft">
                    <span className="w-6 h-6 rounded-full bg-brand/10 text-brand-700 text-xs font-num font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-soft truncate">{sec.nama}</p>
                      <p className="text-[10px] text-ink-muted">{timerLabel(sec)}{sec.passing_grade != null ? ` · Passing grade ${sec.passing_grade}` : ''}</p>
                    </div>
                    <span className="text-xs text-ink-muted font-num shrink-0">{qs.length} soal</span>
                  </div>
                )
              })}
            </div>

            <button onClick={goToFirstSection}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand text-white font-bold text-base rounded-2xl hover:bg-brand-700 transition-all shadow-soft active:scale-[0.98]">
              <Play className="w-4 h-4" /> Mulai Ujian
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Render: intro seksi ─────────────────────────────────────────────────────
  if (phase === 'section-intro' && currentSec) {
    const qs = questionsByKode[currentSec.kode] ?? []
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl border border-hairline shadow-soft p-8 text-center space-y-4">
          <p className="text-[11px] font-bold text-brand uppercase tracking-wider">Seksi {currentSectionIdx + 1} dari {sections.length}</p>
          <h1 className="text-xl font-heading font-extrabold text-ink">{currentSec.nama}</h1>
          <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            {qs.length} soal · {timerLabel(currentSec)}
            {currentSec.timer_mode === 'per_question' && (
              <span className="block mt-1 text-amber-600">Timer per soal. Jawaban otomatis berpindah saat waktu habis.</span>
            )}
          </p>
          {currentSec.passing_grade != null && (
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200 px-4 py-1.5 text-xs font-semibold text-purple-700">
              Passing grade: {currentSec.passing_grade}
            </div>
          )}
          <button onClick={handleStartSection}
            className="w-full flex items-center justify-center gap-2 py-4 bg-brand text-white font-bold text-base rounded-2xl hover:bg-brand-700 transition-all shadow-soft active:scale-[0.98]">
            <Play className="w-4 h-4" /> Mulai Seksi
          </button>
        </div>
      </div>
    )
  }

  // ─── Render: in-progress ─────────────────────────────────────────────────────
  if (phase === 'in-progress' && currentSec && currentQ) {
    const isUrgent = timeLeft <= 30
    const canPrev = currentQIdx > 0
    const isLastQ = currentQIdx >= currentQs.length - 1

    return (
      <div className="min-h-screen bg-paper flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-ink text-white px-4 sm:px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 shrink-0">{currentSec.kode}</span>
              <span className="text-xs text-white/60 truncate">{pkgName}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] text-white/50 font-num">{currentQIdx + 1}/{currentQs.length}</span>
              <Clock className="w-4 h-4 text-white/50" />
              <TimerDisplay seconds={timeLeft} isUrgent={isUrgent} />
            </div>
          </div>
          <div className="max-w-3xl mx-auto mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${((currentSectionIdx + (currentQIdx + 1) / currentQs.length) / sections.length) * 100}%` }} />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5 sm:p-6">
            <div className="text-sm text-ink-soft leading-relaxed">
              <QuestionContent content={currentQ.content} />
            </div>
            {currentQ.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentQ.image_url} alt="Gambar soal" className="mt-4 max-h-72 object-contain mx-auto border border-hairline rounded-xl" />
            )}

            <div className="mt-5 space-y-2">
              {currentQ.options.map((opt) => {
                const selected = answers[currentQ.id] === opt.key
                return (
                  <button
                    key={opt.key}
                    onClick={() => selectAnswer(currentQ.id, opt.key)}
                    className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      selected
                        ? 'border-brand bg-brand/5 ring-2 ring-brand/30'
                        : 'border-hairline hover:border-brand/50 hover:bg-paper-soft'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      selected ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                    }`}>{opt.key}</span>
                    <span className="flex-1 text-sm text-ink-soft">
                      <LatexContent content={opt.text} />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="sticky bottom-0 bg-white border-t border-hairline px-4 sm:px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <button onClick={() => currentQIdx > 0 && setCurrentQIdx(currentQIdx - 1)}
              disabled={!canPrev}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                canPrev ? 'border-hairline text-ink hover:bg-paper-soft' : 'opacity-40 cursor-not-allowed'
              }`}>
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>

            {isLastQ ? (
              <button onClick={() => setShowFinishConfirm(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
                <Flag className="w-4 h-4" /> Selesai Seksi
              </button>
            ) : (
              <button onClick={() => setCurrentQIdx(currentQIdx + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
                Berikutnya <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Konfirmasi selesai seksi */}
        {showFinishConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
              <p className="font-bold text-ink text-lg">Selesai seksi ini?</p>
              <p className="text-sm text-ink-muted">
                {isLastQ ? 'Ini seksi terakhir. Ujian akan langsung dikumpulkan.' : `Lanjut ke seksi berikutnya (${sections[currentSectionIdx + 1]?.nama ?? ''}).`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowFinishConfirm(false)}
                  className="flex-1 py-2.5 border border-hairline text-ink text-sm font-semibold rounded-xl hover:bg-paper-soft transition-colors">
                  Kembali
                </button>
                <button onClick={() => { setShowFinishConfirm(false); advanceToNext(answersRef.current) }}
                  className="flex-1 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
                  {isLastQ ? 'Kumpulkan' : 'Lanjut'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Render: submitting ──────────────────────────────────────────────────────
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      <p className="text-ink-muted text-sm">{isSubmitting ? 'Mengumpulkan jawaban...' : 'Memuat...'}</p>
      {submitError && (
        <div className="max-w-sm text-center space-y-2">
          <p className="text-red-600 text-sm">{submitError}</p>
          <button onClick={() => setPhase('in-progress')} className="text-yellow-600 hover:underline text-sm">← Kembali ke ujian</button>
        </div>
      )}
    </div>
  )
}
