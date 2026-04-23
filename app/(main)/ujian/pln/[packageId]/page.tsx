'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PLN_SUBTESTS } from '@/lib/exam-scoring'
import { LatexContent } from '@/components/ui/LatexContent'

// ─── Konstanta ─────────────────────────────────────────────────────────────────
const SUBTEST_ORDER = ['NUM', 'VER', 'SIL', 'DER', 'FIG', 'PU', 'LA', 'AKHLAK'] as const

const SUBTEST_INFO: Record<string, { desc: string; tip: string }> = {
  NUM:    { desc: 'Soal hitung-hitungan — aritmatika, persentase, perbandingan, dan aljabar sederhana.', tip: 'Skip soal yang terlalu lama dulu — kembali kalau masih ada waktu.' },
  VER:    { desc: 'Kemampuan berbahasa — sinonim, antonim, analogi kata, dan pemahaman istilah.', tip: 'Banyak baca materi seputar ketenagalistrikan untuk istilah khusus PLN.' },
  SIL:    { desc: 'Tentukan kesimpulan paling valid dari premis-premis yang diberikan.', tip: 'Gunakan logika deduktif — jangan berasumsi di luar premis.' },
  DER:    { desc: 'Temukan pola dari deretan angka — aritmatika, geometri, atau kombinasi.', tip: 'Cek selisih antar angka: tetap, kelipatan, atau berganti-ganti pola.' },
  FIG:    { desc: 'Temukan pola dari rangkaian gambar atau bentuk — rotasi, refleksi, pertambahan elemen.', tip: 'Perhatikan perubahan posisi, jumlah, dan arah satu per satu.' },
  PU:     { desc: 'Pengetahuan seputar PT PLN — sejarah, struktur, proyek, core values, dan istilah kelistrikan.', tip: 'Pelajari profil perusahaan, transformasi digital, dan visi transisi energi PLN.' },
  LA:     { desc: 'Situational Judgement Test — pilih reaksi paling tepat untuk situasi kerja yang diberikan.', tip: 'Pilih jawaban yang menunjukkan fleksibilitas belajar dan kerja sama.' },
  AKHLAK: { desc: 'Tes nilai inti BUMN — Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif.', tip: 'Jujur dan natural. Hindari jawaban ekstrem yang terkesan pencitraan.' },
}

const SUBTEST_COLORS: Record<string, string> = {
  NUM:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  VER:    'bg-amber-100 text-amber-700 border-amber-200',
  SIL:    'bg-orange-100 text-orange-700 border-orange-200',
  DER:    'bg-red-100 text-red-600 border-red-200',
  FIG:    'bg-rose-100 text-rose-600 border-rose-200',
  PU:     'bg-blue-100 text-blue-600 border-blue-200',
  LA:     'bg-indigo-100 text-indigo-600 border-indigo-200',
  AKHLAK: 'bg-purple-100 text-purple-600 border-purple-200',
}

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
type Phase = 'loading' | 'overview' | 'subtest-intro' | 'in-progress' | 'submitting'

