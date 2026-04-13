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
  category: string | null
  image_url: string | null
  order_index: number
}

export default async function HasilPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
    .select('name, total_questions')
    .eq('id', attempt.package_id)
    .single()

  const pkg = pkgData as { name: string; total_questions: number } | null

  const { data: questionsData } = await supabase
    .from('questions')
    .select('id, content, options, correct_answer, explanation, category, image_url, order_index')
    .eq('package_id', attempt.package_id)
    .order('order_index', { ascending: true })

  const questions = (questionsData ?? []) as QuestionWithAnswer[]
  const userAnswers = (attempt.answers ?? {}) as Record<string, string>
  const score = attempt.score ?? 0
  const lulus = score >= 75

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Ringkasan Skor ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Lingkaran skor */}
          <div className={`w-28 h-28 shrink-0 rounded-full flex flex-col items-center justify-center ${lulus ? 'bg-green-100' : 'bg-red-100'}`}>
            <span className={`text-4xl font-bold leading-none ${lulus ? 'text-green-600' : 'text-red-500'}`}>{score}</span>
            <span className="text-xs text-gray-500 mt-0.5">/ 100</span>
          </div>

          {/* Detail */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <p className="text-gray-500 text-sm">{pkg?.name}</p>
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${lulus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {lulus ? '✓ LULUS' : '✗ BELUM LULUS'}
            </span>
            <div className="flex justify-center md:justify-start gap-6 text-sm pt-1">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">{attempt.correct_count ?? 0}</p>
                <p className="text-gray-400 text-xs">Benar</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-500">{attempt.wrong_count ?? 0}</p>
                <p className="text-gray-400 text-xs">Salah</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-400">{attempt.empty_count ?? 0}</p>
                <p className="text-gray-400 text-xs">Kosong</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{attempt.duration_seconds ? formatDuration(attempt.duration_seconds) : '-'}</p>
                <p className="text-gray-400 text-xs">Durasi</p>
              </div>
            </div>
          </div>

          {/* Aksi */}
          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href={`/ujian/${attempt.package_id}`}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Coba Lagi
            </Link>
            <Link
              href="/paket"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Pilih Paket Lain
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

      {/* ── Review Pembahasan (navigasi per soal) ── */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900 text-lg">Review Pembahasan</h2>
        <HasilReview questions={questions} userAnswers={userAnswers} />
      </div>
    </div>
  )
}
