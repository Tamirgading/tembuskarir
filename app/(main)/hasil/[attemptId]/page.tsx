import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RotateCcw, Grid2x2, LayoutDashboard, CheckCircle2, XCircle, MinusCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { AttemptRow } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'
import { ASTRA_SUBTESTS, PLN_SUBTESTS } from '@/lib/exam-scoring'
import { HasilReview } from '@/components/hasil/HasilReview'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

interface QuestionWithAnswer {
  id: string
  content: string
  options: { key: string; text: string }[]
  correct_answer: string
  explanation: string | null
  explanation_image_url: string | null
  category: string | null
  image_url: string | null
  order_index: number
}

interface CatStat { correct: number; wrong: number; empty: number; rawScore: number }
interface ScoreDetails {
  type?: string
  categories?: Record<string, CatStat>
  maxScore?: number
  totalQuestions?: number
}

const SUBTEST_FULL: Record<string, string> = Object.fromEntries([
  ...Object.entries(ASTRA_SUBTESTS).map(([k, v]) => [k, v.full]),
  ...Object.entries(PLN_SUBTESTS).map(([k, v]) => [k, v.full]),
])

function tier(pct: number): { title: string; note: string } {
  if (pct >= 85) return { title: 'Hasil yang luar biasa', note: 'Kamu sudah sangat siap. Pertahankan ritme latihanmu.' }
  if (pct >= 70) return { title: 'Hasil yang bagus', note: 'Sedikit lagi menuju level aman — fokuskan ke sub-tes terlemah.' }
  if (pct >= 50) return { title: 'Terus menanjak', note: 'Pondasimu mulai terbentuk. Latih bagian yang masih merah di bawah.' }
  return { title: 'Awal yang baik', note: 'Setiap latihan menambah kesiapanmu. Pelajari pembahasan, lalu coba lagi.' }
}

