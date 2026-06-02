import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow, QuestionRow } from '@/lib/utils'
import { AddQuestionForm } from '@/components/admin/AddQuestionForm'
import { QuestionList } from '@/components/admin/QuestionList'
import { ImportButton } from '@/components/admin/ImportButton'
import { WmPairsManager } from '@/components/admin/WmPairsManager'

export default async function AdminQuestionsPage({
  params,
}: {
  params: Promise<{ packageId: string }>
}) {
  const { packageId } = await params
  const supabase = await createClient()

  const { data: pkgData } = await supabase
    .from('packages')
    .select('*')
    .eq('id', packageId)
    .single()

  if (!pkgData) notFound()
  const pkg = pkgData as PackageRow

  const { data: questionsData } = await supabase
    .from('questions')
    .select('id, content, options, correct_answer, explanation, difficulty, category, order_index, image_url, created_at')
    .eq('package_id', packageId)
    .order('order_index', { ascending: true })

  type FullQuestion = Pick<QuestionRow, 'id' | 'content' | 'options' | 'correct_answer' | 'explanation' | 'difficulty' | 'category' | 'order_index' | 'image_url' | 'created_at'>
  const questions = (questionsData ?? []) as FullQuestion[]

  const total = questions.length
  const target = pkg.total_questions
  const isComplete = total >= target
  const pct = Math.min(100, Math.round((total / target) * 100))

  // Soal WM recall (category='WM') untuk ditampilkan di WmPairsManager
  const wmRecallQuestions = questions
    .filter((q) => q.category?.toUpperCase() === 'WM')
    .map((q) => ({ order_index: q.order_index, content: q.content }))

  const hasWm = pkg.category === 'ASTRA' && wmRecallQuestions.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/admin/packages" className="text-gray-400 hover:text-gray-600 text-sm">← Paket Soal</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{pkg.name}</h1>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pkg.is_published ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
          {pkg.is_published ? 'Published' : 'Draft'}
        </span>
      </div>

      {/* Progress soal */}
      <div className={`rounded-xl border p-5 ${isComplete ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className={`flex items-center gap-1.5 font-semibold ${isComplete ? 'text-green-800' : 'text-amber-800'}`}>
              {isComplete
                ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              }
              {isComplete ? 'Soal Lengkap!' : 'Soal Belum Lengkap'}
            </div>
            <p className={`text-sm mt-0.5 ${isComplete ? 'text-green-600' : 'text-amber-600'}`}>
              {isComplete
                ? `${total} soal siap — paket tampil normal di website`
                : `${total} / ${target} soal — paket tampil "Coming Soon" di website`}
            </p>
          </div>
          <span className={`text-3xl font-bold ${isComplete ? 'text-green-700' : 'text-amber-700'}`}>
            {total}<span className="text-lg font-normal">/{target}</span>
          </span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden border border-gray-200">
          <div className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-right mt-1 text-gray-500">{pct}%</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
        {/* Daftar soal + WM Pairs Manager */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-semibold text-gray-900">Daftar Soal</h2>
              <ImportButton packageId={packageId} startIndex={total + 1} />
            </div>
            <QuestionList questions={questions} packageId={packageId} pkgCategory={pkg.category} />
          </div>

          {/* WM Pairs Manager — khusus paket ASTRA yang punya soal WM */}
          {hasWm && (
            <div className="bg-white rounded-xl border border-hairline shadow-soft p-5">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-purple-700">WM</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Edit Pasangan Hafalan Working Memory</h2>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Tiap soal WM punya pasangan kata–angka yang ditampilkan kepada peserta sebelum pertanyaan recall muncul.
                    Kata dan angka yang berbeda-beda membuat soal lebih sulit untuk dihapalkan.
                  </p>
                </div>
              </div>
              <WmPairsManager packageId={packageId} recallQuestions={wmRecallQuestions} />
            </div>
          )}
        </div>

        {/* Form tambah soal */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
          <h2 className="font-semibold text-gray-900 mb-4">+ Tambah Soal</h2>
          <AddQuestionForm packageId={packageId} pkgCategory={pkg.category} />
        </div>
      </div>
    </div>
  )
}
