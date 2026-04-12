'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LatexContent } from '@/components/ui/LatexContent'

interface Option {
  key: string
  text: string
}

interface Question {
  id: string
  content: string
  options: Option[] | unknown
  correct_answer: string
  explanation: string | null
  difficulty: string | null
  category: string | null
  order_index: number
  created_at: string
}

interface QuestionListProps {
  questions: Question[]
  packageId: string
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
}

const CATEGORY_COLOR: Record<string, string> = {
  TWK: 'bg-blue-100 text-blue-700',
  TIU: 'bg-purple-100 text-purple-700',
  TKP: 'bg-green-100 text-green-700',
  LAINNYA: 'bg-gray-100 text-gray-600',
}

export function QuestionList({ questions, packageId }: QuestionListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function handleDelete(questionId: string) {
    if (!confirm('Hapus soal ini? Tindakan tidak dapat dibatalkan.')) return

    setDeletingId(questionId)

    const res = await fetch('/api/admin/questions/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, packageId }),
    })

    setDeletingId(null)

    if (!res.ok) {
      const data = await res.json() as { error?: string }
      alert(data.error ?? 'Gagal menghapus soal.')
      return
    }

    startTransition(() => {
      router.refresh()
    })
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400">
        <p className="text-3xl mb-2">📝</p>
        <p className="text-sm">Belum ada soal. Tambahkan soal pertama di form kanan.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {questions.map((q, idx) => {
        const opts = Array.isArray(q.options) ? (q.options as Option[]) : []
        const isExpanded = expandedId === q.id
        const catColor = CATEGORY_COLOR[q.category ?? ''] ?? 'bg-gray-100 text-gray-600'

        return (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Header row */}
            <div className="flex items-start gap-3 px-4 py-3">
              {/* Nomor */}
              <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold mt-0.5">
                {idx + 1}
              </span>

              {/* Konten */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 leading-snug line-clamp-2">
                  <LatexContent content={q.content} />
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {q.category && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
                      {q.category}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    Jawaban: <strong className="text-green-600">{q.correct_answer}</strong>
                  </span>
                  {q.difficulty && (
                    <span className="text-xs text-gray-400">
                      · {DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                >
                  {isExpanded ? 'Tutup' : 'Detail'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  disabled={deletingId === q.id || isPending}
                  className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  {deletingId === q.id ? '...' : 'Hapus'}
                </button>
              </div>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-4 py-3 space-y-2 bg-gray-50">
                {/* Gambar soal */}
                {(q as Question & { image_url?: string | null }).image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(q as Question & { image_url?: string | null }).image_url!}
                    alt="Gambar soal"
                    className="max-h-40 rounded-lg border border-gray-200 object-contain"
                  />
                )}

                {/* Opsi */}
                <div className="grid grid-cols-1 gap-1">
                  {opts.map((opt) => (
                    <div
                      key={opt.key}
                      className={`flex items-start gap-2 text-xs rounded-lg px-2 py-1.5 ${
                        opt.key === q.correct_answer
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      <span className="font-bold shrink-0">{opt.key}.</span>
                      <span><LatexContent content={opt.text} /></span>
                      {opt.key === q.correct_answer && (
                        <span className="ml-auto shrink-0 text-green-600">✓</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pembahasan */}
                {q.explanation && (
                  <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-800">
                    <span className="font-semibold">Pembahasan: </span>
                    <LatexContent content={q.explanation} />
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
