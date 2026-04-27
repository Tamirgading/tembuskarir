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
    <div className="max-w-5xl mx-auto space-y-4 px-0">

      {/* ══ CARD UTAMA: Skor + SKD Breakdown (digabung) ══ */}
      <div className="rounded-2xl shadow-lg overflow-hidden">

        {/* ── Bagian atas: gradient header ── */}
        <div className={`px-4 sm:px-6 pt-5 pb-5 ${lulus ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>

          {/* Baris utama: lingkaran + info + durasi */}
          <div className="flex items-center gap-4">
            {/* Lingkaran skor */}
            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 border-4 border-white/40 flex flex-col items-center justify-center shadow-inner">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">{score}</span>
              <span className="text-[9px] sm:text-[10px] text-white/70 mt-0.5">{isSKD ? '/ 550' : '/ 100'}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest truncate">{pkg?.name}</p>
              <p className="text-white text-xl sm:text-2xl font-black leading-tight mt-0.5">
                {lulus ? '✓ Lulus' : '✗ Belum Lulus'}
              </p>
              <span className="inline-block bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full mt-1.5 font-medium">
                {attempt.duration_seconds ? formatDuration(attempt.duration_seconds) : '-'} durasi
              </span>
            </div>
          </div>

          {/* Tombol aksi — baris horizontal */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Link
              href={`/persiapan/${attempt.package_id}`}
              className="py-2 bg-white text-xs font-bold rounded-lg text-center hover:opacity-90 transition-opacity shadow"
              style={{ color: lulus ? '#16a34a' : '#dc2626' }}
            >
              Coba Lagi
            </Link>
            <Link
              href={isCpns ? '/portal/cpns' : '/paket'}
              className="py-2 bg-white/20 border border-white/30 text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-colors text-center"
            >
              {isCpns ? 'Portal CPNS' : 'Paket Lain'}
            </Link>
            <Link
              href="/dashboard"
              className="py-2 bg-white/20 border border-white/30 text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-colors text-center"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* ── Bagian bawah: SKD breakdown (hanya CPNS) ── */}
        {isSKD && scoreDetails?.categories && (
          <div className="bg-white px-4 sm:px-6 py-4 space-y-3">

            {/* Label section */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Rincian Nilai SKD</p>

            {/* 3 kartu kategori */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
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
                  <div key={cat} className={`rounded-xl p-3 border ${isPass ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    {/* Badge kategori + status */}
                    <div className="flex items-center justify-between mb-1.5 gap-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>{cat}</span>
                      <span className={`text-[9px] font-semibold ${isPass ? 'text-green-600' : 'text-red-500'}`}>
                        {isPass ? '✓' : '✗'}
                      </span>
                    </div>

                    {/* Skor */}
                    <p className="text-lg sm:text-xl font-black text-gray-900 leading-none">
                      {raw % 1 === 0 ? raw : raw.toFixed(1)}
                    </p>
                    <p className="text-[9px] text-gray-400">/ {max}</p>

                    {/* Bar */}
                    <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden mt-1.5 mb-1">
                      <div className={`absolute h-full rounded-full ${isPass ? colors.bar : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                      <div className="absolute top-0 h-full w-px bg-gray-600 opacity-50" style={{ left: `${pgPct}%` }} />
                    </div>
                    <p className="text-[9px] text-gray-400">PG {pg}</p>

                    {/* Stat */}
                    {stats && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        <span className="text-[9px] text-green-600 font-semibold bg-green-100 px-1 py-0.5 rounded">✓{stats.correct}</span>
                        <span className="text-[9px] text-red-500 font-semibold bg-red-100 px-1 py-0.5 rounded">✗{stats.wrong}</span>
                        <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded">—{stats.empty}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Total SKD */}
            <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${lulus ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
              <div>
                <p className="text-[10px] text-gray-500">Total Skor SKD</p>
                <p className="text-lg font-black text-gray-900 leading-tight">{score} <span className="text-xs font-normal text-gray-400">/ 550</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500">Passing grade</p>
                <p className="text-sm font-bold text-gray-700">≥ {scoreDetails.passingGrade?.total ?? 311}</p>
              </div>
              <span className={`px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap ${lulus ? 'bg-green-600 text-white' : 'bg-red-100 text-red-700'}`}>
                {lulus ? '✓ LULUS' : '✗ TIDAK LULUS'}
              </span>
            </div>
          </div>
        )}
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