export default async function HasilPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: attemptData } = await supabase
    .from('attempts').select('*').eq('id', attemptId).single()

  const attempt = attemptData as AttemptRow | null
  if (!attempt || attempt.user_id !== user.id) redirect('/')
  if (attempt.status === 'ongoing') redirect(`/ujian/${attempt.package_id}`)

  const { data: pkgData } = await supabase
    .from('packages').select('name, total_questions, category').eq('id', attempt.package_id).single()
  const pkg = pkgData as { name: string; total_questions: number; category: string } | null

  // Soal + pembahasan (fallback jika kolom explanation_image_url belum ada)
  let questionsData: QuestionWithAnswer[] | null = null
  const { data: qData, error: qErr } = await supabase
    .from('questions')
    .select('id, content, options, correct_answer, explanation, explanation_image_url, category, image_url, order_index')
    .eq('package_id', attempt.package_id)
    .order('order_index', { ascending: true })
  if (qErr) {
    const { data: qFallback } = await supabase
      .from('questions')
      .select('id, content, options, correct_answer, explanation, category, image_url, order_index')
      .eq('package_id', attempt.package_id)
      .order('order_index', { ascending: true })
    questionsData = ((qFallback ?? []) as Omit<QuestionWithAnswer, 'explanation_image_url'>[]).map((q) => ({ ...q, explanation_image_url: null }))
  } else {
    questionsData = (qData ?? []) as QuestionWithAnswer[]
  }

  // Sort: urutan sub-tes dulu (sesuai definisi ASTRA/PLN), lalu order_index dalam sub-tes
  const subtestOrder =
    pkg?.category === 'ASTRA' ? Object.keys(ASTRA_SUBTESTS) :
    pkg?.category === 'PLN'   ? Object.keys(PLN_SUBTESTS)   : []

  const questions = questionsData.sort((a, b) => {
    if (subtestOrder.length > 0) {
      const iA = subtestOrder.indexOf((a.category ?? '').toUpperCase())
      const iB = subtestOrder.indexOf((b.category ?? '').toUpperCase())
      const posA = iA === -1 ? 999 : iA
      const posB = iB === -1 ? 999 : iB
      if (posA !== posB) return posA - posB
    }
    return a.order_index - b.order_index
  })
  const userAnswers = (attempt.answers ?? {}) as Record<string, string>
  const score = attempt.score ?? 0
  const correct = attempt.correct_count ?? 0
  const wrong = attempt.wrong_count ?? 0
  const empty = attempt.empty_count ?? 0
  const totalAll = correct + wrong + empty

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDetails = (attempt as any).score_details as ScoreDetails | null | undefined
  const sd: ScoreDetails | null = rawDetails && typeof rawDetails === 'object' ? rawDetails : null

  // Denominator & persen ring sesuai tipe
  let denom = '/ 100'
  let pct = Math.min(100, Math.max(0, score))
  if (sd?.type === 'ASTRA') {
    const max = sd.maxScore ?? pkg?.total_questions ?? 0
    denom = max ? `/ ${max}` : 'poin'
    pct = max ? Math.round((score / max) * 100) : 0
  } else if (sd?.type === 'PLN') {
    denom = 'poin'
    pct = totalAll ? Math.round((correct / totalAll) * 100) : 0
  }

  // Rincian per sub-tes
  const subtests = sd?.categories
    ? Object.entries(sd.categories).map(([code, s]) => {
        const t = s.correct + s.wrong + s.empty
        return { code, pct: t ? Math.round((s.correct / t) * 100) : 0, correct: s.correct, total: t }
      }).sort((a, b) => b.pct - a.pct)
    : []
  const weakest = subtests.length ? subtests[subtests.length - 1] : null

  const t = tier(pct)
  const R = 50, C = 2 * Math.PI * R
  const offset = C * (1 - pct / 100)

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      <Breadcrumb items={[
        { label: 'Paket Soal', href: '/paket' },
        { label: pkg?.name ?? 'Paket', href: attempt.package_id ? `/persiapan/${attempt.package_id}` : undefined },
        { label: 'Hasil' },
      ]} />

      {/* ══ HERO ══ */}
      <div className="rounded-3xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 sm:px-8 py-7 text-white" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Ring skor */}
            <div className="relative w-[128px] h-[128px] shrink-0">
              <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
                <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="11" />
                <circle cx="64" cy="64" r={R} fill="none" stroke="#34D399" strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-num font-bold text-[34px] leading-none">{score}</span>
                <span className="text-[11px] text-white/60 mt-0.5">{denom}</span>
              </div>
            </div>
            {/* Teks */}
            <div className="text-center sm:text-left flex-1">
              <p className="text-white/55 text-xs uppercase tracking-wider font-semibold mb-1">{pkg?.name ?? 'Hasil Simulasi'}</p>
              <h1 className="text-2xl font-heading font-extrabold mb-1.5">{t.title}</h1>
              <p className="text-white/70 text-sm max-w-md">{t.note}</p>
              <div className="inline-flex items-center gap-1.5 mt-3 bg-white/10 rounded-full px-3 py-1 text-xs">
                <Clock className="w-3.5 h-3.5 text-white/70" />
                {attempt.duration_seconds ? formatDuration(attempt.duration_seconds) : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Strip benar/salah/kosong */}
        <div className="grid grid-cols-3 divide-x divide-hairline bg-white">
          {[
            { icon: <CheckCircle2 className="w-4 h-4 text-brand" />, k: correct, l: 'Benar' },
            { icon: <XCircle className="w-4 h-4 text-red-500" />, k: wrong, l: 'Salah' },
            { icon: <MinusCircle className="w-4 h-4 text-ink-muted" />, k: empty, l: 'Kosong' },
          ].map((s) => (
            <div key={s.l} className="flex items-center justify-center gap-2.5 py-3.5">
              {s.icon}
              <span className="font-num font-bold text-lg text-ink">{s.k}</span>
              <span className="text-ink-muted text-sm">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Rincian per sub-tes ══ */}
      {subtests.length > 0 && (
        <div className="bg-white rounded-2xl border border-hairline shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Rincian per sub-tes</p>
            {weakest && <span className="text-xs text-ink-muted">Terlemah: <b className="text-ink">{weakest.code}</b></span>}
          </div>
          <div className="space-y-3">
            {subtests.map((s) => (
              <div key={s.code} className="flex items-center gap-3">
                <span className="w-12 text-[11px] font-bold text-center text-ink bg-paper-soft rounded-md py-1 shrink-0">{s.code}</span>
                <span className="flex-1 text-[13.5px] text-ink-soft truncate min-w-0">{SUBTEST_FULL[s.code] ?? s.code}</span>
                <span className="flex-1 max-w-[220px] h-2 bg-hairline rounded-full overflow-hidden shrink-0">
                  <span className="block h-full rounded-full" style={{ width: `${s.pct}%`, background: s.pct < 60 ? '#F4B400' : '#0E9F6E' }} />
                </span>
                <span className="w-16 text-right font-num text-[13px] text-ink shrink-0">{s.correct}/{s.total}</span>
                <span className="w-10 text-right font-num font-semibold text-[13px] text-ink shrink-0">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ Aksi ══ */}
      <div className="grid grid-cols-3 gap-3">
        <Link href={`/persiapan/${attempt.package_id}`} className="flex items-center justify-center gap-2 py-3 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
          <RotateCcw className="w-4 h-4" /> Coba Lagi
        </Link>
        <Link href="/paket" className="flex items-center justify-center gap-2 py-3 bg-white border border-hairline text-ink text-sm font-semibold rounded-xl hover:bg-paper-soft transition-colors">
          <Grid2x2 className="w-4 h-4" /> Paket Lain
        </Link>
        <Link href="/" className="flex items-center justify-center gap-2 py-3 bg-white border border-hairline text-ink text-sm font-semibold rounded-xl hover:bg-paper-soft transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Beranda
        </Link>
      </div>

      {/* ══ Review pembahasan ══ */}
      <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft">
        <div className="bg-ink px-5 py-3.5">
          <h2 className="font-heading font-bold text-white text-sm">Review Pembahasan</h2>
          <p className="text-white/55 text-xs mt-0.5">Pelajari tiap soal untuk menutup kelemahanmu.</p>
        </div>
        <div className="bg-paper p-3 sm:p-4">
          <HasilReview questions={questions} userAnswers={userAnswers} />
        </div>
      </div>
    </div>
  )
}
