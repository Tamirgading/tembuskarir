'use client'

import { useState } from 'react'
import { Bookmark, ChevronDown, ChevronUp } from 'lucide-react'
import { LatexContent } from '@/components/ui/LatexContent'
import { ASTRA_SUBTESTS, PLN_SUBTESTS } from '@/lib/exam-scoring'

interface QuestionOption { key: string; text: string; point?: number }
export interface SavedQuestionRow {
  id: string
  saved_at: string
  question_id: string
  questions: {
    id: string
    content: string
    options: QuestionOption[]
    correct_answer: string
    explanation: string | null
    explanation_image_url: string | null
    category: string | null
    image_url: string | null
    order_index: number
    packages: { id: string; name: string; category: string } | null
  }
}

// Warna badge nilai poin (selaras HasilReview)
const POINT_COLOR: Record<number, { bg: string; text: string; border: string }> = {
  5: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300' },
  4: { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300' },
  3: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' },
  2: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
  1: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-300' },
}

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries([
  ...Object.entries(ASTRA_SUBTESTS).map(([k, v]) => [k, v.full]),
  ...Object.entries(PLN_SUBTESTS).map(([k, v]) => [k, v.full]),
])

function isPointQuestion(q: SavedQuestionRow['questions']) {
  return q.options.some(o => typeof o.point === 'number')
}

function QuestionCard({ row, onUnsave }: { row: SavedQuestionRow; onUnsave: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [removing, setRemoving] = useState(false)
  const q = row.questions
  const point = isPointQuestion(q)

  async function handleUnsave() {
    if (removing) return
    setRemoving(true)
    try {
      await fetch('/api/saved-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: q.id }),
      })
      onUnsave(row.id)
    } catch {
      setRemoving(false)
    }
  }

  return (
    <div className="bg-white border border-hairline rounded-2xl overflow-hidden shadow-soft">
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <button onClick={() => setExpanded(e => !e)} className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium text-ink leading-snug">
            <LatexContent content={q.content} plain={q.category?.toUpperCase() === 'PS'} />
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[11px] text-ink-muted flex-wrap">
            {q.packages?.name && <span>{q.packages.name}</span>}
            {q.packages?.name && <span>·</span>}
            <span>{CATEGORY_LABEL[q.category ?? ''] ?? q.category ?? 'Lainnya'}</span>
            <span>·</span>
            <span>No. {q.order_index}</span>
          </div>
        </button>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <button
            onClick={() => setExpanded(e => !e)}
            className="grid place-items-center w-[30px] h-[30px] rounded-lg bg-paper-soft border border-hairline text-ink-muted hover:text-ink transition-colors"
            title={expanded ? 'Sembunyikan' : 'Lihat pembahasan'}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleUnsave}
            disabled={removing}
            title="Hapus dari simpanan"
            className="grid place-items-center w-[30px] h-[30px] rounded-lg bg-amber-50 border border-amber-300 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            <Bookmark className="w-[13px] h-[13px]" strokeWidth={0} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-hairline px-4 pb-4 pt-3 space-y-3">
          {q.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={q.image_url} alt="Gambar soal" className="max-h-56 object-contain rounded-lg border border-hairline mx-auto block" />
          )}

          <div className="space-y-1.5">
            {q.options.map(opt => {
              const isCorrect = q.correct_answer === opt.key
              if (point && typeof opt.point === 'number') {
                const pc = POINT_COLOR[opt.point] ?? POINT_COLOR[1]
                return (
                  <div key={opt.key}
                    className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-sm ${isCorrect ? `${pc.bg} ${pc.border} border-2` : 'bg-paper-soft border-hairline'}`}>
                    <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isCorrect ? 'bg-green-500 text-white' : 'bg-hairline text-ink-muted'}`}>
                      {opt.key}
                    </span>
                    <span className="flex-1 text-ink-soft leading-relaxed"><LatexContent content={opt.text} /></span>
                    <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>{opt.point}p</span>
                  </div>
                )
              }
              return (
                <div key={opt.key}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-sm ${isCorrect ? 'bg-green-50 border-green-300 text-green-800' : 'bg-paper-soft border-hairline text-ink-soft'}`}>
                  <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isCorrect ? 'bg-green-500 text-white' : 'bg-hairline text-ink-muted'}`}>
                    {opt.key}
                  </span>
                  <span className="flex-1 leading-relaxed"><LatexContent content={opt.text} /></span>
                  {isCorrect && <span className="shrink-0 text-xs font-semibold text-green-700 mt-0.5">✓ Benar</span>}
                </div>
              )
            })}
          </div>

          {(q.explanation || q.explanation_image_url) && (
            <div className="bg-brand/5 border border-brand/20 rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-brand-700">{point ? 'Penjelasan' : 'Pembahasan'}</p>
              {q.explanation && (
                <div className="text-sm text-ink leading-relaxed"><LatexContent content={q.explanation} /></div>
              )}
              {q.explanation_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={q.explanation_image_url} alt="Pembahasan" className="max-h-64 object-contain rounded-lg border border-brand/20 mx-auto block" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function SavedQuestionList({ initialRows }: { initialRows: SavedQuestionRow[] }) {
  const [rows, setRows] = useState(initialRows)

  function handleUnsave(savedId: string) {
    setRows(prev => prev.filter(r => r.id !== savedId))
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white border border-hairline rounded-2xl p-10 text-center space-y-3 shadow-soft">
        <div className="grid place-items-center mx-auto rounded-full bg-amber-50 w-16 h-16">
          <Bookmark className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-[15px] text-ink">Semua soal telah dihapus</p>
        <p className="text-[13px] text-ink-muted">Simpan soal dari halaman hasil ujian untuk mempelajarinya kembali.</p>
      </div>
    )
  }

  // Kelompokkan per kategori sub-tes
  const grouped: Record<string, SavedQuestionRow[]> = {}
  for (const row of rows) {
    const cat = row.questions.category ?? 'Lainnya'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(row)
  }

  return (
    <div className="space-y-6">
      {Object.keys(grouped).sort().map(cat => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-heading font-bold text-[15px] text-ink">{cat}</span>
            <span className="text-xs text-ink-muted">{CATEGORY_LABEL[cat] ?? ''}</span>
            <span className="ml-auto bg-paper-soft border border-hairline rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold text-ink-muted">
              {grouped[cat].length} soal
            </span>
          </div>
          <div className="space-y-2">
            {grouped[cat].map(row => (
              <QuestionCard key={row.id} row={row} onUnsave={handleUnsave} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
