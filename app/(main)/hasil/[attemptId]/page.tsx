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
const SKD_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  TWK: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  TIU: { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500' },
  TKP: { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' },
}

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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Ringkasan Skor ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Lingkaran skor */}
          <div className={`w-32 h-32 shrink-0 rounded-full flex flex-col items-center justify-center border-4 ${lulus ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
            <span className={`text-4xl font-bold leading-none ${lulus ? 'text-green-600' : 'text-red-500'}`}>{score}</span>
            <span className="text-xs text-gray-500 mt-0.5">{isSKD ? '/ 550' : '/ 100'}</span>
          </div>

          {/* Detail */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{pkg?.name}</p>
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${lulus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {lulus ? '✓ LULUS' : '✗ BELUM LULUS'}
            </span>

            <div className="flex justify-center md:justify-start gap-6 text-sm pt-1 flex-wrap">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{attempt.duration_seconds ? formatDuration(attempt.duration_seconds) : '-'}</p>
                <p className="text-gray-400 text-xs">Durasi</p>
              </div>
            </div>
          </div>

          {/* Aksi */}
          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href={`/persiapan/${attempt.package_id}`}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Coba Lagi
            </Link>
            <Link
              href={isCpns ? '/portal/cpns' : '/paket'}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              {isCpns ? 'Portal CPNS' : 'Pilih Paket Lain'}
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ── SKD Per-Kategori Breakdown (hanya untuk CPNS) ── */}
      {isSKD && scoreDetails?.categories && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Rincian Nilai SKD</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['TWK', 'TIU', 'TKP'] as const).map((cat) => {
              const stats = scoreDetails.categories![cat]
              const max = SKD_MAX[cat]
              const pg = scoreDetails.passingGrade?.[cat] ?? 0
              const raw = stats?.rawScore ?? 0
              const isPass = raw >= pg
              const pct = Math.max(0, Math.min(100, (raw / max) * 100))
              const pgPct = (pg / max) * 100
              const colors = SKD_COLORS[cat]

              return (
                <div key={cat} className={`rounded-xl p-4 border ${isPass ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>{cat}</span>
                    <span className={`text-xs font-semibold ${isPass ? 'text-green-600' : 'text-red-500'}`}>
                      {isPass ? '✓ Lulus' : '✗ Tidak Lulus'}
                    </span>
                  </div>

                  {/* Skor */}
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-gray-900">{raw % 1 === 0 ? raw : raw.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 ml-1">/ {max}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`absolute h-full rounded-full transition-all ${isPass ? colors.bar : 'bg-red-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                    {/* Passing grade marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-gray-700 opacity-40"
                      style={{ left: `${pgPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Passing grade: <strong>{pg}</strong></p>

                  {/* Stat detail */}
                  {stats && (
                    <div className="flex gap-3 mt-3 text-xs">
                      <span className="text-green-600 font-medium">✓ {stats.correct}</span>
                      <span className="text-red-500 font-medium">✗ {stats.wrong}</span>
                      <span className="text-gray-400">— {stats.empty}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Total row */}
          <div className={`mt-4 p-4 rounded-xl border flex items-center justify-between ${lulus ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <div>
              <p className="text-sm text-gray-600">Total Skor SKD</p>
              <p className="text-2xl font-bold text-gray-900">{score} <span className="text-sm font-normal text-gray-400">/ 550</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Passing grade total</p>
              <p className="text-lg font-bold text-gray-700">≥ {scoreDetails.passingGrade?.total ?? 311}</p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full font-bold text-sm ${lulus ? 'bg-green-600 text-white' : 'bg-red-100 text-red-700'}`}>
                {lulus ? '✓ LULUS SKD' : '✗ TIDAK LULUS'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Review Pembahasan (navigasi per soal) ── */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900 text-lg">Review Pembahasan</h2>
        <HasilReview questions={questions} userAnswers={userAnswers} />
      </div>
    </div>
  )
}
