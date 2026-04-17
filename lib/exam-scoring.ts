/**
 * lib/exam-scoring.ts
 * Shared scoring logic untuk semua kategori ujian.
 * Digunakan oleh: /api/submit, /api/cron/cleanup, /persiapan page guard.
 */

export interface QuestionForScoring {
  id: string
  correct_answer: string
  category?: string | null
  options?: { key: string; text: string; point?: number }[] | null
}

/**
 * Baris dari tabel questions_tkp (kolom eksplisit per opsi).
 */
export interface QuestionTkpRow {
  id: string
  opt_a: string; opt_b: string; opt_c: string; opt_d: string; opt_e: string
  point_a: number; point_b: number; point_c: number; point_d: number; point_e: number
}

/**
 * Konversi baris questions_tkp → format QuestionForScoring
 * supaya bisa dipakai oleh computeScore() tanpa perubahan logika scoring.
 */
export function transformTkpForScoring(rows: QuestionTkpRow[]): QuestionForScoring[] {
  return rows.map((r) => {
    const opts = (['a', 'b', 'c', 'd', 'e'] as const).map((k) => ({
      key: k.toUpperCase(),
      text: r[`opt_${k}`],
      point: r[`point_${k}`],
    }))
    // correct_answer = key dengan point tertinggi (konvensi)
    const best = opts.reduce((prev, curr) => (curr.point > prev.point ? curr : prev))
    return {
      id: r.id,
      correct_answer: best.key,
      category: 'TKP',
      options: opts,
    }
  })
}

export interface CategoryStats {
  correct: number  // soal yang dijawab benar (atau dijawab, untuk TKP)
  wrong: number    // soal yang dijawab salah (0 untuk TKP)
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

// ── SKD CPNS ─────────────────────────────────────────────────────────────────
const SKD_SCORING: Record<string, { correct: number; wrong: number }> = {
  TWK: { correct: 5, wrong: 0 },
  TIU: { correct: 5, wrong: 0 },
}
export const SKD_PASSING_GRADE = { TWK: 65, TIU: 80, TKP: 166, total: 311 }

// ── ASTRA Psikotes subtests ───────────────────────────────────────────────────
export const ASTRA_SUBTESTS: Record<string, { full: string; soal: number; minutes: number }> = {
  QR:  { full: 'Quantitative Reasoning',  soal: 10, minutes: 11 },
  DR:  { full: 'Deductive Reasoning',     soal: 10, minutes: 5  },
  RC:  { full: 'Reading Comprehension',   soal: 10, minutes: 5  },
  IR:  { full: 'Inductive Reasoning',     soal: 10, minutes: 6  },
  VIZ: { full: 'Visualization',           soal: 10, minutes: 6  },
  PS:  { full: 'Perceptual Speed',        soal: 30, minutes: 2  },
  WM:  { full: 'Working Memory',          soal: 10, minutes: 6  },
}

/**
 * Hitung skor ujian berdasarkan kategori paket.
 *
 * pkgCategory:
 *   'CPNS'  → SKD scoring (TWK/TIU +5, TKP nilai opsi 1–5)
 *   'ASTRA' → per-subtest correct count (+1 benar, 0 salah/kosong)
 *   lainnya → simple percentage (correctCount / total * 100)
 */
export function computeScore(
  questions: QuestionForScoring[],
  answers: Record<string, string>,
  pkgCategory: string
): ScoreResult {
  let correctCount = 0
  let wrongCount = 0
  let emptyCount = 0
  let score: number
  let scoreDetails: Record<string, unknown> = {}

  if (pkgCategory === 'CPNS') {
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
        const selectedOpt = (q.options ?? []).find((o) => o.key === userAnswer)
        const point = selectedOpt?.point ?? 0
        catStats[cat].correct++
        catStats[cat].rawScore += point
        correctCount++
      } else {
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

  } else if (pkgCategory === 'ASTRA') {
    // ── ASTRA Psikotes Scoring ────────────────────────────────────────────────
    // Benar +1, Salah 0, Kosong 0. Skor = jumlah benar.
    const catStats: Record<string, CategoryStats> = {}

    for (const q of questions) {
      const cat = (q.category ?? 'QR').toUpperCase()
      if (!catStats[cat]) catStats[cat] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }

      const userAnswer = answers[q.id]
      if (!userAnswer) {
        emptyCount++
        catStats[cat].empty++
      } else if (userAnswer === q.correct_answer) {
        correctCount++
        catStats[cat].correct++
        catStats[cat].rawScore++
      } else {
        wrongCount++
        catStats[cat].wrong++
      }
    }

    score = correctCount
    scoreDetails = {
      type: 'ASTRA',
      categories: catStats,
      totalQuestions: questions.length,
      maxScore: questions.length,
    }

  } else {
    // ── Simple Scoring (non-CPNS, non-ASTRA) ─────────────────────────────────
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
 */
export function isAttemptExpired(startedAt: string, durationMinutes: number): boolean {
  const startMs = new Date(startedAt).getTime()
  const deadlineMs = startMs + durationMinutes * 60 * 1000
  return Date.now() > deadlineMs
}
