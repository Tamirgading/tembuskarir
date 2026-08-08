'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Check, Eye, X } from 'lucide-react'
import { LatexContent } from '@/components/ui/LatexContent'

interface PreviewOption {
  key: string
  text: string
  point?: number
}

interface PreviewQuestion {
  id: string
  content: string
  options: PreviewOption[] | unknown
  correct_answer: string
  explanation: string | null
  explanation_image_url?: string | null
  category: string | null
  image_url?: string | null
  order_index: number
}

interface AdminExamPreviewProps {
  packageName: string
  pkgCategory: string
  questions: PreviewQuestion[]
}

const CATEGORY_COLOR: Record<string, string> = {
  QR:     'bg-orange-600',
  DR:     'bg-amber-600',
  RC:     'bg-yellow-600',
  IR:     'bg-red-600',
  VIZ:    'bg-rose-600',
  PS:     'bg-pink-600',
  WM:     'bg-violet-600',
  NUM:    'bg-blue-600',
  VER:    'bg-cyan-600',
  SIL:    'bg-teal-600',
  DER:    'bg-emerald-600',
  FIG:    'bg-green-600',
  PU:     'bg-lime-700',
  LA:     'bg-indigo-600',
  AKHLAK: 'bg-purple-600',
  TWK:    'bg-violet-700',
  VLR:    'bg-indigo-700',
  WC:     'bg-blue-700',
  NS:     'bg-cyan-700',
  DIAG:   'bg-teal-700',
  LAINNYA: 'bg-gray-600',
}

const ORDERED_SUBTESTS: Record<string, string[]> = {
  ASTRA: ['QR', 'DR', 'RC', 'IR', 'VIZ', 'PS', 'WM'],
  PLN:   ['NUM', 'VER', 'SIL', 'DER', 'FIG', 'PU', 'LA', 'AKHLAK'],
  BUMN:  ['TWK', 'VLR', 'WC', 'NS', 'DIAG', 'AKHLAK'],
}

