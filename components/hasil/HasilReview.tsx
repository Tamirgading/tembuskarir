'use client'

import { useState, useEffect } from 'react'
import { LatexContent } from '@/components/ui/LatexContent'
import SaveButton from '@/components/ui/SaveButton'

interface QuestionOption {
  key: string
  text: string
  point?: number // soal berbasis poin: nilai 1–5
}

interface ReviewQuestion {
  id: string
  content: string
  options: QuestionOption[]
  correct_answer: string
  explanation: string | null
  explanation_image_url: string | null
  category: string | null
  image_url: string | null
  order_index: number
}

interface HasilReviewProps {
  questions: ReviewQuestion[]
  userAnswers: Record<string, string>
}

type FilterMode = 'semua' | 'salah' | 'kosong'

// Warna badge nilai poin
const POINT_COLOR: Record<number, { bg: string; text: string; border: string; dot: string }> = {
  5: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300',  dot: 'bg-green-500' },
  4: { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300',   dot: 'bg-blue-500' },
  3: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', dot: 'bg-yellow-500' },
  2: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-400' },
  1: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-300',    dot: 'bg-red-400' },
}

const POINT_LABEL: Record<number, string> = {
  5: 'Sangat Tepat',
  4: 'Tepat',
  3: 'Cukup Tepat',
  2: 'Kurang Tepat',
  1: 'Tidak Tepat',
}

export function HasilReview({ questions, userAnswers }: HasilReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState<FilterMode>('semua')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [savingId, setSavingId] = useState<string | null>(null)

  // Muat daftar soal tersimpan milik user
  useEffect(() => {
    fetch('/api/saved-questions')
      .then((r) => r.json())
      .then((d: { saved_ids?: string[] }) => setSavedIds(new Set(d.saved_ids ?? [])))
      .catch(() => {/* ignore */})
  }, [])

  async function toggleSave(questionId: string) {
    if (savingId) return
    setSavingId(questionId)
    try {
      const res = await fetch('/api/saved-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId }),
      })
      const d = await res.json() as { saved?: boolean }
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (d.saved) next.add(questionId)
        else next.delete(questionId)
        return next
      })
    } catch {/* ignore */} finally {
      setSavingId(null)
    }
  }

  // Deteksi apakah soal berbasis poin (ada field point pada options)
  function isPointQuestion(q: ReviewQuestion): boolean {
    return q.options.some((o) => typeof o.point === 'number')
  }

  function getStatus(q: ReviewQuestion): 'correct' | 'wrong' | 'empty' | 'answered' {
    const ans = userAnswers[q.id]
    if (!ans) return 'empty'
    if (isPointQuestion(q)) return 'answered' // soal berbasis poin tidak punya benar/salah
    return ans === q.correct_answer ? 'correct' : 'wrong'
  }

  // Untuk filter: soal poin "answered" tidak masuk 'salah' atau 'kosong'
  const filteredIndices = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => {
      const s = getStatus(q)
      if (filter === 'salah') return s === 'wrong'
      if (filter === 'kosong') return s === 'empty'
      return true
    })
    .map(({ i }) => i)

  const posInFiltered = filteredIndices.indexOf(currentIndex)

  function goTo(idx: number) { setCurrentIndex(idx) }
  function goPrev() {
    const pos = filteredIndices.indexOf(currentIndex)
    if (pos > 0) setCurrentIndex(filteredIndices[pos - 1])
  }
  function goNext() {
    const pos = filteredIndices.indexOf(currentIndex)
    if (pos < filteredIndices.length - 1) setCurrentIndex(filteredIndices[pos + 1])
  }

  const currentQuestion = questions[currentIndex] ?? questions[0]
  const userAnswer = userAnswers[currentQuestion?.id ?? '']
  const status = currentQuestion ? getStatus(currentQuestion) : 'empty'
  const isPoint = currentQuestion ? isPointQuestion(currentQuestion) : false

  // Poin yang didapat user pada soal berbasis poin saat ini
  const pointEarned = isPoint && userAnswer
    ? (currentQuestion.options.find((o) => o.key === userAnswer)?.point ?? 0)
    : 0

  const correctCount = questions.filter((q) => getStatus(q) === 'correct').length
  const wrongCount   = questions.filter((q) => getStatus(q) === 'wrong').length
  const emptyCount   = questions.filter((q) => getStatus(q) === 'empty').length
  // Soal poin yang sudah dijawab
  const pointAnsweredCount = questions.filter((q) => isPointQuestion(q) && getStatus(q) === 'answered').length

  // Guard: jika tidak ada soal (data gagal dimuat), tampilkan pesan
  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        <p className="font-medium">Data soal tidak tersedia.</p>
        <p className="text-sm mt-1">Silakan refresh halaman atau hubungi admin.</p>
      </div>
    )
  }

  // Border + bg kartu berdasarkan status
  const statusCardClass = {
    correct:  'border-green-400 bg-green-50',
    wrong:    'border-red-400 bg-red-50',
    empty:    'border-gray-200 bg-white',
    answered: 'border-blue-300 bg-blue-50', // soal poin yang dijawab
  }[status]

  // Badge status di header kartu
  const statusBadge = {
    correct:  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 ml-auto">✓ Benar</span>,
    wrong:    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 ml-auto">✗ Salah</span>,
    empty:    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 ml-auto">Tidak dijawab</span>,
    answered: (
      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 ml-auto">
        {pointEarned} poin
      </span>
    ),
  }[status]

  return (
    <div className="space-y-4">
      {/* ── Filter ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 font-medium">Tampilkan:</span>
        {([
          { key: 'semua',  label: `Semua (${questions.length})` },
          { key: 'salah',  label: `Salah (${wrongCount})` },
          { key: 'kosong', label: `Kosong (${emptyCount})` },
        ] as { key: FilterMode; label: string }[]).map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key)
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
                ? 'bg-brand text-white'
                : 'bg-paper-soft text-ink-muted hover:bg-hairline'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[188px_1fr] gap-4 items-start">
        {/* ── Panel Navigasi Soal (kiri, 5 kotak per baris) ── */}
        <div className="bg-white rounded-xl border border-hairline shadow-soft p-3.5 lg:sticky lg:top-20 space-y-3">
          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Soal</p>

          <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 lg:grid lg:grid-cols-5 lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[420px]">
            {questions.map((q, idx) => {
              const s = getStatus(q)
              const isCurrent = idx === currentIndex
              const inFilter = filteredIndices.includes(idx)
              const isPointQ = isPointQuestion(q)

              let cls = 'bg-paper-soft text-ink-muted border border-hairline'
              if (s === 'correct')  cls = 'bg-green-100 text-green-700 border border-green-200'
              if (s === 'wrong')    cls = 'bg-red-100 text-red-700 border border-red-200'
              if (s === 'answered') cls = 'bg-violet-100 text-violet-700 border border-violet-200'
              if (isCurrent)        cls = 'bg-ink text-white border-ink shadow-soft'
              if (!inFilter && !isCurrent) cls += ' opacity-25'

              return (
                <button
                  key={q.id}
                  onClick={() => goTo(idx)}
                  title={`Soal ${idx + 1}${isPointQ ? ' (poin)' : ''}: ${
                    s === 'correct' ? 'Benar' :
                    s === 'wrong' ? 'Salah' :
                    s === 'answered' ? 'Dijawab' : 'Kosong'
                  }`}
                  className={`w-8 h-8 flex-none lg:w-full lg:h-auto lg:aspect-square rounded-lg text-xs font-num font-bold transition-all hover:scale-105 ${cls}`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2.5 border-t border-hairline">
            {[
              { color: 'bg-green-100 border-green-200', label: `Benar (${correctCount})` },
              { color: 'bg-red-100 border-red-200',     label: `Salah (${wrongCount})` },
              ...(pointAnsweredCount > 0 ? [{ color: 'bg-violet-100 border-violet-200', label: `Poin (${pointAnsweredCount})` }] : []),
              { color: 'bg-paper-soft border-hairline', label: `Kosong (${emptyCount})` },
              { color: 'bg-ink',                        label: 'Soal aktif' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[10px] text-ink-muted">
                <span className={`w-3 h-3 rounded-[4px] shrink-0 border ${item.color}`} />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Kartu Soal (kanan) ── */}
        <div className={`bg-white rounded-xl border-2 p-6 space-y-4 ${statusCardClass}`}>
          {/* Nomor + kategori + status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              status === 'correct'  ? 'bg-green-500 text-white' :
              status === 'wrong'   ? 'bg-red-500 text-white' :
              status === 'answered'? 'bg-blue-500 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {currentIndex + 1}
            </span>
            {currentQuestion.category && (
              <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 text-gray-600 rounded font-medium">
                {currentQuestion.category}
              </span>
            )}
            {isPoint && (
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded font-medium">
                Sistem Poin
              </span>
            )}
            {statusBadge}
            <SaveButton
              questionId={currentQuestion.id}
              saved={savedIds.has(currentQuestion.id)}
              loading={savingId === currentQuestion.id}
              onToggle={toggleSave}
            />
          </div>

          {/* Pertanyaan */}
          <div className="text-gray-900 leading-relaxed text-sm">
            <LatexContent content={currentQuestion.content} plain={currentQuestion.category?.toUpperCase() === 'PS'} />
          </div>

          {/* Gambar soal */}
          {currentQuestion.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentQuestion.image_url}
              alt="Gambar soal"
              className="max-h-64 object-contain rounded-lg border border-gray-200 mx-auto block"
            />
          )}

          {/* Pilihan jawaban */}
          <div className="space-y-2">
            {(Array.isArray(currentQuestion.options) ? currentQuestion.options : []).map((opt) => {
              const isUserChoice = userAnswer === opt.key
              const point = opt.point

              if (isPoint && typeof point === 'number') {
                // ── Mode poin: tampilkan nilai poin per opsi ──
                const pc = POINT_COLOR[point] ?? POINT_COLOR[1]
                const isChosen = isUserChoice

                return (
                  <div
                    key={opt.key}
                    className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                      isChosen
                        ? `${pc.bg} ${pc.border} border-2`
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                      isChosen ? `${pc.dot} text-white` : 'bg-gray-200 text-gray-600'
                    }`}>
                      {opt.key}
                    </span>
                    <span className="flex-1 leading-relaxed text-gray-700">
                      <LatexContent content={opt.text} plain={currentQuestion.category?.toUpperCase() === 'PS'} />
                    </span>
                    <div className="shrink-0 flex flex-col items-end gap-0.5 mt-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                        {point} poin
                      </span>
                      {point === 5 && <span className="text-[10px] text-gray-400">{POINT_LABEL[point]}</span>}
                      {isChosen && <span className={`text-[10px] font-semibold ${pc.text}`}>← Pilihanmu</span>}
                    </div>
                  </div>
                )
              }

              // ── Mode pilihan ganda: benar/salah ──
              const isRight = currentQuestion.correct_answer === opt.key
              let bg = 'bg-gray-50 border-gray-200 text-gray-700'
              if (isRight) bg = 'bg-green-50 border-green-300 text-green-800'
              else if (isUserChoice) bg = 'bg-red-50 border-red-300 text-red-800'

              return (
                <div key={opt.key} className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm ${bg}`}>
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                    isRight ? 'bg-green-500 text-white' :
                    isUserChoice ? 'bg-red-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {opt.key}
                  </span>
                  <span className="flex-1 leading-relaxed">
                    <LatexContent content={opt.text} plain={currentQuestion.category?.toUpperCase() === 'PS'} />
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
          {(currentQuestion.explanation || currentQuestion.explanation_image_url) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-blue-700">
                {isPoint ? 'Penjelasan' : 'Pembahasan'}
              </p>
              {currentQuestion.explanation && (
                <div className="text-sm text-blue-900 leading-relaxed">
                  <LatexContent content={currentQuestion.explanation} />
                </div>
              )}
              {currentQuestion.explanation_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentQuestion.explanation_image_url}
                  alt="Gambar pembahasan"
                  className="max-h-72 object-contain rounded-lg border border-blue-200 mx-auto block"
                />
              )}
            </div>
          )}

          {/* Navigasi prev/next */}
          <div className="flex justify-between pt-1">
            <button
              onClick={goPrev}
              disabled={posInFiltered <= 0}
              className="flex items-center gap-1.5 px-4 py-2 border border-hairline text-ink-soft rounded-lg text-sm hover:bg-paper-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Sebelumnya
            </button>
            <span className="font-num text-xs text-ink-muted self-center">
              {posInFiltered + 1} / {filteredIndices.length}
            </span>
            <button
              onClick={goNext}
              disabled={posInFiltered >= filteredIndices.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 border border-hairline text-ink-soft rounded-lg text-sm hover:bg-paper-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
