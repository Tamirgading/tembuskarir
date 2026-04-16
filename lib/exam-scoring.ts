/**
 * lib/exam-scoring.ts
 * Shared scoring logic untuk ujian SKD CPNS dan non-CPNS.
 * Digunakan oleh: /api/submit, /api/cron/cleanup, /persiapan page guard.
 */

export interface QuestionForScoring {
  id: string
  correct_answer: string
  category?: string | null
  options?: { key: string; text: string; point?: number }[] | null
}

export interface CategoryStats {
  correct: number  // TWK/TIU: jawaban benar | TKP: soal yang dijawab
  wrong: number    // TWK/TIU: jawaban salah  | TKP: selalu 0
  empty: number    // soal tidak dijawab
  rawScore: number // total poin kategori ini
}

export interface ScoreResult {
  score: number
  correctCount: number
  wrongCount: number
  emptyCount: number
  scoreDetails: Record<string, unknown>
}

// SKD CPNS: benar +5, salah +0 (tidak ada penalti)
const SKD_SCORING: Record<string, { correct: number; wrong: number }> = {
  TWK: { correct: 5, wrong: 0 },
  TIU: { correct: 5, wrong: 0 },
}

// Passing grade resmi BKN SKD 2024
export const SKD_PASSING_GRADE = { TWK: 65, TIU: 80, TKP: 166, total: 311 }

/**
 * Hitung skor ujian berdasarkan soal dan jawaban user.
 * Pure function — tidak ada I/O, mudah di-test.
 */
export function computeScore(
  questions: QuestionForScoring[],
  answers: Record<string, string>,
  isCpns: boolean
): ScoreResult {
  let correctCount = 0
  let wrongCount = 0
  let emptyCount = 0
  let score: number
  let scoreDetails: Record<string, unknown> = {}

  if (isCpns) {
    // ── SKD CPNS Scoring ──────────────────────────────────────────────────────
    const catStats: Record<string, CategoryStats> = {}

    for (const q of questions) {
      const cat = (q.category ?? 'TWK').toUpperCase()
      if (!catStats[cat]) catStats[cat] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }

      const userAnswer = answers[q.id]

      if (!userAnswer) {
        emptyCount++
        catStats[cat].empty++
      } else if (cat === 'TKP') {
        // TKP: nilai per opsi 1–5, tidak ada benar/salah
        const selectedOpt = (q.options ?? []).find((o) => o.key === userAnswer)
        const point = selectedOpt?.point ?? 0
        catStats[cat].correct++
        catStats[cat].rawScore += point
        correctCount++
      } else {
        // TWK / TIU: benar +5, salah +0
        const scoring = SKD_SCORING[cat] ?? { correct: 5, wrong: 0 }
        if (userAnswer === q.correct_answer) {
          correctCount++
          catStats[cat].correct++
          catStats[cat].rawScore += scoring.correct
        } else {
          wrongCount++
          catStats[cat].wrong++
          catStats[cat].rawScore += scoring.wrong
        }
      }
    }

    const totalRaw = Object.values(catStats).reduce((sum, c) => sum + c.rawScore, 0)
    const twkScore = catStats.TWK?.rawScore ?? 0
    const tiuScore = catStats.TIU?.rawScore ?? 0
    const tkpScore = catStats.TKP?.rawScore ?? 0

    const isLulus =
      twkScore >= SKD_PASSING_GRADE.TWK &&
      tiuScore >= SKD_PASSING_GRADE.TIU &&
      tkpScore >= SKD_PASSING_GRADE.TKP &&
      totalRaw >= SKD_PASSING_GRADE.total

    score = Math.max(0, Math.round(totalRaw))
    scoreDetails = {
      type: 'SKD',
      categories: catStats,
      totalRaw: Math.round(totalRaw * 100) / 100,
      passingGrade: SKD_PASSING_GRADE,
      lulus: isLulus,
    }
  } else {
    // ── Simple Scoring (non-CPNS) ─────────────────────────────────────────────
    const totalQuestions = questions.length
    for (const q of questions) {
      const userAnswer = answers[q.id]
      if (!userAnswer) emptyCount++
      else if (userAnswer === q.correct_answer) correctCount++
      else wrongCount++
    }
    score = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0
    scoreDetails = { type: 'simple' }
  }

  return { score, correctCount, wrongCount, emptyCount, scoreDetails }
}

/**
 * Cek apakah sebuah attempt sudah melewati batas waktu.
 * @param startedAt  - ISO string dari attempt.started_at
 * @param durationMinutes - durasi ujian dalam menit
 */
export function isAttemptExpired(startedAt: string, durationMinutes: number): boolean {
  const startMs = new Date(startedAt).getTime()
  const deadlineMs = startMs + durationMinutes * 60 * 1000
  return Date.now() > deadlineMs
}
