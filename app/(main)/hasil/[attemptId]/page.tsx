import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { AttemptRow } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'
import { HasilReview } from '@/components/hasil/HasilReview'

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

interface CategoryStats {
  correct: number
  wrong: number
  empty: number
  rawScore: number
}

interface ScoreDetails {
  type: 'SKD' | 'simple'
  categories?: Record<string, CategoryStats>
  totalRaw?: number
  passingGrade?: { TWK: number; TIU: number; TKP: number; total: number }
  lulus?: boolean
}

const SKD_MAX: Record<string, number> = { TWK: 150, TIU: 175, TKP: 225 }

export default async function HasilPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: attemptData } = await supabase
    .from('attempts')
    .select('*')
    .eq('id', attemptId)
    .single()

  const attempt = attemptData as AttemptRow | null
  if (!attempt || attempt.user_id !== user.id) redirect('/dashboard')
  if (attempt.status === 'ongoing') redirect(`/ujian/${attempt.package_id}`)

  const { data: pkgData } = await supabase
    .from('packages')
    .select('name, total_questions, category')
    .eq('id', attempt.package_id)
    .single()

  const pkg = pkgData as { name: string; total_questions: number; category: string } | null
  const isCpns = pkg?.category === 'CPNS'

  // Coba fetch dengan explanation_image_url; fallback tanpa kolom itu
  // jika migration belum dijalankan di database (graceful degradation)
  let questionsData: QuestionWithAnswer[] | null = null
  const { data: qData, error: qErr } = await supabase
    .from('questions')
    .select('id, content, options, correct_answer, explanation, explanation_image_url, category, image_url, order_index')
    .eq('package_id', attempt.package_id)
    .order('order_index', { ascending: true })

  if (qErr) {
    // Fallback: kolom explanation_image_url mungkin belum ada di DB
    const { data: qFallback } = await supabase
      .from('questions')
      .select('id, content, options, correct_answer, explanation, category, image_url, order_index')
      .eq('package_id', attempt.package_id)
      .order('order_index', { ascending: true })
    // Tambahkan explanation_image_url: null agar type konsisten
    questionsData = ((qFallback ?? []) as Omit<QuestionWithAnswer, 'explanation_image_url'>[])
      .map((q) => ({ ...q, explanation_image_url: null }))
  } else {
    questionsData = (qData ?? []) as QuestionWithAnswer[]
  }

  // Urutkan soal SKD: TWK → TIU → TKP, lalu order_index dalam tiap kategori
  const SKD_ORDER: Record<string, number> = { TWK: 0, TIU: 1, TKP: 2 }
  const questions = (questionsData).sort((a, b) => {
    const ao = SKD_ORDER[a.category ?? ''] ?? 99
    const bo = SKD_ORDER[b.category ?? ''] ?? 99
    if (ao !== bo) return ao - bo
    return a.order_index - b.order_index
  })
  const userAnswers = (attempt.answers ?? {}) as Record<string, string>
  const score = attempt.score ?? 0

  // Parse score_details kalau ada (untuk CPNS)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDetails = (attempt as any).score_details as ScoreDetails | null | undefined
  const scoreDetails: ScoreDetails | null = rawDetails && typeof rawDetails === 'object' ? rawDetails : null
  const isSKD = scoreDetails?.type === 'SKD'

  // Lulus check
  let lulus: boolean
  if (isSKD && scoreDetails?.lulus !== undefined) {
    lulus = scoreDetails.lulus
  } else {
    lulus = score >= 75
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 px-0">

      {/* ══ CARD UTAMA ══ */}
      <div className={`rounded-2xl shadow-lg overflow-hidden ${lulus ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>

        {/* ── Area utama: 3 kolom ── */}
        <div className="flex items-stretch gap-0 p-4 pb-3">

          {/* KIRI — skor */}
          <div className="flex flex-col items-center justify-center gap-2 shrink-0 pr-4 border-r border-white/20">
            <p className="text-white/60 text-[9px] font-medium uppercase tracking-wide text-center leading-tight max-w-[80px] truncate">{pkg?.name}</p>
            <div className="w-[72px] h-[72px] rounded-full bg-white/20 border-[3px] border-white/50 flex flex-col items-center justify-center shadow-inner">
              <span className="text-2xl font-black text-white leading-none">{score}</span>
              <span className="text-[9px] text-white/70">{isSKD ? '/ 550' : '/ 100'}</span>
            </div>
            <span className="bg-white/25 text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">
              {attempt.duration_seconds ? formatDuration(attempt.duration_seconds) : '-'}
            </span>
          </div>

          {/* TENGAH — progress per materi */}
          {isSKD && scoreDetails?.categories && (
            <div className="flex-1 px-4 flex flex-col justify-center gap-2 border-r border-white/20">
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-wide">Progress Tiap Materi</p>
              {(['TWK', 'TIU', 'TKP'] as const).map((cat) => {
                const stats = scoreDetails.categories![cat]
                const max = SKD_MAX[cat]
                const pg = scoreDetails.passingGrade?.[cat] ?? 0
                const raw = stats?.rawScore ?? 0
                const isPass = raw >= pg
                const pct = Math.max(0, Math.min(100, (raw / max) * 100))
                const pgPct = (pg / max) * 100
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="shrink-0 w-9 text-center text-[10px] font-black text-white bg-white/25 rounded-md py-0.5">{cat}</span>
                    <div className="flex-1 relative h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className={`absolute h-full rounded-full ${isPass ? 'bg-white' : 'bg-red-300'}`} style={{ width: `${pct}%` }} />
                      <div className="absolute top-0 h-full w-0.5 bg-white/60" style={{ left: `${pgPct}%` }} />
                    </div>
                    <span className="shrink-0 text-xs font-black text-white text-right w-12">
                      <span className={isPass ? 'text-white' : 'text-red-200'}>{raw % 1 === 0 ? raw : raw.toFixed(0)}</span>
                      <span className="text-white/40 font-normal text-[9px]">/{max}</span>
                    </span>
                  </div>
                )
              })}
              <p className="text-white/50 text-[10px] pt-0.5 border-t border-white/15">
                Total · PG ≥ {scoreDetails.passingGrade?.total ?? 311}
              </p>
            </div>
          )}

          {/* KANAN — status kelulusan */}
          <div className="shrink-0 pl-4 flex flex-col justify-center gap-2 w-28 sm:w-36">
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-wide">Status Kelulusan</p>
            <div className={`px-2 py-1.5 rounded-xl text-center font-black text-sm border-2 ${lulus ? 'bg-white/20 border-white/50 text-white' : 'bg-white/20 border-white/50 text-white'}`}>
              {lulus ? '✓ LULUS' : 'BELUM LULUS'}
            </div>
            <p className="text-white/60 text-[10px] leading-snug">
              {lulus
                ? 'Selamat! Kamu telah mencapai nilai ambang batas kelulusan.'
                : 'Tingkatkan terus latihanmu untuk mencapai nilai ambang batas kelulusan.'}
            </p>
          </div>
        </div>

        {/* ── Tombol aksi — full width di bawah ── */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          <Link
            href={`/persiapan/${attempt.package_id}`}
            className="py-2.5 bg-white text-sm font-bold rounded-xl text-center hover:opacity-90 transition-opacity shadow"
            style={{ color: lulus ? '#16a34a' : '#dc2626' }}
          >
            Coba Lagi
          </Link>
          <Link
            href={isCpns ? '/portal/cpns' : '/paket'}
            className="py-2.5 bg-white/20 border border-white/30 text-white text-sm font-medium rounded-xl hover:bg-white/30 transition-colors text-center"
          >
            {isCpns ? 'Portal CPNS' : 'Paket Lain'}
          </Link>
          <Link
            href="/dashboard"
            className="py-2.5 bg-white/20 border border-white/30 text-white text-sm font-medium rounded-xl hover:bg-white/30 transition-colors text-center"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* ── Review Pembahasan ── */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-4 sm:px-5 py-3">
          <h2 className="font-bold text-gray-800 text-sm">Review Pembahasan</h2>
        </div>
        <div className="p-3 sm:p-4">
          <HasilReview questions={questions} userAnswers={userAnswers} />
        </div>
      </div>

    </div>
  )
}
