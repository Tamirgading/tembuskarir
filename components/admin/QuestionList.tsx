'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, ChevronsUpDown, Copy, Check, Pencil } from 'lucide-react'
import { LatexContent } from '@/components/ui/LatexContent'
import { EditQuestionModal } from './EditQuestionModal'
import { serializeQuestionSnippet } from '@/lib/question-csv'

interface Option {
  key: string
  text: string
  point?: number
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
  image_url?: string | null
  created_at: string
}

interface QuestionListProps {
  questions: Question[]
  packageId: string
  pkgCategory: string
}

// ─── Metadata subtes ───────────────────────────────────────────────────────────
const SUBTEST_FULL: Record<string, string> = {
  // ASTRA
  QR: 'Quantitative Reasoning',
  DR: 'Deductive Reasoning',
  RC: 'Reading Comprehension',
  IR: 'Inductive Reasoning',
  VIZ: 'Visualization',
  PS: 'Perceptual Speed',
  WM: 'Working Memory',
  // PLN GAT
  NUM: 'Numerik',
  VER: 'Verbal',
  SIL: 'Silogisme',
  DER: 'Deret Angka',
  FIG: 'Figural',
  PU: 'Pengetahuan Umum PLN',
  LA: 'Learning Agility',
  AKHLAK: 'AKHLAK',
  // PLN Tahap 2
  AKDING: 'Akademik Kedinasan',
  BI: 'Bahasa Inggris',
  // BUMN
  TWK:    'Tes Wawasan Kebangsaan',
  VLR:    'Verbal Logical Reasoning',
  WC:     'Word Classification',
  NS:     'Number Sequence',
  DIAG:   'Diagram Reasoning',
  // Generic
  LAINNYA: 'Lainnya',
}

const CATEGORY_COLOR: Record<string, string> = {
  // ASTRA
  QR:  'bg-orange-100 text-orange-700 border-orange-200',
  DR:  'bg-amber-100 text-amber-700 border-amber-200',
  RC:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  IR:  'bg-red-100 text-red-600 border-red-200',
  VIZ: 'bg-rose-100 text-rose-600 border-rose-200',
  PS:  'bg-pink-100 text-pink-600 border-pink-200',
  WM:  'bg-violet-100 text-violet-600 border-violet-200',
  // PLN GAT
  NUM:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  VER:    'bg-amber-100 text-amber-700 border-amber-200',
  SIL:    'bg-orange-100 text-orange-600 border-orange-200',
  DER:    'bg-red-100 text-red-500 border-red-200',
  FIG:    'bg-rose-100 text-rose-600 border-rose-200',
  PU:     'bg-blue-100 text-blue-600 border-blue-200',
  LA:     'bg-indigo-100 text-indigo-600 border-indigo-200',
  AKHLAK: 'bg-purple-100 text-purple-600 border-purple-200',
  // PLN Tahap 2
  AKDING: 'bg-brand/10 text-brand-700 border-brand/30',
  BI:     'bg-sky-100 text-sky-700 border-sky-200',
  // BUMN
  TWK:    'bg-violet-100 text-violet-700 border-violet-200',
  VLR:    'bg-indigo-100 text-indigo-700 border-indigo-200',
  WC:     'bg-blue-100 text-blue-700 border-blue-200',
  NS:     'bg-cyan-100 text-cyan-700 border-cyan-200',
  DIAG:   'bg-teal-100 text-teal-700 border-teal-200',
  // Generic
  LAINNYA: 'bg-gray-100 text-gray-600 border-gray-200',
}

// Urutan tampil per tipe paket
const ORDERED_SUBTESTS: Record<string, string[]> = {
  ASTRA: ['QR', 'DR', 'RC', 'IR', 'VIZ', 'PS', 'WM'],
  PLN:   ['NUM', 'VER', 'SIL', 'DER', 'FIG', 'PU', 'LA', 'AKHLAK', 'AKDING', 'BI'],
  BUMN:  ['TWK', 'VLR', 'WC', 'NS', 'DIAG', 'AKHLAK'],
}

// Subtes PLN yang pakai sistem poin (bukan MCQ biasa)
const POINT_BASED_CATS = new Set(['AKHLAK', 'LA'])

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Mudah', medium: 'Sedang', hard: 'Sulit',
}

