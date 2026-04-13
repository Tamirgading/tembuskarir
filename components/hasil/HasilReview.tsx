'use client'

import { useState } from 'react'
import { LatexContent } from '@/components/ui/LatexContent'

interface QuestionOption { key: string; text: string }

interface ReviewQuestion {
  id: string
  content: string
  options: QuestionOption[]
  correct_answer: string
  explanation: string | null
  category: string | null
  image_url: string | null
  order_index: number
}

interface HasilReviewProps {
  questions: ReviewQuestion[]
  userAnswers: Record<string, string>
}

type FilterMode = 'semua' | 'salah' | 'kosong'

export function HasilReview({ questions, userAnswers }: HasilReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState<FilterMode>('semua')

  const getStatus = (q: ReviewQuestion) => {
    const ans = userAnswers[q.id]
    if (!ans) return 'empty'
    return ans === q.correct_answer ? 'correct' : 'wrong'
  }

  // Daftar indeks yang ditampilkan sesuai filter
  const filteredIndices = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => {
      const s = getStatus(q)
      if (filter === 'salah') return s === 'wrong'
      if (filter === 'kosong') return s === 'empty'
      return true
    })
    .map(({ i }) => i)

  // currentIndex mengacu ke index dalam questions[], bukan filteredIndices
  const posInFiltered = filteredIndices.indexOf(currentIndex)

  function goTo(idx: number) {
    setCurrentIndex(idx)
  }
  function goPrev() {
    const pos = filteredIndices.indexOf(currentIndex)
    if (pos > 0) setCurrentIndex(filteredIndices[pos - 1])
  }
  function goNext() {
    const pos = filteredIndices.indexOf(currentIndex)
    if (pos < filteredIndices.length - 1) setCurrentIndex(filteredIndices[pos + 1])
  }

  const currentQuestion = questions[currentIndex]
  const userAnswer = userAnswers[currentQuestion?.id]
  const status = getStatus(currentQuestion)

  const correctCount = questions.filter((q) => getStatus(q) === 'correct').length
  const wrongCount = questions.filter((q) => getStatus(q) === 'wrong').length
  const emptyCount = questions.filter((q) => getStatus(q) === 'empty').length

  const statusColor = {
    correct: 'border-green-400 bg-green-50',
    wrong: 'border-red-400 bg-red-50',
    empty: 'border-gray-200 bg-white',
  }[status]

  return (
    <div className="space-y-4">
      {/* ── Filter ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 font-medium">Tampilkan:</span>
        {([
          { key: 'semua', label: `Semua (${questions.length})` },
          { key: 'salah', label: `Salah (${wrongCount})` },
          { key: 'kosong', label: `Kosong (${emptyCount})` },
        ] as { key: FilterMode; label: string }[]).map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key)
              // Reset ke soal pertama di filter baru
              const newFiltered = questions
                .map((q, i) => ({ q, i }))
                .filter(({ q }) => {
                  const s = getStatus(q)
                  if (f.key === 'salah') return s === 'wrong'
                  if (f.key === 'kosong') return s === 'empty'
                  return true
                })
              if (newFiltered.length > 0) setCurrentIndex(newFiltered[0].i)
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              filter === f.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4 items-start">
        {/* ── Kartu Soal ── */}
        <div className={`bg-white rounded-xl border-2 p-6 space-y-4 ${statusColor}`}>
          {/* Nomor + kategori + status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              status === 'correct' ? 'bg-green-500 text-white' :
              status === 'wrong' ? 'bg-red-500 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {currentIndex + 1}
            </span>
            {currentQuestion.category && (
              <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 text-gray-600 rounded font-medium">
                {currentQuestion.category}
              </span>
            )}
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ml-auto ${
              status === 'correct' ? 'bg-green-100 text-green-700' :
              status === 'wrong' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-500'
            }`}>
              {status === 'correct' ? '✓ Benar' : status === 'wrong' ? '✗ Salah' : '— Tidak dijawab'}
            </span>
          </div>

          {/* Pertanyaan */}
          <div className="text-gray-900 leading-relaxed text-sm">
            <LatexContent content={currentQuestion.content} />
          </div>

          {/* Gambar */}
          {currentQuestion.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentQuestion.image_url}
              alt="Gambar soal"
              className="max-w-full rounded-lg border border-gray-200 max-h-56 object-contain"
            />
          )}

          {/* Pilihan */}
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => {
              const isUserChoice = userAnswer === opt.key
              const isRight = currentQuestion.correct_answer === opt.key
              let bg = 'bg-gray-50 border-gray-200 text-gray-700'
              if (isRight) bg = 'bg-green-50 border-green-300 text-green-800'
              else if (isUserChoice) bg = 'bg-red-50 border-red-300 text-red-800'

              return (
                <div
                  key={opt.key}
                  className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm ${bg}`}
                >
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                    isRight ? 'bg-green-500 text-white' :
                    isUserChoice ? 'bg-red-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {opt.key}
                  </span>
                  <span className="flex-1 leading-relaxed">
                    <LatexContent content={opt.text} />
                  </span>
                  <span className="shrink-0 text-xs font-semibold mt-0.5">
                    {isRight && '✓ Benar'}
                    {isUserChoice && !isRight && '✗ Pilihanmu'}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Pembahasan */}
          {currentQuestion.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-1.5">💡 Pembahasan</p>
              <div className="text-sm text-blue-900 leading-relaxed">
                <LatexContent content={currentQuestion.explanation} />
              </div>
            </div>
          )}

          {/* Navigasi prev/next */}
          <div className="flex justify-between pt-1">
            <button
              onClick={goPrev}
              disabled={posInFiltered <= 0}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Sebelumnya
            </button>
            <span className="text-xs text-gray-400 self-center">
              {posInFiltered + 1} / {filteredIndices.length}
            </span>
            <button
              onClick={goNext}
              disabled={posInFiltered >= filteredIndices.length - 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya →
            </button>
          </div>
        </div>

        {/* ── Panel Navigasi ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 sticky top-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Navigasi Soal</p>

          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, idx) => {
              const s = getStatus(q)
              const isCurrent = idx === currentIndex
              const inFilter = filteredIndices.includes(idx)

              let cls = 'bg-gray-100 text-gray-500' // empty
              if (s === 'correct') cls = 'bg-green-100 text-green-700'
              if (s === 'wrong') cls = 'bg-red-100 text-red-700'
              if (isCurrent) cls = 'bg-blue-600 text-white ring-2 ring-blue-300'
              if (!inFilter && !isCurrent) cls += ' opacity-30'

              return (
                <button
                  key={q.id}
                  onClick={() => goTo(idx)}
                  title={`Soal ${idx + 1} — ${s === 'correct' ? 'Benar' : s === 'wrong' ? 'Salah' : 'Kosong'}`}
                  className={`w-full aspect-square rounded-md text-xs font-bold transition-all ${cls}`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="space-y-1 pt-2 border-t border-gray-100">
            {[
              { color: 'bg-green-100', label: `Benar (${correctCount})` },
              { color: 'bg-red-100', label: `Salah (${wrongCount})` },
              { color: 'bg-gray-100', label: `Kosong (${emptyCount})` },
              { color: 'bg-blue-600', label: 'Soal aktif' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-3.5 h-3.5 rounded-sm shrink-0 ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