export function AdminExamPreview({ packageName, pkgCategory, questions }: AdminExamPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  // Sort: ikuti order ORDERED_SUBTESTS, lalu order_index dalam grup
  const orderedQuestions = useMemo(() => {
    const categoryOrder = ORDERED_SUBTESTS[pkgCategory] ?? []
    return [...questions].sort((a, b) => {
      const catA = a.category?.toUpperCase() ?? 'LAINNYA'
      const catB = b.category?.toUpperCase() ?? 'LAINNYA'
      const rankA = categoryOrder.indexOf(catA)
      const rankB = categoryOrder.indexOf(catB)
      const normA = rankA === -1 ? categoryOrder.length : rankA
      const normB = rankB === -1 ? categoryOrder.length : rankB
      return normA - normB || a.order_index - b.order_index
    })
  }, [questions, pkgCategory])

  const navigationGroups = useMemo(() => {
    const grouped = new Map<string, Array<{ question: PreviewQuestion; index: number }>>()
    orderedQuestions.forEach((q, index) => {
      const cat = q.category?.toUpperCase() ?? 'LAINNYA'
      const entries = grouped.get(cat) ?? []
      entries.push({ question: q, index })
      grouped.set(cat, entries)
    })
    const categoryOrder = ORDERED_SUBTESTS[pkgCategory] ?? []
    const orderedCats = [
      ...categoryOrder.filter((c) => grouped.has(c)),
      ...Array.from(grouped.keys()).filter((c) => !categoryOrder.includes(c)),
    ]
    return orderedCats.map((cat) => ({ category: cat, entries: grouped.get(cat) ?? [] }))
  }, [orderedQuestions, pkgCategory])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', handleKey) }
  }, [isOpen])

  if (questions.length === 0) {
    return (
      <button type="button" disabled
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-400 disabled:cursor-not-allowed">
        <Eye className="h-3.5 w-3.5" /> Pratinjau Ujian
      </button>
    )
  }

  const currentQuestion = orderedQuestions[currentIndex] ?? orderedQuestions[0]
  const opts = Array.isArray(currentQuestion.options) ? currentQuestion.options as PreviewOption[] : []
  const selectedAnswer = answers[currentQuestion.id]

  return (
    <>
      <button type="button" onClick={() => { setCurrentIndex(0); setAnswers({}); setIsOpen(true) }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100">
        <Eye className="h-3.5 w-3.5" /> Pratinjau Ujian
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-gray-100">
          {/* Header */}
          <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            <div className="mx-auto flex max-w-[1280px] items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 shrink-0 text-indigo-600" />
                  <h2 className="truncate text-sm font-bold text-gray-900">Pratinjau Ujian</h2>
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-500">{packageName} · Jawaban tidak disimpan</p>
              </div>
              <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 sm:inline">
                {currentIndex + 1} / {orderedQuestions.length}
              </span>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Tutup pratinjau"
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Mobile navigation (horizontal scroll per group) */}
          <div className="space-y-2 border-b border-gray-200 bg-white px-3 py-2.5 lg:hidden">
            {navigationGroups.map((group) => (
              <div key={group.category} className="flex items-center gap-2">
                <span className={`w-12 shrink-0 rounded-md py-1 text-center text-[10px] font-bold text-white ${CATEGORY_COLOR[group.category] ?? 'bg-gray-600'}`}>
                  {group.category}
                </span>
                <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-0.5">
                  {group.entries.map(({ question, index }) => {
                    const isCurrent = index === currentIndex
                    const isAnswered = Boolean(answers[question.id])
                    return (
                      <button key={question.id} type="button" onClick={() => setCurrentIndex(index)}
                        className={`h-9 w-9 shrink-0 rounded-lg text-xs font-bold transition-colors ${
                          isCurrent ? 'bg-amber-500 text-white ring-2 ring-amber-200'
                          : isAnswered ? 'bg-emerald-600 text-white'
                          : 'border border-gray-200 bg-white text-gray-600'
                        }`}>
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto grid max-w-[1280px] items-start gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[240px_1fr] lg:px-6">

              {/* Sidebar navigasi (desktop) */}
              <aside className="sticky top-0 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm font-bold text-gray-900">Navigasi Soal</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">Klik nomor untuk berpindah soal</p>
                </div>
                <div className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto p-3">
                  {navigationGroups.map((group) => (
                    <section key={group.category}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className={`rounded-md px-2 py-1 text-[10px] font-bold text-white ${CATEGORY_COLOR[group.category] ?? 'bg-gray-600'}`}>
                          {group.category}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400">{group.entries.length} soal</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {group.entries.map(({ question, index }) => {
                          const isCurrent = index === currentIndex
                          const isAnswered = Boolean(answers[question.id])
                          return (
                            <button key={question.id} type="button" onClick={() => setCurrentIndex(index)}
                              title={`${group.category} · Soal ${index + 1}`}
                              className={`aspect-square rounded-lg text-xs font-bold transition-all hover:scale-105 ${
                                isCurrent ? 'bg-amber-500 text-white ring-2 ring-amber-200'
                                : isAnswered ? 'bg-emerald-600 text-white'
                                : 'border border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300'
                              }`}>
                              {index + 1}
                            </button>
                          )
                        })}
                      </div>
                    </section>
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t border-gray-200 px-4 py-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-500" />Aktif</span>
                  <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-600" />Dipilih</span>
                </div>
              </aside>

              {/* Konten soal */}
              <main className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="space-y-5 p-4 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-bold text-white">
                      Soal {currentIndex + 1}
                    </span>
                    {currentQuestion.category && (
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold text-white ${CATEGORY_COLOR[currentQuestion.category.toUpperCase()] ?? 'bg-gray-600'}`}>
                        {currentQuestion.category.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="text-[15px] leading-7 text-gray-900">
                    <LatexContent content={currentQuestion.content} />
                  </div>

                  {currentQuestion.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentQuestion.image_url} alt="Gambar soal"
                      className="mx-auto block max-h-72 rounded-xl border border-gray-200 object-contain" />
                  )}

                  <div className="space-y-2.5">
                    {opts.map((opt) => {
                      const isSelected = selectedAnswer === opt.key
                      return (
                        <button key={opt.key} type="button"
                          onClick={() => setAnswers((cur) => ({ ...cur, [currentQuestion.id]: opt.key }))}
                          className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50 text-gray-900 ring-1 ring-indigo-200'
                              : 'border-gray-200 bg-white text-gray-800 hover:border-indigo-300 hover:bg-indigo-50/40'
                          }`}>
                          <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {opt.key}
                          </span>
                          <span className="min-w-0 flex-1 text-sm leading-6">
                            <LatexContent content={opt.text} />
                          </span>
                          {isSelected && <Check className="mt-1 h-4 w-4 shrink-0 text-indigo-600" strokeWidth={3} />}
                        </button>
                      )
                    })}
                  </div>

                  {/* Pembahasan — selalu tampil (mode pratinjau) */}
                  <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-blue-700">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-semibold">Tampilan setelah ujian</span>
                      {currentQuestion.correct_answer && (
                        <span className="ml-auto rounded-full bg-green-100 px-2.5 py-1 font-bold text-green-700">
                          Kunci: {currentQuestion.correct_answer}
                        </span>
                      )}
                    </div>
                    {currentQuestion.explanation ? (
                      <div className="text-sm leading-7 text-blue-950">
                        <LatexContent content={currentQuestion.explanation} />
                      </div>
                    ) : (
                      <p className="text-sm italic text-blue-500">Belum ada pembahasan untuk soal ini.</p>
                    )}
                    {currentQuestion.explanation_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentQuestion.explanation_image_url} alt="Gambar pembahasan"
                        className="mx-auto block max-h-80 rounded-lg border border-blue-200 object-contain" />
                    )}
                  </div>
                </div>

                {/* Footer navigasi */}
                <div className="flex items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
                  <button type="button"
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" /> Sebelumnya
                  </button>
                  <span className="text-xs font-semibold text-gray-500">
                    {currentIndex + 1} / {orderedQuestions.length}
                  </span>
                  <button type="button"
                    onClick={() => setCurrentIndex((i) => Math.min(orderedQuestions.length - 1, i + 1))}
                    disabled={currentIndex === orderedQuestions.length - 1}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
                    Berikutnya <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </main>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