// ─── Komponen utama ────────────────────────────────────────────────────────────
export function QuestionList({ questions, packageId, pkgCategory }: QuestionListProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Group + sort per kategori, respecting subtest order
  const groups = useMemo(() => {
    const map: Record<string, Question[]> = {}
    for (const q of questions) {
      const cat = (q.category ?? 'LAINNYA').toUpperCase()
      if (!map[cat]) map[cat] = []
      map[cat].push(q)
    }
    // Sort tiap grup by order_index
    for (const cat of Object.keys(map)) {
      map[cat].sort((a, b) => a.order_index - b.order_index)
    }
    // Susun sesuai urutan yang sudah didefinisikan
    const order = ORDERED_SUBTESTS[pkgCategory] ?? []
    const result: { key: string; questions: Question[] }[] = []
    for (const key of order) {
      if (map[key]) result.push({ key, questions: map[key] })
    }
    // Tambah grup yang tidak ada di urutan baku (kategori custom)
    for (const key of Object.keys(map)) {
      if (!order.includes(key)) result.push({ key, questions: map[key] })
    }
    return result
  }, [questions, pkgCategory])

  function toggleGroup(key: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function expandAll() {
    setExpandedGroups(new Set(groups.map(g => g.key)))
  }

  function collapseAll() {
    setExpandedGroups(new Set())
    setExpandedDetailId(null)
  }

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
    startTransition(() => router.refresh())
  }

  async function handleReorder(q1: Question, q2: Question) {
    setReorderingId(q1.id)
    const res = await fetch('/api/admin/questions/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id1: q1.id,
        orderIndex1: q1.order_index,
        id2: q2.id,
        orderIndex2: q2.order_index,
        packageId,
      }),
    })
    setReorderingId(null)
    if (!res.ok) {
      const data = await res.json() as { error?: string }
      alert(data.error ?? 'Gagal mengubah urutan.')
      return
    }
    startTransition(() => router.refresh())
  }

  function handleCopySnippet(q: Question) {
    const text = serializeQuestionSnippet(q)
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(q.id)
      setTimeout(() => setCopiedId(null), 2000)
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

  const allExpanded = groups.every(g => expandedGroups.has(g.key))

  return (
    <div className="space-y-3">

      {/* Toolbar expand/collapse all */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{groups.length} sub-tes · {questions.length} soal total</span>
        <button
          type="button"
          onClick={allExpanded ? collapseAll : expandAll}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-500 hover:text-gray-700"
        >
          <ChevronsUpDown className="w-3.5 h-3.5" />
          {allExpanded ? 'Tutup Semua' : 'Buka Semua'}
        </button>
      </div>

      {/* Edit modal */}
      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          packageId={packageId}
          pkgCategory={pkgCategory}
          onClose={() => setEditingQuestion(null)}
        />
      )}

      {/* Daftar grup per sub-tes */}
      {groups.map(({ key, questions: groupQs }) => {
        const isExpanded = expandedGroups.has(key)
        const catCls = CATEGORY_COLOR[key] ?? 'bg-gray-100 text-gray-600 border-gray-200'
        const fullName = SUBTEST_FULL[key] ?? key
        const isPointBased = POINT_BASED_CATS.has(key)

        return (
          <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

            {/* ── Header grup (klik untuk expand/collapse) ── */}
            <button
              type="button"
              onClick={() => toggleGroup(key)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
            >
              {isExpanded
                ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}

              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${catCls}`}>
                {key}
              </span>

              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                {isPointBased && (
                  <p className="text-[10px] text-purple-500 mt-0.5">Sistem poin (1–5)</p>
                )}
              </div>

              <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                groupQs.length > 0
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {groupQs.length} soal
              </span>
            </button>

            {/* ── Body grup ── */}
            {isExpanded && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {groupQs.map((q, idx) => {
                  const opts = Array.isArray(q.options) ? (q.options as Option[]) : []
                  const isDetailExpanded = expandedDetailId === q.id
                  const isFirst = idx === 0
                  const isLast = idx === groupQs.length - 1
                  const isReordering = reorderingId === q.id

                  return (
                    <div key={q.id}>
                      {/* Baris soal */}
                      <div className="flex items-start gap-3 px-4 py-3">

                        {/* Nomor dalam grup */}
                        <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-bold mt-0.5">
                          {idx + 1}
                        </span>

                        {/* Konten soal */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 leading-snug line-clamp-2">
                            <LatexContent content={q.content} plain={key === 'PS'} />
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {isPointBased ? (
                              <span className="text-xs text-purple-500">Poin 1–5</span>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Jawaban: <strong className="text-green-600">{q.correct_answer}</strong>
                              </span>
                            )}
                            {q.difficulty && (
                              <span className="text-xs text-gray-400">
                                · {DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty}
                              </span>
                            )}
                            <span className="text-xs text-gray-300">· #{q.order_index}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                          {/* ↑ Naik */}
                          <button
                            type="button"
                            disabled={isFirst || isReordering}
                            onClick={() => handleReorder(q, groupQs[idx - 1])}
                            title="Geser ke atas"
                            className="p-1.5 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          {/* ↓ Turun */}
                          <button
                            type="button"
                            disabled={isLast || isReordering}
                            onClick={() => handleReorder(q, groupQs[idx + 1])}
                            title="Geser ke bawah"
                            className="p-1.5 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Divider */}
                          <span className="w-px h-4 bg-gray-200 mx-1" />

                          {/* Detail */}
                          <button
                            type="button"
                            onClick={() => setExpandedDetailId(isDetailExpanded ? null : q.id)}
                            className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            {isDetailExpanded ? 'Tutup' : 'Detail'}
                          </button>

                          {/* Salin snippet */}
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(q)}
                            title="Salin soal sebagai snippet CSV"
                            className="text-xs text-gray-400 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition-colors flex items-center gap-1"
                          >
                            {copiedId === q.id
                              ? <Check className="w-3 h-3 text-green-600" />
                              : <Copy className="w-3 h-3" />}
                            {copiedId === q.id ? 'Disalin!' : 'Salin'}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditingQuestion(q)}
                            className="text-xs text-gray-400 hover:text-amber-600 px-2 py-1 rounded hover:bg-amber-50 transition-colors flex items-center gap-1"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>

                          {/* Hapus */}
                          <button
                            type="button"
                            onClick={() => handleDelete(q.id)}
                            disabled={deletingId === q.id}
                            className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            {deletingId === q.id ? '...' : 'Hapus'}
                          </button>
                        </div>
                      </div>

                      {/* ── Detail expanded ── */}
                      {isDetailExpanded && (
                        <div className="border-t border-gray-100 px-4 py-3 space-y-2 bg-gray-50 ml-10">
                          {/* Gambar soal */}
                          {q.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={q.image_url}
                              alt="Gambar soal"
                              className="max-h-40 rounded-lg border border-gray-200 object-contain"
                            />
                          )}

                          {/* Pilihan jawaban */}
                          <div className="grid grid-cols-1 gap-1">
                            {opts.map((opt) => {
                              const isCorrect = !isPointBased && opt.key === q.correct_answer
                              return (
                                <div
                                  key={opt.key}
                                  className={`flex items-start gap-2 text-xs rounded-lg px-2 py-1.5 ${
                                    isCorrect
                                      ? 'bg-green-100 text-green-800 font-medium'
                                      : 'bg-white text-gray-700 border border-gray-100'
                                  }`}
                                >
                                  <span className={`font-bold shrink-0 ${isCorrect ? 'text-green-700' : 'text-gray-500'}`}>
                                    {opt.key}.
                                  </span>
                                  <span className="flex-1">
                                    <LatexContent content={opt.text} plain={key === 'PS'} />
                                  </span>
                                  {isPointBased && opt.point !== undefined && (
                                    <span className="ml-auto shrink-0 text-xs font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">
                                      {opt.point} poin
                                    </span>
                                  )}
                                  {isCorrect && (
                                    <span className="ml-auto shrink-0 text-green-600 font-bold">✓</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Pembahasan */}
                          {q.explanation && (
                            <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-800 border border-blue-100">
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
            )}
          </div>
        )
      })}
    </div>
  )
}
