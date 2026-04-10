import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { AttemptRow } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'

interface QuestionOption { key: string; text: string }
interface QuestionWithAnswer {
  id: string
  content: string
  options: QuestionOption[]
  correct_answer: string
  explanation: string | null
  category: string | null
  order_index: number
}

export default async function HasilPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch attempt
  const { data: attemptData } = await supabase
    .from('attempts')
    .select('*')
    .eq('id', attemptId)
    .single()

  const attempt = attemptData as AttemptRow | null

  if (!attempt || attempt.user_id !== user.id) redirect('/dashboard')
  if (attempt.status === 'ongoing') redirect(`/ujian/${attempt.package_id}`)

  // Fetch paket
  const { data: pkgData } = await supabase
    .from('packages')
    .select('name, total_questions')
    .eq('id', attempt.package_id)
    .single()

  const pkg = pkgData as { name: string; total_questions: number } | null

  // Fetch soal + correct_answer + explanation (aman di Server Component)
  const { data: questionsData } = await supabase
    .from('questions')
    .select('id, content, options, correct_answer, explanation, category, order_index')
    .eq('package_id', attempt.package_id)
    .order('order_index', { ascending: true })

  const questions = (questionsData ?? []) as QuestionWithAnswer[]
  const userAnswers = (attempt.answers ?? {}) as Record<string, string>
  const score = attempt.score ?? 0
  const lulus = score >= 75

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Ringkasan ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
        <p className="text-sm text-gray-500 font-medium">{pkg?.name}</p>
        <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto ${lulus ? 'bg-green-100' : 'bg-red-100'}`}>
          <span className={`text-4xl font-bold ${lulus ? 'text-green-600' : 'text-red-500'}`}>{score}</span>
        </div>
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${lulus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {lulus ? '✓ LULUS' : '✗ BELUM LULUS'}
        </span>
        <div className="flex justify-center gap-6 text-sm pt-2">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{attempt.correct_count ?? 0}</p>
            <p className="text-gray-500">Benar</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-500">{attempt.wrong_count ?? 0}</p>
            <p className="text-gray-500">Salah</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-400">{attempt.empty_count ?? 0}</p>
            <p className="text-gray-500">Kosong</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{attempt.duration_seconds ? formatDuration(attempt.duration_seconds) : '-'}</p>
            <p className="text-gray-500">Durasi</p>
          </div>
        </div>
      </div>

      {/* ── Aksi ── */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href={`/ujian/${attempt.package_id}`} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Coba Lagi
        </Link>
        <Link href="/paket" className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
          Kembali ke Paket
        </Link>
        <Link href="/dashboard" className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
          Dashboard
        </Link>
      </div>

      {/* ── Review Soal ── */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-900 text-lg">Review Pembahasan</h2>
        {questions.map((q, idx) => {
          const userAnswer = userAnswers[q.id]
          const isCorrect = userAnswer === q.correct_answer
          const isEmpty = !userAnswer

          return (
            <div key={q.id} className={`bg-white rounded-xl border-2 p-5 space-y-3 ${isCorrect ? 'border-green-200' : isEmpty ? 'border-gray-200' : 'border-red-200'}`}>
              {/* Header soal */}
              <div className="flex items-start gap-2">
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-600' : isEmpty ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'}`}>
                  {idx + 1}
                </span>
                <div className="flex-1">
                  {q.category && <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded mr-2">{q.category}</span>}
                  <span className="text-sm text-gray-900 leading-relaxed">{q.content}</span>
                </div>
              </div>

              {/* Pilihan */}
              <div className="space-y-1.5 ml-9">
                {q.options.map((opt) => {
                  const isUserChoice = userAnswer === opt.key
                  const isRightAnswer = q.correct_answer === opt.key
                  return (
                    <div key={opt.key} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${isRightAnswer ? 'bg-green-50 text-green-800' : isUserChoice && !isRightAnswer ? 'bg-red-50 text-red-800' : 'text-gray-600'}`}>
                      <span className={`font-bold shrink-0 ${isRightAnswer ? 'text-green-600' : isUserChoice ? 'text-red-500' : 'text-gray-400'}`}>{opt.key}.</span>
                      <span>{opt.text}</span>
                      {isRightAnswer && <span className="ml-auto text-green-600 text-xs font-semibold shrink-0">✓ Benar</span>}
                      {isUserChoice && !isRightAnswer && <span className="ml-auto text-red-500 text-xs font-semibold shrink-0">✗ Pilihanmu</span>}
                    </div>
                  )
                })}
              </div>

              {/* Penjelasan */}
              {q.explanation && (
                <details className="ml-9">
                  <summary className="text-xs text-blue-600 cursor-pointer hover:underline">Lihat pembahasan</summary>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-lg p-3">{q.explanation}</p>
                </details>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
