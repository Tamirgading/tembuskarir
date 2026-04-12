import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow, QuestionRow } from '@/lib/utils'
import { AddQuestionForm } from '@/components/admin/AddQuestionForm'
import { QuestionList } from '@/components/admin/QuestionList'

const CPNS_TARGET = 110

export default async function AdminQuestionsPage({
  params,
}: {
  params: Promise<{ packageId: string }>
}) {
  const { packageId } = await params
  const supabase = await createClient()

  // Fetch package
  const { data: pkgData } = await supabase
    .from('packages')
    .select('*')
    .eq('id', packageId)
    .single()

  if (!pkgData) notFound()
  const pkg = pkgData as PackageRow

  // Fetch questions
  const { data: questionsData } = await supabase
    .from('questions')
    .select('id, content, options, correct_answer, explanation, difficulty, category, order_index, image_url, created_at')
    .eq('package_id', packageId)
    .order('order_index', { ascending: true })

  type FullQuestion = Pick<QuestionRow, 'id' | 'content' | 'options' | 'correct_answer' | 'explanation' | 'difficulty' | 'category' | 'order_index' | 'image_url' | 'created_at'>
  const questions = (questionsData ?? []) as FullQuestion[]

  const total = questions.length
  const isCPNS = pkg.category === 'CPNS'
  const target = isCPNS ? CPNS_TARGET : pkg.total_questions
  const isComplete = total >= target
  const pct = Math.min(100, Math.round((total / target) * 100))

  // Hitung per kategori
  const byCategory: Record<string, number> = {}
  for (const q of questions) {
    const cat = q.category ?? 'LAINNYA'
    byCategory[cat] = (byCategory[cat] ?? 0) + 1
  }

  // Distribusi ideal CPNS SKD
  const cpnsDistribution = [
    { label: 'TWK', target: 30, color: 'bg-blue-500' },
    { label: 'TIU', target: 35, color: 'bg-purple-500' },
    { label: 'TKP', target: 45, color: 'bg-green-500' },
  ]

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
            <p className={`font-semibold ${isComplete ? 'text-green-800' : 'text-amber-800'}`}>
              {isComplete ? '✅ Soal Lengkap!' : '⚠️ Soal Belum Lengkap'}
            </p>
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
        {/* Progress bar */}
        <div className="h-3 bg-white rounded-full overflow-hidden border border-gray-200">
          <div
            className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-amber-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-right mt-1 text-gray-500">{pct}%</p>

        {/* Distribusi CPNS */}
        {isCPNS && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {cpnsDistribution.map((d) => {
              const count = byCategory[d.label] ?? 0
              const done = count >= d.target
              return (
                <div key={d.label} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-gray-700">{d.label}</span>
                    <span className={`text-sm font-bold ${done ? 'text-green-600' : 'text-amber-600'}`}>
                      {count}/{d.target}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${done ? 'bg-green-500' : d.color} opacity-70`}
                      style={{ width: `${Math.min(100, Math.round((count / d.target) * 100))}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
        {/* Daftar soal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Daftar Soal ({total})</h2>
            {Object.keys(byCategory).length > 0 && (
              <div className="flex gap-2 text-xs">
                {Object.entries(byCategory).map(([cat, cnt]) => (
                  <span key={cat} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {cat}: {cnt}
                  </span>
                ))}
              </div>
            )}
          </div>
          <QuestionList questions={questions} packageId={packageId} />
        </div>

        {/* Form tambah soal */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
          <h2 className="font-semibold text-gray-900 mb-4">+ Tambah Soal</h2>
          <AddQuestionForm packageId={packageId} nextIndex={total + 1} />
        </div>
      </div>
    </div>
  )
}