// ─── Timer display ──────────────────────────────────────────────────────────────
function TimerDisplay({ seconds, isUrgent }: { seconds: number; isUrgent: boolean }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return (
    <span className={`font-mono text-lg font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
      {m}:{s}
    </span>
  )
}

// ─── Konten soal dengan line-break per baris ────────────────────────────────────
function QuestionContent({ content }: { content: string }) {
  const lines = content.split('\n').filter(l => l.trim() !== '')
  if (lines.length <= 1) {
    return <LatexContent content={content} />
  }
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

// ─── Baris dari tabel questions_pln_akhlak / questions_pln_la ──────────────────
interface PlnPointRow {
  id: string
  content: string
  opt_a: string; opt_b: string; opt_c: string; opt_d: string; opt_e: string
  order_index: number
  image_url: string | null
}

function pointRowToQuestion(row: PlnPointRow, category: string): Question {
  return {
    id: row.id,
    content: row.content,
    options: [
      { key: 'A', text: row.opt_a },
      { key: 'B', text: row.opt_b },
      { key: 'C', text: row.opt_c },
      { key: 'D', text: row.opt_d },
      { key: 'E', text: row.opt_e },
    ],
    order_index: row.order_index,
    category,
    image_url: row.image_url,
  }
}

// ─── Halaman Ujian PLN ──────────────────────────────────────────────────────────
export default function PlnUjianPage() {
  const router = useRouter()
  const params = useParams()
  const packageId = params.packageId as string

  const [phase, setPhase] = useState<Phase>('loading')
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [pkgName, setPkgName] = useState('')
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [subtestKeys, setSubtestKeys] = useState<string[]>([])
  const [questionsBySubtest, setQuestionsBySubtest] = useState<Record<string, Question[]>>({})
  const [currentSubtestIdx, setCurrentSubtestIdx] = useState(0)
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const answersRef = useRef<Answers>({})
  const subtestKeysRef = useRef<string[]>([])
  const currentSubtestIdxRef = useRef(0)
  const attemptIdRef = useRef<string | null>(null)
  const isSubmittingRef = useRef(false)

  answersRef.current = answers
  subtestKeysRef.current = subtestKeys
  currentSubtestIdxRef.current = currentSubtestIdx
  attemptIdRef.current = attemptId
  isSubmittingRef.current = isSubmitting

  async function doSubmit(finalAnswers: Answers) {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsSubmitting(true)
    setPhase('submitting')
    if (timerRef.current) clearInterval(timerRef.current)

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attemptIdRef.current, answers: finalAnswers }),
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
    const keys = subtestKeysRef.current
    const nextIdx = currentSubtestIdxRef.current + 1
    if (nextIdx >= keys.length) {
      doSubmit(currentAnswers)
    } else {
      setCurrentSubtestIdx(nextIdx)
      setCurrentQIdx(0)
      setPhase('subtest-intro')
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/'); return }

        const { data: pkgData } = await supabase
          .from('packages')
          .select('name, is_free')
          .eq('id', packageId)
          .single()

        if (!pkgData) { setLoadError('Paket tidak ditemukan.'); return }
        setPkgName((pkgData as { name: string }).name)

        // Fetch soal MCQ biasa (NUM, VER, SIL, DER, FIG, PU)
        const { data: mcqData } = await supabase
          .from('questions')
          .select('id, content, options, order_index, category, image_url')
          .eq('package_id', packageId)
          .order('order_index', { ascending: true })

        // Fetch soal AKHLAK (tanpa point untuk keamanan)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: akhlakData } = await (supabase.from('questions_pln_akhlak') as any)
          .select('id, content, opt_a, opt_b, opt_c, opt_d, opt_e, order_index, image_url')
          .eq('package_id', packageId)
          .order('order_index', { ascending: true })

        // Fetch soal LA (tanpa point)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: laData } = await (supabase.from('questions_pln_la') as any)
          .select('id, content, opt_a, opt_b, opt_c, opt_d, opt_e, order_index, image_url')
          .eq('package_id', packageId)
          .order('order_index', { ascending: true })

        const mcqList = (mcqData ?? []) as Question[]
        const akhlakList = ((akhlakData ?? []) as PlnPointRow[]).map(r => pointRowToQuestion(r, 'AKHLAK'))
        const laList = ((laData ?? []) as PlnPointRow[]).map(r => pointRowToQuestion(r, 'LA'))

        const allQuestions = [...mcqList, ...akhlakList, ...laList]
        if (allQuestions.length === 0) {
          setLoadError('Soal belum tersedia untuk paket ini.')
          return
        }

        const grouped: Record<string, Question[]> = {}
        for (const q of allQuestions) {
          const cat = (q.category ?? 'NUM').toUpperCase()
          if (!grouped[cat]) grouped[cat] = []
          grouped[cat].push(q)
        }
        const availableKeys = SUBTEST_ORDER.filter(k => grouped[k] && grouped[k].length > 0)
        setSubtestKeys(availableKeys)
        setQuestionsBySubtest(grouped)

        // Cek attempt ongoing
        const { data: ongoingData } = await supabase
          .from('attempts')
          .select('id, answers, started_at')
          .eq('user_id', user.id)
          .eq('package_id', packageId)
          .eq('status', 'ongoing')
          .maybeSingle()

        const ongoing = ongoingData as { id: string; answers: Answers; started_at: string } | null

        if (ongoing) {
          setAttemptId(ongoing.id)
          const savedAnswers = (ongoing.answers as Answers) ?? {}
          setAnswers(savedAnswers)

          let resumeIdx = 0
          for (let i = 0; i < availableKeys.length; i++) {
            const allAnswered = grouped[availableKeys[i]].every(q => savedAnswers[q.id])
            if (allAnswered) { resumeIdx = i + 1 } else { resumeIdx = i; break }
          }

          if (resumeIdx >= availableKeys.length) {
            doSubmit(savedAnswers)
          } else {
            setCurrentSubtestIdx(resumeIdx)
            setCurrentQIdx(0)
            setPhase('subtest-intro')
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: newAttempt, error: attemptErr } = await (supabase.from('attempts') as any)
            .insert({ user_id: user.id, package_id: packageId })
            .select('id')
            .single()

          if (attemptErr || !newAttempt) {
            setLoadError(`Gagal membuat sesi ujian. ${(attemptErr as { message?: string })?.message ?? ''}`)
            return
          }
          setAttemptId((newAttempt as { id: string }).id)
          setPhase('overview')
        }
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.')
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId])

  useEffect(() => {
    if (phase !== 'in-progress') return
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          advanceToNext(answersRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentSubtestIdx])

  function goToFirstSubtest() {
    setCurrentSubtestIdx(0)
    setCurrentQIdx(0)
    setPhase('subtest-intro')
  }

  function handleStartSubtest() {
    const key = subtestKeys[currentSubtestIdx]
    setTimeLeft(PLN_SUBTESTS[key].minutes * 60)
    setCurrentQIdx(0)
    setPhase('in-progress')
  }

  async function selectAnswer(questionId: string, key: string) {
    const updated = { ...answers, [questionId]: key }
    setAnswers(updated)
    if (attemptId) localStorage.setItem(`pln_${attemptId}`, JSON.stringify(updated))
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('attempts') as any).update({ answers: updated }).eq('id', attemptId)
    } catch { /* ignore */ }
  }

  function handleNext() {
    const key = subtestKeys[currentSubtestIdx]
    const questions = questionsBySubtest[key]
    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx(prev => prev + 1)
    } else {
      setShowFinishConfirm(true)
    }
  }

  function handleConfirmFinish() {
    setShowFinishConfirm(false)
    advanceToNext(answersRef.current)
  }

  // ─── Render: Loading ──────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">Memuat soal ujian...</p>
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

  // ─── Render: Overview ─────────────────────────────────────────────────────────
  if (phase === 'overview') {
    const totalSoal = subtestKeys.reduce((s, k) => s + (questionsBySubtest[k]?.length ?? 0), 0)
    const totalMenit = subtestKeys.reduce((s, k) => s + (PLN_SUBTESTS[k]?.minutes ?? 0), 0)

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 px-7 py-8">
            <p className="text-yellow-100 text-sm font-semibold mb-1">GAT PLN</p>
            <h1 className="text-2xl font-extrabold text-white">{pkgName}</h1>
            <div className="flex gap-3 mt-4">
              {[
                { label: 'soal total', value: totalSoal },
                { label: 'sub-tes', value: subtestKeys.length },
                { label: 'menit total', value: totalMenit },
              ].map(s => (
                <div key={s.label} className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-white font-bold">{s.value}</p>
                  <p className="text-yellow-100 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Urutan Sub-tes</p>

            <div className="space-y-2">
              {subtestKeys.map((key, i) => {
                const sub = PLN_SUBTESTS[key]
                const qs = questionsBySubtest[key]
                return (
                  <div key={key} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50">
                    <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${SUBTEST_COLORS[key]}`}>
                      {key}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 flex-1">{sub.full}</span>
                    <span className="text-xs text-gray-400 shrink-0">{qs.length} soal · {sub.minutes} mnt</span>
                  </div>
                )
              })}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-xs text-yellow-700 leading-relaxed">
              <strong>Perhatian:</strong> Sub-tes dikerjakan berurutan. Waktu tiap sub-tes berjalan terpisah dan tidak bisa dijeda. Jawaban otomatis tersimpan saat waktu habis.
            </div>

            <button
              onClick={goToFirstSubtest}
              className="w-full py-4 bg-yellow-500 text-white font-bold text-base rounded-2xl hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-200 active:scale-[0.98]"
            >
              Mulai Simulasi →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Render: Subtest Intro ────────────────────────────────────────────────────
  if (phase === 'subtest-intro') {
    const key = subtestKeys[currentSubtestIdx]
    const sub = PLN_SUBTESTS[key]
    const info = SUBTEST_INFO[key]
    const qs = questionsBySubtest[key]
    const isPointBased = sub.kind === 'akhlak' || sub.kind === 'la'

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 px-7 py-8">
            <p className="text-yellow-100 text-sm font-semibold mb-2">
              Sub-tes {currentSubtestIdx + 1} dari {subtestKeys.length}
            </p>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/30 text-white text-sm font-extrabold rounded-full">{key}</span>
              <h2 className="text-xl font-extrabold text-white">{sub.full}</h2>
            </div>
            <div className="flex gap-3">
              {[
                { label: 'soal', value: qs.length },
                { label: 'menit', value: sub.minutes },
                { label: isPointBased ? 'per opsi' : 'per benar', value: isPointBased ? '1–5' : '+1' },
              ].map(s => (
                <div key={s.label} className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-white font-bold">{s.value}</p>
                  <p className="text-yellow-100 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deskripsi</p>
              <p className="text-gray-700 text-sm leading-relaxed">{info?.desc}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">💡 Tips</p>
              <p className="text-yellow-800 text-sm leading-relaxed">{info?.tip}</p>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>Timer dimulai saat kamu klik &quot;Mulai&quot;. Soal dikerjakan satu per satu &mdash; tidak bisa kembali ke soal sebelumnya.</p>
            </div>

            <button
              onClick={handleStartSubtest}
              className="w-full py-4 bg-yellow-500 text-white font-bold text-base rounded-2xl hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-200 active:scale-[0.98]"
            >
              Mulai {key} →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Render: In Progress ──────────────────────────────────────────────────────
  if (phase === 'in-progress') {
    const key = subtestKeys[currentSubtestIdx]
    const questions = questionsBySubtest[key]
    const currentQ = questions[currentQIdx]
    const isAnswered = !!answers[currentQ.id]
    const isLastQ = currentQIdx === questions.length - 1
    const isLastSubtest = currentSubtestIdx === subtestKeys.length - 1
    const isUrgent = timeLeft > 0 && timeLeft <= 30

    return (
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">

        <div className="bg-white rounded-2xl border border-gray-200 px-5 py-3 flex items-center gap-4">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${SUBTEST_COLORS[key]}`}>
            {key}
          </span>
          <div className="flex-1">
            <p className="text-xs text-gray-400">{PLN_SUBTESTS[key].full}</p>
            <p className="text-sm font-bold text-gray-800">Soal {currentQIdx + 1} / {questions.length}</p>
          </div>

          <div className="hidden sm:flex gap-0.5 w-32">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className={`h-1.5 flex-1 rounded-full ${
                  i < currentQIdx ? 'bg-green-400'
                  : i === currentQIdx ? 'bg-yellow-500'
                  : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shrink-0 ${
            isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <p className="text-xs text-gray-400">Waktu</p>
            <TimerDisplay seconds={timeLeft} isUrgent={isUrgent} />
          </div>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {submitError}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {currentQIdx + 1}
            </span>
            <span className="text-xs text-gray-400">
              Sub-tes {currentSubtestIdx + 1} dari {subtestKeys.length}
            </span>
          </div>

          <div className="text-gray-900 leading-relaxed">
            <QuestionContent content={currentQ.content} />
          </div>

          {currentQ.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentQ.image_url} alt="Gambar soal" className="max-h-72 object-contain rounded-xl border border-gray-200 mx-auto block" />
          )}

          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer(currentQ.id, opt.key)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/40 text-gray-800'
                  }`}
                >
                  <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'border-yellow-500 bg-yellow-500 text-white' : 'border-gray-300 text-gray-500'
                  }`}>
                    {opt.key}
                  </span>
                  <span className="leading-relaxed"><LatexContent content={opt.text} /></span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            {!isAnswered ? (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Pilih jawaban untuk melanjutkan
              </p>
            ) : (
              <span />
            )}
            <button
              onClick={handleNext}
              disabled={!isAnswered || isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isAnswered && !isSubmitting
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm hover:shadow-yellow-200 hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLastQ
                ? (isLastSubtest ? 'Selesai & Kirim Hasil ✓' : 'Selesai Sub-tes →')
                : 'Berikutnya →'}
            </button>
          </div>
        </div>

        {/* ── Modal Konfirmasi Selesai Sub-tes ── */}
        {showFinishConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center">
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-yellow-600" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                  Selesaikan Sub-tes {key}?
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isLastSubtest
                    ? 'Kamu akan mengirim seluruh jawaban. Tindakan ini tidak dapat dibatalkan.'
                    : `Kamu akan berpindah ke sub-tes berikutnya. Jawaban sub-tes ${key} tidak bisa diubah lagi.`}
                </p>
                {timeLeft > 30 && (
                  <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    Masih ada <span className="font-bold">{Math.floor(timeLeft / 60)} menit {timeLeft % 60} detik</span> tersisa
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConfirmFinish}
                  className="w-full py-3 bg-yellow-500 text-white font-bold rounded-2xl hover:bg-yellow-600 transition-all"
                >
                  {isLastSubtest ? 'Ya, Kirim Jawaban' : 'Ya, Lanjut ke Sub-tes Berikutnya'}
                </button>
                <button
                  onClick={() => setShowFinishConfirm(false)}
                  className="w-full py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all text-sm"
                >
                  Kembali, Cek Jawaban Lagi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Render: Submitting ───────────────────────────────────────────────────────
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-700 font-medium">Mengirim jawaban...</p>
        <p className="text-gray-400 text-sm">Harap jangan tutup halaman ini</p>
      </div>
    </div>
  )
}
